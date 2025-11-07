# 컴포넌트 구조 설계

React 컴포넌트 트리 및 상태 관리 전략

## 📁 디렉토리 구조

```
frontend/src/
├── components/
│   ├── ui/                    # 재사용 가능한 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── index.ts
│   │
│   ├── layout/                # 레이아웃 컴포넌트
│   │   ├── Container.tsx
│   │   ├── MainLayout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── index.ts
│   │
│   ├── chat/                  # 채팅 관련 컴포넌트
│   │   ├── ChatWindow.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── TypingIndicator.tsx
│   │   └── QuickReply.tsx
│   │
│   ├── strategy/              # 전략 관련 컴포넌트
│   │   ├── StrategyCard.tsx
│   │   ├── StrategyList.tsx
│   │   ├── StrategyDetail.tsx
│   │   ├── PeriodSelector.tsx
│   │   └── StrategyStats.tsx
│   │
│   ├── project/               # 프로젝트 관련 컴포넌트
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectList.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskList.tsx
│   │   ├── ResourceChart.tsx  # 맨먼스 시각화
│   │   └── GanttChart.tsx     # 타임라인
│   │
│   ├── kpi/                   # KPI 관련 컴포넌트
│   │   ├── KPICard.tsx
│   │   ├── KPIDashboard.tsx
│   │   ├── ProgressBar.tsx
│   │   └── KPIChart.tsx
│   │
│   └── report/                # 보고서 관련 컴포넌트
│       ├── ReportPreview.tsx
│       ├── ReportExport.tsx
│       └── ReportTemplate.tsx
│
├── pages/                     # 페이지 컴포넌트
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── ChatPage.tsx          # 입력 탭
│   ├── SummaryPage.tsx       # 정리 탭
│   ├── StrategyDetail.tsx
│   └── ReportPage.tsx
│
├── hooks/                     # 커스텀 훅
│   ├── useAuth.ts
│   ├── useStrategy.ts
│   ├── useChat.ts
│   ├── useProject.ts
│   └── useWebSocket.ts
│
├── store/                     # Zustand 상태 관리
│   ├── authStore.ts
│   ├── strategyStore.ts
│   ├── chatStore.ts
│   └── uiStore.ts
│
├── api/                       # API 클라이언트
│   ├── client.ts             # Axios 인스턴스
│   ├── auth.ts
│   ├── strategy.ts
│   ├── project.ts
│   ├── chat.ts
│   └── report.ts
│
├── types/                     # TypeScript 타입
│   ├── strategy.ts
│   ├── project.ts
│   ├── chat.ts
│   └── api.ts
│
├── utils/                     # 유틸리티 함수
│   ├── format.ts             # 날짜, 숫자 포맷팅
│   ├── validation.ts         # 입력 검증
│   └── storage.ts            # LocalStorage 관리
│
└── App.tsx                    # 루트 컴포넌트
```

---

## 🌳 컴포넌트 트리

### App Level
```
App
└── Router
    ├── PublicLayout
    │   ├── Login
    │   └── Register
    │
    └── AuthenticatedLayout
        ├── MainLayout
        │   ├── Header
        │   │   ├── Logo
        │   │   ├── Navigation
        │   │   └── UserMenu
        │   │
        │   ├── Sidebar (optional)
        │   │   ├── PeriodSelector
        │   │   └── QuickNav
        │   │
        │   └── Main Content
        │       ├── Dashboard
        │       ├── ChatPage
        │       ├── SummaryPage
        │       └── ReportPage
```

### Dashboard Page
```
Dashboard
├── Container
│   ├── WelcomeSection
│   ├── StrategyOverview
│   │   ├── PeriodSelector
│   │   └── StrategyList
│   │       └── StrategyCard (multiple)
│   │
│   ├── QuickActions
│   │   └── Button (multiple)
│   │
│   └── RecentActivity
│       └── ActivityItem (multiple)
```

### ChatPage (입력 탭)
```
ChatPage
├── Container
│   ├── PeriodSelector
│   │   ├── YearSelect
│   │   ├── QuarterSelect
│   │   └── MonthSelect
│   │
│   ├── SplitView
│   │   ├── ChatWindow (Left)
│   │   │   ├── ChatMessage (multiple)
│   │   │   │   ├── MessageBubble
│   │   │   │   └── Timestamp
│   │   │   ├── TypingIndicator
│   │   │   └── ChatInput
│   │   │       ├── TextArea
│   │   │       ├── QuickReply (multiple)
│   │   │       └── SendButton
│   │   │
│   │   └── LivePreview (Right)
│   │       ├── ProgressStepper
│   │       ├── GoalPreview
│   │       ├── KPIPreview
│   │       └── ActionItemPreview
│   │
│   └── SaveProgress
```

### SummaryPage (정리 탭)
```
SummaryPage
├── Container
│   ├── PeriodFilter
│   │   └── Toggle (Year/Quarter/Month)
│   │
│   ├── ViewToggle
│   │   └── Toggle (Grid/List/Timeline)
│   │
│   ├── GridView (if selected)
│   │   └── StrategyCard (multiple)
│   │       ├── ThumbnailStats
│   │   │   └── QuickActions
│   │
│   ├── ListView (if selected)
│   │   └── StrategyRow (multiple)
│   │
│   └── TimelineView (if selected)
│       └── GanttChart
│           └── ProjectBar (multiple)
```

