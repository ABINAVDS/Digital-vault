import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import AppWithDashboard from './AppWithDashboard';
import { LogOut, User } from 'lucide-react';
import './components/Login.css';
import './components/AuthStyles.css';

/**
 * Main Application Component with Authentication
 * 
 * This component handles the authentication flow:
 * - Shows login page if user is not authenticated
 * - Shows main application (dashboard + documents) if authenticated
 * - Provides logout functionality
 * - Persists login state in localStorage
 * 
 * Authentication Credentials (from application.properties):
 * Username: admin
 * Password: admin123
 * Email: admin@documentvault.com
 */
const AppWithAuth = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Check for existing authentication on component mount
   */
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Checks if user is already logged in (from localStorage)
   */
  const checkAuthStatus = () => {
    try {
      const storedUser = localStorage.getItem('documentVaultUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Clear invalid data
      localStorage.removeItem('documentVaultUser');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles successful login
   * @param {Object} userData - User data from login
   */
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * Handles user logout
   */
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('documentVaultUser');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
  };

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Show main application with logout option
  return (
    <div className="authenticated-app">
      {/* User Header with Logout */}
      <div className="user-header">
        <div className="user-info">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div className="user-details">
            <span className="user-name">Welcome, {user.username}</span>
            <span className="user-email">{user.email}</span>
          </div>
        </div>
        
        <button onClick={handleLogout} className="logout-button">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Application Content */}
      <AppWithDashboard />
    </div>
  );
};

export default AppWithAuth;