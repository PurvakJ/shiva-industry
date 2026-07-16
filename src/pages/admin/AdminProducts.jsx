import { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { api } from '../../utils/api';
import './AdminProducts.css';

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
    star: (
      <>
        <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" />
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

export default function AdminProducts() {
  const { data, refreshAdminData } = useData();
  const { products = [] } = data || {};
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    featured: false,
    stock: ''
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

  const password = localStorage.getItem('adminPassword');

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.Category).filter(Boolean))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.Description && product.Description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.Category === selectedCategory;
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
    setLoading(true);
    setMessage(null);

    const productData = {
      Name: formData.name,
      Description: formData.description,
      Price: formData.price,
      Category: formData.category,
      Image: formData.image,
      Featured: formData.featured,
      Stock: formData.stock ? parseInt(formData.stock) : undefined
    };

    try {
      let result;
      if (editingId) {
        result = await api.updateProduct(password, editingId, productData);
        if (result.success) {
          setMessage({ type: 'success', text: 'Product updated successfully!' });
        }
      } else {
        result = await api.addProduct(password, productData);
        if (result.success) {
          setMessage({ type: 'success', text: 'Product added successfully!' });
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
      setMessage({ type: 'error', text: 'Failed to save product' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.ID);
    setFormData({
      name: product.Name || '',
      description: product.Description || '',
      price: product.Price || '',
      category: product.Category || '',
      image: product.Image || '',
      featured: product.Featured === true || product.Featured === 'TRUE',
      stock: product.Stock !== undefined ? String(product.Stock) : ''
    });
    setTempImagePreview(product.Image || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setLoading(true);
    try {
      const result = await api.deleteProduct(password, id);
      if (result.success) {
        await refreshAdminData(password);
        setMessage({ type: 'success', text: 'Product deleted successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete product' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const result = await api.toggleFeatured(password, id);
      if (result.success) {
        await refreshAdminData(password);
        setMessage({ type: 'success', text: 'Featured status updated!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update featured status' });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      featured: false,
      stock: ''
    });
    setTempImagePreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get stock status label
  const getStockStatus = (stock) => {
    if (stock === undefined || stock === null) return null;
    if (stock <= 0) return { label: 'Out of Stock', className: 'out-of-stock' };
    if (stock <= 5) return { label: 'Low Stock', className: 'low-stock' };
    return { label: 'In Stock', className: 'in-stock' };
  };

  return (
    <div className="admin-products">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h2>Manage Products</h2>
          <p className="header-subtitle">Add, edit or remove products from your catalog</p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">
            <Icon name="star" className="stat-icon" />
            {products.filter(p => p.Featured === true || p.Featured === 'TRUE').length} Featured
          </span>
          <span className="stat-badge">
            Total: {products.length}
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
              Price
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              placeholder="₹1,999.99"
              className="form-input"
            />
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

          <div className="form-group">
            <label>
              Stock
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              placeholder="Quantity in stock"
              className="form-input"
              min="0"
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

          <div className="form-group full-width">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
              />
              <span className="checkbox-text">
                <Icon name="star" className="checkbox-icon" />
                Featured Product
              </span>
            </label>
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
      {products.length > 0 && (
        <div className="table-controls">
          <div className="search-wrapper">
            <Icon name="search" className="search-icon" />
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
            <Icon name="filter" className="filter-icon" />
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
      )}

      {/* Table */}
      <div className="products-table-wrapper">
        {filteredProducts.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const stockStatus = getStockStatus(product.Stock);
                const isFeatured = product.Featured === true || product.Featured === 'TRUE';
                
                return (
                  <tr key={product.ID}>
                    <td>
                      {product.Image ? (
                        <img 
                          src={product.Image} 
                          alt={product.Name} 
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
                      <div className="product-name-cell">
                        <strong>{product.Name}</strong>
                        {product.Description && (
                          <span className="product-description-cell">{product.Description}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {product.Category && (
                        <span className="category-badge">{product.Category}</span>
                      )}
                    </td>
                    <td className="price-cell">{product.Price || '—'}</td>
                    <td>
                      {stockStatus ? (
                        <span className={`stock-badge ${stockStatus.className}`}>
                          {stockStatus.label}
                          {product.Stock > 0 && ` (${product.Stock})`}
                        </span>
                      ) : (
                        <span className="stock-badge unknown">—</span>
                      )}
                    </td>
                    <td>
                      <button
                        className={`featured-toggle ${isFeatured ? 'active' : ''}`}
                        onClick={() => handleToggleFeatured(product.ID)}
                        title={isFeatured ? 'Remove from featured' : 'Make featured'}
                      >
                        <Icon name="star" className="featured-icon" />
                        {isFeatured ? 'Featured' : 'Set'}
                      </button>
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
                );
              })}
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
      {products.length > 0 && (
        <div className="table-footer">
          <span className="footer-count">
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>
      )}
    </div>
  );
}