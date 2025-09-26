import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
  const validateForm = () => {
    const newErrors = {};

    // Validate amount - check if it's a number or valid expression
    let finalAmount = formData.amount;
    const hasOperators = /[+\-*/]/.test(formData.amount);
    
    if (hasOperators) {
      finalAmount = evaluateExpression(formData.amount);
    } else {
      finalAmount = parseFloat(formData.amount);
    }
    
    if (!formData.amount || isNaN(finalAmount) || finalAmount <= 0) {
      newErrors.amount = t('validAmountRequired');
    }

    if (!formData.date) {
      newErrors.date = t('dateRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };eModal = ({ mode, expense, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'General',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
    
    // Pre-fill form for edit mode
    if (mode === 'edit' && expense) {
      setFormData({
        title: expense.title,
        amount: expense.amount.toString(),
        category: expense.category,
        date: expense.date,
        description: expense.description || ''
      });
    }
  }, [mode, expense]);

  const loadCategories = async () => {
    try {
      const categoriesData = await expenseService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  // Safe math expression evaluator
  const evaluateExpression = (expr) => {
    try {
      // Remove any whitespace
      const cleanExpr = expr.replace(/\s/g, '');
      
      // Only allow numbers, +, -, *, /, ., (, )
      if (!/^[0-9+\-*/.()]+$/.test(cleanExpr)) {
        return null;
      }
      
      // Prevent dangerous expressions
      if (cleanExpr.includes('**') || cleanExpr.includes('++') || cleanExpr.includes('--')) {
        return null;
      }
      
      // Use Function constructor for safe evaluation (safer than eval)
      const result = new Function('return ' + cleanExpr)();
      
      // Check if result is a valid number
      if (typeof result === 'number' && !isNaN(result) && isFinite(result) && result >= 0) {
        return result;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle formula calculation for amount field
    if (name === 'amount') {
      // Check if the input contains mathematical operators
      const hasOperators = /[+\-*/]/.test(value);
      
      if (hasOperators) {
        const calculatedValue = evaluateExpression(value);
        if (calculatedValue !== null) {
          // Auto-calculate when user types an expression
          setFormData(prev => ({
            ...prev,
            [name]: calculatedValue.toString()
          }));
        } else {
          // Keep the expression if it's invalid (let user continue typing)
          setFormData(prev => ({
            ...prev,
            [name]: value
          }));
        }
      } else {
        // No operators, just regular number input
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Calculate final amount if it's an expression
      let finalAmount = formData.amount;
      const hasOperators = /[+\-*/]/.test(formData.amount);
      
      if (hasOperators) {
        finalAmount = evaluateExpression(formData.amount);
      } else {
        finalAmount = parseFloat(formData.amount);
      }
      
      await onSave({
        ...formData,
        amount: finalAmount
      });
    } catch (error) {
      console.error(`Failed to ${mode} expense:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay expense-modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content expense-modal-content">
        <div className="modal-header expense-modal-header">
          <h2 className="modal-title">
            {mode === 'add' ? '➕ Add Expense' : '✏️ Edit Expense'}
          </h2>
          <button className="close-btn-mobile" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="expense-form">
          {/* Essential Fields Row */}
          <div className="form-row-mobile">
          <div className="form-group form-group-compact">
            <label className="form-label">Amount *</label>
            <input
              type="number"
              name="amount"
              className={`form-input form-input-mobile ${errors.amount ? 'error' : ''}`}
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00 or 30+15"
              step="0.01"
              min="0"
              autoFocus
            />
            <div className="quick-amounts-mobile">
              {[5, 10, 20, 50].map(amount => (
                <button
                  key={amount}
                  type="button"
                  className="quick-amount-btn"
                  onClick={() => handleChange({ target: { name: 'amount', value: amount.toString() } })}
                >
                  ${amount}
                </button>
              ))}
            </div>
            {errors.amount && <div className="error-message">{errors.amount}</div>}
          </div>            <div className="form-group form-group-compact">
              <label className="form-label">Category</label>
              <select
                name="category"
                className={`form-select form-input-mobile ${errors.category ? 'error' : ''}`}
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <div className="error-message">{errors.category}</div>}
            </div>
          </div>

          <div className="form-group form-group-compact">
            <label className="form-label">Date *</label>
            <input
              type="date"
              name="date"
              className={`form-input form-input-mobile ${errors.date ? 'error' : ''}`}
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <div className="error-message">{errors.date}</div>}
          </div>

          <div className="form-group form-group-compact">
            <label className="form-label">Title (Optional)</label>
            <input
              type="text"
              name="title"
              className={`form-input form-input-mobile ${errors.title ? 'error' : ''}`}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Lunch, Gas, Shopping"
              maxLength={50}
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>

          <div className="form-group form-group-compact">
            <label className="form-label">Notes (Optional)</label>
            <textarea
              name="description"
              className="form-textarea form-textarea-mobile"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional notes..."
              rows="2"
              maxLength={200}
            />
          </div>

          <div className="modal-actions expense-modal-actions">
            <button
              type="button"
              className="btn btn-secondary btn-mobile"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-mobile"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  {mode === 'add' ? 'Adding...' : 'Saving...'}
                </>
              ) : (
                <>
                  {mode === 'add' ? '➕ Add' : '💾 Save'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
