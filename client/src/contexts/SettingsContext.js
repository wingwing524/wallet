import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    currency: 'USD',
    notifications: true,
    language: 'en'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Apply theme to document when settings change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Save to localStorage as backup
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/user/preferences', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({
          ...prev,
          ...data
        }));
      } else if (response.status === 401) {
        // User not authenticated, use localStorage backup or defaults
        const localSettings = localStorage.getItem('userSettings');
        if (localSettings) {
          try {
            const parsed = JSON.parse(localSettings);
            setSettings(prev => ({ ...prev, ...parsed }));
          } catch (e) {
            console.warn('Failed to parse local settings');
          }
        }
      } else {
        throw new Error('Failed to load settings');
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setError(error.message);
      
      // Fallback to localStorage
      const localSettings = localStorage.getItem('userSettings');
      if (localSettings) {
        try {
          const parsed = JSON.parse(localSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.warn('Failed to parse local settings');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updatedSettings)
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
        return { success: true };
      } else if (response.status === 401) {
        // User not authenticated, save to localStorage only
        setSettings(updatedSettings);
        return { success: true, offline: true };
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Still update local state for immediate UI feedback
      setSettings(updatedSettings);
      return { success: false, error: error.message };
    }
  };

  const resetSettings = () => {
    const defaultSettings = {
      theme: 'light',
      currency: 'USD',
      notifications: true,
      language: 'en'
    };
    
    setSettings(defaultSettings);
    localStorage.removeItem('userSettings');
    
    // Also clear from database if user is authenticated
    updateSettings(defaultSettings);
  };

  const value = {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings,
    refreshSettings: loadSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;