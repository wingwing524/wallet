import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { hapticFeedback } from '../utils/mobileUtils';

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
      await onAdd({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      // Reset form
      setFormData({
        title: '',
        amount: '',
        category: 'General',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      
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
              type="number"
              name="amount"
              className={`form-input ${errors.amount ? 'error' : ''}`}
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
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
                    setFormData(prev => ({ ...prev, amount: amount.toString() }));
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
