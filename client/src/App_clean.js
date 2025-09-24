import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import AddExpense from './components/AddExpense';
import ExpenseModal from './components/ExpenseModal';
import AuthProvider, { useAuth } from './components/AuthProvider';
import AuthScreen from './components/AuthScreen';
import { expenseService } from './services/expenseService';

function AppContent() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadExpenses();
    }
  }, [isAuthenticated, authLoading]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const newExpense = await expenseService.createExpense(expenseData);
      setExpenses(prev => [newExpense, ...prev]);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to add expense:', error);
      alert('Failed to add expense. Please try again.');
    }
  };

  const handleUpdateExpense = async (expenseData) => {
    try {
      const updatedExpense = await expenseService.updateExpense(selectedExpense.id, expenseData);
      setExpenses(prev => prev.map(exp => 
        exp.id === selectedExpense.id ? updatedExpense : exp
      ));
      setShowModal(false);
      setSelectedExpense(null);
    } catch (error) {
      console.error('Failed to update expense:', error);
      alert('Failed to update expense. Please try again.');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await expenseService.deleteExpense(expenseId);
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
    } catch (error) {
      console.error('Failed to delete expense:', error);
      alert('Failed to delete expense. Please try again.');
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedExpense(null);
    setShowModal(true);
  };

  const openEditModal = (expense) => {
    setModalMode('edit');
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedExpense(null);
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Show main app if authenticated
  return (
    <div className="app">
      <Header user={user} />
      <div className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            expenses={expenses} 
            loading={loading}
            onRefresh={loadExpenses}
          />
        )}
        
        {activeTab === 'expenses' && (
          <ExpenseList 
            expenses={expenses} 
            loading={loading}
            onEdit={openEditModal}
            onDelete={handleDeleteExpense}
            onRefresh={loadExpenses}
          />
        )}
        
        {activeTab === 'add' && (
          <AddExpense onAdd={handleAddExpense} />
        )}
      </div>

      {/* Floating Action Button for quick add */}
      {activeTab !== 'add' && (
        <button className="fab" onClick={openAddModal} title="Add Expense">
          +
        </button>
      )}

      {/* Modal for add/edit */}
      {showModal && (
        <ExpenseModal
          mode={modalMode}
          expense={selectedExpense}
          onSave={modalMode === 'add' ? handleAddExpense : handleUpdateExpense}
          onClose={closeModal}
        />
      )}

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
