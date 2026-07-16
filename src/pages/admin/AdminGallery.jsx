import { useEffect, useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import './AdminGallery.css';
import { api } from '../../utils/api';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = "dm9gg8yss";
const CLOUDINARY_UPLOAD_PRESET = "images";

/* Icon component */
function Icon({ name, className }) {
  const paths = {
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
    image: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </>
    ),
    edit: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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

const EMPTY_FORM = { Title: '', ImageURL: '' };

export default function AdminGallery() {
  const { data } = useData();
  const password = localStorage.getItem('adminPassword');

  const [items, setItems] = useState(data.gallery || []);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  
  // Image upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tempImagePreview, setTempImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getAdminData(password);
      if (res.error) throw new Error(res.error);
      setItems(res.gallery || []);
    } catch (err) {
      setError(err.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 2500);
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setTempImagePreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

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
      setError('Please select an image file');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      setTimeout(() => setError(''), 3000);
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
        setForm((f) => ({ ...f, ImageURL: url }));
        flash('Image uploaded successfully!');
      })
      .catch((error) => {
        clearInterval(progressInterval);
        console.error('Upload error:', error);
        setError('Failed to upload image. Please try again.');
        setTimeout(() => setError(''), 3000);
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
    setForm((f) => ({ ...f, ImageURL: '' }));
    setTempImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.ID);
    setForm({ Title: item.Title || '', ImageURL: item.ImageURL || '' });
    setTempImagePreview(item.ImageURL || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image from the gallery?')) return;
    setError('');
    try {
      const res = await api.deleteGallery(password, id);
      if (res.error) throw new Error(res.error);
      if (editingId === id) resetForm();
      await refresh();
      flash('Image deleted');
    } catch (err) {
      setError(err.message || 'Failed to delete image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ImageURL.trim()) {
      setError('Image URL is required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = editingId
        ? await api.updateGallery(password, editingId, form)
        : await api.addGallery(password, form);
      if (res.error) throw new Error(res.error);
      await refresh();
      resetForm();
      flash(editingId ? 'Image updated' : 'Image added');
    } catch (err) {
      setError(err.message || 'Failed to save image');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-gallery">
      <div className="admin-gallery-header">
        <div>
          <h1>Gallery</h1>
          <p className="admin-gallery-subtitle">
            Add, edit or remove the images shown on the public gallery page.
          </p>
        </div>
        <span className="admin-gallery-count">
          <Icon name="image" className="count-icon" />
          {items.length} image{items.length === 1 ? '' : 's'}
        </span>
      </div>

      {notice && (
        <div className="admin-gallery-notice">
          <Icon name="check" className="notice-icon" />
          <span>{notice}</span>
          <button className="notice-close" onClick={() => setNotice('')}>
            <Icon name="close" className="close-icon" />
          </button>
        </div>
      )}
      
      {error && (
        <div className="admin-gallery-error">
          <Icon name="alert" className="error-icon" />
          <span>{error}</span>
          <button className="error-close" onClick={() => setError('')}>
            <Icon name="close" className="close-icon" />
          </button>
        </div>
      )}

      <form className="admin-gallery-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>
            <Icon name={editingId ? 'edit' : 'upload'} className="form-header-icon" />
            {editingId ? 'Edit Image' : 'Add New Image'}
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
              Title
            </label>
            <input
              type="text"
              name="Title"
              value={form.Title}
              onChange={handleChange}
              placeholder="e.g. Workshop floor, 2025"
              className="form-input"
            />
          </div>

          <div className="form-group full-width">
            <label>
              Image URL *
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
              {(tempImagePreview || form.ImageURL) && (
                <div className="image-preview-container">
                  <img 
                    src={tempImagePreview || form.ImageURL} 
                    alt="Preview" 
                    className="image-preview"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<span className="preview-error">Failed to load image</span>';
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
                    name="ImageURL"
                    value={form.ImageURL}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="form-input image-url-input"
                    disabled={uploadingImage}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting || uploadingImage}>
            {submitting ? (
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
                <Icon name={editingId ? 'edit' : 'upload'} className="btn-icon" />
                {editingId ? 'Update Image' : 'Add Image'}
              </>
            )}
          </button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={resetForm} disabled={submitting || uploadingImage}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="admin-gallery-loading">
          <div className="spinner" />
          <span>Loading gallery…</span>
        </div>
      ) : items.length === 0 ? (
        <div className="admin-gallery-empty">
          <Icon name="image" className="empty-icon" />
          <h3>No Images Yet</h3>
          <p>Add your first image using the form above.</p>
        </div>
      ) : (
        <div className="admin-gallery-grid">
          {items.map((item) => (
            <div className="gallery-card" key={item.ID}>
              <div className="gallery-card-image-wrap">
                <img 
                  src={item.ImageURL} 
                  alt={item.Title || 'Gallery'} 
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
              </div>
              <div className="gallery-card-body">
                <h3>{item.Title || 'Untitled'}</h3>
                <div className="gallery-card-actions">
                  <button type="button" className="btn-link" onClick={() => handleEdit(item)}>
                    <Icon name="edit" className="action-icon" />
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-link btn-link--danger"
                    onClick={() => handleDelete(item.ID)}
                  >
                    <Icon name="delete" className="action-icon" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}