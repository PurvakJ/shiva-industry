import { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { api } from '../../utils/api';
import './AdminUpcoming.css';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = "dm9gg8yss";
const CLOUDINARY_UPLOAD_PRESET = "images";

/* Icon component */
function Icon({ name, className }) {
  const paths = {
    add: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    ),
    edit: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
    delete: (
      <>
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </>
    ),
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </>
    ),
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </>
    ),
    check: (
      <>
        <path d="M20 6L9 17l-5-5" />
      </>
    ),
    alert: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </>
    ),
    location: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    description: (
      <>
        <path d="M4 4h16v16H4z" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="14" y2="13" />
        <line x1="8" y1="17" x2="12" y2="17" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    filter: (
      <>
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    upload: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </>
    ),
  };
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export default function AdminUpcoming() {
  const { data, refreshAdminData } = useData();
  const { upcomingSites = [] } = data || {};
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    launchDate: '',
    location: '',
    type: ''
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Image upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tempImagePreview, setTempImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const password = localStorage.getItem('adminPassword');

  // Get unique site types
  const siteTypes = ['all', ...new Set(upcomingSites.map(s => s.Type || 'General').filter(Boolean))];

  // Filter sites
  const filteredSites = upcomingSites.filter(site => {
    const matchesSearch = 
      site.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (site.Description && site.Description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || (site.Type || 'General') === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Sort sites by launch date (closest first)
  const sortedSites = [...filteredSites].sort((a, b) => {
    const dateA = new Date(a.LaunchDate || '2099-12-31');
    const dateB = new Date(b.LaunchDate || '2099-12-31');
    return dateA - dateB;
  });

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploadingImage(true);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    uploadImageToCloudinary(file)
      .then((url) => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setFormData({ ...formData, image: url });
        setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        setTimeout(() => setMessage(null), 3000);
      })
      .catch((error) => {
        clearInterval(progressInterval);
        console.error('Upload error:', error);
        setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' });
        setTimeout(() => setMessage(null), 3000);
        setTempImagePreview(null);
      })
      .finally(() => {
        setUploadingImage(false);
        setUploadProgress(0);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      });
  };

  // Remove uploaded image
  const removeImage = () => {
    setFormData({ ...formData, image: '' });
    setTempImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const siteData = {
      Name: formData.name,
      Description: formData.description,
      Image: formData.image,
      LaunchDate: formData.launchDate,
      Location: formData.location,
      Type: formData.type
    };

    try {
      let result;
      if (editingId) {
        result = await api.updateUpcoming(password, editingId, siteData);
        if (result.success) {
          setMessage({ type: 'success', text: 'Site updated successfully!' });
        }
      } else {
        result = await api.addUpcoming(password, siteData);
        if (result.success) {
          setMessage({ type: 'success', text: 'Site added successfully!' });
        }
      }

      if (result.success) {
        await refreshAdminData(password);
        resetForm();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Operation failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save site' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (site) => {
    setEditingId(site.ID);
    setFormData({
      name: site.Name || '',
      description: site.Description || '',
      image: site.Image || '',
      launchDate: site.LaunchDate || '',
      location: site.Location || '',
      type: site.Type || ''
    });
    setTempImagePreview(site.Image || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this site?')) return;
    
    setLoading(true);
    try {
      const result = await api.deleteUpcoming(password, id);
      if (result.success) {
        await refreshAdminData(password);
        setMessage({ type: 'success', text: 'Site deleted successfully!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete site' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      description: '', 
      image: '', 
      launchDate: '',
      location: '',
      type: ''
    });
    setTempImagePreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get days until launch
  const getDaysUntilLaunch = (launchDate) => {
    if (!launchDate) return null;
    const launch = new Date(launchDate);
    const now = new Date();
    const diffTime = launch - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status label
  const getStatusLabel = (launchDate) => {
    const days = getDaysUntilLaunch(launchDate);
    if (days === null) return { label: 'TBD', className: 'status-tbd' };
    if (days < 0) return { label: 'Now Open', className: 'status-open' };
    if (days <= 7) return { label: 'This Week', className: 'status-this-week' };
    if (days <= 30) return { label: 'Coming Soon', className: 'status-coming' };
    return { label: 'Upcoming', className: 'status-upcoming' };
  };

  return (
    <div className="admin-upcoming">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h2>Upcoming Sites</h2>
          <p className="header-subtitle">Manage new locations coming soon</p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">
            <Icon name="location" className="stat-icon" />
            Total: {upcomingSites.length}
          </span>
          <span className="stat-badge">
            <Icon name="clock" className="stat-icon" />
            Opening Soon: {upcomingSites.filter(s => {
              const days = getDaysUntilLaunch(s.LaunchDate);
              return days !== null && days <= 30 && days > 0;
            }).length}
          </span>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`message ${message.type}`}>
          <Icon name={message.type === 'success' ? 'check' : 'alert'} className="message-icon" />
          <span>{message.text}</span>
          <button className="message-close" onClick={() => setMessage(null)}>
            <Icon name="close" className="close-icon" />
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-header">
          <h3>
            <Icon name={editingId ? 'edit' : 'add'} className="form-header-icon" />
            {editingId ? 'Edit Site' : 'Add New Site'}
          </h3>
          {editingId && (
            <button type="button" className="btn-cancel" onClick={resetForm}>
              <Icon name="close" className="btn-icon" />
              Cancel
            </button>
          )}
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>
              <Icon name="location" className="label-icon" />
              Site Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              placeholder="Enter site name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              <Icon name="calendar" className="label-icon" />
              Launch Date
            </label>
            <input
              type="date"
              value={formData.launchDate}
              onChange={(e) => setFormData({...formData, launchDate: e.target.value})}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g., Mumbai, Maharashtra"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              Site Type
            </label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              placeholder="e.g., Manufacturing, Distribution"
              className="form-input"
            />
          </div>

          <div className="form-group full-width">
            <label>
              <Icon name="link" className="label-icon" />
              Site Image
            </label>
            
            {/* Image Upload Area */}
            <div className="image-upload-container">
              <div className="image-upload-area">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="file-input-hidden"
                  id="image-upload"
                  disabled={uploadingImage}
                />
                <label htmlFor="image-upload" className="image-upload-label">
                  <Icon name="upload" className="upload-icon" />
                  <span>{uploadingImage ? 'Uploading...' : 'Click to upload image'}</span>
                  <span className="upload-hint">PNG, JPG, WebP (max 5MB)</span>
                </label>
              </div>

              {uploadingImage && (
                <div className="upload-progress-container">
                  <div className="upload-progress-bar">
                    <div 
                      className="upload-progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="upload-progress-text">{uploadProgress}%</span>
                </div>
              )}

              {/* Image Preview */}
              {(tempImagePreview || formData.image) && (
                <div className="image-preview-container">
                  <img 
                    src={tempImagePreview || formData.image} 
                    alt="Site preview" 
                    className="image-preview"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<span class="preview-error">Failed to load image</span>';
                    }}
                  />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={removeImage}
                    disabled={uploadingImage}
                    title="Remove image"
                  >
                    <Icon name="close" className="remove-icon" />
                  </button>
                </div>
              )}

              {/* Image URL Input (fallback) */}
              <div className="image-url-input-wrapper">
                <label className="image-url-label">Or enter image URL directly:</label>
                <div className="image-url-input-group">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    className="form-input image-url-input"
                    disabled={uploadingImage}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-group full-width">
            <label>
              <Icon name="description" className="label-icon" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              placeholder="Enter site description"
              className="form-input form-textarea"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading || uploadingImage}>
            {loading ? (
              <>
                <span className="spinner" />
                Saving...
              </>
            ) : uploadingImage ? (
              <>
                <span className="spinner" />
                Uploading Image...
              </>
            ) : (
              <>
                <Icon name={editingId ? 'edit' : 'add'} className="btn-icon" />
                {editingId ? 'Update Site' : 'Add Site'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Search and Filter */}
      {upcomingSites.length > 0 && (
        <div className="table-controls">
          <div className="search-wrapper">
            <Icon name="search" className="search-icon" />
            <input
              type="text"
              placeholder="Search sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <Icon name="close" className="close-icon" />
              </button>
            )}
          </div>
          <div className="filter-wrapper">
            <Icon name="filter" className="filter-icon" />
            <select 
              value={selectedFilter} 
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="filter-select"
            >
              {siteTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="sites-table-wrapper">
        {sortedSites.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Site</th>
                <th>Location</th>
                <th>Type</th>
                <th>Launch Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedSites.map(site => {
                const status = getStatusLabel(site.LaunchDate);
                const days = getDaysUntilLaunch(site.LaunchDate);
                
                return (
                  <tr key={site.ID}>
                    <td>
                      {site.Image ? (
                        <img 
                          src={site.Image} 
                          alt={site.Name} 
                          className="table-image"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="table-image-placeholder">
                          <Icon name="image" className="placeholder-icon" />
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="site-name-cell">
                        <strong>{site.Name}</strong>
                        {site.Description && (
                          <span className="site-description-cell">{site.Description}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {site.Location && (
                        <span className="location-cell">
                          <Icon name="location" className="location-icon" />
                          {site.Location}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="type-badge">
                        {site.Type || 'General'}
                      </span>
                    </td>
                    <td className="date-cell">
                      {site.LaunchDate ? (
                        <>
                          <span>{site.LaunchDate}</span>
                          {days !== null && days > 0 && (
                            <span className="days-until">({days}d)</span>
                          )}
                        </>
                      ) : (
                        'TBD'
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="edit-btn" 
                          onClick={() => handleEdit(site)}
                          title="Edit"
                        >
                          <Icon name="edit" className="action-icon" />
                        </button>
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDelete(site.ID)}
                          title="Delete"
                        >
                          <Icon name="delete" className="action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-sites">
            <Icon name="location" className="no-sites-icon" />
            <p>No sites found</p>
            {searchTerm || selectedFilter !== 'all' ? (
              <span className="no-sites-hint">Try adjusting your search or filters</span>
            ) : (
              <span className="no-sites-hint">Add your first site using the form above</span>
            )}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {upcomingSites.length > 0 && (
        <div className="table-footer">
          <span className="footer-count">
            Showing {sortedSites.length} of {upcomingSites.length} sites
          </span>
        </div>
      )}
    </div>
  );
}