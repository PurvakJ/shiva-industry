import { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { api } from '../../utils/api';
import './AdminComingSoon.css';

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

export default function AdminComingSoon() {
  const { data, refreshAdminData } = useData();
  const { comingSoonProducts = [] } = data || {};
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    expectedDate: '',
    status: 'In Development',
    category: ''
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Image upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tempImagePreview, setTempImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Get password from localStorage
  const password = localStorage.getItem('adminPassword');
  console.log('Admin password exists:', !!password); // Debug log

  // Get unique categories
  const categories = ['all', ...new Set(comingSoonProducts.map(p => p.Category || 'General').filter(Boolean))];

  // Filter products
  const filteredProducts = comingSoonProducts.filter(product => {
    const matchesSearch = product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.Description && product.Description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || (product.Category || 'General') === selectedCategory;
    return matchesSearch && matchesCategory;
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
    
    // Check if password exists
    if (!password) {
      setMessage({ type: 'error', text: 'Not authenticated. Please log in again.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    setMessage(null);

    const productData = {
      Name: formData.name,
      Description: formData.description,
      Image: formData.image,
      ExpectedDate: formData.expectedDate,
      Status: formData.status,
      Category: formData.category
    };

    console.log('Saving product:', { password, editingId, productData }); // Debug log

    try {
      let result;
      if (editingId) {
        result = await api.updateComingSoon(password, editingId, productData);
      } else {
        result = await api.addComingSoon(password, productData);
      }

      console.log('API response:', result); // Debug log

      if (result && result.success) {
        await refreshAdminData(password);
        setMessage({ type: 'success', text: editingId ? 'Product updated successfully!' : 'Product added successfully!' });
        resetForm();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ 
          type: 'error', 
          text: result?.error || 'Operation failed. Please check your password and try again.' 
        });
      }
    } catch (err) {
      console.error('Error saving product:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to save product' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.ID);
    setFormData({
      name: product.Name || '',
      description: product.Description || '',
      image: product.Image || '',
      expectedDate: product.ExpectedDate || '',
      status: product.Status || 'In Development',
      category: product.Category || ''
    });
    setTempImagePreview(product.Image || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    if (!password) {
      setMessage({ type: 'error', text: 'Not authenticated. Please log in again.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    try {
      const result = await api.deleteComingSoon(password, id);
      if (result.success) {
        await refreshAdminData(password);
        setMessage({ type: 'success', text: 'Product deleted successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete product' });
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to delete product' });
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
      expectedDate: '',
      status: 'In Development',
      category: ''
    });
    setTempImagePreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="admin-coming-soon">
      <div className="admin-page-header">
        <div className="header-left">
          <h2>Coming Soon Products</h2>
          <p className="header-subtitle">Manage upcoming products in your pipeline</p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">
            Total: {comingSoonProducts.length}
          </span>
        </div>
      </div>

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
            {editingId ? 'Edit Product' : 'Add New Product'}
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
              <Icon name="image" className="label-icon" />
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              placeholder="Enter product name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              <Icon name="calendar" className="label-icon" />
              Expected Date
            </label>
            <input
              type="date"
              value={formData.expectedDate}
              onChange={(e) => setFormData({...formData, expectedDate: e.target.value})}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="form-input"
            >
              <option value="In Development">In Development</option>
              <option value="Prototype Testing">Prototype Testing</option>
              <option value="Design Phase">Design Phase</option>
              <option value="R&D Stage">R&D Stage</option>
              <option value="Planning">Planning</option>
              <option value="Testing">Testing</option>
              <option value="Production">Production</option>
              <option value="Available Soon">Available Soon</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              placeholder="e.g., Hydraulics, Biomass"
              className="form-input"
            />
          </div>

          <div className="form-group full-width">
            <label>
              <Icon name="link" className="label-icon" />
              Product Image
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
                    alt="Product preview" 
                    className="image-preview"
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
                <label className="image-url-label">Or enter image URL:</label>
                <div className="image-url-input-group">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({...formData, image: e.target.value});
                      setTempImagePreview(e.target.value);
                    }}
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
              placeholder="Enter product description"
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
                {editingId ? 'Update Product' : 'Add Product'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Search and Filter */}
      <div className="table-controls">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search products..."
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
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="products-table-wrapper">
        {filteredProducts.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Expected Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.ID}>
                  <td>
                    {product.Image ? (
                      <img src={product.Image} alt={product.Name} className="table-image" />
                    ) : (
                      <div className="table-image-placeholder">
                        <Icon name="image" className="placeholder-icon" />
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="product-name-cell">
                      <strong>{product.Name}</strong>
                      {product.Description && (
                        <span className="product-description-cell">{product.Description}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">
                      {product.Category || 'General'}
                    </span>
                  </td>
                  <td>{product.ExpectedDate || 'TBD'}</td>
                  <td>
                    <span className={`status-badge ${(product.Status || 'In Development').toLowerCase().replace(/\s/g, '-')}`}>
                      {product.Status || 'In Development'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn" 
                        onClick={() => handleEdit(product)}
                        title="Edit"
                      >
                        <Icon name="edit" className="action-icon" />
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDelete(product.ID)}
                        title="Delete"
                      >
                        <Icon name="delete" className="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-products">
            <Icon name="image" className="no-products-icon" />
            <p>No products found</p>
            {searchTerm || selectedCategory !== 'all' ? (
              <span className="no-products-hint">Try adjusting your search or filters</span>
            ) : (
              <span className="no-products-hint">Add your first product using the form above</span>
            )}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="table-footer">
        <span className="footer-count">
          Showing {filteredProducts.length} of {comingSoonProducts.length} products
        </span>
      </div>
    </div>
  );
}