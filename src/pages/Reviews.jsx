import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { api } from '../utils/api';
import './Reviews.css';

/* Site configuration for SEO */
const siteConfig = {
  domain: 'shivahydraulicandbiomass.com',
  name: 'Shiva Hydraulic & Biomass Industries',
  shortName: 'Shiva Industries',
  description: 'Leading manufacturer of hydraulic cylinders, biomass briquettes, and spare parts in Sardulgarh, Mansa, and Tibbi.',
  keywords: [
    'hydraulic industry',
    'hydraulic industry in sardulgarh',
    'hydraulic industry near me',
    'hydraulic industry in mansa',
    'hydraulic industry in tibbi',
    'biomass industry',
    'biomass industry in mansa',
    'biomass industry in sardulgarh',
    'biomass industry near me',
    'biomass industry in tibbi',
    'biomass spare parts manufacturer',
    'biomass manufacturers',
    'biomass manufacturers in mansa',
    'biomass manufacturers near me',
    'biomass manufacturers in sardulgarh',
    'biomass manufacturers in tibbi',
    'biomass spare parts manufacturer in mansa',
    'biomass spare parts manufacturer near me',
    'biomass spare parts manufacturer in sardulgarh',
    'biomass spare parts manufacturer in tibbi',
    'shiva industries',
    'shiva industries near me',
    'shiva industries in mansa',
    'shiva industries in sardulgarh',
    'shiva industries in tibbi',
    'shiva hydraulic industries',
    'shiva biomass industries',
    'reviews',
    'testimonials',
    'customer feedback'
  ],
  contact: {
    phone1: '+91 92168 00934',
    phone2: '+91 92168 00996',
    phoneLink1: 'tel:+919216800934',
    phoneLink2: 'tel:+919216800996',
    whatsappLink: 'https://wa.me/919216800934',
    email: 'info@shivahydraulicandbiomass.com',
    address: 'Sardulgarh, Mansa District, Punjab, India'
  }
};

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
    phone: (
      <>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </>
    ),
    whatsapp: (
      <>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    message: (
      <>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
      <Helmet>
        <title>Customer Reviews & Testimonials | Shiva Hydraulic & Biomass Industries</title>
        <meta name="description" content="Read real reviews and testimonials from our satisfied customers. See why clients trust Shiva Industries for hydraulic, biomass, and industrial solutions in Sardulgarh, Mansa, and Tibbi." />
        <meta name="keywords" content={`customer reviews, testimonials, feedback, ${siteConfig.keywords.join(', ')}`} />
        <link rel="canonical" href={`https://${siteConfig.domain}/reviews`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Customer Reviews & Testimonials | Shiva Hydraulic & Biomass Industries" />
        <meta property="og:description" content="Read real reviews and testimonials from our satisfied customers. See why clients trust Shiva Industries for hydraulic, biomass, and industrial solutions." />
        <meta property="og:url" content={`https://${siteConfig.domain}/reviews`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Shiva Hydraulic & Biomass Industries" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Customer Reviews & Testimonials | Shiva Industries" />
        <meta name="twitter:description" content="Read real reviews and testimonials from our satisfied customers." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Shiva Hydraulic & Biomass Industries Products",
            "description": "Industrial hydraulic cylinders, biomass briquettes, and spare parts.",
            "brand": {
              "@type": "Brand",
              "name": "Shiva Industries"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": averageRating.toFixed(1),
              "reviewCount": totalReviews,
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": reviews.slice(0, 5).map(review => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": review.Name || "Anonymous"
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.Rating,
                "bestRating": "5"
              },
              "reviewBody": review.Message,
              "datePublished": review.CreatedAt || review.createdAt || new Date().toISOString()
            }))
          })}
        </script>
      </Helmet>

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
            <div className="reviews-hero-contact">
              <a href={siteConfig.contact.phoneLink1} className="reviews-hero-phone">
                <Icon name="phone" className="reviews-hero-phone-icon" />
                {siteConfig.contact.phone1}
              </a>
              <span className="reviews-hero-divider">|</span>
              <a href={siteConfig.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="reviews-hero-whatsapp">
                <Icon name="whatsapp" className="reviews-hero-whatsapp-icon" />
                WhatsApp
              </a>
            </div>
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
                <p className="section-subtitle">
                  Hear what our customers in Sardulgarh, Mansa, Tibbi and across India say about us
                </p>
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
                    {[1, 2, 3, 4, 5].map(num => (
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
                    placeholder="Tell us about your experience with our hydraulic, biomass, or industrial products..."
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

      {/* Location Badges Section */}
      <section className="section location-section">
        <div className="container">
          <Reveal>
            <div className="location-badges-wrapper">
              <span className="eyebrow">Our Locations</span>
              <h3>Serving Industrial Needs Across Punjab</h3>
              <div className="location-badges-grid">
                <div className="location-badge-item">
                  <span className="location-icon">📍</span>
                  <span>Sardulgarh</span>
                </div>
                <div className="location-badge-item">
                  <span className="location-icon">📍</span>
                  <span>Mansa</span>
                </div>
                <div className="location-badge-item">
                  <span className="location-icon">📍</span>
                  <span>Tibbi</span>
                </div>
                <div className="location-badge-item">
                  <span className="location-icon">🌍</span>
                  <span>Pan-India</span>
                </div>
              </div>
            </div>
          </Reveal>
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
            <div className="cta-contact-info">
              <a href={siteConfig.contact.phoneLink1} className="cta-phone">
                <Icon name="phone" className="cta-icon" />
                {siteConfig.contact.phone1}
              </a>
              <span className="cta-divider">|</span>
              <a href={siteConfig.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="cta-whatsapp">
                <Icon name="whatsapp" className="cta-icon" />
                WhatsApp
              </a>
            </div>
            <div className="cta-actions">
              <Link to="/products" className="btn btn--primary">
                View Products
              </Link>
              <Link to="/contact" className="btn btn--outline-light">
                Get in Touch
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}