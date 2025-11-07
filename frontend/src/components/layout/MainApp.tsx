import React, { useState } from 'react';
import { AppHeader } from './AppHeader';
import { TabNavigation, TabType } from './TabNavigation';
import { InputTab } from '../strategy/InputTab';
import { SummaryTab } from '../strategy/SummaryTab';

export const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('input');

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-hidden">
        {activeTab === 'input' ? <InputTab /> : <SummaryTab />}
      </div>
    </div>
  );
};
