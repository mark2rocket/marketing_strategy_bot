# 아키텍처 설계 문서

## 1. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Chat UI  │  │Input Tab │  │Summary   │  │ Reports  │   │
│  │          │  │          │  │  Tab     │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP / WebSocket
┌────────────────────────┴────────────────────────────────────┐
│                    Backend (Node.js + Express)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    API Layer                          │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐  │   │
│  │  │  Auth   │ │Strategy │ │  Chat   │ │ Reports  │  │   │
│  │  │ Router  │ │ Router  │ │ Router  │ │  Router  │  │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └──────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                 Business Logic Layer                  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │  Auth    │ │Strategy  │ │   Chat   │            │   │
│  │  │ Service  │ │ Service  │ │ Service  │            │   │
│  │  └──────────┘ └──────────┘ └──────────┘            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  External Services                    │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │  Gemini  │ │   PDF    │ │   PPT    │            │   │
│  │  │   API    │ │Generator │ │Generator │            │   │
│  │  └──────────┘ └──────────┘ └──────────┘            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Data Layer                         │   │
│  │                 Prisma ORM Client                     │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                  PostgreSQL Database                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │Users │ │Strat │ │Projt │ │Action│ │ Chat │ │ KPIs │   │
│  │      │ │egies │ │      │ │Items │ │      │ │      │   │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 인증 및 인가 (Authentication & Authorization)

### 2.1 인증 플로우

#### 회원가입 플로우
```
1. Client → POST /api/auth/register
   - email, name, password 전송

2. Server
   - 이메일 중복 체크
   - 비밀번호 해싱 (bcrypt, salt rounds: 10)
   - DB에 사용자 저장

3. Server → JWT 토큰 생성
   - Payload: { userId, email }
   - Expiry: 7일
   - Secret: 환경 변수에서 로드

4. Client ← 사용자 정보 + JWT 토큰 반환
```

#### 로그인 플로우
```
1. Client → POST /api/auth/login
   - email, password 전송

2. Server
   - 이메일로 사용자 조회
   - 비밀번호 검증 (bcrypt.compare)
   - 로그인 실패 시 401 반환

3. Server → JWT 토큰 생성
   - Payload: { userId, email }
   - Expiry: 7일

4. Client ← 사용자 정보 + JWT 토큰 반환
```

### 2.2 인가 (Authorization)

#### JWT 미들웨어
```typescript
// src/middleware/auth.ts

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user; // { userId, email }
    next();
  });
};
```

#### 리소스 소유권 검증
```typescript
// src/middleware/ownership.ts

export const checkStrategyOwnership = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const strategy = await prisma.marketingStrategy.findUnique({
    where: { id },
    select: { userId: true }
  });

  if (!strategy) {
    return res.status(404).json({ error: 'Strategy not found' });
  }

  if (strategy.userId !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
};
```

### 2.3 보안 고려사항

1. **비밀번호 저장**
   - bcrypt 사용 (salt rounds: 10)
   - 평문 비밀번호 절대 저장 금지

2. **JWT 토큰**
   - 짧은 만료 시간 (7일)
   - Refresh Token (향후 구현)
   - HTTPS 사용 (프로덕션)

3. **Rate Limiting**
   - 로그인: 5회/분
   - 일반 API: 100회/분
   - AI 요청: 10회/분

4. **CORS**
   - 허용된 origin만 접근 가능
   - Credentials 허용

---

## 3. 에러 핸들링 전략

### 3.1 에러 타입 정의

```typescript
// src/types/errors.ts

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(500, message, false);
  }
}
```

### 3.2 글로벌 에러 핸들러

```typescript
// src/middleware/errorHandler.ts

export const errorHandler = (err, req, res, next) => {
  // 로깅
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.userId,
  });

  // Operational 에러 (예상 가능한 에러)
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.constructor.name,
      message: err.message,
    });
  }

  // Prisma 에러
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({
      error: 'Database Error',
      message: 'Invalid database operation',
    });
  }

  // JWT 에러
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token expired',
    });
  }

  // 예상치 못한 에러
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
};
```

### 3.3 Async 에러 처리

