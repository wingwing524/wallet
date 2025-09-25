import React from 'react';
import { useAuth } from './AuthProvider';
import { useTranslation } from 'react-i18next';
import SettingsModal from './SettingsModal';

const Header = ({ user }) => {
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();
  const currentDate = new Date().toLocaleDateString(i18n.language === 'zh-TW' ? 'zh-TW' : i18n.language === 'zh-CN' ? 'zh-CN' : i18n.language === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'long'
  });

  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);

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
          <h1>{t('appTitle')}</h1>
          <div className="subtitle">{t('subtitle')} - {currentDate}</div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="username">{t('welcome', { username: user?.username })}</span>
            <button className="settings-btn" onClick={() => setShowSettingsModal(true)} title="Settings">
              ⚙️
            </button>
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
              <h3>{t('confirmLogout')}</h3>
            </div>
            <div className="modal-body">
              <p>{t('logoutMessage')}</p>
            </div>
            <div className="modal-actions">
              <button className="secondary-button" onClick={cancelLogout}>
                {t('cancel')}
              </button>
              <button className="primary-button logout-confirm" onClick={confirmLogout}>
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />
    </>
  );
};

export default Header;
