import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'expenses', label: '📝 Expenses', icon: '📝' },
    { id: 'friends', label: '👥 Friends', icon: '👥' },
    { id: 'add', label: '➕ Add New', icon: '➕' }
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
          <span className="tab-label">{tab.label.split(' ')[1]}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
