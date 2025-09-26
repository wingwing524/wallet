import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import { setPageSEO, seoData } from '../utils/seoUtils';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  // Update SEO based on auth mode
  useEffect(() => {
    const pageType = isLogin ? 'login' : 'register';
    const pageData = seoData[pageType];
    if (pageData) {
      setPageSEO(pageData.title, pageData.description, pageData.keywords);
    }
  }, [isLogin]);

  return (
    <>
      {isLogin ? (
        <Login onSwitchToRegister={switchToRegister} />
      ) : (
        <Register onSwitchToLogin={switchToLogin} />
      )}
    </>
  );
};

export default AuthScreen;
