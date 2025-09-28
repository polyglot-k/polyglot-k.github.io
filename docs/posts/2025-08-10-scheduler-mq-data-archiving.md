# Scheduler와 Message Queue를 이용한 레거시 데이터 자동 아카이빙 시스템 구축

운영 서비스에서 `PENDING`이나 `FAILED`와 같이 처리가 완료되지 않은 상태의 데이터가 계속 누적되는 것은 잠재적인 성능 저하와 관리 비용 증가를 유발하는 흔한 문제입니다. 이러한 레거시 데이터는 시간이 지나며 그 양이 불어나고, 결국 데이터베이스의 성능에 직접적인 악영향을 미칠 수 있습니다.

이 글에서는 주기적으로 작업을 실행하는 **스케줄러(Scheduler)**와 비동기 처리를 위한 **메시지 큐(Message Queue)**를 조합하여, 운영 DB에 부하를 최소화하면서 레거시 데이터를 안정적으로 자동 아카이빙하는 시스템을 설계하고 구축한 경험을 공유합니다.

## 1. 문제 정의: 영구 상태가 된 임시 데이터

시스템 로직상, 특정 데이터는 일시적으로 `PENDING` 또는 `FAILED` 상태에 머물다가 후속 프로세스에 의해 `COMPLETE`로 변경되어야 합니다. 하지만 간헐적인 네트워크 오류나 예상치 못한 예외 케이스로 인해, 일부 데이터가 영구적으로 `PENDING` 또는 `FAILED` 상태로 남게 되는 문제가 발생했습니다.

-   **현상**: 특정 상태(`PENDING`, `FAILED`)의 데이터가 시간이 지나도 변경되지 않고 계속 누적됨.
-   **영향**: 
    1.  **DB 성능 저하**: 불필요한 데이터가 인덱스 크기를 비대화시키고, 관련 테이블 조회 쿼리의 성능을 저하시켰습니다.
    2.  **스토리지 비용 증가**: 수백만 건의 불필요한 데이터가 상당한 양의 디스크 공간을 차지하여 비용을 증가시켰습니다.
    3.  **운영 복잡성 증가**: 데이터 분석, 마이그레이션 등 운영 작업 시 불필요한 데이터를 매번 필터링해야 하는 번거로움이 있었습니다.

## 2. 초기 해결책의 한계: 수동 쿼리 실행

가장 먼저 시도한 방법은 특정 기간(예: 30일)이 지난 `PENDING` 또는 `FAILED` 데이터를 주기적으로 찾아 수동 `DELETE` 쿼리를 실행하는 것이었습니다. 하지만 이 방식은 다음과 같은 명확한 한계를 가졌습니다.

-   **휴먼 에러의 위험**: `DELETE` 쿼리는 항상 데이터 유실의 위험을 내포합니다. `WHERE` 조건의 작은 실수가 심각한 운영 장애로 이어질 수 있습니다.
-   **비생산적인 운영 리소스**: 누군가는 이 작업을 잊지 않고 주기적으로 실행해야 했으며, 이는 비생산적인 리소스 낭비였습니다.
-   **운영 DB 부하**: 대량의 데이터를 삭제하는 `DELETE` 작업은 그 자체로 운영 DB에 상당한 부하를 주어 다른 트랜잭션에 영향을 줄 수 있습니다.

결국, 사람의 개입 없이 안정적으로 동작하는 자동화 시스템의 필요성이 대두되었습니다.

## 3. 아키텍처 설계: Scheduler와 Message Queue의 조합

새로운 시스템의 핵심 목표는 **"운영 DB 부하 최소화, 안정성, 완전 자동화"** 였습니다. 이를 위해 **Scheduler**와 **Message Queue(MQ)**를 조합한 비동기 처리 아키텍처를 채택했습니다.

**처리 흐름:**

1.  **Scheduler**: 트래픽이 가장 적은 시간대(예: 매일 새벽 3시)에 주기적으로 실행됩니다.
2.  **대상 선정**: 아카이빙 대상이 되는 데이터의 `ID` 목록만 조회합니다. 전체 데이터를 조회하지 않음으로써 DB 부하를 최소화합니다.
3.  **메시지 발행**: 조회된 `ID`를 개별 메시지로 만들어 MQ에 발행(Publish)합니다.
4.  **Worker (Consumer)**: MQ를 구독(Subscribe)하는 별도의 워커(Worker) 프로세스가 메시지를 순차적으로 수신하여 데이터 처리 작업을 수행합니다.
5.  **아카이빙 및 삭제**: 워커는 `ID`를 이용해 데이터를 조회한 후, 별도의 아카이빙 스토리지(Cold Storage, S3 등)에 백업하고, 원본 DB에서 해당 데이터를 삭제합니다.

**아키텍처의 핵심 장점:**

-   **관심사 분리 (SoC)**: 데이터 '선별' 로직(Scheduler)과 실제 '처리' 로직(Worker)이 명확하게 분리되어 유지보수성이 향상됩니다.
-   **부하 분산**: 실제 데이터 삭제 작업이 비동기적으로 워커에서 처리되므로, 스케줄러 실행 시점이나 메인 애플리케이션에 거의 영향을 주지 않습니다.
-   **높은 안정성 및 확장성**: 워커의 처리 실패 시, MQ의 재시도(Retry) 또는 데드 레터 큐(Dead-letter Queue) 기능을 통해 데이터 유실 없이 안정적인 처리가 가능합니다. 또한 처리량이 많아지면 워커의 수만 늘려 간단히 확장할 수 있습니다.

## 4. 핵심 로직 구현 (Pseudo-code)

구현의 핵심은 각 컴포넌트의 역할을 명확히 하는 것입니다.

**1. Scheduler: 아카이빙 대상 선정 및 메시지 발행**

```java
// Spring Framework 기준 예시
@Component
public class LegacyDataArchivingScheduler {

    @Scheduled(cron = "0 0 3 * * ?") // 매일 새벽 3시 실행
    public void scheduleArchiving() {
        // 1. 30일 이상 경과된 특정 상태의 데이터 ID 목록을 조회
        List<String> targetStatuses = List.of("PENDING", "FAILED");
        List<Long> targetIds = dataRepository.findIdsByStatusesAndDate(targetStatuses, 30);

        // 2. 각 ID를 MQ에 아카이빙 작업 메시지로 발행
        for (Long id : targetIds) {
            messageQueueProducer.publishArchivingTask(id);
        }
    }
}
```

**2. Worker: 메시지 수신 및 데이터 처리**

```java
// RabbitMQ 기준 예시
@Component
public class ArchivingWorker {

    @RabbitListener(queues = "archiving-task-queue")
    public void handleArchivingTask(Long id) {
        try {
            // 1. ID로 데이터 조회
            DataObject data = dataRepository.findById(id).orElse(null);
            if (data == null) {
                log.warn("Data with id {} already processed or does not exist.", id);
                return;
            }

            // 2. 아카이빙 스토리지에 백업
            archiveStorage.save(data);

            // 3. 원본 DB에서 삭제
            dataRepository.delete(data);

        } catch (Exception e) {
            // 4. 실패 시, 로그를 남기고 MQ의 재시도/DLQ 정책에 따라 처리되도록 예외를 다시 던짐
            log.error("Failed to archive data with id: {}. Error: {}", id, e.getMessage());
            throw new AmqpRejectAndDontRequeueException("Archiving failed", e);
        }
    }
}
```

## 5. 도입 결과 및 교훈

자동 아카이빙 시스템 도입 후, 다음과 같은 정량적/정성적 효과를 얻었습니다.

-   **DB 스토리지 사용량 안정화**: 불필요한 데이터로 인한 스토리지 사용량의 지속적인 증가 문제가 해결되었습니다.
-   **쿼리 성능 향상**: 관련 테이블의 인덱스 크기가 최적화되어, 주요 조회 쿼리의 성능이 평균 15% 향상되었습니다.
-   **운영 효율성 증대**: 데이터 관리에 투입되던 수동 작업을 완전히 제거하여, 개발팀이 핵심 비즈니스 로직 개발에 더 집중할 수 있게 되었습니다.

이번 프로젝트를 통해 얻은 교훈은 다음과 같습니다.

1.  **데이터는 라이프사이클 관리가 필요하다**: 모든 데이터는 생성, 사용, 보관, 폐기의 라이프사이클을 가집니다. 일시적인 상태를 가지는 데이터는 반드시 최종 상태를 보장하거나, 주기적으로 정리하는 정책 및 시스템을 초기에 설계하는 것이 중요합니다.
2.  **비동기 아키텍처의 적극적인 활용**: 대량의 데이터를 주기적으로 처리해야 하는 백그라운드 작업의 경우, 동기 방식보다는 스케줄러와 MQ를 이용한 비동기 아키텍처가 시스템 안정성과 확장성 측면에서 훨씬 유리합니다.

<Comment />