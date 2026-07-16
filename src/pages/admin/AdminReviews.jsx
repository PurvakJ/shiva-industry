import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { api } from '../../utils/api';
import './AdminReviews.css';

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
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    star: (
      <>
        <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" />
      </>
    ),
    message: (
      <>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
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
    eye: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    eyeOff: (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
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

export default function AdminReviews() {
  const { data, refreshAdminData } = useData();
  const { reviews = [] } = data || {};
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [loading, setLoading] = useState(false);

  const password = localStorage.getItem('adminPassword');

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.Rating, 0) / totalReviews) 
    : 0;
  const visibleCount = reviews.filter(r => r.Visible === true || r.Visible === 'TRUE').length;

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.Message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = selectedRating === 'all' || review.Rating === parseInt(selectedRating);
    
    let matchesFilter = true;
    if (selectedFilter === 'visible') {
      matchesFilter = review.Visible === true || review.Visible === 'TRUE';
    } else if (selectedFilter === 'hidden') {
      matchesFilter = review.Visible !== true && review.Visible !== 'TRUE';
    }
    
    return matchesSearch && matchesRating && matchesFilter;
  });

  // Sort reviews by date (newest first)
  const sortedReviews = [...filteredReviews].sort((a, b) => 
    new Date(b.CreatedAt) - new Date(a.CreatedAt)
  );

  const handleToggle = async (id) => {
    setLoading(true);
    try {
      const result = await api.toggleReview(password, id);
      if (result.success) {
        await refreshAdminData(password);
        setMessage({ type: 'success', text: 'Review visibility toggled successfully!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to toggle review' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    setLoading(true);
    try {
      const result = await api.deleteReview(password, id);
      if (result.success) {
        await refreshAdminData(password);
        setMessage({ type: 'success', text: 'Review deleted successfully!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete review' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return (
      <span className="rating-stars">
        {Array.from({ length: 5 }).map((_, index) => (
          <span 
            key={index} 
            className={`star ${index < rating ? 'star--filled' : 'star--empty'}`}
          >
            ★
          </span>
        ))}
      </span>
    );
  };

  return (
    <div className="admin-reviews">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h2>Manage Reviews</h2>
          <p className="header-subtitle">Monitor and manage customer feedback</p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">
            <Icon name="star" className="stat-icon" />
            {averageRating.toFixed(1)} Avg
          </span>
          <span className="stat-badge">
            <Icon name="message" className="stat-icon" />
            {totalReviews} Total
          </span>
          <span className="stat-badge">
            <Icon name="eye" className="stat-icon" />
            {visibleCount} Visible
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

      {/* Search and Filter */}
      <div className="table-controls">
        <div className="search-wrapper">
          <Icon name="search" className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or message..."
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
            <option value="all">All Reviews</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
        <div className="filter-wrapper rating-filter">
          <Icon name="star" className="filter-icon" />
          <select 
            value={selectedRating} 
            onChange={(e) => setSelectedRating(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="reviews-table-wrapper">
        {sortedReviews.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <Icon name="user" className="th-icon" />
                  Reviewer
                </th>
                <th>
                  <Icon name="star" className="th-icon" />
                  Rating
                </th>
                <th>
                  <Icon name="message" className="th-icon" />
                  Message
                </th>
                <th>
                  <Icon name="calendar" className="th-icon" />
                  Date
                </th>
                <th>
                  <Icon name="eye" className="th-icon" />
                  Visibility
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedReviews.map(review => {
                const isVisible = review.Visible === true || review.Visible === 'TRUE';
                
                return (
                  <tr key={review.ID} className={!isVisible ? 'review-hidden' : ''}>
                    <td>
                      <div className="name-cell">
                        <span className="name-initial">
                          {review.Name.charAt(0).toUpperCase()}
                        </span>
                        <span className="name-text">{review.Name}</span>
                      </div>
                    </td>
                    <td>{renderStars(review.Rating)}</td>
                    <td>
                      <div className="message-cell">
                        {review.Message.length > 80 
                          ? `${review.Message.substring(0, 80)}...` 
                          : review.Message}
                      </div>
                    </td>
                    <td className="date-cell">{formatDate(review.CreatedAt)}</td>
                    <td>
                      <button
                        className={`visibility-toggle ${isVisible ? 'visible' : 'hidden'}`}
                        onClick={() => handleToggle(review.ID)}
                        disabled={loading}
                        title={isVisible ? 'Hide this review' : 'Show this review'}
                      >
                        <Icon name={isVisible ? 'eye' : 'eyeOff'} className="visibility-icon" />
                        <span>{isVisible ? 'Visible' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDelete(review.ID)}
                          title="Delete review"
                          disabled={loading}
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
          <div className="no-reviews">
            <Icon name="star" className="no-reviews-icon" />
            <p>No reviews found</p>
            {searchTerm || selectedFilter !== 'all' || selectedRating !== 'all' ? (
              <span className="no-reviews-hint">Try adjusting your search or filters</span>
            ) : (
              <span className="no-reviews-hint">Reviews from customers will appear here</span>
            )}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {reviews.length > 0 && (
        <div className="table-footer">
          <span className="footer-count">
            Showing {sortedReviews.length} of {reviews.length} reviews
          </span>
          <div className="footer-stats">
            <span className="footer-stat">
              <span className="stat-dot visible-dot" />
              {visibleCount} Visible
            </span>
            <span className="footer-stat">
              <span className="stat-dot hidden-dot" />
              {reviews.length - visibleCount} Hidden
            </span>
          </div>
        </div>
      )}
    </div>
  );
}