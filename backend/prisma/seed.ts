import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 테스트 사용자 생성
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: '김마케',
      password: 'hashed_password_here', // 실제로는 bcrypt로 해싱 필요
    },
  });

  console.log('✅ Created test user:', testUser.email);

  // 2024 Q1 전략 생성
  const strategy2024Q1 = await prisma.marketingStrategy.create({
    data: {
      userId: testUser.id,
      periodType: 'QUARTERLY',
      year: 2024,
      quarter: 1,
      periodLabel: '2024-Q1',
      title: '2024년 1분기 신제품 론칭 전략',
      description: '신제품 출시를 위한 마케팅 캠페인',
      totalBudget: 50000000, // 5천만원

      // 목표 생성
      goals: {
        create: [
          {
            description: '신제품 인지도 30% 달성',
            specific: '타겟 고객 1,000명 중 300명이 신제품을 인지',
            measurable: '브랜드 인지도 설문조사',
            achievable: true,
            relevant: '신제품 출시 성공을 위한 필수 지표',
            timeBound: '2024년 3월 31일까지',
            order: 1,
          },
          {
            description: '온라인 판매 500건 달성',
            specific: '웹사이트를 통한 직접 판매 500건',
            measurable: '주문 수 카운트',
            achievable: true,
            relevant: '매출 목표 달성',
            timeBound: '2024년 3월 31일까지',
            order: 2,
          },
        ],
      },

      // 타겟 오디언스
      targetAudience: {
        create: {
          segments: ['MZ세대', '직장인', '테크 얼리어답터'],
          demographics: '25-35세, 대졸 이상, 중상위 소득층',
          psychographics: '새로운 기술에 관심이 많고, 온라인 쇼핑을 선호하는 그룹',
          painPoints: ['시간 부족', '효율성 추구', '품질 중시'],
        },
      },

      // 마케팅 채널
      channels: {
        create: [
          {
            name: '인스타그램 광고',
            description: '인플루언서 협업 및 스폰서 광고',
            budget: 15000000,
            priority: 'HIGH',
          },
          {
            name: '네이버 검색 광고',
            description: '키워드 광고 및 브랜드 검색',
            budget: 10000000,
            priority: 'HIGH',
          },
          {
            name: '이메일 마케팅',
            description: '기존 고객 대상 뉴스레터',
            budget: 2000000,
            priority: 'MEDIUM',
          },
        ],
      },

      // KPI
      kpis: {
        create: [
          {
            name: '웹사이트 방문자 수',
            target: 10000,
            unit: '명',
            currentValue: 0,
            measurementMethod: 'Google Analytics',
          },
          {
            name: '전환율',
            target: 5,
            unit: '%',
            currentValue: 0,
            measurementMethod: '주문 수 / 방문자 수',
          },
          {
            name: 'SNS 참여율',
            target: 3,
            unit: '%',
            currentValue: 0,
            measurementMethod: '좋아요, 댓글, 공유 합산',
          },
        ],
      },

      // 프로젝트
      projects: {
        create: [
          {
            name: '신제품 론칭 캠페인',
            description: '인플루언서 협업 및 온라인 광고 집행',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-28'),
            durationMonths: 2,
            manMonths: 3, // 3 MM
            status: 'IN_PROGRESS',
            progress: 40,
            budget: 25000000,
            teamMembers: ['김마케', '박디자인', '이콘텐츠'],

            // 프로젝트 하위 태스크
            tasks: {
              create: [
                {
                  title: '인플루언서 섭외 및 계약',
                  description: '10명의 마이크로 인플루언서 섭외',
                  priority: 'HIGH',
                  startDate: new Date('2024-01-01'),
                  dueDate: new Date('2024-01-15'),
                  durationMonths: 0.5,
                  manMonths: 0.5,
                  assignee: '김마케',
                  status: 'COMPLETED',
                  progress: 100,
                  strategyId: '', // 아래에서 설정
                },
                {
                  title: '콘텐츠 제작 및 검수',
                  description: '제품 리뷰 영상 및 이미지 제작',
                  priority: 'HIGH',
                  startDate: new Date('2024-01-16'),
                  dueDate: new Date('2024-02-15'),
                  durationMonths: 1,
                  manMonths: 1.5,
                  assignee: '이콘텐츠',
                  status: 'IN_PROGRESS',
                  progress: 60,
                  strategyId: '', // 아래에서 설정
                },
                {
                  title: '광고 캠페인 집행',
                  description: '인스타그램 및 네이버 광고 운영',
                  priority: 'HIGH',
                  startDate: new Date('2024-02-01'),
                  dueDate: new Date('2024-02-28'),
                  durationMonths: 1,
                  manMonths: 1,
                  assignee: '김마케',
                  status: 'NOT_STARTED',
                  progress: 0,
                  strategyId: '', // 아래에서 설정
                },
              ],
            },
          },
          {
            name: '웹사이트 최적화',
            description: 'UX 개선 및 전환율 최적화',
            startDate: new Date('2024-01-15'),
            endDate: new Date('2024-03-15'),
            durationMonths: 2,
            manMonths: 1.5,
            status: 'IN_PROGRESS',
            progress: 30,
            budget: 8000000,
            teamMembers: ['박개발', '최디자이너'],

            tasks: {
              create: [
                {
                  title: '랜딩 페이지 리디자인',
                  description: '제품 소개 페이지 UX/UI 개선',
                  priority: 'HIGH',
                  startDate: new Date('2024-01-15'),
                  dueDate: new Date('2024-02-15'),
                  durationMonths: 1,
                  manMonths: 1,
                  assignee: '최디자이너',
                  status: 'IN_PROGRESS',
                  progress: 50,
                  strategyId: '',
                },
                {
                  title: 'A/B 테스트 구현',
                  description: 'CTA 버튼 및 레이아웃 테스트',
                  priority: 'MEDIUM',
                  startDate: new Date('2024-02-15'),
                  dueDate: new Date('2024-03-15'),
                  durationMonths: 1,
                  manMonths: 0.5,
                  assignee: '박개발',
                  status: 'NOT_STARTED',
                  progress: 0,
                  strategyId: '',
                },
              ],
            },
          },
        ],
      },

      // 독립 액션 아이템 (프로젝트 외)
      actionItems: {
        create: [
          {
            title: '경쟁사 분석 리포트 작성',
            description: '주요 경쟁사 3개 마케팅 전략 분석',
            priority: 'MEDIUM',
            dueDate: new Date('2024-01-31'),
            durationMonths: 0.5,
            manMonths: 0.3,
            assignee: '김마케',
            status: 'COMPLETED',
            progress: 100,
          },
          {
            title: '월간 성과 리포트 작성',
            description: '매월 말 KPI 달성률 리포트',
            priority: 'HIGH',
            dueDate: new Date('2024-03-31'),
            durationMonths: 3,
            manMonths: 0.6,
            assignee: '김마케',
            status: 'IN_PROGRESS',
            progress: 30,
          },
        ],
      },
    },
  });

  console.log('✅ Created Q1 2024 strategy:', strategy2024Q1.periodLabel);

  // 채팅 세션 생성
  const chatSession = await prisma.chatSession.create({
    data: {
      userId: testUser.id,
      strategyId: strategy2024Q1.id,
      title: '2024 Q1 전략 수립 세션',
      isActive: true,
      messages: {
        create: [
          {
            role: 'SYSTEM',
            content: '안녕하세요! 마케팅 전략 수립을 도와드리겠습니다.',
          },
          {
            role: 'USER',
            content: '2024년 1분기 신제품 론칭 전략을 세우고 싶어요.',
          },
          {
            role: 'ASSISTANT',
            content:
              '좋습니다! 신제품 론칭 전략을 수립하겠습니다. 먼저 제품에 대해 조금 더 자세히 알려주실 수 있나요?',
          },
        ],
      },
    },
  });

  console.log('✅ Created chat session:', chatSession.title);

  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
