import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

// System prompt for marketing strategy expert
const SYSTEM_PROMPT = `당신은 전문 마케팅 전략가입니다. 사용자가 마케팅 전략을 수립하도록 도와주는 역할입니다.

당신의 역할:
1. 사용자와 대화하며 마케팅 전략의 핵심 요소를 도출합니다
2. SMART 기준에 맞는 목표 설정을 돕습니다
3. 실행 가능한 액션 아이템을 제안합니다
4. 측정 가능한 KPI를 추천합니다
5. 사용자의 아이디어를 확장하고 구조화합니다

대화 방식:
- 친근하고 전문적인 톤을 유지합니다
- 질문을 통해 정보를 구체화합니다
- 단계별로 진행하여 사용자가 부담스럽지 않게 합니다
- 예시와 함께 설명하여 이해를 돕습니다

주의사항:
- 추상적인 답변보다는 구체적인 제안을 합니다
- 실현 가능성을 고려한 조언을 제공합니다
- 사용자의 산업과 상황에 맞는 맞춤형 조언을 합니다`;

// Function declarations for structured data extraction
const functions = [
  {
    name: 'extract_goals',
    description: '사용자의 대화에서 마케팅 목표를 추출합니다',
    parameters: {
      type: 'object',
      properties: {
        goals: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
                description: '목표 설명',
              },
              specific: {
                type: 'string',
                description: 'SMART - Specific: 구체적인 목표',
              },
              measurable: {
                type: 'string',
                description: 'SMART - Measurable: 측정 방법',
              },
              achievable: {
                type: 'boolean',
                description: 'SMART - Achievable: 달성 가능성',
              },
              relevant: {
                type: 'string',
                description: 'SMART - Relevant: 관련성',
              },
              timeBound: {
                type: 'string',
                description: 'SMART - Time-bound: 기한',
              },
            },
            required: ['description', 'specific', 'measurable', 'achievable', 'relevant', 'timeBound'],
          },
        },
      },
      required: ['goals'],
    },
  },
  {
    name: 'extract_kpis',
    description: '사용자의 대화에서 KPI(핵심 성과 지표)를 추출합니다',
    parameters: {
      type: 'object',
      properties: {
        kpis: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'KPI 이름',
              },
              target: {
                type: 'number',
                description: '목표 수치',
              },
              unit: {
                type: 'string',
                description: '단위 (%, 명, 원 등)',
              },
              measurementMethod: {
                type: 'string',
                description: '측정 방법',
              },
            },
            required: ['name', 'target', 'unit'],
          },
        },
      },
      required: ['kpis'],
    },
  },
  {
    name: 'extract_action_items',
    description: '사용자의 대화에서 실행 과제(액션 아이템)를 추출합니다',
    parameters: {
      type: 'object',
      properties: {
        actionItems: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description: '과제 제목',
              },
              description: {
                type: 'string',
                description: '과제 상세 설명',
              },
              priority: {
                type: 'string',
                enum: ['HIGH', 'MEDIUM', 'LOW'],
                description: '우선순위',
              },
              dueDate: {
                type: 'string',
                description: '마감일 (YYYY-MM-DD)',
              },
              durationMonths: {
                type: 'number',
                description: '소요 기간 (월)',
              },
              manMonths: {
                type: 'number',
                description: '투입 맨먼스',
              },
            },
            required: ['title', 'priority'],
          },
        },
      },
      required: ['actionItems'],
    },
  },
  {
    name: 'extract_projects',
    description: '사용자의 대화에서 프로젝트를 추출합니다',
    parameters: {
      type: 'object',
      properties: {
        projects: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: '프로젝트 이름',
              },
              description: {
                type: 'string',
                description: '프로젝트 설명',
              },
              startDate: {
                type: 'string',
                description: '시작일 (YYYY-MM-DD)',
              },
              endDate: {
                type: 'string',
                description: '종료일 (YYYY-MM-DD)',
              },
              durationMonths: {
                type: 'number',
                description: '소요 기간 (월)',
              },
              manMonths: {
                type: 'number',
                description: '투입 맨먼스',
              },
              budget: {
                type: 'number',
                description: '예산',
              },
            },
            required: ['name', 'durationMonths', 'manMonths'],
          },
        },
      },
      required: ['projects'],
    },
  },
];

export class GeminiService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });
  }

  async chat(message: string, history: Array<{ role: string; parts: Array<{ text: string }> }> = []) {
    try {
      const chat = this.model.startChat({
        history,
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      const result = await chat.sendMessage(message);
      const response = result.response;
      const text = response.text();

      return {
        text,
        role: 'model',
      };
    } catch (error) {
      console.error('Gemini chat error:', error);
      throw new Error('Failed to get response from AI');
    }
  }

  async extractData(conversationText: string, functionName: string) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const prompt = `다음 대화에서 ${functionName}에 해당하는 정보를 추출해주세요:\n\n${conversationText}`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        tools: [{ functionDeclarations: functions }],
      });

      const response = result.response;
      const functionCall = response.functionCalls()?.[0];

      if (functionCall && functionCall.name === functionName) {
        return functionCall.args;
      }

      return null;
    } catch (error) {
      console.error('Gemini extraction error:', error);
      throw new Error('Failed to extract data from conversation');
    }
  }

  async expandIdeas(userIdea: string) {
    try {
      const prompt = `사용자의 다음 아이디어를 마케팅 관점에서 확장하고 구체화해주세요.

아이디어: ${userIdea}

다음 측면에서 확장해주세요:
1. 구체적인 실행 방안
2. 관련된 마케팅 채널
3. 타겟 고객 세분화
4. 예상 효과
5. 고려해야 할 리스크

각 항목을 명확히 구분하여 구조화된 형태로 답변해주세요.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('Gemini idea expansion error:', error);
      throw new Error('Failed to expand ideas');
    }
  }

  async organizeIdeas(ideas: string[]) {
    try {
      const prompt = `다음 산발적인 아이디어들을 체계적으로 정리하고 우선순위를 제안해주세요:

${ideas.map((idea, index) => `${index + 1}. ${idea}`).join('\n')}

다음 기준으로 정리해주세요:
1. 카테고리별 분류 (채널, 콘텐츠, 프로모션 등)
2. 우선순위 (긴급/중요도 매트릭스)
3. 의존성 관계 (어떤 작업이 먼저 되어야 하는지)
4. 예상 리소스 (시간, 인력, 예산)

구조화된 형태로 답변해주세요.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('Gemini organize error:', error);
      throw new Error('Failed to organize ideas');
    }
  }
}

export const geminiService = new GeminiService();
