import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useTranslation } from 'react-i18next';

const Dashboard = ({ expenses, loading }) => {
  const { t, i18n } = useTranslation();
  const [monthlyData, setMonthlyData] = useState({
    total: 0,
    count: 0,
    categoryTotals: {},
    topCategories: []
  });
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    return parseFloat(localStorage.getItem('monthlyBudget') || '1000');
  });

  useEffect(() => {
    calculateMonthlyData();
  }, [expenses]); // eslint-disable-line react-hooks/exhaustive-deps

  const calculateMonthlyData = () => {
    const currentDate = new Date();
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    // Filter expenses for current month
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    });

    // Calculate totals - ensure amounts are numbers
    const total = monthlyExpenses.reduce((sum, expense) => {
      const amount = Number(expense.amount) || 0;
      return sum + amount;
    }, 0);
    const count = monthlyExpenses.length;

    // Calculate category totals
    const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
      const amount = Number(expense.amount) || 0;
      acc[expense.category] = (acc[expense.category] || 0) + amount;
      return acc;
    }, {});

    // Get top categories
    const topCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount: Number(amount) || 0 }));

    setMonthlyData({
      total,
      count,
      categoryTotals,
      topCategories
    });
  };

  const updateBudget = (newBudget) => {
    setMonthlyBudget(newBudget);
    localStorage.setItem('monthlyBudget', newBudget.toString());
  };

  const BudgetProgressCircle = ({ spent, budget }) => {
    // Ensure spent and budget are numbers
    const spentAmount = Number(spent) || 0;
    const budgetAmount = Number(budget) || 1;
    const percentage = Math.min((spentAmount / budgetAmount) * 100, 100);
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    const getProgressColor = () => {
      if (percentage >= 100) return '#FF3B30'; // Red
      if (percentage >= 80) return '#FF9500'; // Orange
      if (percentage >= 60) return '#FFCC00'; // Yellow
      return '#34C759'; // Green
    };

    return (
      <div className="budget-progress-container">
        <svg className="budget-progress-svg" width="180" height="180">
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#E5E5EA"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke={getProgressColor()}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            className="budget-progress-circle"
          />
        </svg>
        <div className="budget-progress-content">
          <div className="budget-spent">{formatCurrency(spentAmount)}</div>
          <div className="budget-total">{t('of')} {formatCurrency(budgetAmount)}</div>
          <div className="budget-remaining">
            {formatCurrency(Math.max(0, budgetAmount - spentAmount))} {t('left')}
          </div>
        </div>
      </div>
    );
  };

  const formatCurrency = (amount) => {
    // Ensure amount is a valid number
    const numericAmount = Number(amount) || 0;
    const locale = i18n.language === 'zh-TW' ? 'zh-TW' : i18n.language === 'zh-CN' ? 'zh-CN' : i18n.language === 'ja' ? 'ja-JP' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'HKD',
      currencyDisplay: 'symbol'
    }).format(numericAmount).replace('HK$', '$');
  };

  const getRecentExpenses = () => {
    return expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Budget Progress */}
      <div className="card budget-card">
        <div className="card-header">
          <h2 className="card-title">💰 {t('monthlyBudget')}</h2>
          <button 
            className="budget-edit-btn"
            onClick={() => {
              const newBudget = prompt(t('setBudgetPrompt'), monthlyBudget);
              if (newBudget && !isNaN(newBudget) && newBudget > 0) {
                updateBudget(parseFloat(newBudget));
              }
            }}
          >
            ✏️
          </button>
        </div>
        <div className="budget-content">
          <BudgetProgressCircle spent={monthlyData.total} budget={monthlyBudget} />
          <div className="budget-insights">
            {(monthlyData.total || 0) > monthlyBudget && (
              <div className="budget-warning">
                {t('budgetExceeded')} {formatCurrency((monthlyData.total || 0) - monthlyBudget)}
              </div>
            )}
            {(monthlyData.total || 0) <= monthlyBudget * 0.8 && (
              <div className="budget-success">
                {t('budgetOnTrack')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{formatCurrency(monthlyData.total)}</div>
          <div className="stat-label">{t('thisMonth')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{monthlyData.count}</div>
          <div className="stat-label">{t('transactions')}</div>
        </div>
      </div>

      {/* Top Categories */}
      {monthlyData.topCategories.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">{t('topCategories')}</h2>
          </div>
          <div className="category-list">
            {monthlyData.topCategories.map((item, index) => (
              <div key={item.category} className="category-item">
                <div className="category-info">
                  <div className="category-name">
                    #{index + 1} {t(item.category.toLowerCase())}
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-bar-fill"
                      style={{
                        width: `${monthlyData.total > 0 ? (item.amount / monthlyData.total) * 100 : 0}%`,
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                      }}
                    ></div>
                  </div>
                </div>
                <div className="category-amount">
                  {formatCurrency(item.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Expenses */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{t('recentExpenses')}</h2>
        </div>
        {getRecentExpenses().length > 0 ? (
          <div className="recent-expenses">
            {getRecentExpenses().map(expense => (
              <div key={expense.id} className="recent-expense-item">
                <div className="expense-info">
                  <div className="expense-title">{expense.title}</div>
                  <div className="expense-meta">
                    <span className="expense-category">{t(expense.category.toLowerCase())}</span>
                    <span className="expense-date">
                      {format(new Date(expense.date), 'MMM dd')}
                    </span>
                  </div>
                </div>
                <div className="expense-amount">
                  {formatCurrency(expense.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <p>{t('noExpenses')}</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{t('quickStats')}</h2>
        </div>
        <div className="quick-stats">
          <div className="quick-stat">
            <div className="quick-stat-label">{t('averagePerTransaction')}</div>
            <div className="quick-stat-value">
              {monthlyData.count > 0 
                ? formatCurrency(monthlyData.total / monthlyData.count)
                : formatCurrency(0)
              }
            </div>
          </div>
          <div className="quick-stat">
            <div className="quick-stat-label">{t('dailyAverage')}</div>
            <div className="quick-stat-value">
              {formatCurrency((monthlyData.total || 0) / new Date().getDate())}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
