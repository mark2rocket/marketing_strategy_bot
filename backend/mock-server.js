const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock user data
const mockUser = {
  userId: 'user-123',
  email: 'test@example.com',
  name: 'Test User'
};

const mockToken = 'mock-jwt-token-12345';

// Mock strategies
const mockStrategies = [
  {
    id: 'strategy-1',
    userId: 'user-123',
    periodType: 'quarterly',
    year: 2024,
    quarter: 4,
    periodLabel: '2024-Q4',
    title: '2024년 4분기 디지털 마케팅 전략',
    description: 'SNS와 콘텐츠 마케팅을 중심으로 한 브랜드 인지도 향상 전략',
    totalBudget: 50000000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  res.json({
    user: mockUser,
    token: mockToken
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    user: mockUser,
    token: mockToken
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json(mockUser);
});

// Strategy endpoints
app.get('/api/strategies', (req, res) => {
  res.json({
    data: mockStrategies,
    pagination: {
      page: 1,
      pageSize: 20,
      totalPages: 1,
      totalCount: mockStrategies.length
    }
  });
});

app.get('/api/strategies/:id', (req, res) => {
  const strategy = mockStrategies[0];
  res.json({
    ...strategy,
    goals: [
      {
        id: 'goal-1',
        strategyId: strategy.id,
        description: 'SNS 팔로워 20% 증가',
        specific: '인스타그램과 페이스북 팔로워 합계 10만명 달성',
        measurable: '월별 팔로워 증가 수 추적',
        achievable: true,
        relevant: '브랜드 인지도 향상에 직접적 기여',
        timeBound: '2024년 12월 31일',
        order: 1
      }
    ],
    kpis: [
      {
        id: 'kpi-1',
        strategyId: strategy.id,
        name: 'SNS 팔로워 수',
        target: 100000,
        unit: '명',
        currentValue: 85000,
        measurementMethod: '플랫폼별 팔로워 합산'
      },
      {
        id: 'kpi-2',
        strategyId: strategy.id,
        name: '웹사이트 방문자',
        target: 50000,
        unit: '명/월',
        currentValue: 42000,
        measurementMethod: 'Google Analytics'
      }
    ],
    projects: [
      {
        id: 'project-1',
        strategyId: strategy.id,
        name: '인스타그램 캠페인',
        description: '인플루언서 협업을 통한 브랜드 홍보',
        startDate: '2024-10-01',
        endDate: '2024-12-31',
        durationMonths: 3,
        manMonths: 4.5,
        status: 'IN_PROGRESS',
        progress: 60,
        budget: 15000000
      },
      {
        id: 'project-2',
        strategyId: strategy.id,
        name: '콘텐츠 마케팅',
        description: '블로그 및 유튜브 콘텐츠 제작',
        startDate: '2024-10-15',
        endDate: '2024-12-31',
        durationMonths: 2.5,
        manMonths: 6,
        status: 'IN_PROGRESS',
        progress: 45,
        budget: 20000000
      }
    ],
    actionItems: [
      {
        id: 'action-1',
        strategyId: strategy.id,
        title: '인플루언서 10명 섭외',
        description: '마이크로 인플루언서 중심으로 협업 진행',
        priority: 'HIGH',
        dueDate: '2024-11-15',
        durationMonths: 1,
        manMonths: 2,
        status: 'IN_PROGRESS',
        progress: 70
      }
    ]
  });
});

app.post('/api/strategies', (req, res) => {
  const newStrategy = {
    id: `strategy-${Date.now()}`,
    userId: 'user-123',
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockStrategies.push(newStrategy);
  res.json(newStrategy);
});

// Chat endpoints
app.post('/api/chat/sessions', (req, res) => {
  res.json({
    id: `session-${Date.now()}`,
    userId: 'user-123',
    title: req.body.title || 'New Chat',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

app.get('/api/chat/sessions', (req, res) => {
  res.json({
    data: []
  });
});

app.post('/api/chat/sessions/:sessionId/messages', (req, res) => {
  const userMessage = {
    id: `msg-${Date.now()}-user`,
    sessionId: req.params.sessionId,
    role: 'USER',
    content: req.body.content,
    createdAt: new Date().toISOString()
  };

  const aiMessage = {
    id: `msg-${Date.now()}-ai`,
    sessionId: req.params.sessionId,
    role: 'ASSISTANT',
    content: '안녕하세요! 마케팅 전략 수립을 도와드리겠습니다. 어떤 목표를 가지고 계신가요?',
    createdAt: new Date().toISOString()
  };

  res.json({
    userMessage,
    aiMessage,
    extractedData: {
      goals: null,
      kpis: null,
      actionItems: null,
      projects: null
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on http://localhost:${PORT}`);
  console.log(`✅ Ready to serve requests`);
});
