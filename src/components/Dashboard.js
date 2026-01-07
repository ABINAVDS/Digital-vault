import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Search, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Calendar,
  HardDrive,
  Users
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Dashboard Component - Provides overview and analytics for document management
 * Features:
 * - Document statistics and metrics
 * - Recent uploads display
 * - File type distribution
 * - Storage usage overview
 * - Quick actions panel
 */
const Dashboard = () => {
  // State management for dashboard data
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalSize: 0,
    recentUploads: 0,
    fileTypes: {}
  });

  /**
   * Fetch all documents from API and calculate statistics
   */
  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * Fetches documents and processes them for dashboard metrics
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/documents`);
      const docs = response.data;
      setDocuments(docs);
      
      // Calculate dashboard statistics
      calculateStats(docs);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Processes document data to generate dashboard statistics
   * @param {Array} docs - Array of document objects
   */
  const calculateStats = (docs) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Calculate total size
    const totalSize = docs.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
    
    // Count recent uploads (last 7 days)
    const recentUploads = docs.filter(doc => 
      new Date(doc.uploadDate) > weekAgo
    ).length;
    
    // Group by file types
    const fileTypes = docs.reduce((acc, doc) => {
      const type = doc.fileType || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    setStats({
      totalDocuments: docs.length,
      totalSize,
      recentUploads,
      fileTypes
    });
  };

  /**
   * Formats file size from bytes to human readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Gets the most recent documents (last 5)
   * @returns {Array} Array of recent documents
   */
  const getRecentDocuments = () => {
    return documents
      .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
      .slice(0, 5);
  };

  /**
   * Gets file type distribution for chart display
   * @returns {Array} Array of file type objects with count and percentage
   */
  const getFileTypeDistribution = () => {
    const total = stats.totalDocuments;
    return Object.entries(stats.fileTypes).map(([type, count]) => ({
      type: type.split('/')[1] || type, // Get file extension from MIME type
      count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0
    }));
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Document Vault Dashboard</h1>
        <p>Overview of your document management system</p>
      </div>

      {/* Statistics Cards Row */}
      <div className="stats-grid">
        {/* Total Documents Card */}
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalDocuments}</h3>
            <p>Total Documents</p>
          </div>
        </div>

        {/* Storage Usage Card */}
        <div className="stat-card">
          <div className="stat-icon">
            <HardDrive size={24} />
          </div>
          <div className="stat-content">
            <h3>{formatFileSize(stats.totalSize)}</h3>
            <p>Storage Used</p>
          </div>
        </div>

        {/* Recent Uploads Card */}
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.recentUploads}</h3>
            <p>Recent Uploads (7 days)</p>
          </div>
        </div>

        {/* File Types Card */}
        <div className="stat-card">
          <div className="stat-icon">
            <PieChart size={24} />
          </div>
          <div className="stat-content">
            <h3>{Object.keys(stats.fileTypes).length}</h3>
            <p>File Types</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Recent Documents Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Documents</h2>
            <Calendar size={20} />
          </div>
          <div className="recent-documents">
            {getRecentDocuments().length > 0 ? (
              getRecentDocuments().map((doc) => (
                <div key={doc.id} className="recent-doc-item">
                  <div className="doc-icon">
                    <FileText size={16} />
                  </div>
                  <div className="doc-info">
                    <h4>{doc.name}</h4>
                    <p>{doc.fileName} • {formatFileSize(doc.fileSize)}</p>
                    <span className="upload-date">
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No recent documents</p>
            )}
          </div>
        </div>

        {/* File Type Distribution Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>File Type Distribution</h2>
            <BarChart3 size={20} />
          </div>
          <div className="file-types-chart">
            {getFileTypeDistribution().length > 0 ? (
              getFileTypeDistribution().map((item, index) => (
                <div key={index} className="file-type-item">
                  <div className="file-type-info">
                    <span className="file-type-name">{item.type}</span>
                    <span className="file-type-count">{item.count} files</span>
                  </div>
                  <div className="file-type-bar">
                    <div 
                      className="file-type-progress" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="file-type-percentage">{item.percentage}%</span>
                </div>
              ))
            ) : (
              <p className="no-data">No file type data available</p>
            )}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="dashboard-section quick-actions">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="action-buttons">
            {/* Upload Document Button */}
            <button className="action-btn upload-btn">
              <Upload size={20} />
              <span>Upload Document</span>
            </button>
            
            {/* Search Documents Button */}
            <button className="action-btn search-btn">
              <Search size={20} />
              <span>Search Documents</span>
            </button>
            
            {/* View All Documents Button */}
            <button className="action-btn view-btn">
              <FileText size={20} />
              <span>View All Documents</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;