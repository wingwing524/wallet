import React from 'react';
import { useTranslation } from 'react-i18next';

const Navigation = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  
  const tabs = [
    { id: 'dashboard', icon: '📊' },
    { id: 'expenses', icon: '📝' },
    { id: 'friends', icon: '👥' },
    { id: 'add', icon: '➕' }
  ];

  return (
    <nav className="nav-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">
            {tab.id === 'dashboard' && t('dashboard')}
            {tab.id === 'expenses' && t('expenses')}
            {tab.id === 'friends' && t('friends')}
            {tab.id === 'add' && t('addExpense')}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