```typescript
// src/utils/asyncHandler.ts

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 사용 예시
router.get('/strategies', authenticateToken, asyncHandler(async (req, res) => {
  const strategies = await strategyService.getStrategies(req.user.userId);
  res.json({ data: strategies });
}));
```

### 3.4 입력 검증

```typescript
// src/middleware/validation.ts
import { z } from 'zod';

export const validateBody = (schema: z.ZodSchema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: err.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      next(err);
    }
  };
};

// 사용 예시
const createStrategySchema = z.object({
  periodType: z.enum(['YEARLY', 'QUARTERLY', 'MONTHLY']),
  year: z.number().min(2020).max(2100),
  quarter: z.number().min(1).max(4).optional(),
  title: z.string().min(1).max(200),
});

router.post(
  '/strategies',
  authenticateToken,
  validateBody(createStrategySchema),
  asyncHandler(strategyController.createStrategy)
);
```

---

## 4. 데이터베이스 관계

```
User (1) ─────< (N) MarketingStrategy
                    │
                    ├─< (N) Goal
                    ├── (1) TargetAudience
                    ├─< (N) Channel
                    ├─< (N) KPI
                    ├─< (N) Project
                    │       └─< (N) ActionItem
                    └─< (N) ActionItem (독립)

User (1) ─────< (N) ChatSession
                    └─< (N) ChatMessage
```

---

## 5. AI 통합 (Google Gemini)

### 5.1 대화 플로우

```
1. Client → 메시지 전송
2. Server → ChatSession에 사용자 메시지 저장
3. Server → Gemini API 호출
   - 시스템 프롬프트: 마케팅 전문가 페르소나
   - 대화 히스토리 포함
   - Function Calling 활성화
4. Gemini → 응답 생성
5. Server → 구조화된 데이터 추출 (Function Calling)
   - goals, kpis, actionItems 등
6. Server → 데이터베이스에 저장
7. Server → AI 응답 저장
8. Client ← AI 응답 + 추출된 데이터 반환
```

### 5.2 Function Calling 정의

```typescript
const functions = [
  {
    name: 'extract_goals',
    description: '사용자의 대화에서 목표를 추출합니다',
    parameters: {
      type: 'object',
      properties: {
        goals: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              description: { type: 'string' },
              specific: { type: 'string' },
              measurable: { type: 'string' },
              achievable: { type: 'boolean' },
              relevant: { type: 'string' },
              timeBound: { type: 'string' }
            }
          }
        }
      }
    }
  },
  // ... 다른 function 정의
];
```

---

## 6. 성능 최적화

### 6.1 캐싱 전략
- Redis 사용 (향후 추가)
- 자주 조회되는 전략 데이터 캐싱
- TTL: 5분

### 6.2 데이터베이스 최적화
- 인덱스 추가 (userId, periodType, year, quarter)
- N+1 문제 해결 (Prisma include)
- 페이지네이션

### 6.3 API 최적화
- Compression 미들웨어
- Response 필드 선택 (select)
- Lazy loading

---

## 7. 모니터링 및 로깅

### 7.1 로깅
- Winston 라이브러리 사용
- 로그 레벨: error, warn, info, debug
- 파일 로테이션 (일별)

### 7.2 모니터링
- Health check 엔드포인트
- 데이터베이스 연결 상태
- 외부 API 상태 (Gemini)

---

## 8. 배포 전략

### 8.1 개발 환경
- Docker Compose로 로컬 실행
- Hot reload (ts-node-dev)

### 8.2 프로덕션 환경
- Docker 컨테이너
- AWS ECS 또는 GCP Cloud Run
- PostgreSQL (Managed Service)
- 환경 변수 관리 (AWS Secrets Manager)

---

## 9. 보안 체크리스트

- [ ] HTTPS 강제
- [ ] CORS 설정
- [ ] Rate Limiting
- [ ] SQL Injection 방지 (Prisma ORM 사용)
- [ ] XSS 방지 (입력 sanitization)
- [ ] CSRF 토큰 (향후 추가)
- [ ] 환경 변수 보안
- [ ] 비밀번호 해싱
- [ ] JWT 토큰 보안

---

**Version**: 1.0
**Last Updated**: 2024-11-07
