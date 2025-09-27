import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';

// Safe formula evaluation function (same as AddExpense)
const evaluateFormula = (formula) => {
  try {
    // Remove spaces and validate characters
    const cleanFormula = formula.replace(/\s/g, '');
    
    // Only allow numbers, operators, parentheses, and decimal points
    if (!/^[0-9+\-*/().]+$/.test(cleanFormula)) {
      return null;
    }
    
    // Prevent empty or invalid expressions
    if (!cleanFormula || cleanFormula === '' || /^[+\-*/]/.test(cleanFormula) || /[+\-*/]$/.test(cleanFormula)) {
      return null;
    }
    
    // Use Function constructor for safe evaluation (safer than eval)
    const result = new Function('return ' + cleanFormula)();
    
    // Validate result is a finite number
    if (typeof result === 'number' && isFinite(result) && result >= 0) {
      return Math.round(result * 100) / 100; // Round to 2 decimal places
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

const ExpenseModal = ({ mode, expense, onSave, onClose }) => {
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
  const [calculatedAmount, setCalculatedAmount] = useState(null);

  useEffect(() => {
    loadCategories();
    
    // Pre-fill form for edit mode
    if (mode === 'edit' && expense) {
      const amountStr = expense.amount.toString();
      setFormData({
        title: expense.title,
        amount: amountStr,
        category: expense.category,
        date: expense.date,
        description: expense.description || ''
      });
      // Set calculated amount for edit mode
      const calculated = evaluateFormula(amountStr);
      setCalculatedAmount(calculated);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Handle amount field with formula calculation
    if (name === 'amount') {
      const calculated = evaluateFormula(value);
      setCalculatedAmount(calculated);
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

    // Validate amount - can be a number or a valid formula
    const calculated = evaluateFormula(formData.amount);
    if (!formData.amount || calculated === null || calculated <= 0) {
      newErrors.amount = 'Please enter a valid amount or formula (e.g., 10+20)';
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
      // Calculate the final amount to send to backend
      const finalAmount = evaluateFormula(formData.amount) || parseFloat(formData.amount);
      
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
              type="text"
              name="amount"
              className={`form-input form-input-mobile ${errors.amount ? 'error' : ''}`}
              value={formData.amount}
              onChange={handleChange}
              placeholder="10 or 10+20"
              autoFocus
            />
            {/* Show calculated result */}
            {formData.amount && calculatedAmount !== null && formData.amount !== calculatedAmount.toString() && (
              <div className="formula-result">
                = ${calculatedAmount.toFixed(2)}
              </div>
            )}
            <div className="quick-amounts-mobile">
              {[5, 10, 20, 50].map(amount => (
                <button
                  key={amount}
                  type="button"
                  className="quick-amount-btn"
                  onClick={() => {
                    const newAmount = amount.toString();
                    setFormData(prev => ({ ...prev, amount: newAmount }));
                    setCalculatedAmount(amount); // Set calculated amount for quick buttons
                  }}
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
