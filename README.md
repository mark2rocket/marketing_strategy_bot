# 마케팅 분기 전략 수립 봇 (Marketing Quarterly Strategy Bot)

대화형 AI 봇을 통해 마케팅 담당자가 분기별 전략을 체계적으로 수립하고, 목표, 액션아이템, KPI 등을 자동으로 정리하여 시각화된 전략 보고서를 생성하는 솔루션

## 📋 프로젝트 개요

- **목적**: 마케팅 전략 수립 시간 70% 단축, 전략 구조화 및 표준화
- **기술 스택**:
  - Frontend: React, TypeScript, Vite, TailwindCSS, Chart.js
  - Backend: Node.js, Express, TypeScript
  - AI: Google Gemini API
  - Database: PostgreSQL
- **개발 기간**: 8주 MVP + 4주 고도화

## 🚀 빠른 시작

### 사전 요구사항

- Node.js 20.x 이상
- Docker & Docker Compose
- npm 또는 yarn

### 설치 및 실행

#### 1. 저장소 클론

```bash
git clone <repository-url>
cd marketing_strategy_bot
```

#### 2. 환경 변수 설정

백엔드 환경 변수 파일 설정:
```bash
cd backend
cp .env.example .env
# .env 파일을 열어 필요한 값 설정 (특히 GEMINI_API_KEY)
```

#### 3. Docker로 전체 스택 실행

```bash
docker-compose up --build
```

서비스 접속:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

#### 4. 로컬 개발 (Docker 없이)

**백엔드 실행:**
```bash
cd backend
npm install
npm run dev
```

**프론트엔드 실행:**
```bash
cd frontend
npm install
npm run dev
```

**PostgreSQL 설치 (로컬):**
```bash
# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql
sudo systemctl start postgresql
```

## 📁 프로젝트 구조

```
marketing_strategy_bot/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── store/          # Zustand 상태 관리
│   │   ├── api/            # API 클라이언트
│   │   └── types/          # TypeScript 타입 정의
│   ├── Dockerfile
│   └── package.json
│
├── backend/                  # Node.js 백엔드
│   ├── src/
│   │   ├── routes/         # API 라우트
│   │   ├── controllers/    # 비즈니스 로직
│   │   ├── services/       # AI, DB 서비스
│   │   ├── models/         # 데이터 모델
│   │   ├── middleware/     # 미들웨어
│   │   └── index.ts        # 진입점
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── docs/                     # 문서
│   ├── PRD.md               # 제품 요구사항 문서
│   ├── BUILD_PLAN.md        # 빌드 플랜
│   └── CLAUDE.md            # Claude Code 지침
│
├── docker-compose.yml        # Docker Compose 설정
├── .gitignore
└── README.md
```

## 🎯 핵심 기능

### MVP (Phase 1)
- ✅ 대화형 전략 수립 인터페이스
- ✅ AI 기반 아이디어 확장 및 정리
- ✅ 연/분기/월 단위 그루핑
- ✅ 프로젝트 및 맨먼스 관리
- ✅ KPI 및 지표 설정
- ✅ 자동 보고서 생성 (PDF/PPT)

### Phase 2 (고도화)
- 🔄 협업 기능
- 🔄 버전 관리
- 🔄 AI 인사이트

### Phase 3 (확장)
- 📋 외부 시스템 연동 (CRM, Analytics)
- 📋 모바일 앱
- 📋 엔터프라이즈 기능

## 🛠️ 개발 가이드

### 코드 스타일

프로젝트는 ESLint와 Prettier를 사용합니다:

```bash
# 백엔드 린트 실행
cd backend
npm run lint

# 프론트엔드 린트 실행
cd frontend
npm run lint
```

### 테스트

```bash
# 백엔드 테스트
cd backend
npm test

# 프론트엔드 테스트
cd frontend
npm test
```

### 빌드

```bash
# 백엔드 빌드
cd backend
npm run build

# 프론트엔드 빌드
cd frontend
npm run build
```

## 📚 API 문서

백엔드 서버 실행 후 다음 엔드포인트에서 API 문서를 확인할 수 있습니다:
- Health Check: `GET http://localhost:3001/health`
- API Root: `GET http://localhost:3001/api`

## 🔑 환경 변수

### Backend (.env)

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/marketing_strategy_bot
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

### Frontend

프론트엔드 환경 변수는 `.env.local` 파일 또는 Vite 설정에서 관리합니다.

## 🤝 기여 가이드

1. 이슈 생성 또는 기존 이슈 확인
2. 브랜치 생성 (`feature/기능명` 또는 `fix/버그명`)
3. 변경사항 커밋
4. Pull Request 생성

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 📞 문의

프로젝트 관련 문의는 이슈를 통해 남겨주세요.

---

**개발 시작일**: 2025-11-07
**현재 상태**: Week 1 - 환경 설정 및 기본 구조 구축 완료
**다음 단계**: Week 2 - UI/UX 디자인 및 DB 스키마 설계
