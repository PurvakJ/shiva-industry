import { useData } from '../context/DataContext';
import { useEffect, useRef, useState } from 'react';
import './ComingSoon.css';

/* Reusing the Icon component from About */
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
    award: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l3 2" />
        <path d="M8 18l1.5-3" />
        <path d="M16 18l-1.5-3" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
      </>
    ),
    leaf: (
      <>
        <path d="M12 21c-1.5-2-4-5.5-4-9a4 4 0 0 1 8 0c0 3.5-2.5 7-4 9Z" />
        <path d="M12 3v3" />
        <path d="M8 8l-2-2" />
        <path d="M16 8l2-2" />
      </>
    ),
    handshake: (
      <>
        <path d="M17 12v-3a3 3 0 0 0-6 0v3" />
        <path d="M17 12v2a3 3 0 0 1-6 0v-2" />
        <path d="M11 12h6" />
        <path d="M8 12h3" />
        <path d="M4 12h2" />
        <path d="M18 12h2" />
      </>
    ),
    // Additional icons for Coming Soon page
    rocket: (
      <>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </>
    ),
    cube: (
      <>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M12 22V12" />
        <path d="M3.3 7L12 12l8.7-5" />
      </>
    ),
    bulb: (
      <>
        <path d="M9 18h6" />
        <path d="M10 21h4" />
        <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.3 4.7 3.3 6H12" />
        <path d="M12 15v-3" />
        <circle cx="12" cy="9" r="2" fill="currentColor" stroke="none" />
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

/* Scroll-reveal hook (same as About page) */
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

/* Status Configuration */
const STATUS_CONFIG = {
  'In Development': { color: '#f07a3a', label: 'In Development' },
  'Prototype Testing': { color: '#e0611c', label: 'Prototype' },
  'Design Phase': { color: '#b94e15', label: 'Design Phase' },
  'R&D Stage': { color: '#8a3d10', label: 'R&D' },
  'Planning': { color: '#f0a97a', label: 'Planning' },
  'Testing': { color: '#d97a2a', label: 'Testing' },
  'Production': { color: '#b94e15', label: 'Production' },
  'Available Soon': { color: '#e0611c', label: 'Available Soon' },
  'In Progress': { color: '#f07a3a', label: 'In Progress' },
  'Pre-Launch': { color: '#e0611c', label: 'Pre-Launch' }
};

/* Process Steps Data */
const PROCESS_STEPS = [
  {
    icon: 'bulb',
    title: 'Research & Design',
    description: 'Understanding market needs and engineering innovative solutions',
  },
  {
    icon: 'cube',
    title: 'Prototyping',
    description: 'Building and testing initial prototypes with precision',
  },
  {
    icon: 'shield',
    title: 'Testing & Validation',
    description: 'Rigorous quality and performance testing',
  },
  {
    icon: 'gear',
    title: 'Production',
    description: 'Full-scale manufacturing and quality control',
  },
];

export default function ComingSoon() {
  const { data } = useData();
  const { comingSoonProducts = [], upcomingSites = [] } = data || {};

  // Combine both data sources
  const allItems = [...comingSoonProducts, ...upcomingSites];
  const hasData = allItems.length > 0;

  // Format item for display
  const formatItem = (item) => {
    const isProduct = item.ID && item.Name;
    return {
      id: item.ID || item.id || Math.random(),
      name: isProduct ? item.Name : (item.SiteName || item.Name || 'Unnamed'),
      description: item.Description || 'Coming soon',
      image: item.Image || null,
      date: isProduct ? (item.ExpectedDate || item.LaunchDate || 'Coming Soon') : (item.LaunchDate || item.ExpectedDate || 'Coming Soon'),
      category: isProduct ? (item.Category || 'General') : (item.Type || item.Category || 'New Site'),
      status: isProduct ? (item.Status || 'In Development') : (item.Status || 'Planning')
    };
  };

  const items = hasData ? allItems.map(formatItem) : [];

  // Stats
  const stats = {
    total: items.length,
    year: new Date().getFullYear() + 1,
    categories: new Set(items.map(i => i.category)).size
  };

  return (
    <div className="coming-soon-page">
      {/* Hero Section */}
      <section className="cs-hero">
        <div className="cs-hero-backdrop" aria-hidden="true">
          <div className="cs-hero-grid" />
        </div>
        <div className="container cs-hero-inner">
          <Reveal>
            <span className="eyebrow">Innovation Pipeline</span>
            <h1 className="cs-hero-title">
              Coming <span className="text-accent">Soon</span>
            </h1>
            <p className="cs-hero-copy">
              {hasData 
                ? "Cutting-edge solutions currently in development — engineered to solve tomorrow's industrial challenges"
                : "We're developing new products and innovations to power your industry"}
            </p>
          </Reveal>
        </div>

        {/* Stats Section */}
        {hasData && (
          <div className="cs-stats-row">
            <div className="cs-stat">
              <Icon name="cube" className="cs-stat-icon" />
              <span className="cs-stat-value">{stats.total}</span>
              <span className="cs-stat-label">Products</span>
            </div>
            <div className="cs-stat">
              <Icon name="clock" className="cs-stat-icon" />
              <span className="cs-stat-value">{stats.year}</span>
              <span className="cs-stat-label">Launch Year</span>
            </div>
            <div className="cs-stat">
              <Icon name="rocket" className="cs-stat-icon" />
              <span className="cs-stat-value">{stats.categories}</span>
              <span className="cs-stat-label">Categories</span>
            </div>
          </div>
        )}
      </section>

      {/* Products Grid */}
      <section className="section cs-products">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <span className="eyebrow">What's Next</span>
            <h2 className="section-title">
              {hasData ? 'Upcoming ' : ''}<span className="text-accent">Innovations</span>
            </h2>
            <p className="section-subtitle">
              {hasData 
                ? "Solutions engineered to solve tomorrow's industrial challenges"
                : "Exciting new products in development — stay tuned for updates"}
            </p>
          </Reveal>

          {hasData ? (
            <div className="cs-product-grid">
              {items.map((item, index) => (
                <Reveal key={item.id} delay={`${index * 0.06}s`}>
                  <div className="cs-product-card">
                    <div className="cs-card-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} loading="lazy" />
                      ) : (
                        <div className="cs-card-placeholder">
                          <Icon name="cube" className="cs-placeholder-icon" />
                        </div>
                      )}
                      <div className="cs-card-badges">
                        <span className="badge badge--coming">Coming Soon</span>
                        <span 
                          className="badge badge--status"
                          style={{ 
                            backgroundColor: STATUS_CONFIG[item.status]?.color || '#e0611c'
                          }}
                        >
                          {STATUS_CONFIG[item.status]?.label || item.status}
                        </span>
                      </div>
                      <span className="cs-card-category">{item.category}</span>
                    </div>
                    
                    <div className="cs-card-content">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <div className="cs-card-meta">
                        <Icon name="clock" className="cs-meta-icon" />
                        <span>{item.date}</span>
                      </div>
                      <button className="cs-notify-btn">
                        <Icon name="handshake" className="cs-btn-icon" />
                        Notify Me
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="cs-empty-state">
                <div className="cs-empty-icon">
                  <Icon name="rocket" className="cs-empty-rocket" />
                </div>
                <h3>Exciting Things Are Cooking!</h3>
                <p>We're currently developing new products and solutions.</p>
                <p className="cs-empty-subtext">Check back soon for updates on our latest innovations.</p>
                <div className="cs-empty-actions">
                  <a href="/contact" className="btn btn--primary">
                    <Icon name="handshake" className="btn-icon" />
                    Get Notified
                  </a>
                  <a href="/products" className="btn btn--outline">
                    Browse Products
                  </a>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="section cs-process">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <span className="eyebrow eyebrow--light">Our Process</span>
            <h2 className="section-title section-title--light">
              From Concept to <span className="text-accent">Reality</span>
            </h2>
          </Reveal>
          <div className="cs-process-grid">
            {PROCESS_STEPS.map((step, index) => (
              <Reveal key={step.title} delay={`${index * 0.08}s`}>
                <div className="cs-process-step">
                  <div className="cs-step-icon-wrap">
                    <Icon name={step.icon} className="cs-step-icon" />
                  </div>
                  <span className="cs-step-number">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cs-cta">
        <div className="cs-cta-pattern" aria-hidden="true" />
        <div className="container cs-cta-inner">
          <Reveal>
            <span className="eyebrow eyebrow--onDark">Stay Ahead</span>
            <h2 className="cs-cta-title">
              Be the <span className="text-accent">First</span> to Know
            </h2>
            <p className="cs-cta-copy">
              Subscribe to get updates on our latest products, innovations, and industry insights.
            </p>
            <div className="cs-cta-actions">
              <a href="/contact" className="btn btn--primary">
                <Icon name="star" className="btn-icon" />
                Subscribe Now
              </a>
              <a href="/products" className="btn btn--outline-light">
                View Products
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}