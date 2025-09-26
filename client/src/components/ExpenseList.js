import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import SearchInput from './SearchInput';
import { SkeletonExpenseItem, LoadingSpinner } from './LoadingComponents';
import { hapticFeedback, pullToRefresh, swipeGestures, searchUtils } from '../utils/mobileUtils';

const ExpenseList = ({ expenses, loading, onEdit, onDelete, onRefresh }) => {
  const [filter, setFilter] = useState({
    category: '',
    month: '',
    year: new Date().getFullYear().toString()
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef(null);
  const expenseRefs = useRef({});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Setup pull-to-refresh
  useEffect(() => {
    if (containerRef.current && onRefresh) {
      const cleanup = pullToRefresh.setup(containerRef.current, async () => {
        setIsRefreshing(true);
        await onRefresh();
        setIsRefreshing(false);
      });
      return cleanup;
    }
  }, [onRefresh]);

  // Filter and search expenses
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    
    // Category filter
    if (filter.category && expense.category !== filter.category) {
      return false;
    }
    
    // Month filter
    if (filter.month && (expenseDate.getMonth() + 1).toString() !== filter.month) {
      return false;
    }
    
    // Year filter
    if (filter.year && expenseDate.getFullYear().toString() !== filter.year) {
      return false;
    }
    
    return true;
  });

  // Apply search filter
  const searchedExpenses = searchUtils.fuzzySearch(
    filteredExpenses, 
    searchQuery, 
    ['title', 'description', 'category']
  );

  const totalAmount = searchedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Handle swipe actions
  const handleSwipeLeft = useCallback((expense) => {
    hapticFeedback.medium();
    onDelete(expense.id);
  }, [onDelete]);

  const handleSwipeRight = useCallback((expense) => {
    hapticFeedback.light();
    onEdit(expense);
  }, [onEdit]);

  // Setup swipe gestures for expense items
  useEffect(() => {
    const cleanupFunctions = [];
    
    Object.entries(expenseRefs.current).forEach(([expenseId, element]) => {
      if (element) {
        const expense = searchedExpenses.find(e => e.id === expenseId);
        if (expense) {
          const cleanup = swipeGestures.setup(element, {
            onSwipeLeft: () => handleSwipeLeft(expense),
            onSwipeRight: () => handleSwipeRight(expense),
            threshold: 80
          });
          cleanupFunctions.push(cleanup);
        }
      }
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [searchedExpenses, handleSwipeLeft, handleSwipeRight]);

  const categories = [...new Set(expenses.map(expense => expense.category))];
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const years = [...new Set(expenses.map(expense => 
    new Date(expense.date).getFullYear()
  ))].sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="expense-list-page">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🔍 Filter Expenses</h2>
          </div>
          <div className="skeleton-filters">
            <div className="skeleton-line" style={{height: '48px', marginBottom: '8px'}}></div>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="skeleton-stat-card">
            <div className="skeleton-line skeleton-stat-value"></div>
            <div className="skeleton-line skeleton-stat-label"></div>
          </div>
          <div className="skeleton-stat-card">
            <div className="skeleton-line skeleton-stat-value"></div>
            <div className="skeleton-line skeleton-stat-label"></div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="skeleton-line skeleton-card-title"></div>
          </div>
          {[1, 2, 3, 4, 5].map(i => (
            <SkeletonExpenseItem key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="expense-list-page" ref={containerRef}>
      {/* Search */}
      <SearchInput 
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by title, description, or category..."
        onClear={() => hapticFeedback.light()}
      />

      {/* Filters */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🔍 Filter Expenses</h2>
        </div>
        
        <div className="filters">
          <div className="filter-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-select"
                value={filter.category}
                onChange={(e) => setFilter({...filter, category: e.target.value})}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Month</label>
              <select 
                className="form-select"
                value={filter.month}
                onChange={(e) => setFilter({...filter, month: e.target.value})}
              >
                <option value="">All Months</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Year</label>
              <select 
                className="form-select"
                value={filter.year}
                onChange={(e) => setFilter({...filter, year: e.target.value})}
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            className="btn btn-secondary"
            onClick={() => setFilter({ category: '', month: '', year: new Date().getFullYear().toString() })}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{searchedExpenses.length}</div>
          <div className="stat-label">{searchQuery ? 'Found' : 'Total'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatCurrency(totalAmount)}</div>
          <div className="stat-label">Amount</div>
        </div>
      </div>

      {/* Expense List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📝 Expenses</h2>
        </div>
        
        {isRefreshing && (
          <LoadingSpinner size="small" text="Refreshing..." />
        )}
        
        {searchedExpenses.length > 0 ? (
          <ul className="expense-list">
            {searchedExpenses.map(expense => (
              <li 
                key={expense.id} 
                className="expense-item"
                ref={el => expenseRefs.current[expense.id] = el}
                onClick={() => {
                  hapticFeedback.light();
                  onEdit(expense);
                }}
              >
                <div className="expense-info">
                  <div 
                    className="expense-title"
                    dangerouslySetInnerHTML={{
                      __html: searchUtils.highlightText(expense.title, searchQuery)
                    }}
                  />
                  <div className="expense-meta">
                    <span className="expense-category">{expense.category}</span>
                    <span className="expense-date">
                      {format(new Date(expense.date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  {expense.description && (
                    <div 
                      className="expense-description"
                      dangerouslySetInnerHTML={{
                        __html: searchUtils.highlightText(expense.description, searchQuery)
                      }}
                    />
                  )}
                </div>
                
                <div className="expense-right">
                  <div className="expense-amount">
                    {formatCurrency(expense.amount)}
                  </div>
                  <div className="expense-actions">
                    <button 
                      className="btn btn-secondary btn-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        hapticFeedback.light();
                        onEdit(expense);
                      }}
                      title="Edit expense"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn btn-danger btn-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        hapticFeedback.medium();
                        onDelete(expense.id);
                      }}
                      title="Delete expense"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                {/* Swipe hint */}
                <div className="swipe-hint">
                  ← Swipe for actions →
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              {searchQuery ? '�' : '�📝'}
            </div>
            <p>
              {searchQuery 
                ? `No expenses found for "${searchQuery}"` 
                : 'No expenses found matching your filters.'
              }
            </p>
            <div className="empty-state-actions">
              {searchQuery && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    hapticFeedback.light();
                    setSearchQuery('');
                  }}
                >
                  Clear Search
                </button>
              )}
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  hapticFeedback.light();
                  setFilter({ category: '', month: '', year: new Date().getFullYear().toString() });
                  setSearchQuery('');
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
