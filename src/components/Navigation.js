import React from 'react';
import { Home, FileText, BarChart3 } from 'lucide-react';

/**
 * Navigation Component
 * Provides navigation between Dashboard and Document Management pages
 * 
 * Props:
 * - currentPage: string - Current active page ('dashboard' or 'documents')
 * - onPageChange: function - Callback when page changes
 */
const Navigation = ({ currentPage, onPageChange }) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Logo/Brand Section */}
        <div className="nav-brand">
          <FileText size={24} />
          <span>Document Vault</span>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          {/* Dashboard Link */}
          <button
            className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => onPageChange('dashboard')}
          >
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </button>

          {/* Documents Link */}
          <button
            className={`nav-link ${currentPage === 'documents' ? 'active' : ''}`}
            onClick={() => onPageChange('documents')}
          >
            <Home size={20} />
            <span>Documents</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;