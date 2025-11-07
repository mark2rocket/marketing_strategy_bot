import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';
import { MainApp } from './components/layout/MainApp';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

type AuthView = 'login' | 'register';

function App() {
  const { isAuthenticated, checkAuth, loading } = useAuthStore();
  const { theme } = useUIStore();
  const [authView, setAuthView] = useState<AuthView>('login');
  const [initializing, setInitializing] = useState(true);

  // Apply theme to document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Check authentication status on mount
  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setInitializing(false);
    };
    init();
  }, [checkAuth]);

  // Show loading spinner during initialization
  if (initializing || loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Show main app if authenticated
  if (isAuthenticated) {
    return <MainApp />;
  }

  // Show auth pages if not authenticated
  return (
    <>
      {authView === 'login' ? (
        <LoginPage onSwitchToRegister={() => setAuthView('register')} />
      ) : (
        <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
      )}
    </>
  );
}

export default App;
