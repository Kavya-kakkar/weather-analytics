import React from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import './AuthButton.css';

const AuthButton = ({ user, onUserChange }) => {
  const provider = new GoogleAuthProvider();

  // Add this to prevent popup issues
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  const handleGoogleLogin = async () => {
    try {
      // Add timeout to handle popup blocking
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Popup timeout')), 10000);
      });

      const result = await Promise.race([
        signInWithPopup(auth, provider),
        timeoutPromise
      ]);

      const userData = {
        id: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL
      };
      onUserChange(userData);
    } catch (error) {
      console.error('Google login failed:', error);
      if (error.code === 'auth/popup-blocked') {
        alert('Popup was blocked by your browser. Please allow popups for this site.');
      } else if (error.message === 'Popup timeout') {
        alert('Login timed out. Please try again.');
      } else {
        handleDemoLogin();
      }
    }
  };

  const handleFirebaseLogout = async () => {
    try {
      await signOut(auth);
      onUserChange(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDemoLogin = () => {
    const demoUser = {
      id: 'demo-123',
      name: 'Demo User',
      email: 'demo@weatherapp.com',
      avatar: '👤'
    };
    onUserChange(demoUser);
  };

  return (
    <div className="auth-button">
      {user ? (
        <div className="user-menu">
          <div className="user-info">
            {user.avatar && (user.avatar.startsWith('http') ? (
              <img src={user.avatar} alt={user.name} className="user-avatar" />
            ) : (
              <span className="user-avatar-emoji">{user.avatar}</span>
            ))}
            <span className="user-name">Hello, {user.name}</span>
          </div>
          <button 
            className="logout-btn"
            onClick={handleFirebaseLogout}
          >
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      ) : (
        <div className="login-options">
          <button 
            className="login-btn primary"
            onClick={handleGoogleLogin}
          >
            <i className="fab fa-google"></i>
            Login with Google
          </button>
          <button 
            className="login-btn secondary"
            onClick={handleDemoLogin}
          >
            <i className="fas fa-rocket"></i>
            Demo Login
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthButton;