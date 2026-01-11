// 기술 스택 (카테고리별)
export const skillsData = [
    {
        category: 'Web Development',
        skills: [
            ['Java', 'Javascript', 'Spring', 'Spring Boot', 'Spring Data Jpa', 'Lanchain4j', 'JPA', 'Go', 'Python', 'FastAPI',]
        ],
    },
    {
        category: 'Database',
        skills: [
            ['MySQL', 'Redis', 'RabbitMQ'],
        ],
    },
    {
        category: 'DevOps & Infra',
        skills: [
            ['Docker', 'AWS', 'Git', 'GitHub Actions', 'Locust'],
        ],
    },
];

// Career Timeline
export const careerData = [
    {
        period: '26.01 ~ ing',
        company: 'Wrtn Technologies, Inc.',
        role: 'Agent Developer Intern ( AX CIC Team)',
    },
    {
        period: '25.06 ~ 25.10',
        company: '모의 수능 신청 플랫폼 : 모수 (창업, MAU 8000+)',
        role: 'Lead Backend Engineer',
        details: [
            {
                "title": "가상계좌 기반 결제 시스템 및 Webhook 정합성",
                "items": [
                    "Webhook 수신과 사용자 조회 요청 간 레이스 컨디션을 고려한 결제 상태 머신 구현",
                    "중복 Webhook 호출에 대비한 멱등성 키 기반 결제 처리 로직 설계",
                    "입금 지연·중복 입금·부분 입금 케이스를 분리 처리하여 결제 데이터 정합성 확보"
                ]
            },
            {
                "title": "Toss Payments API 기반 간편결제 연동",
                "items": [
                    "외부 결제 API 예외를 내부 도메인 에러 코드로 매핑하여 제어 흐름 단순화",
                    "외부 장애 발생 시 핵심 도메인 트랜잭션을 보호하기 위한 실패 격리 구조 적용"
                ]
            },
            {
                "title": "할인 및 환불 정책 도메인 설계",
                "items": [
                    "정액·정률·조건부 할인 정책을 테이블 기반으로 모델링",
                    "결제 금액·할인 금액·환불 금액 간 불일치 방지를 위한 검증 로직 구현"
                ]
            },
            {
                "title": "Outbox 패턴 기반 알림톡(Luna) 비동기 처리",
                "items": [
                    "알림 발송 실패 시 재처리 가능한 상태 기반 이벤트 관리",
                    "외부 메시징 시스템 장애 시 핵심 결제 트랜잭션 보호"
                ]
            },
            {
                "title": "좌석 선점 구조 기반 신청 시스템",
                "items": [
                    "신청 시 좌석을 선점하는 구조로 설계하여 DB Row Lock 의존도 최소화",
                    "동시 요청 상황에서 Lock 기반 병목을 제거하고 약 800 TPS 처리 성능 확보"
                ]
            },
            {
                "title": "고아 데이터 관리 및 자동화",
                "items": [
                    "결제 실패·중단으로 발생하는 고아 데이터를 별도 테이블로 관리",
                    "스케줄러 기반 배치 작업을 통해 고아 데이터 주기적 정리",
                    "운영 대응을 위한 수동 트리거 기능 제공"
                ]
            },
            {
                "title": "포트 스와핑 기반 무중단 배포",
                "items": [
                    "단일 서버 환경에서 포트 스와핑 방식의 무중단 배포 구조 설계",
                    "배포 실패 시 즉시 이전 버전으로 복구 가능한 롤백 구조 구현"
                ]
            }
        ],
    },
];

// Activity Timeline
export const activityData = [
    {
        period: '25.05 ~ 25.11',
        company: '카카오 테크 캠퍼스 3기',
        details: [{
            title: 'Backend 과정',
            items: [
                '카테캠 아이디어톤 참여 및 1등 수상 (얼음 땡 - 아이스 브레이킹 게이밍 서비스)',
                'Java, Spring 교육과정 참여',
            ],
        },]
    },
    {
        period: '24.06 ~ 25.12',
        company: 'Google Developer Group on Campus KNU',
        details: [
            {
                title: 'Organizer',
                items: [
                    '운영 총괄, 후원사 컨택 및 운영 자금 조달',
                    '대구광역시 연합 해커톤 달빛톤 행사 기획 및 심사위원장 역할 수행',
                    '백엔드 직렬 정기 스터디 운영',
                ],
            },
            {
                title: 'Core Team Member',
                items: [
                    'GDGoC KNU DevFest 행사 기획 및 운영',
                    'GDGoC KNU 비전톤 우수 아이디어상 수상',
                ],
            },
        ],
    },
];

// Opensource Contributions (Timeline format)
export const opensourceData = [
    {
        period: '2025.09',
        company: 'Spring Data JPA',
        details: [
            { title: '렌더러 객체 내에 재귀 호출 로직을 반복문 구조로 리팩터링하여 메모리 사용 효율화 (PR#4025)' },
        ],
    },
    {
        period: '2025.09',
        company: 'Spring Framework',
        details: [
            { title: '기존 String 기반 처리에서 StringBuilder로 변환하여 GC 부담 및 연산 68% 감소 (PR#35510)' },
        ],
    },
    {
        period: '2024.11',
        company: 'Spring Framework',
        details: [
            { title: '유틸리티 내에 조기 반환 추가, 불필요한 else 블록 제거, 코드 형식 통일 (PR#33903)' },
            { title: '불필요한 else 문을 제거하고 if 구조를 단순화하여 가독성 향상 (PR#33902)' },
        ],
    },
];

// Awards
export const awardsData = [
    { year: '2024.11', title: '대구지역산업 성과교류회', award: '대구시장상', org: '대구디지털혁신진흥원' },
    { year: '2024.11', title: '대구 산학협력 프로젝트 경진대회', award: '우수상', org: '대구디지털혁신진흥원' },
    { year: '2024.11', title: 'KIPS 추계통합학술대회', award: '금상', org: '한국정보기술학회' },
    { year: '2024.09', title: '대구를 빛내는 SW 해커톤', award: '우수상', org: '경북대학교 컴퓨터학부' },
    { year: '2024.06', title: 'KIPS 춘계통합학술대회', award: '동상', org: '한국정보기술학회' },
    { year: '2023.11', title: '대구를 빛내는 SW 해커톤', award: '우수상', org: '경북대학교 컴퓨터학부' },
    { year: '2023.10', title: '대구·경북 공공데이터 활용 해커톤', award: '우수상', org: '경북대학교 소프트웨어 교육원' },
];
