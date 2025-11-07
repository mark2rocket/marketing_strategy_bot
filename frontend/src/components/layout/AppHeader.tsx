import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../ui/Button';

export const AppHeader: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🎯</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Marketing Strategy Bot
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              AI 기반 마케팅 전략 수립 도구
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            <span className="text-xl">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
              <Button onClick={logout} variant="outline" size="sm">
                로그아웃
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
