import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';

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
      await onSave({
        ...formData,
        amount: parseFloat(formData.amount)
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
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'add' ? '➕ Add Expense' : '✏️ Edit Expense'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
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
              autoFocus
            />
            {errors.amount && <div className="error-message">{errors.amount}</div>}
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
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
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
