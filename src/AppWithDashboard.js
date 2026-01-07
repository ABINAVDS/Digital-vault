import React, { useState } from 'react';
import App from './App'; // Your existing document management component
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import './components/Dashboard.css';
import './components/Navigation.css';

/**
 * Main Application Component with Dashboard Integration
 * 
 * This component wraps your existing App component and adds dashboard functionality
 * without modifying the original code. It provides:
 * 
 * - Navigation between Dashboard and Document Management
 * - State management for current page
 * - Seamless integration with existing functionality
 * 
 * Usage:
 * 1. Import this component instead of App in index.js
 * 2. Or replace App component content with this component
 * 3. Your existing document management functionality remains unchanged
 */
const AppWithDashboard = () => {
  // State to track current active page
  const [currentPage, setCurrentPage] = useState('dashboard'); // Default to dashboard

  /**
   * Handles page navigation
   * @param {string} page - Page to navigate to ('dashboard' or 'documents')
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app-with-dashboard">
      {/* Navigation Bar */}
      <Navigation 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
      />

      {/* Page Content */}
      <div className="page-content">
        {currentPage === 'dashboard' ? (
          // Dashboard Page - Shows analytics and overview
          <Dashboard />
        ) : (
          // Documents Page - Your existing document management functionality
          <App />
        )}
      </div>
    </div>
  );
};

export default AppWithDashboard;