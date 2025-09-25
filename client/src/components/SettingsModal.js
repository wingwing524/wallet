import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SettingsModal = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('zh-TW');

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('expense-tracker-theme') || 'light';
    const savedLanguage = localStorage.getItem('expense-tracker-language') || 'zh-TW';
    
    setTheme(savedTheme);
    setLanguage(savedLanguage);
    
    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Set language immediately
    if (savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('expense-tracker-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('expense-tracker-language', newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay settings-modal" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{t('settings')}</h3>
          <button 
            className="modal-close" 
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          {/* Theme Selection */}
          <div className="settings-section">
            <h4 className="settings-title">{t('appearance')}</h4>
            <div className="settings-option">
              <label className="settings-label">{t('theme')}</label>
              <div className="theme-options">
                <button
                  className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('light')}
                >
                  {t('lightMode')}
                </button>
                <button
                  className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('dark')}
                >
                  {t('darkMode')}
                </button>
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="settings-section">
            <h4 className="settings-title">{t('language')}</h4>
            <div className="settings-option">
              <label className="settings-label">{t('displayLanguage')}</label>
              <select
                className="language-select"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <option value="zh-TW">�� 繁體中文</option>
                <option value="en">�🇸 English</option>
                <option value="ja">�� 日本語</option>
                <option value="zh-CN">🇨🇳 简体中文</option>
              </select>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="settings-section">
            <h4 className="settings-title">{t('preferences')}</h4>
            <div className="settings-option">
              <label className="settings-label">
                <input
                  type="checkbox"
                  className="settings-checkbox"
                  defaultChecked={localStorage.getItem('expense-tracker-notifications') === 'true'}
                  onChange={(e) => localStorage.setItem('expense-tracker-notifications', e.target.checked)}
                />
                {t('enableNotifications')}
              </label>
            </div>
            <div className="settings-option">
              <label className="settings-label">
                <input
                  type="checkbox"
                  className="settings-checkbox"
                  defaultChecked={localStorage.getItem('expense-tracker-animations') !== 'false'}
                  onChange={(e) => localStorage.setItem('expense-tracker-animations', e.target.checked)}
                />
                {t('enableAnimations')}
              </label>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button 
            className="btn btn-primary" 
            onClick={onClose}
          >
            {t('done')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;