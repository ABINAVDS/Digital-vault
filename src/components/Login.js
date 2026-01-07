import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, FileText } from 'lucide-react';

/**
 * Login Component
 * Provides authentication interface for Document Vault System
 * 
 * Default Credentials (from application.properties):
 * Username: admin
 * Password: admin123
 * Email: admin@documentvault.com
 * 
 * Props:
 * - onLogin: function - Callback when login is successful
 */
const Login = ({ onLogin }) => {
  // Form state management
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  // UI state management
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handles input field changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  /**
   * Handles form submission and authentication
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate authentication delay
    setTimeout(() => {
      // Check credentials against application.properties values
      if (formData.username === 'admin' && formData.password === 'admin123') {
        // Successful login
        const userData = {
          username: 'admin',
          email: 'admin@documentvault.com',
          loginTime: new Date().toISOString()
        };
        
        // Store user data in localStorage for persistence
        localStorage.setItem('documentVaultUser', JSON.stringify(userData));
        
        // Call parent callback
        onLogin(userData);
      } else {
        // Failed login
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 1000);
  };

  /**
   * Toggles password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      {/* Background Pattern */}
      <div className="login-background"></div>
      
      {/* Login Card */}
      <div className="login-card">
        {/* Header Section */}
        <div className="login-header">
          <div className="login-logo">
            <FileText size={40} />
          </div>
          <h1>Document Vault</h1>
          <p>Secure Document Management System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Error Message */}
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* Username Field */}
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-button"
            disabled={loading || !formData.username || !formData.password}
          >
            {loading ? (
              <>
                <div className="login-spinner"></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Credentials Info */}
        <div className="login-info">
          <h3>Demo Credentials</h3>
          <div className="credentials">
            <p><strong>Username:</strong> admin</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;