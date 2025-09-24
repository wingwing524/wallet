import React from 'react';

// Skeleton loading components for better UX
export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-header">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-amount"></div>
    </div>
    <div className="skeleton-content">
      <div className="skeleton-line skeleton-category"></div>
      <div className="skeleton-line skeleton-date"></div>
    </div>
  </div>
);

export const SkeletonExpenseItem = () => (
  <div className="skeleton-expense-item">
    <div className="skeleton-info">
      <div className="skeleton-line skeleton-expense-title"></div>
      <div className="skeleton-meta">
        <div className="skeleton-line skeleton-category-tag"></div>
        <div className="skeleton-line skeleton-date-small"></div>
      </div>
    </div>
    <div className="skeleton-line skeleton-amount-large"></div>
  </div>
);

export const SkeletonStats = () => (
  <div className="skeleton-stats-grid">
    <div className="skeleton-stat-card">
      <div className="skeleton-line skeleton-stat-value"></div>
      <div className="skeleton-line skeleton-stat-label"></div>
    </div>
    <div className="skeleton-stat-card">
      <div className="skeleton-line skeleton-stat-value"></div>
      <div className="skeleton-line skeleton-stat-label"></div>
    </div>
  </div>
);

export const SkeletonDashboard = () => (
  <div className="skeleton-dashboard">
    <SkeletonStats />
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-card-title"></div>
      <div className="skeleton-categories">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-category-item">
            <div className="skeleton-category-info">
              <div className="skeleton-line skeleton-category-name"></div>
              <div className="skeleton-category-bar"></div>
            </div>
            <div className="skeleton-line skeleton-category-amount"></div>
          </div>
        ))}
      </div>
    </div>
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-card-title"></div>
      <div className="skeleton-recent-expenses">
        {[1, 2, 3].map(i => (
          <SkeletonExpenseItem key={i} />
        ))}
      </div>
    </div>
  </div>
);

export const LoadingSpinner = ({ size = 'medium', text = '' }) => (
  <div className={`loading-spinner loading-spinner-${size}`}>
    <div className="spinner"></div>
    {text && <div className="loading-text">{text}</div>}
  </div>
);

export const PullToRefreshIndicator = ({ isRefreshing, progress = 0 }) => (
  <div className={`pull-to-refresh-indicator ${isRefreshing ? 'refreshing' : ''}`}>
    <div 
      className="refresh-spinner"
      style={{ 
        transform: `rotate(${progress * 360}deg)`,
        opacity: Math.min(1, progress * 2)
      }}
    >
      🔄
    </div>
    <div className="refresh-text">
      {isRefreshing ? 'Refreshing...' : progress > 0.8 ? 'Release to refresh' : 'Pull to refresh'}
    </div>
  </div>
);
