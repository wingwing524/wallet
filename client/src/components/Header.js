import React from 'react';
import { useAuth } from './AuthProvider';

const Header = ({ user }) => {
  const { logout } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <h1>💰 Expense Tracker</h1>
          <div className="subtitle">Track your monthly expenses - {currentDate}</div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="username">👋 {user?.username}</span>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              🚪
            </button>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content logout-modal">
            <div className="modal-header">
              <h3>Confirm Logout</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="modal-actions">
              <button className="secondary-button" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="primary-button logout-confirm" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
