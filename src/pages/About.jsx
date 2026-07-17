import { useData } from '../context/DataContext';
import { useEffect, useRef, useState } from 'react';
import './About.css';

/* Reusing the icon component from Home */
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

const STATS = [
  { value: '20+', label: 'Years of Excellence', icon: 'award' },
  { value: '500+', label: 'Projects Completed', icon: 'gear' },
  { value: '100+', label: 'Happy Clients', icon: 'handshake' },
  { value: '15+', label: 'Team Members', icon: 'support' },
];

const CORE_VALUES = [
  {
    icon: 'shield',
    title: 'Quality First',
    description: 'Every component is load-tested and precision machined to exceed industry standards.',
  },
  {
    icon: 'target',
    title: 'Innovation Driven',
    description: 'We continuously evolve our processes to deliver cutting-edge solutions.',
  },
  {
    icon: 'leaf',
    title: 'Sustainable Practices',
    description: 'Committed to eco-friendly manufacturing and sustainable industrial solutions.',
  },
  {
    icon: 'handshake',
    title: 'Client Partnership',
    description: 'We work alongside our clients, understanding their unique challenges and needs.',
  },
];


const MILESTONES = [
  { year: '2000', title: 'Foundation', description: 'Started operations with a focus on hydraulic systems.' },
  { year: '2005', title: 'Expansion', description: 'Expanded into biomass machinery and shredder parts.' },
  { year: '2010', title: 'New Facility', description: 'Opened state-of-the-art manufacturing facility.' },
  { year: '2015', title: 'Innovation', description: 'Launched custom fabrication services.' },
  { year: '2020', title: 'Digital Transformation', description: 'Integrated modern technology and processes.' },
];

export default function About() {
  const { data } = useData();
  const { reviews = [] } = data || {};
  const featuredReviews = reviews.slice(0, 2);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-backdrop" aria-hidden="true">
          <div className="about-hero-grid" />
        </div>
        <div className="container about-hero-inner">
          <Reveal>
            <span className="eyebrow">About Shiva Industry</span>
            <h1 className="about-hero-title">
              Engineering <span className="text-accent">Industrial Solutions</span> Since 2000
            </h1>
            <p className="about-hero-copy">
              We're not just a parts manufacturer — we're the backbone of heavy industry, 
              keeping machines running across India with precision-engineered components 
              that stand the test of time and load.
            </p>
          </Reveal>
        </div>

        {/* Stats Section */}
        <div className="about-stats-row">
          {STATS.map((stat, index) => (
            <div className="about-stat" key={stat.label}>
              <Icon name={stat.icon} className="about-stat-icon" />
              <span className="about-stat-value">{stat.value}</span>
              <span className="about-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="section about-story">
        <div className="container">
          <div className="about-story-grid">
            <Reveal className="about-story-content">
              <span className="eyebrow">Our Journey</span>
              <h2 className="section-title">
                Built on a <span className="text-accent">legacy</span> of precision
              </h2>
              <p>
                Shiva Industry was founded in 2000 with a simple mission: build industrial 
                components that don't just work — they outlast. What started as a small 
                workshop in the heart of India's industrial belt has grown into a trusted 
                name in hydraulic systems, biomass machinery, and shredder parts.
              </p>
              <p>
                Today, we serve clients across the nation, delivering precision-engineered 
                solutions that power heavy industry. Our commitment to quality, innovation, 
                and client satisfaction remains at the core of everything we do.
              </p>
              <div className="about-story-highlights">
                <div className="highlight-item">
                  <Icon name="shield" className="highlight-icon" />
                  <span>ISO Certified Quality</span>
                </div>
                <div className="highlight-item">
                  <Icon name="gauge" className="highlight-icon" />
                  <span>Precision Engineering</span>
                </div>
                <div className="highlight-item">
                  <Icon name="truck" className="highlight-icon" />
                  <span>Pan-India Delivery</span>
                </div>
              </div>
            </Reveal>
            <Reveal className="about-story-image" delay="0.1s">
              <div className="about-story-image-placeholder">
                <div className="about-story-year-badge">Since 2000</div>
                <Icon name="gear" className="about-story-gear" />
                <div className="about-story-image-overlay">
                  <span className="about-story-tag">Manufacturing Excellence</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section about-values">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <span className="eyebrow">What Drives Us</span>
            <h2 className="section-title">
              Our <span className="text-accent">Core Values</span>
            </h2>
            <p className="section-subtitle">
              These principles guide everything we do, from the shop floor to the client's doorstep.
            </p>
          </Reveal>
          <div className="values-grid">
            {CORE_VALUES.map((value, index) => (
              <Reveal key={value.title} delay={`${index * 0.08}s`}>
                <div className="value-card">
                  <div className="value-icon-wrap">
                    <Icon name={value.icon} className="value-icon" />
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section about-milestones">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <span className="eyebrow">Our Journey</span>
            <h2 className="section-title">Key <span className="text-accent">Milestones</span></h2>
          </Reveal>
          <div className="milestones-timeline">
            {MILESTONES.map((milestone, index) => (
              <Reveal key={milestone.year} delay={`${index * 0.06}s`}>
                <div
                  className={`milestone-item ${
                  index % 2 === 0 ? "milestone-left" : "milestone-right"
                    }`}
                >
                  <div className="milestone-year">{milestone.year}</div>
                  <div className="milestone-content">
                    <h3>{milestone.title}</h3>
                    <p>{milestone.description}</p>
                  </div>
                  {index < MILESTONES.length - 1 && (
                    <div className="milestone-line" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials */}
      {featuredReviews.length > 0 && (
        <section className="section about-testimonials">
          <div className="container">
            <Reveal className="section-head section-head--center">
              <span className="eyebrow">Client Voices</span>
              <h2 className="section-title">What Our <span className="text-accent">Clients Say</span></h2>
            </Reveal>
            <div className="about-reviews-grid">
              {featuredReviews.map((review, index) => (
                <Reveal key={review.ID} delay={`${index * 0.08}s`}>
                  <div className="about-review-card">
                    <div className="review-rating">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx} className={idx < review.Rating ? 'star star--on' : 'star'}>
                          &#9733;
                        </span>
                      ))}
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
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="about-cta">
        <div className="about-cta-hazard" aria-hidden="true" />
        <div className="container about-cta-inner">
          <Reveal>
            <span className="eyebrow eyebrow--onDark">Let's Build Together</span>
            <h2 className="about-cta-title">
              Ready to <span className="text-accent">engineer</span> your solution?
            </h2>
            <p className="about-cta-copy">
              Whether you need a single component or a complete system, we're here to help.
            </p>
            <div className="about-cta-actions">
              <a href="/contact" className="btn btn--primary">
                Get in Touch
              </a>
              <a href="/products" className="btn btn--outline-light">
                Explore Products
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}