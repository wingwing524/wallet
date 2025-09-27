import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { hapticFeedback } from '../utils/mobileUtils';

// Safe formula evaluation function
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

const AddExpense = ({ onAdd }) => {
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
  }, []);

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
      
      await onAdd({
        ...formData,
        amount: finalAmount
      });
      
      // Reset form
      setFormData({
        title: '',
        amount: '',
        category: 'General',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      setCalculatedAmount(null);
      
      // Show success message
      alert('✅ Expense added successfully!');
    } catch (error) {
      console.error('Failed to add expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [5, 10, 20, 50, 100, 200, 300, 500];

  return (
    <div className="add-expense-page">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">➕ Add New Expense</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Amount * ($)</label>
            <input
              type="text"
              name="amount"
              className={`form-input ${errors.amount ? 'error' : ''}`}
              value={formData.amount}
              onChange={handleChange}
              placeholder="10 or 10+20 or 50*0.8"
            />
            {/* Show calculated result */}
            {formData.amount && calculatedAmount !== null && formData.amount !== calculatedAmount.toString() && (
              <div className="formula-result">
                = ${calculatedAmount.toFixed(2)}
              </div>
            )}
            {errors.amount && <div className="error-message">{errors.amount}</div>}
            
            {/* Quick amount buttons */}
            <div className="quick-amounts">
              {quickAmounts.map(amount => (
                <button
                  key={amount}
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    hapticFeedback.light();
                    const newAmount = amount.toString();
                    setFormData(prev => ({ ...prev, amount: newAmount }));
                    setCalculatedAmount(amount); // Set calculated amount for quick buttons
                  }}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              className={`form-select ${errors.category ? 'error' : ''}`}
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

          <div className="form-group">
            <label className="form-label">Date *</label>
            <input
              type="date"
              name="date"
              className={`form-input ${errors.date ? 'error' : ''}`}
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <div className="error-message">{errors.date}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Title (Optional)</label>
            <input
              type="text"
              name="title"
              className={`form-input ${errors.title ? 'error' : ''}`}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Lunch, Gas, Shopping (leave empty for quick entry)"
              maxLength={100}
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional notes about this expense..."
              rows="3"
              maxLength={500}
            />
            <div className="character-count">
              {formData.description.length}/500 characters
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              onClick={() => !loading && hapticFeedback.medium()}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Adding...
                </>
              ) : (
                <>
                  ➕ Add Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>


    </div>
  );
};

export default AddExpense;
