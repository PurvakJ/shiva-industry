import { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { api } from '../utils/api';
import './Reviews.css';

/* Reusing icon component */
function Icon({ name, className }) {
  const paths = {
    star: (
      <>
        <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" />
      </>
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
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
    quote: (
      <>
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h1c0 4.667-1 7-2 8z" />
        <path d="M14 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h1c0 4.667-1 7-2 8z" />
      </>
    ),
    check: (
      <>
        <path d="M20 6L9 17l-5-5" />
      </>
    ),
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
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

/* Scroll-reveal hook */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return [ref, visible];
}

function Reveal({ as: Tag = 'div', className = '', delay, children }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'reveal--visible' : ''} ${className}`}
      style={delay ? { transitionDelay: delay } : undefined}
    >
      {children}
    </Tag>
  );
}

// Helper function to render star ratings
function StarRating({ rating, max = 5 }) {
  return (
    <div className="star-rating" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, index) => (
        <span 
          key={index} 
          className={`star ${index < rating ? 'star--filled' : 'star--empty'}`}
        >
          {index < rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { data, refreshData } = useData();
  const { reviews = [] } = data || {};
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', rating: 5, message: '', company: '' });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const formRef = useRef(null);

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.Rating, 0) / totalReviews) 
    : 0;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => Math.round(r.Rating) === stars).length
  }));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    
    try {
      const result = await api.addReview(formData);
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', rating: 5, message: '', company: '' });
        setShowForm(false);
        await refreshData();
        setTimeout(() => setSubmitStatus(null), 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="reviews-page">
      {/* Hero Section */}
      <section className="reviews-hero">
        <div className="reviews-hero-backdrop" aria-hidden="true">
          <div className="reviews-hero-grid" />
        </div>
        <div className="container reviews-hero-inner">
          <Reveal>
            <span className="eyebrow">Testimonials</span>
            <h1 className="reviews-hero-title">
              What Our <span className="text-accent">Clients Say</span>
            </h1>
            <p className="reviews-hero-copy">
              Real feedback from real clients who trust us with their industrial needs.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats Section */}
      {totalReviews > 0 && (
        <section className="reviews-stats">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{averageRating.toFixed(1)}</div>
                <div className="stat-stars">
                  <StarRating rating={Math.round(averageRating)} />
                </div>
                <div className="stat-label">Average Rating</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{totalReviews}</div>
                <div className="stat-label">Total Reviews</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {reviews.filter(r => r.Rating >= 4).length}
                </div>
                <div className="stat-label">4+ Star Reviews</div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="rating-distribution">
              {ratingDistribution.map(({ stars, count }) => (
                <div key={stars} className="distribution-bar">
                  <span className="distribution-label">{stars} ★</span>
                  <div className="distribution-track">
                    <div 
                      className="distribution-fill" 
                      style={{ 
                        width: totalReviews > 0 ? `${(count / totalReviews) * 100}%` : '0%',
                        backgroundColor: stars >= 4 ? '#2d7d46' : stars >= 3 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                  <span className="distribution-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="section reviews-section">
        <div className="container">
          <div className="reviews-header">
            <Reveal>
              <div className="reviews-header-content">
                <span className="eyebrow">Client Feedback</span>
                <h2 className="section-title">
                  <span className="text-accent">Real</span> Experiences
                </h2>
              </div>
            </Reveal>
            <Reveal delay="0.1s">
              <button 
                className={`write-review-btn ${showForm ? 'active' : ''}`}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? (
                  <>
                    <Icon name="close" className="btn-icon" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Icon name="edit" className="btn-icon" />
                    Write a Review
                  </>
                )}
              </button>
            </Reveal>
          </div>

          {/* Review Form */}
          {showForm && (
            <Reveal className="review-form-wrapper">
              <form className="review-form" onSubmit={handleSubmit} ref={formRef}>
                <h3>Share Your Experience</h3>
                <p>Your feedback helps us improve and helps others make informed decisions.</p>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="review-name">Your Name *</label>
                    <input
                      type="text"
                      id="review-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      disabled={submitStatus === 'submitting'}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="review-company">Company (Optional)</label>
                    <input
                      type="text"
                      id="review-company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company name"
                      disabled={submitStatus === 'submitting'}
                    />
                  </div>
                </div>

                <div className="form-group rating-group">
                  <label>Your Rating *</label>
                  <div className="rating-selector">
                    {[5, 4, 3, 2, 1].map(num => (
                      <button
                        key={num}
                        type="button"
                        className={`rating-star-btn ${formData.rating >= num ? 'active' : ''}`}
                        onClick={() => handleRatingClick(num)}
                        onMouseEnter={() => setHoverRating(num)}
                        onMouseLeave={() => setHoverRating(0)}
                        disabled={submitStatus === 'submitting'}
                      >
                        {num <= (hoverRating || formData.rating) ? '★' : '☆'}
                      </button>
                    ))}
                  </div>
                  <span className="rating-label">
                    {formData.rating === 5 && 'Excellent!'}
                    {formData.rating === 4 && 'Very Good'}
                    {formData.rating === 3 && 'Good'}
                    {formData.rating === 2 && 'Fair'}
                    {formData.rating === 1 && 'Poor'}
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="review-message">Your Message *</label>
                  <textarea
                    id="review-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Tell us about your experience with our products or services..."
                    disabled={submitStatus === 'submitting'}
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="submit-review-btn" 
                    disabled={submitStatus === 'submitting'}
                  >
                    {submitStatus === 'submitting' ? (
                      <>
                        <span className="spinner" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Icon name="check" className="btn-icon" />
                        Submit Review
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-review-btn"
                    onClick={() => setShowForm(false)}
                    disabled={submitStatus === 'submitting'}
                  >
                    Cancel
                  </button>
                </div>

                {submitStatus === 'success' && (
                  <div className="status-message success">
                    <Icon name="check" className="status-icon" />
                    <span>Thank you! Your review has been submitted successfully.</span>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="status-message error">
                    <span>Failed to submit review. Please try again.</span>
                  </div>
                )}
              </form>
            </Reveal>
          )}

          {/* Reviews List */}
          {totalReviews > 0 ? (
            <div className="reviews-list">
              {reviews.map((review, index) => (
                <Reveal key={review.ID || review.id || index} delay={`${(index % 6) * 0.05}s`}>
                  <div className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {review.Name ? review.Name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="reviewer-details">
                          <strong className="reviewer-name">{review.Name}</strong>
                          {review.Company && (
                            <span className="reviewer-company">{review.Company}</span>
                          )}
                        </div>
                      </div>
                      <div className="review-rating">
                        <StarRating rating={review.Rating} />
                      </div>
                    </div>
                    <p className="review-message">
                      <Icon name="quote" className="quote-icon" />
                      {review.Message}
                    </p>
                    <div className="review-footer">
                      <span className="review-date">
                        <Icon name="calendar" className="date-icon" />
                        {review.CreatedAt || review.createdAt || 'Recent'}
                      </span>
                      <span className="review-verified">
                        <Icon name="check" className="verified-icon" />
                        Verified Customer
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="no-reviews">
              <Icon name="quote" className="no-reviews-icon" />
              <h3>No Reviews Yet</h3>
              <p>Be the first to share your experience with us!</p>
              <button 
                className="btn btn--primary"
                onClick={() => setShowForm(true)}
              >
                Write a Review
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="reviews-cta">
        <div className="cta-hazard" aria-hidden="true" />
        <div className="container cta-inner">
          <Reveal>
            <span className="eyebrow eyebrow--onDark">Ready to Experience Quality?</span>
            <h3 className="cta-title">Join Our Satisfied Customers</h3>
            <p className="cta-copy">
              Explore our products and see why clients trust us for their industrial needs.
            </p>
            <div className="cta-actions">
              <a href="/products" className="btn btn--primary">
                View Products
              </a>
              <a href="/contact" className="btn btn--outline-light">
                Get in Touch
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}