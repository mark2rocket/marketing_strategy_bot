# Integration Test Plan - Week 7 Day 46-49

## 테스트 목표
전체 시스템의 End-to-End 통합을 검증하고 버그를 수정합니다.

## 완료된 작업 ✅

### 1. Docker 설정 검증
- ✅ docker-compose.yml 확인
- ✅ Backend Dockerfile 확인
- ✅ Frontend Dockerfile 확인
- ✅ PostgreSQL 설정 확인

### 2. 환경 변수 설정
- ✅ backend/.env 확인 (Gemini API 키 포함)
- ✅ frontend/.env 생성
- ✅ .env.example 생성

### 3. 스타트업 스크립트
- ✅ start.sh 생성 (편리한 서비스 시작)

## 진행 중인 작업 🚧

### 4. 백엔드 서버 테스트
```bash
cd backend

# Prisma Client 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 시드 데이터 삽입
npx prisma db seed

# 서버 시작
npm run dev
```

**테스트할 엔드포인트:**
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] GET /api/auth/me
- [ ] GET /api/strategies
- [ ] POST /api/strategies
- [ ] POST /api/chat/sessions
- [ ] POST /api/chat/sessions/:id/messages

### 5. 프론트엔드 테스트
```bash
cd frontend

# 서버 시작
npm run dev
```

**테스트할 기능:**
- [ ] 회원가입/로그인
- [ ] 다크 모드 전환
- [ ] 전략 입력 탭
  - [ ] 기간 선택
  - [ ] AI 채팅
  - [ ] 실시간 데이터 추출 미리보기
- [ ] 전략 요약 탭
  - [ ] 전략 목록 표시
  - [ ] 필터링 (연/분기/월)
  - [ ] 전략 상세 모달
    - [ ] 개요 탭
    - [ ] 차트 탭
    - [ ] 상세 탭
    - [ ] 프로젝트 관리 탭

## 대기 중인 작업 📋

### 6. End-to-End 플로우 테스트

**시나리오 1: 신규 사용자 온보딩**
1. 회원가입
2. 로그인
3. 입력 탭에서 기간 선택 (2024년 4분기)
4. AI와 대화 시작
5. 목표, KPI, 액션 아이템, 프로젝트 추출 확인
6. 전략 저장
7. 요약 탭에서 전략 확인

**시나리오 2: 전략 상세 관리**
1. 요약 탭에서 전략 카드 클릭
2. 전략 상세 모달 열기
3. 개요 탭에서 요약 정보 확인
4. 차트 탭에서 시각화 확인
   - KPI 비교 차트
   - 프로젝트 타임라인
   - 예산 배분 파이 차트
   - 리소스 활용도 차트
5. 프로젝트 관리 탭
   - 새 프로젝트 생성
   - 프로젝트 수정
   - 리소스 대시보드 확인
   - 병목 구간 확인

**시나리오 3: AI 기능 테스트**
1. 채팅에서 마케팅 전략 논의
2. "2024년 4분기 소셜 미디어 캠페인" 요청
3. AI가 목표 추출 확인
4. AI가 KPI 추천 확인
5. AI가 액션 아이템 생성 확인
6. 프로젝트 구조화 확인

### 7. 버그 수정 및 개선

**발견된 문제:**
- [ ] (문제 발견 시 기록)

**수정 완료:**
- [x] 환경 변수 설정
- [x] Docker 설정 검증

## 테스트 체크리스트

### 기능 테스트
- [ ] 회원가입이 정상 작동하는가?
- [ ] 로그인이 정상 작동하는가?
- [ ] JWT 토큰이 올바르게 발급되는가?
- [ ] AI 채팅이 응답하는가?
- [ ] 데이터 추출이 작동하는가?
- [ ] 차트가 올바르게 렌더링되는가?
- [ ] 프로젝트 CRUD가 작동하는가?
- [ ] 필터링이 작동하는가?
- [ ] 다크 모드가 작동하는가?

### 성능 테스트
- [ ] AI 응답 시간 < 3초
- [ ] API 응답 시간 < 500ms
- [ ] 페이지 로드 시간 < 2초
- [ ] 차트 렌더링 시간 < 1초

### UI/UX 테스트
- [ ] 반응형 디자인 (데스크톱/태블릿/모바일)
- [ ] 다크 모드 일관성
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 표시
- [ ] 빈 상태 (empty state) 처리

### 에러 처리
- [ ] 네트워크 오류 처리
- [ ] 인증 오류 처리 (401)
- [ ] 서버 오류 처리 (500)
- [ ] 폼 검증 에러 표시
- [ ] AI 응답 실패 처리

## 다음 단계

1. ✅ Docker 및 환경 설정 완료
2. 🚧 백엔드 서버 실행 및 테스트 (진행 중)
3. ⏳ 프론트엔드 실행 및 테스트
4. ⏳ E2E 플로우 테스트
5. ⏳ 버그 수정 및 문서화

## 실행 방법

### Docker로 전체 시스템 실행
```bash
./start.sh
```

### 개별 서비스 실행
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## 문제 해결

### PostgreSQL 연결 오류
```bash
docker-compose restart postgres
```

### Prisma Client 오류
```bash
cd backend
npx prisma generate
```

### 포트 충돌
- Frontend: 5173
- Backend: 3001
- Database: 5432

기존 프로세스를 종료하거나 포트를 변경하세요.
