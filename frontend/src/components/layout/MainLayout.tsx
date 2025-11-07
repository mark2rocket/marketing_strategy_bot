import React from 'react';

export interface MainLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  showSidebar?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  header,
  sidebar,
  showSidebar = false,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Header */}
      {header && (
        <header className="sticky top-0 z-50 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 shadow-sm">
          {header}
        </header>
      )}

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && sidebar && (
          <aside className="hidden lg:block w-64 min-h-[calc(100vh-64px)] bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
            <div className="sticky top-16 p-4">
              {sidebar}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
};