### StrategyDetail Page
```
StrategyDetail
├── Container
│   ├── Header
│   │   ├── Title
│   │   ├── PeriodBadge
│   │   └── Actions
│   │
│   ├── TabNavigation
│   │   ├── Overview
│   │   ├── Goals
│   │   ├── Projects
│   │   ├── Actions
│   │   ├── KPIs
│   │   └── Timeline
│   │
│   ├── TabContent
│   │   ├── OverviewTab
│   │   │   ├── StrategyStats
│   │   │   ├── TargetAudience
│   │   │   └── Channels
│   │   │
│   │   ├── GoalsTab
│   │   │   └── GoalCard (multiple)
│   │   │
│   │   ├── ProjectsTab
│   │   │   ├── ProjectCard (multiple)
│   │   │   │   ├── ProjectHeader
│   │   │   │   ├── ResourceInfo (manMonths)
│   │   │   │   ├── ProgressBar
│   │   │   │   └── TaskList
│   │   │   │       └── TaskItem (multiple)
│   │   │   │
│   │   │   └── ResourceChart (Total ManMonths)
│   │   │
│   │   ├── KPIsTab
│   │   │   └── KPIDashboard
│   │   │       └── KPICard (multiple)
│   │   │
│   │   └── TimelineTab
│   │       └── GanttChart
│   │
│   └── FloatingActions
│       ├── ExportButton
│       └── EditButton
```

---

## 🔄 상태 관리 (Zustand)

### authStore
```typescript
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}
```

### strategyStore
```typescript
interface StrategyStore {
  strategies: MarketingStrategy[];
  currentStrategy: MarketingStrategy | null;
  loading: boolean;
  error: string | null;

  fetchStrategies: (filters: StrategyFilters) => Promise<void>;
  fetchStrategy: (id: string) => Promise<void>;
  createStrategy: (data: CreateStrategyData) => Promise<void>;
  updateStrategy: (id: string, data: UpdateStrategyData) => Promise<void>;
  deleteStrategy: (id: string) => Promise<void>;
}
```

### chatStore
```typescript
interface ChatStore {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  isTyping: boolean;

  createSession: (strategyId?: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  loadMessages: (sessionId: string) => Promise<void>;
}
```

### projectStore
```typescript
interface ProjectStore {
  projects: Project[];
  totalManMonths: number;

  fetchProjects: (strategyId: string) => Promise<void>;
  createProject: (data: CreateProjectData) => Promise<void>;
  updateProject: (id: string, data: UpdateProjectData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  calculateTotalManMonths: () => number;
}
```

### uiStore
```typescript
interface UIStore {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  currentView: 'grid' | 'list' | 'timeline';
  periodFilter: PeriodFilter;

  toggleTheme: () => void;
  toggleSidebar: () => void;
  setView: (view: string) => void;
  setPeriodFilter: (filter: PeriodFilter) => void;
}
```

---

## 🎣 커스텀 훅

### useAuth
```typescript
const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  // 로직
  return { user, isAuthenticated, login, logout };
};
```

### useStrategy
```typescript
const useStrategy = (strategyId?: string) => {
  const { strategies, fetchStrategies, createStrategy } = useStrategyStore();
  // 로직
  return { strategies, fetchStrategies, createStrategy };
};
```

### useWebSocket
```typescript
const useWebSocket = (sessionId: string) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // WebSocket 연결
  }, [sessionId]);

  return { connected, sendMessage };
};
```

---

## 🔌 API 클라이언트

### client.ts
```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
});

// 인터셉터 설정
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

---

## 📊 데이터 플로우

### 전략 생성 플로우
```
User Input (ChatPage)
  ↓
ChatStore.sendMessage()
  ↓
API.chat.sendMessage()
  ↓
Backend (Gemini AI)
  ↓
Response (extracted data)
  ↓
StrategyStore.createStrategy()
  ↓
UI Update
```

### 실시간 채팅 플로우
```
User Types
  ↓
WebSocket.send(message)
  ↓
Server (Gemini AI Processing)
  ↓
WebSocket.receive(response)
  ↓
ChatStore.addMessage()
  ↓
ChatWindow re-render
```

---

## 🎯 성능 최적화

### React.memo
- List 컴포넌트 최적화
- Card 컴포넌트 최적화

### useCallback
- 이벤트 핸들러 메모이제이션

### useMemo
- 복잡한 계산 결과 캐싱
- 필터링된 리스트

### Code Splitting
```typescript
const ReportPage = lazy(() => import('./pages/ReportPage'));
```

### Virtual Scrolling
- 긴 리스트 렌더링 최적화 (react-window)

---

## ✅ 컴포넌트 개발 체크리스트

- [ ] TypeScript 타입 정의
- [ ] Props 인터페이스 문서화
- [ ] 에러 바운더리 적용
- [ ] 로딩 상태 처리
- [ ] 에러 상태 처리
- [ ] 반응형 디자인
- [ ] 다크 모드 지원
- [ ] Accessibility 준수
- [ ] 단위 테스트 작성

---

**Version**: 1.0
**Last Updated**: 2024-11-07
