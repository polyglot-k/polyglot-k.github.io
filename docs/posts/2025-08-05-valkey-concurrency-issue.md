# Valkey(Redis) Lua 스크립트를 이용한 분산 환경의 동시성 문제 해결

선착순 이벤트, 수강 신청, 한정 수량 상품 판매 등 여러 사용자가 동시에 한정된 자원을 요청하는 시스템에서는 **동시성 제어**가 매우 중요합니다. 동시성 제어가 제대로 이루어지지 않으면, 재고 이상의 상품이 판매되거나 정원 이상의 인원이 신청되는 등 심각한 데이터 불일치 문제를 야기할 수 있습니다.

이 글에서는 인메모리 데이터 저장소 Valkey(Redis)를 이용해 선착순 신청 기능을 구현하는 과정에서 발생한 **동시성 이슈**를 분석하고, **Lua 스크립트**를 활용하여 이 문제를 해결한 과정을 다룹니다.

## 1. 문제 상황: 동시 요청 시 발생하는 데이터 부정합

선착순 50명 정원의 이벤트를 위해, Valkey를 카운터로 사용하는 간단한 신청 로직을 구현했습니다. 하지만 `vUser 50명`의 동시 요청 테스트에서 약 **20%의 요청이 실패**하고, 간헐적으로 정원 이상의 인원이 신청되는 데이터 부정합 문제까지 발견되었습니다.

최초에 구현한 코드는 다음과 같은 **"읽고-수정-쓰기(Read-Modify-Write)"** 패턴의 문제점을 가지고 있었습니다.

```java
// 문제의 코드: Race Condition에 취약한 구조
public boolean apply() {
    String key = "event:1:apply_count";
    int limit = 50;

    // 1. READ: 현재 신청자 수를 가져온다
    int currentCount = valkey.get(key);

    // 2. MODIFY: 애플리케이션 단에서 50명 미만인지 확인한다
    if (currentCount < limit) {
        // 3. WRITE: 카운트를 1 증가시킨다
        valkey.increment(key);
        return true;
    }
    return false;
}
```

이 코드는 두 개 이상의 스레드가 `get()`과 `increment()` 호출 사이에 끼어들 경우 **Race Condition(경쟁 상태)** 에 빠지게 됩니다. 예를 들어, 두 스레드가 동시에 `49`라는 값을 읽었다면, 두 스레드 모두 조건을 통과하여 카운터를 `51`까지 증가시키게 됩니다.

## 2. 실패한 해결책: WATCH를 이용한 트랜잭션

이러한 Race Condition을 해결하기 위해 Valkey의 `WATCH` 명령어를 이용한 **낙관적 락(Optimistic Lock)**을 도입했습니다. `WATCH`는 감시하는 키의 값이 트랜잭션 실행 전에 변경되면 해당 트랜잭션을 실패시키는 기능입니다.

```java
// WATCH를 이용한 트랜잭션 시도
public boolean apply() {
    String key = "event:1:apply_count";
    int limit = 50;

    valkey.watch(key); // 1. 카운트 키 감시
    int currentCount = valkey.get(key);

    if (currentCount < limit) {
        valkey.multi(); // 2. 트랜잭션 시작
        valkey.increment(key);
        List<Object> result = valkey.exec(); // 3. 실행

        // result가 null이면 WATCH 키가 변경되어 트랜잭션이 실패했음을 의미
        if (result != null) return true;
    }
    valkey.unwatch();
    return false; // 트랜잭션 실패 또는 정원 초과
}
```

데이터 정합성 문제는 해결되었지만, 이것이 바로 **20% 요청 실패의 주된 원인**이었습니다. 동시 요청이 몰리는 **경쟁이 심한(High Contention)** 환경에서는, 단 하나의 트랜잭션만 성공하고 나머지 모든 트랜잭션은 `WATCH` 키의 변경으로 인해 실패하게 됩니다. 실패한 요청들이 재시도를 반복하면서 시스템의 전반적인 처리량은 오히려 감소했습니다.

## 3. 근본적인 해결책: Lua 스크립트를 이용한 Atomic 연산

"읽고-수정-쓰기" 연산을 외부의 방해 없이 한 번의 원자적(Atomic) 단위로 실행할 필요가 있었습니다. 해답은 **Valkey 서버 내부에서 직접 로직을 실행**시키는 **Lua 스크립트**였습니다.

Valkey(Redis)는 Lua 스크립트 하나가 실행되는 동안 다른 어떤 명령도 처리하지 않으므로, 스크립트 전체의 원자성을 보장합니다. 이를 통해 Race Condition을 근본적으로 해결할 수 있습니다.

**Lua 스크립트:**

```lua
-- apply_script.lua

-- KEYS[1]: 카운터 키
local key = KEYS[1]
-- ARGV[1]: 정원(limit)
local limit = tonumber(ARGV[1])

-- 현재 카운트를 가져온다 (없으면 0)
local count = tonumber(redis.call('GET', key) or "0")

-- 정원 미만일 경우에만
if count < limit then
  -- 카운터를 1 증가시키고 성공(1)을 반환
  redis.call('INCR', key)
  return 1
end

-- 정원 초과 시 실패(0)를 반환
return 0
```

애플리케이션에서는 이 Lua 스크립트를 Valkey 서버로 보내 실행하기만 하면 됩니다. `GET`, `비교`, `INCR` 로직 전체가 서버 내에서 한 번의 아토믹 연산으로 처리됩니다.

## 4. 최종 결과 및 교훈

Lua 스크립트 도입 후, 동일한 부하 테스트에서 다음과 같이 극적인 성능 향상을 확인했습니다.

| 지표 | Before (WATCH) | After (Lua Script) |
| :--- | :--- | :--- |
| **동시 사용자** | 50 | 50 |
| **성공률** | 80% | **100%** |
| **실패율** | 20% | **0%** |
| **처리량 (RPS)** | ~85 | **~250 (약 3배 향상)** |

모든 요청이 데이터 정합성을 유지하면서 단 한 건의 실패도 없이 처리되었습니다. 이는 Lua 스크립트를 통해 불필요한 네트워크 왕복과 애플리케이션 단의 재시도 로직을 제거하고, 모든 로직을 서버 내에서 원자적으로 처리한 결과입니다.

**이번 프로젝트를 통해 얻은 교훈은 다음과 같습니다.**

1.  **분산 환경의 "읽고-수정-쓰기" 패턴을 경계하라**: 이 패턴은 동시성 문제의 주된 원인입니다. 이를 발견했다면 즉시 아토믹 연산으로 대체하는 것을 고려해야 합니다.
2.  **상황에 맞는 동시성 제어 기법을 선택하라**: 낙관적 락(`WATCH`)은 경쟁이 적은 환경에서는 유용할 수 있지만, 선착순 이벤트와 같이 경쟁이 매우 심한 환경에서는 오히려 성능 저하를 유발합니다.
3.  **데이터 저장소의 서버 사이드 기능을 적극 활용하라**: Valkey/Redis의 Lua 스크립트와 같이, 데이터 저장소가 제공하는 서버 사이드 기능을 활용하면 네트워크 비용을 줄이고, Race Condition을 우아하고 효과적으로 해결할 수 있습니다.

<Comment />