import { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import './Products.css';

/* Reusing icon component */
function Icon({ name, className }) {
  const paths = {
    hydraulic: (
      <>
        <rect x="3" y="10" width="11" height="4" rx="1" />
        <rect x="14" y="8.5" width="4" height="7" rx="0.5" />
        <line x1="18" y1="12" x2="22" y2="12" />
        <circle cx="6" cy="12" r="1.1" fill="currentColor" stroke="none" />
        <path d="M8 8l1.5-2h5L16 8" strokeWidth="1.2" />
      </>
    ),
    biomass: (
      <>
        <path d="M12 3c3 3 6 6.5 6 10.5A6 6 0 0 1 6 13.5C6 9.5 9 6 12 3Z" />
        <path d="M12 21v-7" />
        <circle cx="12" cy="14" r="1.5" fill="currentColor" stroke="none" />
      </>
    ),
    shredder: (
      <>
        <path d="M4 6h16" />
        <path d="M6 6l1.5 13h9L18 6" />
        <path d="M9.5 10v5M12 10v5M14.5 10v5" />
        <circle cx="12" cy="3" r="1.2" fill="currentColor" stroke="none" />
      </>
    ),
    support: (
      <>
        <path d="M12 3a7 7 0 0 0-7 7v3a2 2 0 0 0 2 2h1v-6H6a6 6 0 0 1 12 0h-2v6h1a2 2 0 0 0 2-2v-3a7 7 0 0 0-7-7Z" />
        <path d="M8 15v1a4 4 0 0 0 4 4" />
        <circle cx="9" cy="10" r="0.8" fill="currentColor" stroke="none" />
        <circle cx="15" cy="10" r="0.8" fill="currentColor" stroke="none" />
      </>
    ),
    gauge: (
      <>
        <circle cx="12" cy="13" r="7.5" />
        <path d="M12 13l3.2-3.4" />
        <path d="M9 5.2 8.6 3M15 5.2l.4-2.2" />
        <circle cx="12" cy="5.5" r="1" fill="currentColor" stroke="none" />
      </>
    ),
    truck: (
      <>
        <rect x="2.5" y="8" width="11" height="7" rx="0.6" />
        <path d="M13.5 10.5H17l3 3V15h-6.5z" />
        <circle cx="6.5" cy="16.5" r="1.6" />
        <circle cx="16.5" cy="16.5" r="1.6" />
        <path d="M4 11.5v-2" strokeWidth="1.2" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3l7 3v5c0 4.6-3 8-7 10-4-2-7-5.4-7-10V6z" />
        <path d="M9 12l2 2 4-4.2" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
      </>
    ),
    gear: (
      <>
        <circle cx="12" cy="12" r="4" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x="10.5"
            y="2"
            width="3"
            height="5"
            rx="0.5"
            transform={`rotate(${i * 45} 12 12)`}
          />
        ))}
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
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="0.5" />
        <rect x="14" y="3" width="7" height="7" rx="0.5" />
        <rect x="3" y="14" width="7" height="7" rx="0.5" />
        <rect x="14" y="14" width="7" height="7" rx="0.5" />
      </>
    ),
    list: (
      <>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="4" y2="6" />
        <line x1="3" y1="12" x2="4" y2="12" />
        <line x1="3" y1="18" x2="4" y2="18" />
      </>
    ),
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    email: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
    phone: (
      <>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </>
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    message: (
      <>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
    )
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

/* Product Detail Modal */
function ProductModal({ product, onClose, onEnquire }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <Icon name="close" className="modal-close-icon" />
        </button>
        
        <div className="modal-grid">
          {product.Image && (
            <div className="modal-image-wrap">
              <img src={product.Image} alt={product.Name} className="modal-image" />
              {product.Featured === true && (
                <span className="featured-badge">
                  <Icon name="star" className="featured-icon" />
                  Featured
                </span>
              )}
            </div>
          )}
          
          <div className="modal-details">
            <div className="modal-header">
              <h2 className="modal-title">{product.Name}</h2>
              {product.Category && (
                <span className="modal-category">{product.Category}</span>
              )}
            </div>

            <div className="modal-meta">
              {product.Price && (
                <div className="modal-price">{product.Price}</div>
              )}
              {product.Stock !== undefined && (
                <div className={`modal-stock ${product.Stock === 0 ? 'out-of-stock' : product.Stock <= 5 ? 'low-stock' : 'in-stock'}`}>
                  {product.Stock === 0 ? 'Out of Stock' : 
                   product.Stock <= 5 ? `Only ${product.Stock} left` : 
                   `${product.Stock} in stock`}
                </div>
              )}
            </div>

            <div className="modal-description">
              <h4>Description</h4>
              <p>{product.Description || 'No description available.'}</p>
            </div>

            {product.Specifications && Object.keys(product.Specifications).length > 0 && (
              <div className="modal-specs">
                <h4>Specifications</h4>
                <div className="specs-grid">
                  {Object.entries(product.Specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-label">{key}</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button 
                className="modal-btn modal-btn-primary"
                onClick={() => onEnquire(product)}
              >
                <Icon name="message" className="modal-btn-icon" />
                Enquire Now
              </button>
              <button 
                className="modal-btn modal-btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Enquiry Modal */
function EnquiryModal({ product, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    productName: product?.Name || ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Enquiry submitted:', formData);
    setSubmitted(true);
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!product) return null;

  if (submitted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content enquiry-success" onClick={(e) => e.stopPropagation()}>
          <div className="success-content">
            <Icon name="check" className="success-icon" />
            <h3>Enquiry Sent!</h3>
            <p>Thank you for your interest in {product.Name}. We'll get back to you within 24 hours.</p>
            <button className="modal-btn modal-btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content enquiry-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <Icon name="close" className="modal-close-icon" />
        </button>
        
        <div className="enquiry-header">
          <h3>Enquire about {product.Name}</h3>
          <p>Fill in your details and we'll get back to you shortly.</p>
        </div>

        <form onSubmit={handleSubmit} className="enquiry-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 890"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              placeholder={`I'm interested in the ${product.Name}. Please provide more information.`}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="modal-btn modal-btn-primary">
              <Icon name="message" className="modal-btn-icon" />
              Send Enquiry
            </button>
            <button type="button" className="modal-btn modal-btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Products() {
  const { data } = useData();
  const { products = [] } = data || {};
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState(null);

  // Extract unique categories
  const categories = ['all', ...new Set(products.map(p => p.Category).filter(Boolean))];

  // Filter and search products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.Category === selectedCategory;
    const matchesSearch = product.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.Description && product.Description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.Name.localeCompare(b.Name);
    if (sortBy === 'price') {
      const priceA = parseFloat(a.Price?.replace(/[^0-9.-]+/g, '') || 0);
      const priceB = parseFloat(b.Price?.replace(/[^0-9.-]+/g, '') || 0);
      return priceA - priceB;
    }
    if (sortBy === 'category') return (a.Category || '').localeCompare(b.Category || '');
    return 0;
  });

  // Get category count
  const getCategoryCount = (category) => {
    if (category === 'all') return products.length;
    return products.filter(p => p.Category === category).length;
  };

  // Handlers
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowEnquiry(false);
  };

  const handleEnquire = (product) => {
    setEnquiryProduct(product);
    setShowEnquiry(true);
    setSelectedProduct(null);
  };

  const handleEnquirySubmit = (data) => {
    console.log('Enquiry submitted:', data);
    // You can add API call here
  };

  const closeAllModals = () => {
    setSelectedProduct(null);
    setShowEnquiry(false);
    setEnquiryProduct(null);
  };

  return (
    <div className="products-page">
      {/* Hero Section */}
      <section className="products-hero">
        <div className="products-hero-backdrop" aria-hidden="true">
          <div className="products-hero-grid" />
        </div>
        <div className="container products-hero-inner">
          <Reveal>
            <span className="eyebrow">Our Range</span>
            <h1 className="products-hero-title">
              Quality <span className="text-accent">Industrial</span> Products
            </h1>
            <p className="products-hero-copy">
              Explore our comprehensive range of hydraulic systems, biomass machinery parts,
              and shredder components — all engineered for durability and performance.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Products Section */}
      <section className="section products-section">
        <div className="container">
          {products.length > 0 ? (
            <>
              {/* Search and Filter Bar */}
              <Reveal className="products-toolbar">
                <div className="search-wrapper">
                  <Icon name="search" className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search products by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      className="clear-search"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="toolbar-controls">
                  <div className="sort-wrapper">
                    <select 
                      className="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Sort by Name</option>
                      <option value="category">Sort by Category</option>
                      <option value="price">Sort by Price</option>
                    </select>
                  </div>

                  <div className="view-toggle">
                    <button
                      className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid view"
                    >
                      <Icon name="grid" className="view-icon" />
                    </button>
                    <button
                      className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                    >
                      <Icon name="list" className="view-icon" />
                    </button>
                  </div>
                </div>
              </Reveal>

              {/* Category Filters */}
              <Reveal className="category-filters">
                <div className="category-scroll">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === 'all' ? 'All Products' : category}
                      <span className="category-count">{getCategoryCount(category)}</span>
                    </button>
                  ))}
                </div>
              </Reveal>

              {/* Results Info */}
              <div className="results-info">
                <span className="results-count">
                  Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
                  {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </span>
              </div>

              {/* Product Grid/List */}
              <div className={`product-container ${viewMode}`}>
                {sortedProducts.map((product, index) => (
                  <Reveal key={product.ID || product.id || index} delay={`${(index % 6) * 0.05}s`}>
                    <div className={`product-card ${viewMode}`}>
                      {product.Image && (
                        <div className="product-image-wrap">
                          <img 
                            src={product.Image} 
                            alt={product.Name} 
                            className="product-image" 
                            loading="lazy"
                          />
                          {product.Featured === true && (
                            <span className="featured-badge">
                              <Icon name="star" className="featured-icon" />
                              Featured
                            </span>
                          )}
                          {product.Stock !== undefined && product.Stock <= 5 && product.Stock > 0 && (
                            <span className="stock-badge low-stock">Low Stock</span>
                          )}
                          {product.Stock === 0 && (
                            <span className="stock-badge out-of-stock">Out of Stock</span>
                          )}
                        </div>
                      )}
                      <div className="product-content">
                        <div className="product-header">
                          <h3>{product.Name}</h3>
                          {product.Category && (
                            <span className="product-category">{product.Category}</span>
                          )}
                        </div>
                        <p className="product-description">{product.Description}</p>
                        <div className="product-footer">
                          {product.Price && (
                            <span className="product-price">{product.Price}</span>
                          )}
                          <div className="product-actions">
                            <button 
                              className="product-btn view-btn-action"
                              onClick={() => handleViewDetails(product)}
                            >
                              View Details
                            </button>
                            <button 
                              className="product-btn enquiry-btn"
                              onClick={() => handleEnquire(product)}
                            >
                              Enquire
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* No Results */}
              {sortedProducts.length === 0 && (
                <div className="no-results">
                  <Icon name="search" className="no-results-icon" />
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filter criteria.</p>
                  <button 
                    className="btn btn--primary reset-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-products">
              <Icon name="gear" className="no-products-icon" />
              <h3>No Products Available</h3>
              <p>Products will be added soon.</p>
              <p className="no-products-sub">Check back later for our complete range.</p>
              <div className="no-products-actions">
                <a href="/contact" className="btn btn--primary">
                  Contact Us
                </a>
                <a href="/coming-soon" className="btn btn--ghost-dark">
                  View Coming Soon
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="products-cta">
        <div className="cta-hazard" aria-hidden="true" />
        <div className="container cta-inner">
          <Reveal>
            <span className="eyebrow eyebrow--onDark">Need Something Custom?</span>
            <h3 className="cta-title">We Build to Your Specs</h3>
            <p className="cta-copy">
              Don't see what you're looking for? We offer custom fabrication and engineering services.
            </p>
            <div className="cta-actions">
              <a href="/contact" className="btn btn--primary">
                Get a Quote
              </a>
              <a href="/gallery" className="btn btn--outline-light">
                View Our Work
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Modals */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={closeAllModals}
          onEnquire={handleEnquire}
        />
      )}
      
      {showEnquiry && enquiryProduct && (
        <EnquiryModal 
          product={enquiryProduct} 
          onClose={closeAllModals}
          onSubmit={handleEnquirySubmit}
        />
      )}
    </div>
  );
}