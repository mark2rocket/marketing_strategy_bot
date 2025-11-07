# API 명세서 (API Specification)

마케팅 분기 전략 봇 백엔드 RESTful API 문서

## Base URL
```
http://localhost:3001/api
```

## 인증 (Authentication)
JWT (JSON Web Token) 기반 인증 사용
```
Authorization: Bearer <token>
```

---

## 1. 인증 (Auth)

### 1.1 회원가입
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "홍길동",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "홍길동"
  },
  "token": "jwt_token_here"
}
```

### 1.2 로그인
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "홍길동"
  },
  "token": "jwt_token_here"
}
```

### 1.3 현재 사용자 정보
```
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "홍길동",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## 2. 마케팅 전략 (Marketing Strategies)

### 2.1 전략 목록 조회
```
GET /api/strategies
```

**Query Parameters:**
- `periodType` (optional): `yearly`, `quarterly`, `monthly`
- `year` (optional): 2024
- `quarter` (optional): 1-4
- `month` (optional): 1-12
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "periodType": "quarterly",
      "year": 2024,
      "quarter": 1,
      "periodLabel": "2024-Q1",
      "title": "2024년 1분기 신제품 론칭 전략",
      "totalBudget": 50000000,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 2.2 전략 상세 조회
```
GET /api/strategies/:id
```

**Response (200):**
```json
{
  "id": "uuid",
  "periodType": "quarterly",
  "year": 2024,
  "quarter": 1,
  "periodLabel": "2024-Q1",
  "title": "2024년 1분기 신제품 론칭 전략",
  "description": "신제품 출시를 위한 마케팅 캠페인",
  "totalBudget": 50000000,
  "goals": [...],
  "targetAudience": {...},
  "channels": [...],
  "kpis": [...],
  "projects": [...],
  "actionItems": [...],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

### 2.3 전략 생성
```
POST /api/strategies
```

**Request Body:**
```json
{
  "periodType": "quarterly",
  "year": 2024,
  "quarter": 1,
  "title": "2024년 1분기 신제품 론칭 전략",
  "description": "신제품 출시를 위한 마케팅 캠페인",
  "totalBudget": 50000000
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "periodType": "quarterly",
  "year": 2024,
  "quarter": 1,
  "periodLabel": "2024-Q1",
  "title": "2024년 1분기 신제품 론칭 전략",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### 2.4 전략 수정
```
PATCH /api/strategies/:id
```

**Request Body:** (부분 업데이트 가능)
```json
{
  "title": "수정된 제목",
  "totalBudget": 60000000
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "title": "수정된 제목",
  "totalBudget": 60000000,
  "updatedAt": "2024-01-20T00:00:00Z"
}
```

### 2.5 전략 삭제
```
DELETE /api/strategies/:id
```

**Response (204):** No Content

---

## 3. 프로젝트 (Projects)

### 3.1 프로젝트 목록 조회
```
GET /api/strategies/:strategyId/projects
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "신제품 론칭 캠페인",
      "description": "인플루언서 협업 및 온라인 광고 집행",
      "startDate": "2024-01-01",
      "endDate": "2024-02-28",
      "durationMonths": 2,
      "manMonths": 3,
      "status": "IN_PROGRESS",
      "progress": 40,
      "budget": 25000000,
      "teamMembers": ["김마케", "박디자인"]
    }
  ]
}
```

### 3.2 프로젝트 생성
```
POST /api/strategies/:strategyId/projects
```

**Request Body:**
```json
{
  "name": "신제품 론칭 캠페인",
  "description": "인플루언서 협업 및 온라인 광고 집행",
  "startDate": "2024-01-01",
  "endDate": "2024-02-28",
  "durationMonths": 2,
  "manMonths": 3,
  "budget": 25000000,
  "teamMembers": ["김마케", "박디자인"]
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "신제품 론칭 캠페인",
  "status": "NOT_STARTED",
  "progress": 0,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### 3.3 프로젝트 수정
```
PATCH /api/projects/:id
```

### 3.4 프로젝트 삭제
```
DELETE /api/projects/:id
```

---

## 4. 액션 아이템 (Action Items)

### 4.1 액션 아이템 목록 조회
```
GET /api/strategies/:strategyId/action-items
```

**Query Parameters:**
- `projectId` (optional): 특정 프로젝트의 태스크만 필터링
- `status` (optional): `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`
- `priority` (optional): `HIGH`, `MEDIUM`, `LOW`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "인플루언서 섭외 및 계약",
      "description": "10명의 마이크로 인플루언서 섭외",
      "priority": "HIGH",
      "dueDate": "2024-01-15",
      "manMonths": 0.5,
      "assignee": "김마케",
      "status": "COMPLETED",
      "progress": 100,
      "projectId": "uuid or null"
    }
  ]
}
```

### 4.2 액션 아이템 생성
```
POST /api/strategies/:strategyId/action-items
```

**Request Body:**
```json
{
  "projectId": "uuid (optional)",
  "title": "인플루언서 섭외 및 계약",
  "description": "10명의 마이크로 인플루언서 섭외",
  "priority": "HIGH",
  "startDate": "2024-01-01",
  "dueDate": "2024-01-15",
  "durationMonths": 0.5,
  "manMonths": 0.5,
  "assignee": "김마케"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "title": "인플루언서 섭외 및 계약",
  "status": "NOT_STARTED",
  "progress": 0,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### 4.3 액션 아이템 상태 업데이트
```
PATCH /api/action-items/:id
```

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "progress": 50
}
```

---

## 5. 목표 (Goals)

### 5.1 목표 목록 조회
```
GET /api/strategies/:strategyId/goals
```

### 5.2 목표 생성
```
POST /api/strategies/:strategyId/goals
```

**Request Body:**
```json
{
  "description": "신제품 인지도 30% 달성",
  "specific": "타겟 고객 1,000명 중 300명이 신제품을 인지",
  "measurable": "브랜드 인지도 설문조사",
  "achievable": true,
  "relevant": "신제품 출시 성공을 위한 필수 지표",
  "timeBound": "2024년 3월 31일까지",
  "order": 1
}
```

---

## 6. KPI

### 6.1 KPI 목록 조회
```
GET /api/strategies/:strategyId/kpis
```

### 6.2 KPI 생성
```
POST /api/strategies/:strategyId/kpis
```

**Request Body:**
```json
{
  "name": "웹사이트 방문자 수",
  "target": 10000,
  "unit": "명",
  "currentValue": 0,
  "measurementMethod": "Google Analytics"
}
```

### 6.3 KPI 업데이트 (현재값 갱신)
```
PATCH /api/kpis/:id
```

**Request Body:**
```json
{
  "currentValue": 5000
}
```

---

## 7. 채팅 (Chat)

### 7.1 채팅 세션 생성
```
POST /api/chat/sessions
```

**Request Body:**
```json
{
  "strategyId": "uuid (optional)",
  "title": "2024 Q1 전략 수립"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "title": "2024 Q1 전략 수립",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### 7.2 메시지 전송
```
POST /api/chat/sessions/:sessionId/messages
```

**Request Body:**
```json
{
  "content": "2024년 1분기 마케팅 전략을 세우고 싶어요"
}
```

**Response (200):**
```json
{
  "userMessage": {
    "id": "uuid",
    "role": "USER",
    "content": "2024년 1분기 마케팅 전략을 세우고 싶어요",
    "createdAt": "2024-01-01T10:00:00Z"
  },
  "assistantMessage": {
    "id": "uuid",
    "role": "ASSISTANT",
    "content": "좋습니다! 2024년 1분기 마케팅 전략을 수립하겠습니다. 먼저...",
    "createdAt": "2024-01-01T10:00:03Z"
  },
  "extractedData": {
    "goals": [...],
    "kpis": [...],
    "actionItems": [...]
  }
}
```

### 7.3 채팅 히스토리 조회
```
GET /api/chat/sessions/:sessionId/messages
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "role": "USER",
      "content": "...",
      "createdAt": "2024-01-01T10:00:00Z"
    },
    {
      "id": "uuid",
      "role": "ASSISTANT",
      "content": "...",
      "createdAt": "2024-01-01T10:00:03Z"
    }
  ]
}
```

---

## 8. 보고서 (Reports)

### 8.1 PDF 보고서 생성
```
POST /api/strategies/:strategyId/reports/pdf
```

**Response (200):**
```json
{
  "downloadUrl": "/api/reports/download/uuid.pdf",
  "filename": "2024-Q1-marketing-strategy.pdf"
}
```

### 8.2 PowerPoint 보고서 생성
```
POST /api/strategies/:strategyId/reports/pptx
```

---

## 에러 응답 (Error Responses)

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Strategy not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## WebSocket 이벤트

실시간 대화 기능을 위한 WebSocket 이벤트

### 연결
```
ws://localhost:3001/api/chat/ws
```

### 이벤트

**Client → Server:**
- `message`: 사용자 메시지 전송
- `typing`: 사용자가 입력 중임을 알림

**Server → Client:**
- `message`: AI 응답 메시지
- `typing`: AI가 응답 생성 중임을 알림
- `data_extracted`: 구조화된 데이터 추출 완료
- `error`: 오류 발생

---

## 버전
- **API Version**: v1
- **Last Updated**: 2024-11-07
