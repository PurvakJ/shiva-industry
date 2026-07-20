import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useData } from '../context/DataContext';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

/* Site configuration for SEO */
const siteConfig = {
  domain: 'shivahydraulicandbiomass.com',
  name: 'Shiva Hydraulic & Biomass Industries',
  shortName: 'Shiva Industries',
  description: 'Leading manufacturer of hydraulic cylinders, biomass briquettes, and spare parts in Sardulgarh, Mansa, and Tibbi. Quality industrial solutions since 1990.',
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
    'shiva biomass industries'
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
            transform={`rotate(${i * 45} 12 12}`}
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
    external: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </>
    ),
    location: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
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

/* Helper function to parse specifications from description */
function parseSpecs(description) {
  if (!description) return { specs: {}, descriptionText: '' };
  const lines = description.split('\n').filter(line => line.trim());
  const specs = {};
  let descriptionText = '';
  
  lines.forEach(line => {
    const match = line.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      specs[match[1].trim()] = match[2].trim();
    } else {
      descriptionText += line + ' ';
    }
  });
  
  return { specs, descriptionText: descriptionText.trim() };
}

/* Helper function to get random items from array */
function getRandomItems(array, count) {
  if (!array || array.length === 0) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

/* Contact Phone Component with Direct Call & WhatsApp */
function ContactPhone() {
  return (
    <div className="contact-phone-card">
      <div className="contact-phone-icon">
        <Icon name="phone" className="phone-icon" />
      </div>
      <div className="contact-phone-content">
        <span className="contact-phone-label">Call or WhatsApp for Enquiry</span>
        <div className="contact-actions-row">
          <a href={siteConfig.contact.phoneLink1} className="contact-call-btn">
            <Icon name="phone" className="action-icon" />
            Call Now
          </a>
          <a href={siteConfig.contact.whatsappLink} className="contact-whatsapp-btn" target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" className="whatsapp-icon" />
            WhatsApp
          </a>
        </div>
        <span className="contact-phone-number-display">{siteConfig.contact.phone1}</span>
        <span className="contact-phone-number-display secondary">{siteConfig.contact.phone2}</span>
      </div>
    </div>
  );
}

/* Product Detail Modal - Wider Layout */
function ProductModal({ product, onClose }) {
  const parsedData = product?.Description ? parseSpecs(product.Description) : null;
  const hasSpecs = parsedData && Object.keys(parsedData.specs).length > 0;

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
    <div className="product-detail-overlay" onClick={onClose}>
      <div className="product-detail-page" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose} aria-label="Close">
          <Icon name="close" className="detail-close-icon" />
        </button>

        <div className="detail-container">
          {/* Main Content */}
          <div className="detail-main">
            {/* Image Section */}
            <div className="detail-image-section">
              {product.Image && (
                <img src={product.Image} alt={product.Name} className="detail-main-image" />
              )}
              {product.Featured === true && (
                <span className="detail-featured-badge">
                  <Icon name="star" className="featured-icon" />
                  Featured
                </span>
              )}
            </div>

            {/* Info Section */}
            <div className="detail-info-section">
              <div className="detail-header">
                <h1 className="detail-title">{product.Name}</h1>
                {product.Category && (
                  <span className="detail-category">{product.Category}</span>
                )}
              </div>

              <div className="detail-meta">
                {product.Price && (
                  <div className="detail-price">{product.Price}</div>
                )}
                {product.Stock !== undefined && (
                  <div className={`detail-stock ${product.Stock === 0 ? 'out-of-stock' : product.Stock <= 5 ? 'low-stock' : 'in-stock'}`}>
                    {product.Stock === 0 ? 'Out of Stock' : 
                     product.Stock <= 5 ? `Only ${product.Stock} left` : 
                     `${product.Stock} in stock`}
                  </div>
                )}
              </div>

              {/* Specifications Table */}
              {hasSpecs && (
                <div className="detail-specs-wrap">
                  <h3>Specifications</h3>
                  <div className="detail-specs-table">
                    {Object.entries(parsedData.specs).map(([key, value]) => (
                      <div key={key} className="detail-spec-row">
                        <span className="detail-spec-label">{key}</span>
                        <span className="detail-spec-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {parsedData?.descriptionText && (
                <div className="detail-description">
                  <h3>Description</h3>
                  <p>{parsedData.descriptionText}</p>
                </div>
              )}

              {!hasSpecs && product.Description && (
                <div className="detail-description">
                  <h3>Description</h3>
                  <p>{product.Description}</p>
                </div>
              )}

              <div className="detail-actions">
                <ContactPhone />
                <button 
                  className="detail-btn detail-btn-secondary"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
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
    image: 'https://i.postimg.cc/sxsX9gJK/48f0eb5f-fc3f-4739-88a2-ade77a648e1b.png',
    link: '/products?category=hydraulic'
  },
  {
    icon: 'biomass',
    title: 'Biomass Machinery',
    body: 'Wear-resistant parts for shredding, pelletising and processing plant biomass.',
    image: 'https://i.postimg.cc/W4qhsK37/7ec259ad-79f2-4f72-844c-81da41ab3a2c.png',
    link: '/products?category=biomass'
  },
  {
    icon: 'shredder',
    title: 'Shredder Parts',
    body: 'Blades, rotors and liners hardened for high-load, continuous-duty cutting.',
    image: 'https://i.postimg.cc/wjG18H6X/4b16d519-8dde-4d8e-9a97-28b9480915ff.png',
    link: '/products?category=spare-parts'
  },
  {
    icon: 'support',
    title: 'And Beyond',
    body: 'Custom fabrication and spares for machinery that falls outside a catalogue.',
    image: 'https://i.postimg.cc/Hs3JzXRF/2bbb0603-8fd7-4c41-a045-13b86582d590.png',
    link: '/contact'
  },
];

const TRUST_STATS = [
  { value: '20+', label: 'Years in Operation', mono: 'SI-EST', icon: 'gear' },
  { value: '3', label: 'Core Product Lines', mono: 'SI-LINE', icon: 'star' },
  { value: 'Pan-India', label: 'Delivery Network', mono: 'SI-SHIP', icon: 'truck' },
  { value: '24/7', label: 'Service Support', mono: 'SI-SVC', icon: 'support' },
];

export default function Home() {
  const { data } = useData();
  const navigate = useNavigate();
  const { products = [], reviews = [], upcomingSites = [] } = data || {};
  
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Get random 6 products (prioritize featured ones first)
  const featuredProducts = products.filter(
    (p) => p.Featured === true || p.Featured === 'TRUE'
  );
  
  const nonFeaturedProducts = products.filter(
    (p) => p.Featured !== true && p.Featured !== 'TRUE'
  );

  // Combine: all featured + random from non-featured to make 6 total
  let selectedProducts = [...featuredProducts];
  if (selectedProducts.length < 6) {
    const remaining = 6 - selectedProducts.length;
    const randomNonFeatured = getRandomItems(nonFeaturedProducts, remaining);
    selectedProducts = [...selectedProducts, ...randomNonFeatured];
  } else {
    // If more than 6 featured, pick random 6 from featured
    selectedProducts = getRandomItems(featuredProducts, 6);
  }

  // Get random 3 reviews
  const randomReviews = getRandomItems(reviews, 3);

  // Handlers
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeAllModals = () => {
    setSelectedProduct(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="home-page">
      <Helmet>
        <title>Shiva Hydraulic & Biomass Industries | Sardulgarh, Mansa, Tibbi</title>
        <meta name="description" content="Leading manufacturer of hydraulic cylinders, biomass briquettes, and spare parts in Sardulgarh, Mansa, and Tibbi. Quality industrial solutions since 1990." />
        <meta name="keywords" content={siteConfig.keywords.join(', ')} />
        <link rel="canonical" href={`https://${siteConfig.domain}`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Shiva Hydraulic & Biomass Industries | Industrial Solutions in Punjab" />
        <meta property="og:description" content="Leading manufacturer of hydraulic cylinders, biomass briquettes, and spare parts in Sardulgarh, Mansa, and Tibbi." />
        <meta property="og:url" content={`https://${siteConfig.domain}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Shiva Hydraulic & Biomass Industries" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Shiva Hydraulic & Biomass Industries | Sardulgarh, Mansa, Tibbi" />
        <meta name="twitter:description" content="Leading manufacturer of hydraulic cylinders, biomass briquettes, and spare parts." />
        
        {/* Location-specific meta tags */}
        <meta name="geo.region" content="IN-PB" />
        <meta name="geo.placename" content="Sardulgarh" />
        <meta name="geo.position" content="29.6900;75.2333" />
        <meta name="ICBM" content="29.6900, 75.2333" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Shiva Hydraulic & Biomass Industries",
            "description": "Leading manufacturer of hydraulic cylinders, biomass briquettes, and spare parts in Sardulgarh, Mansa, and Tibbi.",
            "url": `https://${siteConfig.domain}`,
            "telephone": siteConfig.contact.phone1,
            "email": siteConfig.contact.email,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Sardulgarh",
              "addressRegion": "Punjab",
              "addressCountry": "India"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "29.6900",
              "longitude": "75.2333"
            },
            "areaServed": [
              {
                "@type": "City",
                "name": "Sardulgarh"
              },
              {
                "@type": "City",
                "name": "Mansa"
              },
              {
                "@type": "City",
                "name": "Tibbi"
              }
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Industrial Products",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Hydraulic Cylinders"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Biomass Briquettes"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Industrial Spare Parts"
                  }
                }
              ]
            },
            "potentialAction": {
              "@type": "OrderAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `https://${siteConfig.domain}/products`
              }
            }
          })}
        </script>
      </Helmet>

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
            <Link to="/products" className="btn btn--primary">
              View Products
            </Link>
            <Link to="/contact" className="btn btn--ghost">
              Get a Quote
            </Link>
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
            
            {/* Location-Specific Content */}
            <div className="location-tags">
              <span className="location-tag">📍 Sardulgarh</span>
              <span className="location-tag">📍 Mansa</span>
              <span className="location-tag">📍 Tibbi</span>
            </div>
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
                <div className="feature-card" onClick={() => handleNavigation(f.link)} style={{ cursor: 'pointer' }}>
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
                  <span className="feature-link">Learn More →</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS - Random 6 with Tabular Format */}
      <section className="section products">
        <div className="container">
          <Reveal className="section-head section-head--split">
            <div>
              <span className="eyebrow">Our Range</span>
              <h2 className="section-title">Parts for the plant floor.</h2>
            </div>
            <Link to="/products" className="link-arrow">
              All Products <span aria-hidden="true">&rarr;</span>
            </Link>
          </Reveal>

          {selectedProducts.length > 0 ? (
            <div className="product-grid">
              {selectedProducts.map((product, i) => {
                const parsedData = product.Description ? parseSpecs(product.Description) : null;
                const hasSpecs = parsedData && Object.keys(parsedData.specs).length > 0;
                const specsEntries = hasSpecs ? Object.entries(parsedData.specs) : [];

                return (
                  <Reveal key={product.ID || i} delay={`${i * 0.06}s`}>
                    <div className="product-card">
                      {product.Image && (
                        <div className="product-image-wrap">
                          <img src={product.Image} alt={product.Name} className="product-image" />
                          {product.Category && (
                            <span className="tag tag--orange">{product.Category}</span>
                          )}
                          {product.Featured === true && (
                            <span className="tag tag--featured">
                              <Icon name="star" className="featured-icon-small" />
                              Featured
                            </span>
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
                        
                        {/* Specifications in Tabular Format - Default View */}
                        {hasSpecs && (
                          <div className="product-specs-table">
                            {specsEntries.slice(0, 4).map(([key, value]) => (
                              <div key={key} className="product-spec-row">
                                <span className="product-spec-label">{key}</span>
                                <span className="product-spec-value">{value}</span>
                              </div>
                            ))}
                            {specsEntries.length > 4 && (
                              <div className="product-spec-more">
                                +{specsEntries.length - 4} more specs
                              </div>
                            )}
                          </div>
                        )}

                        {!hasSpecs && product.Description && (
                          <p className="product-description">{product.Description}</p>
                        )}

                        <div className="product-meta">
                          <span className="product-price">{product.Price}</span>
                          <button 
                            className="product-enquire-btn"
                            onClick={() => handleViewDetails(product)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
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

      {/* TESTIMONIALS - Random 3 */}
      {randomReviews.length > 0 && (
        <section className="section reviews">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow eyebrow--light">From the Shop Floor</span>
              <h2 className="section-title section-title--light">Trusted where it runs hard.</h2>
            </Reveal>
            <div className="reviews-grid">
              {randomReviews.map((review, i) => (
                <Reveal key={review.ID || i} delay={`${i * 0.08}s`}>
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
              <Link to="/reviews" className="link-arrow link-arrow--light">
                View All Reviews <span aria-hidden="true">&rarr;</span>
              </Link>
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
            <div className="location-badges">
              <span className="location-badge">📍 Sardulgarh</span>
              <span className="location-badge">📍 Mansa</span>
              <span className="location-badge">📍 Tibbi</span>
            </div>
          </div>
          <div className="cta-actions">
            <a href={siteConfig.contact.phoneLink1} className="btn btn--outline-light">
              <Icon name="phone" className="btn-icon" /> Call Now
            </a>
            <a href={siteConfig.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
              <Icon name="whatsapp" className="btn-icon" /> WhatsApp
            </a>
            <Link to="/contact" className="btn btn--ghost-light">
              <Icon name="message" className="btn-icon" /> Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={closeAllModals}
        />
      )}
    </div>
  );
}