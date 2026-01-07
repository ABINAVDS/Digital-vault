import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import { Upload, Search, Download, Trash2, FileText, File } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    file: null
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/documents`);
      setDocuments(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.name) {
      setError('Please provide both file and name');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('name', uploadForm.name);
    formData.append('description', uploadForm.description);

    try {
      await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Document uploaded successfully!');
      setUploadForm({ name: '', description: '', file: null });
      fetchDocuments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload document');
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/documents/download/${id}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download document');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await axios.delete(`${API_BASE_URL}/documents/${id}`);
        setSuccess('Document deleted successfully!');
        fetchDocuments();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete document');
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchDocuments();
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/documents/search?query=${searchQuery}`);
      setDocuments(response.data);
    } catch (err) {
      setError('Search failed');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType && fileType.includes('pdf')) return <FileText size={20} />;
    return <File size={20} />;
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Digital Document Vault</h1>
        <p>Secure document storage and management system</p>
      </header>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <section className="upload-section">
        <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>Upload Document</h2>
        <form onSubmit={handleUpload} className="upload-form">
          <div className="form-group">
            <label>Document Name *</label>
            <input
              type="text"
              value={uploadForm.name}
              onChange={(e) => setUploadForm({...uploadForm, name: e.target.value})}
              placeholder="Enter document name"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={uploadForm.description}
              onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
              placeholder="Enter document description (optional)"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Select File *</label>
            <div className="file-input">
              <input
                type="file"
                onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
                required
              />
              <div className="file-input-label">
                <Upload size={24} />
                <span>{uploadForm.file ? uploadForm.file.name : 'Choose file to upload'}</span>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            <Upload size={20} />
            Upload Document
          </button>
        </form>
      </section>

      <section className="search-section">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="btn btn-secondary">
            <Search size={20} />
            Search
          </button>
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>Documents</h2>
        {loading ? (
          <div className="loading">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="loading">No documents found</div>
        ) : (
          <div className="documents-grid">
            {documents.map((doc) => (
              <div key={doc.id} className="document-card">
                <div className="document-header">
                  <div className="document-icon">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <div className="document-title">{doc.name}</div>
                </div>
                <div className="document-info">
                  <p><strong>File:</strong> {doc.fileName}</p>
                  <p><strong>Size:</strong> {formatFileSize(doc.fileSize)}</p>
                  <p><strong>Type:</strong> {doc.fileType || 'Unknown'}</p>
                  <p><strong>Uploaded:</strong> {new Date(doc.uploadDate).toLocaleDateString()}</p>
                  {doc.description && <p><strong>Description:</strong> {doc.description}</p>}
                </div>
                <div className="document-actions">
                  <button
                    onClick={() => handleDownload(doc.id, doc.fileName)}
                    className="btn btn-secondary"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="btn btn-danger"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;