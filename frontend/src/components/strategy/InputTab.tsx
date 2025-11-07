import React, { useState, useEffect } from 'react';
import { PeriodSelector } from './PeriodSelector';
import { ExtractedDataPreview } from './ExtractedDataPreview';
import { ChatWindow } from '../chat/ChatWindow';
import { useChatStore } from '../../store/chatStore';
import { Button } from '../ui/Button';
import { PeriodType } from '../../types';

export const InputTab: React.FC = () => {
  const {
    currentSession,
    messages,
    isLoading,
    extractedData,
    createSession,
    sendMessage,
    clearCurrentSession,
  } = useChatStore();

  const [period, setPeriod] = useState<{
    periodType: PeriodType;
    year: number;
    quarter?: number;
    month?: number;
  }>({
    periodType: 'quarterly',
    year: new Date().getFullYear(),
    quarter: Math.floor(new Date().getMonth() / 3) + 1,
  });

  const [sessionTitle, setSessionTitle] = useState('');

  const handleStartSession = async () => {
    // Generate title based on period
    let title = '';
    if (period.periodType === 'yearly') {
      title = `${period.year}년 마케팅 전략`;
    } else if (period.periodType === 'quarterly') {
      title = `${period.year}년 ${period.quarter}분기 마케팅 전략`;
    } else if (period.periodType === 'monthly') {
      title = `${period.year}년 ${period.month}월 마케팅 전략`;
    }

    setSessionTitle(title);

    try {
      await createSession(undefined, title);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleNewSession = () => {
    clearCurrentSession();
    setSessionTitle('');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Period Selector */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            전략 입력
          </h1>
          {currentSession && (
            <Button onClick={handleNewSession} variant="outline" size="sm">
              새 세션 시작
            </Button>
          )}
        </div>

        {!currentSession && (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              기간을 선택하고 AI와 대화를 시작하세요
            </p>
            <div className="flex items-end gap-4">
              <PeriodSelector value={period} onChange={setPeriod} />
              <Button onClick={handleStartSession} variant="primary" size="md">
                대화 시작
              </Button>
            </div>
          </>
        )}

        {currentSession && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              현재 세션:
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {sessionTitle}
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area - Split View */}
      {currentSession ? (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
          {/* Left: Chat Window */}
          <div className="h-full border-r border-gray-200 dark:border-gray-700">
            <ChatWindow
              messages={messages.map((msg) => ({
                id: msg.id,
                content: msg.content,
                role: msg.role,
                createdAt: msg.createdAt,
              }))}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              sessionTitle={sessionTitle}
            />
          </div>

          {/* Right: Extracted Data Preview */}
          <div className="h-full bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                실시간 데이터 추출
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI가 대화에서 자동으로 추출한 정보입니다
              </p>
            </div>
            <ExtractedDataPreview data={extractedData} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center max-w-md p-8">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              AI와 함께 전략을 세워보세요
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              기간을 선택하고 대화를 시작하면, AI가 자연스러운 대화를 통해
              마케팅 전략의 핵심 요소를 함께 도출합니다.
            </p>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  SMART 목표
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl mb-2">📈</div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  KPI 지표
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  액션 아이템
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl mb-2">🚀</div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  프로젝트 계획
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
