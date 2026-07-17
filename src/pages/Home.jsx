import { useEffect, useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import './Home.css';

/* Enhanced icon set with more detail */
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
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
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

/* Scroll-reveal without any animation library */
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

const CAPABILITIES = [
  'Hydraulic Systems',
  'Biomass Machinery',
  'Shredder Parts',
  'Custom Fabrication',
  'Industrial Solutions',
  'Precision Engineering',
];

const CORE_LINES = [
  {
    icon: 'hydraulic',
    title: 'Hydraulic Systems',
    body: 'Cylinders, pumps and power packs machined to hold pressure, shift after shift.',
    image: 'https://5.imimg.com/data5/SELLER/Default/2021/10/WR/FF/IQ/11057383/mild-steel-hydraulic-press-brake-machine-500x500.jpg',
  },
  {
    icon: 'biomass',
    title: 'Biomass Machinery',
    body: 'Wear-resistant parts for shredding, pelletising and processing plant biomass.',
    image: '/images/biomass-machinery.jpg',
  },
  {
    icon: 'shredder',
    title: 'Shredder Parts',
    body: 'Blades, rotors and liners hardened for high-load, continuous-duty cutting.',
    image: '/images/shredder-parts.jpg',
  },
  {
    icon: 'support',
    title: 'And Beyond',
    body: 'Custom fabrication and spares for machinery that falls outside a catalogue.',
    image: '/images/custom-fabrication.jpg',
  },
];

const TRUST_STATS = [
  { value: '20+', label: 'Years in Operation', mono: 'SI-EST', icon: 'gear' },
  { value: '3', label: 'Core Product Lines', mono: 'SI-LINE', icon: 'star' },
  { value: 'Pan-India', label: 'Delivery Network', mono: 'SI-SHIP', icon: 'truck' },
  { value: '24/7', label: 'Service Support', mono: 'SI-SVC', icon: 'support' },
];

// Sample additional image data for products
const PRODUCT_IMAGES = {
  'Hydraulic Cylinder': '/images/hydraulic-cylinder.jpg',
  'Biomass Shredder': '/images/biomass-shredder.jpg',
  'Industrial Pump': '/images/industrial-pump.jpg',
};

export default function Home() {
  const { data } = useData();
  const { products = [], reviews = [], upcomingSites = [] } = data || {};
  
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState(null);

  const featuredProducts = products.filter(
    (p) => p.Featured === true || p.Featured === 'TRUE'
  );

  // Add fallback images if product has no image
  const productsWithImages = featuredProducts.map(product => ({
    ...product,
    Image: product.Image || PRODUCT_IMAGES[product.Name] || '/images/placeholder-product.jpg'
  }));

  const latestReviews = reviews.slice(0, 3);

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
    <div className="home-page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-backdrop" aria-hidden="true">
          <div className="hero-grid" />
          <svg className="hero-gear" viewBox="0 0 100 100" aria-hidden="true">
            <path
              fill="currentColor"
              d="M50 32a18 18 0 1 0 0 36 18 18 0 0 0 0-36Zm0 8a10 10 0 1 1 0 20 10 10 0 0 1 0-20Z"
            />
            {Array.from({ length: 12 }).map((_, i) => (
              <rect
                key={i}
                x="47"
                y="2"
                width="6"
                height="14"
                fill="currentColor"
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
          </svg>
        </div>

        <div className="hero-inner">
          <span className="eyebrow eyebrow--light">Shiva Industry &middot; Since the shop floor, 20+ years</span>
          <h1 className="hero-title">
            Engineered to <span className="text-accent">Outlast</span>.
          </h1>
          <p className="hero-copy">
            For over two decades Shiva Industry has manufactured hydraulic systems, biomass
            machinery parts and shredder components for plants that can&apos;t afford downtime.
            If it needs to run hard and keep running, we&apos;ve probably built a part for it.
          </p>
          <div className="hero-actions">
            <a href="/products" className="btn btn--primary">
              View Products
            </a>
            <a href="/contact" className="btn btn--ghost">
              Get a Quote
            </a>
          </div>
        </div>

        <div className="nameplate-row">
          {TRUST_STATS.map((s) => (
            <div className="nameplate" key={s.label}>
              <Icon name={s.icon} className="nameplate-icon" />
              <span className="nameplate-code">{s.mono}</span>
              <span className="nameplate-value">{s.value}</span>
              <span className="nameplate-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CAPABILITY TICKER */}
      <div className="ticker" role="presentation">
        <div className="ticker-track">
          {[...CAPABILITIES, ...CAPABILITIES].map((c, i) => (
            <span className="ticker-item" key={i}>
              {c} <span className="ticker-dot">&#9670;</span>
            </span>
          ))}
        </div>
      </div>

      {/* WHO WE ARE */}
      <section className="section about">
        <div className="container about-grid">
          <Reveal className="about-copy">
            <span className="eyebrow">Who We Are</span>
            <h2 className="section-title">
              Parts that keep <span className="text-accent">heavy machines</span> honest.
            </h2>
            <p>
              Shiva Industry builds and supplies hydraulic components, biomass processing parts
              and shredder machinery to workshops and plants that run their equipment hard, every
              day. We don&apos;t make disposable parts — we make the ones you stop thinking about
              because they simply don&apos;t fail.
            </p>
            <p>
              Every component leaves our floor tested under load, matched to spec and ready to
              install — backed by a service team that answers the phone.
            </p>
            <ul className="check-list">
              <li>
                <Icon name="shield" className="check-icon" /> Load-tested before dispatch
              </li>
              <li>
                <Icon name="gauge" className="check-icon" /> Precision machined to tolerance
              </li>
              <li>
                <Icon name="support" className="check-icon" /> Dedicated after-sales support
              </li>
            </ul>
          </Reveal>
          <Reveal className="about-image-wrap" delay="0.1s">
          <img
    src="https://5.imimg.com/data5/SELLER/Default/2021/10/RA/TP/FF/11057383/mild-steel-angle-cutting-machine-500x500.jpg"
    alt="Shiva Industry - Heavy Machinery Manufacturing"
    className="about-image"
/>
            <div className="about-image-overlay">
              <h4 className="overlay-title">20+ Years of Excellence</h4>
              <p className="overlay-sub">Precision Engineering • Quality Assured</p>
            </div>
            <span className="about-image-badge">Est. 2003</span>
          </Reveal>
        </div>
      </section>

      {/* CORE LINES / WHY US */}
      <section className="section why">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow eyebrow--light">Why Shiva</span>
            <h2 className="section-title section-title--light">Built for the load you actually run.</h2>
          </Reveal>
          <div className="feature-grid">
            {CORE_LINES.map((f, i) => (
              <Reveal key={f.title} delay={`${i * 0.08}s`}>
                <div className="feature-card">
                  <div className="feature-image-wrap">
                    <img src={f.image} alt={f.title} className="feature-image" />
                    <div className="feature-overlay">
                      <div className="feature-icon-wrapper">
                        <Icon name={f.icon} className="feature-icon" />
                      </div>
                    </div>
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section products">
        <div className="container">
          <Reveal className="section-head section-head--split">
            <div>
              <span className="eyebrow">Our Range</span>
              <h2 className="section-title">Parts for the plant floor.</h2>
            </div>
            <a href="/products" className="link-arrow">
              All Products <span aria-hidden="true">&rarr;</span>
            </a>
          </Reveal>

          {productsWithImages.length > 0 ? (
            <div className="product-grid">
              {productsWithImages.map((product, i) => (
                <Reveal key={product.ID} delay={`${i * 0.06}s`}>
                  <div className="product-card">
                    {product.Image && (
                      <div className="product-image-wrap">
                        <img src={product.Image} alt={product.Name} className="product-image" />
                        {product.Category && (
                          <span className="tag tag--orange">{product.Category}</span>
                        )}
                        <div className="product-image-overlay">
                          <button 
                            className="product-view-btn"
                            onClick={() => handleViewDetails(product)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="product-content">
                      <h3>{product.Name}</h3>
                      <p className="product-description">{product.Description}</p>
                      <div className="product-meta">
                        <span className="product-price">{product.Price}</span>
                        <button 
                          className="product-enquire-btn"
                          onClick={() => handleEnquire(product)}
                        >
                          Enquire
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="no-data">No featured products yet — check back soon.</p>
          )}
        </div>
      </section>

      {/* NEW ARRIVALS / UPCOMING */}
      {upcomingSites.length > 0 && (
        <section className="section upcoming">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow">In the Pipeline</span>
              <h2 className="section-title">What&apos;s rolling out next.</h2>
            </Reveal>
            <div className="upcoming-grid">
              {upcomingSites.slice(0, 3).map((site, i) => (
                <Reveal key={site.ID} delay={`${i * 0.08}s`}>
                  <div className="upcoming-card">
                    {site.Image && (
                      <div className="upcoming-image-wrap">
                        <img src={site.Image} alt={site.Name} className="upcoming-image" />
                        <div className="upcoming-badge">Coming Soon</div>
                      </div>
                    )}
                    <h3>{site.Name}</h3>
                    <p>{site.Description}</p>
                    <span className="tag tag--dark">Available {site.LaunchDate}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {latestReviews.length > 0 && (
        <section className="section reviews">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow eyebrow--light">From the Shop Floor</span>
              <h2 className="section-title section-title--light">Trusted where it runs hard.</h2>
            </Reveal>
            <div className="reviews-grid">
              {latestReviews.map((review, i) => (
                <Reveal key={review.ID} delay={`${i * 0.08}s`}>
                  <div className="review-card">
                    <div className="review-header">
                      <div className="review-rating" aria-label={`${review.Rating} out of 5 stars`}>
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span key={idx} className={idx < review.Rating ? 'star star--on' : 'star'}>
                            &#9733;
                          </span>
                        ))}
                      </div>
                      <span className="review-date">{review.Date || 'Recent'}</span>
                    </div>
                    <p className="review-message">&ldquo;{review.Message}&rdquo;</p>
                    <div className="review-footer">
                      <strong className="review-name">{review.Name}</strong>
                      {review.Company && (
                        <span className="review-company">{review.Company}</span>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="view-all">
              <a href="/reviews" className="link-arrow link-arrow--light">
                View All Reviews <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* CTA STRIP */}
      <section className="cta-strip">
        <div className="cta-hazard" aria-hidden="true" />
        <div className="container cta-inner">
          <div>
            <span className="eyebrow eyebrow--onDark">Ready When You Are</span>
            <h3 className="cta-title">Talk to our team today.</h3>
            <p className="cta-copy">
              Tell us the machine, the load, the deadline — we&apos;ll tell you the part.
            </p>
          </div>
          <div className="cta-actions">
            <a href="tel:+911234567890" className="btn btn--outline-light">
              <Icon name="truck" className="btn-icon" /> +91 12345 67890
            </a>
            <a href="/contact" className="btn btn--primary">
              Send Enquiry
            </a>
          </div>
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