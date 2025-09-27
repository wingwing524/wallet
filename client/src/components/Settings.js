import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [preferences, setPreferences] = useState({
    theme: 'light'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/preferences', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const newPreferences = {
          theme: data.theme || 'light'
        };
        setPreferences(newPreferences);
        applyTheme(newPreferences.theme);
      } else if (response.status === 401) {
        // User not authenticated, use localStorage fallback
        const savedTheme = localStorage.getItem('theme') || 'light';
        const newPreferences = { theme: savedTheme };
        setPreferences(newPreferences);
        applyTheme(savedTheme);
      } else {
        throw new Error('Failed to load preferences');
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
      // Fallback to localStorage
      const savedTheme = localStorage.getItem('theme') || 'light';
      const newPreferences = { theme: savedTheme };
      setPreferences(newPreferences);
      applyTheme(savedTheme);
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme); // Keep localStorage as backup
  };

  const savePreferences = async (newPreferences) => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newPreferences)
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
        applyTheme(data.theme);
        return { success: true };
      } else if (response.status === 401) {
        // User not authenticated, save to localStorage only
        setPreferences(newPreferences);
        applyTheme(newPreferences.theme);
        return { success: true, offline: true };
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      // Still update local state for immediate feedback
      setPreferences(newPreferences);
      applyTheme(newPreferences.theme);
      return { success: false, error: error.message };
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = async (newTheme) => {
    const newPreferences = { ...preferences, theme: newTheme };
    const result = await savePreferences(newPreferences);
    
    if (!result.success && !result.offline) {
      alert('Failed to save theme preference. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="card">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">⚙️ Settings</h2>
          <p className="card-subtitle">Customize your expense tracker appearance</p>
        </div>

        <div className="settings-content">
          {/* Theme Section */}
          <div className="setting-section">
            <h3 className="setting-section-title">🎨 Appearance</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Theme</label>
                <p className="setting-description">Choose your preferred color theme</p>
              </div>
              <div className="setting-control">
                <div className="theme-options">
                  <button
                    className={`theme-option ${preferences.theme === 'light' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('light')}
                    disabled={saving}
                  >
                    ☀️ Light
                  </button>
                  <button
                    className={`theme-option ${preferences.theme === 'dark' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('dark')}
                    disabled={saving}
                  >
                    🌙 Dark
                  </button>
                </div>
                {saving && (
                  <div className="saving-indicator">
                    <div className="spinner"></div>
                    <span>Saving...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;