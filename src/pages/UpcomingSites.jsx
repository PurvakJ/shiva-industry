import { Helmet } from 'react-helmet-async';
import { useData } from '../context/DataContext';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './UpcomingSites.css';

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
    'upcoming sites',
    'new locations',
    'expansion roadmap'
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

/* Reusing the Icon component */
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
    location: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" fill="currentColor" stroke="none" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <circle cx="12" cy="14" r="1.5" fill="currentColor" stroke="none" />
      </>
    ),
    map: (
      <>
        <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
        <path d="M8 2v16" />
        <path d="M16 6v16" />
        <circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="16" cy="14" r="1.5" fill="currentColor" stroke="none" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </>
    ),
    rocket: (
      <>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
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

export default function UpcomingSites() {
  const { data } = useData();
  const { upcomingSites = [] } = data || {};
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifyStatus, setNotifyStatus] = useState({});

  // Get unique site types
  const siteTypes = ['all', ...new Set(upcomingSites.map(site => site.Type || site.Category || 'General').filter(Boolean))];

  // Filter sites
  const filteredSites = selectedFilter === 'all'
    ? upcomingSites
    : upcomingSites.filter(site => (site.Type || site.Category || 'General') === selectedFilter);

  // Sort by launch date
  const sortedSites = [...filteredSites].sort((a, b) => {
    const dateA = new Date(a.LaunchDate || a.launchDate || '2099-12-31');
    const dateB = new Date(b.LaunchDate || b.launchDate || '2099-12-31');
    return dateA - dateB;
  });

  // Get filter count
  const getTypeCount = (type) => {
    if (type === 'all') return upcomingSites.length;
    return upcomingSites.filter(site => (site.Type || site.Category || 'General') === type).length;
  };

  // Format site data
  const formatSite = (site) => ({
    id: site.ID || site.id || Math.random(),
    name: site.Name || site.name || 'Unnamed Site',
    description: site.Description || 'Coming soon',
    image: site.Image || null,
    location: site.Location || null,
    type: site.Type || site.Category || 'General',
    launchDate: site.LaunchDate || site.launchDate || 'TBD',
    status: site.Status || 'Upcoming'
  });

  const sites = sortedSites.map(formatSite);
  const hasData = sites.length > 0;

  // Calculate days until launch
  const getDaysUntil = (date) => {
    if (!date || date === 'TBD') return null;
    const launch = new Date(date);
    const now = new Date();
    const diffTime = launch - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get badge info
  const getBadgeInfo = (date) => {
    const days = getDaysUntil(date);
    if (days === null) return { label: 'Upcoming', className: 'upcoming' };
    if (days <= 0) return { label: 'Now Open', className: 'open' };
    if (days <= 30) return { label: 'Coming Soon', className: 'soon' };
    return { label: 'Upcoming', className: 'upcoming' };
  };

  // Handle notify click
  const handleNotify = (siteId, siteName) => {
    setNotifyStatus(prev => ({
      ...prev,
      [siteId]: 'notified'
    }));
    
    // Open WhatsApp with pre-filled message
    const message = `Hi Shiva Industries, I want to get notified about the upcoming site: ${siteName}. Please keep me updated.`;
    const whatsappUrl = `https://wa.me/919216800934?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Handle location click
  const handleLocation = (location) => {
    if (location) {
      const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
      window.open(mapsUrl, '_blank');
    }
  };

  // Stats
  const stats = {
    total: sites.length,
    types: siteTypes.length - 1,
    soonCount: sites.filter(s => {
      const days = getDaysUntil(s.launchDate);
      return days !== null && days <= 30 && days > 0;
    }).length
  };

  return (
    <div className="upcoming-sites-page">
      <Helmet>
        <title>Upcoming Sites & Locations | Shiva Hydraulic & Biomass Industries</title>
        <meta name="description" content="Discover upcoming sites and new locations of Shiva Hydraulic & Biomass Industries. Expanding our reach in Sardulgarh, Mansa, Tibbi, and across India." />
        <meta name="keywords" content={`upcoming sites, new locations, expansion roadmap, ${siteConfig.keywords.join(', ')}`} />
        <link rel="canonical" href={`https://${siteConfig.domain}/upcoming-sites`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Upcoming Sites & Locations | Shiva Hydraulic & Biomass Industries" />
        <meta property="og:description" content="Discover upcoming sites and new locations of Shiva Hydraulic & Biomass Industries. Expanding our reach in Sardulgarh, Mansa, Tibbi, and across India." />
        <meta property="og:url" content={`https://${siteConfig.domain}/upcoming-sites`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Shiva Hydraulic & Biomass Industries" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Upcoming Sites & Locations | Shiva Industries" />
        <meta name="twitter:description" content="Discover upcoming sites and new locations of Shiva Hydraulic & Biomass Industries." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Upcoming Sites & Locations",
            "description": "Discover upcoming sites and new locations of Shiva Hydraulic & Biomass Industries.",
            "url": `https://${siteConfig.domain}/upcoming-sites`,
            "about": {
              "@type": "LocalBusiness",
              "name": "Shiva Hydraulic & Biomass Industries",
              "telephone": siteConfig.contact.phone1,
              "email": siteConfig.contact.email,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Sardulgarh",
                "addressRegion": "Punjab",
                "addressCountry": "India"
              }
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="us-hero">
        <div className="us-hero-backdrop" aria-hidden="true">
          <div className="us-hero-grid" />
        </div>
        <div className="container us-hero-inner">
          <Reveal>
            <span className="eyebrow">Expanding Reach</span>
            <h1 className="us-hero-title">
              <span className="text-accent">Upcoming</span> Sites
            </h1>
            <p className="us-hero-copy">
              {hasData 
                ? "Discover new locations where you can access our products, services, and expertise"
                : "We're expanding our reach to serve you better with industrial solutions"}
            </p>
            <div className="us-hero-contact">
              <a href={siteConfig.contact.phoneLink1} className="us-hero-phone">
                <Icon name="phone" className="us-hero-phone-icon" />
                {siteConfig.contact.phone1}
              </a>
              <span className="us-hero-divider">|</span>
              <a href={siteConfig.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="us-hero-whatsapp">
                <Icon name="whatsapp" className="us-hero-whatsapp-icon" />
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>

        {/* Stats Section */}
        {hasData && (
          <div className="us-stats-row">
            <div className="us-stat">
              <Icon name="location" className="us-stat-icon" />
              <span className="us-stat-value">{stats.total}</span>
              <span className="us-stat-label">New Sites</span>
            </div>
            <div className="us-stat">
              <Icon name="map" className="us-stat-icon" />
              <span className="us-stat-value">{stats.types}</span>
              <span className="us-stat-label">Site Types</span>
            </div>
            <div className="us-stat">
              <Icon name="clock" className="us-stat-icon" />
              <span className="us-stat-value">{stats.soonCount}</span>
              <span className="us-stat-label">Opening Soon</span>
            </div>
          </div>
        )}
      </section>

      {/* Sites Section */}
      <section className="section us-sites">
        <div className="container">
          {hasData ? (
            <>
              <Reveal className="section-head">
                <span className="eyebrow">Our Locations</span>
                <h2 className="section-title">
                  Expansion <span className="text-accent">Roadmap</span>
                </h2>
                <p className="section-subtitle">
                  Explore our upcoming sites and be the first to know when we arrive in your area
                </p>
              </Reveal>

              {/* Filters */}
              <Reveal>
                <div className="us-filters">
                  <div className="us-filter-buttons">
                    {siteTypes.map(type => (
                      <button
                        key={type}
                        className={`us-filter-btn ${selectedFilter === type ? 'active' : ''}`}
                        onClick={() => setSelectedFilter(type)}
                      >
                        {type === 'all' ? 'All Sites' : type}
                        <span className="us-filter-count">{getTypeCount(type)}</span>
                      </button>
                    ))}
                  </div>
                  <div className="us-result-count">
                    <Icon name="map" className="us-result-icon" />
                    <span>{sites.length} {sites.length === 1 ? 'Site' : 'Sites'}</span>
                  </div>
                </div>
              </Reveal>

              {/* Sites Grid */}
              <div className="us-sites-grid">
                {sites.map((site, index) => {
                  const daysUntil = getDaysUntil(site.launchDate);
                  const badge = getBadgeInfo(site.launchDate);

                  return (
                    <Reveal key={site.id} delay={`${index * 0.06}s`}>
                      <div className="us-site-card">
                        <div className="us-card-image">
                          {site.image ? (
                            <img src={site.image} alt={site.name} loading="lazy" />
                          ) : (
                            <div className="us-card-placeholder">
                              <Icon name="location" className="us-placeholder-icon" />
                            </div>
                          )}
                          <span className={`us-badge us-badge--${badge.className}`}>
                            {badge.label}
                          </span>
                          <span className="us-card-type">{site.type}</span>
                        </div>

                        <div className="us-card-content">
                          <h3>{site.name}</h3>
                          {site.location && (
                            <div className="us-card-location">
                              <Icon name="map" className="us-location-icon" />
                              <span>{site.location}</span>
                            </div>
                          )}
                          <p className="us-card-description">{site.description}</p>

                          <div className="us-card-meta">
                            <div className="us-meta-item">
                              <Icon name="calendar" className="us-meta-icon" />
                              <div>
                                <span className="us-meta-label">Launch Date</span>
                                <span className="us-meta-value">{site.launchDate}</span>
                              </div>
                            </div>
                            {daysUntil !== null && daysUntil > 0 && (
                              <div className="us-meta-item">
                                <Icon name="clock" className="us-meta-icon" />
                                <div>
                                  <span className="us-meta-label">Days Until Launch</span>
                                  <span className="us-meta-value us-countdown">{daysUntil}</span>
                                </div>
                              </div>
                            )}
                            {daysUntil !== null && daysUntil <= 0 && (
                              <div className="us-meta-item">
                                <Icon name="star" className="us-meta-icon" />
                                <div>
                                  <span className="us-meta-label">Status</span>
                                  <span className="us-meta-value us-status-open">Open Now</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="us-card-actions">
                            <button 
                              className="us-btn us-btn--notify"
                              onClick={() => handleNotify(site.id, site.name)}
                              disabled={notifyStatus[site.id] === 'notified'}
                            >
                              <Icon name="handshake" className="us-btn-icon" />
                              {notifyStatus[site.id] === 'notified' ? 'Notified!' : 'Notify Me'}
                            </button>
                            <button 
                              className="us-btn us-btn--location"
                              onClick={() => handleLocation(site.location)}
                            >
                              <Icon name="map" className="us-btn-icon" />
                              View Location
                            </button>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </>
          ) : (
            <Reveal>
              <div className="us-empty-state">
                <div className="us-empty-icon">
                  <Icon name="rocket" className="us-empty-rocket" />
                </div>
                <h3>Expanding to New Locations</h3>
                <p>We're always looking to serve more industries and regions.</p>
                <p className="us-empty-subtext">Subscribe to get notified when we launch in your area.</p>
                <div className="us-empty-actions">
                  <Link to="/contact" className="btn btn--primary">
                    <Icon name="handshake" className="btn-icon" />
                    Get Notified
                  </Link>
                  <Link to="/products" className="btn btn--outline">
                    Browse Products
                  </Link>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Map Section */}
      {hasData && (
        <section className="section us-map-section">
          <div className="container">
            <Reveal className="section-head section-head--center">
              <span className="eyebrow eyebrow--light">Visual Guide</span>
              <h2 className="section-title section-title--light">
                Expansion <span className="text-accent">Map</span>
              </h2>
              <p className="section-subtitle" style={{ color: 'var(--silver)' }}>
                See where we're opening new locations across the region
              </p>
            </Reveal>
            
            <Reveal>
              <div className="us-map-container">
                <div className="us-map-grid" />
                {sites.slice(0, 8).map((site, index) => (
                  <div 
                    key={site.id}
                    className="us-map-marker"
                    style={{
                      top: `${15 + (index * 10) % 70}%`,
                      left: `${10 + (index * 11) % 80}%`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  >
                    <div className="us-marker-dot" />
                    <span className="us-marker-label">{site.name}</span>
                  </div>
                ))}
                <div className="us-map-legend">
                  <div className="us-legend-item">
                    <span className="us-legend-dot" />
                    <span>Upcoming Sites</span>
                  </div>
                  <div className="us-legend-item">
                    <span className="us-legend-dot us-legend-dot--soon" />
                    <span>Opening Within 30 Days</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="us-cta">
        <div className="us-cta-pattern" aria-hidden="true" />
        <div className="container us-cta-inner">
          <Reveal>
            <span className="eyebrow eyebrow--onDark">Grow With Us</span>
            <h2 className="us-cta-title">
              Let's <span className="text-accent">Grow</span> Together
            </h2>
            <p className="us-cta-copy">
              Interested in having Shiva Industry in your area? Let's discuss partnership opportunities.
            </p>
            <div className="us-cta-contact-info">
              <div className="us-cta-phone">
                <Icon name="phone" className="us-cta-icon" />
                <div>
                  <span>Call us at</span>
                  <a href={siteConfig.contact.phoneLink1} className="us-cta-number">
                    {siteConfig.contact.phone1}
                  </a>
                </div>
              </div>
              <div className="us-cta-divider" />
              <div className="us-cta-email">
                <Icon name="message" className="us-cta-icon" />
                <div>
                  <span>Email us at</span>
                  <a href={`mailto:${siteConfig.contact.email}`} className="us-cta-email-link">
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>
            </div>
            <div className="us-cta-actions">
              <Link to="/contact" className="btn btn--primary">
                <Icon name="handshake" className="btn-icon" />
                Contact Us
              </Link>
              <Link to="/products" className="btn btn--outline-light">
                Explore Products
              </Link>
              <a href={siteConfig.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp">
                <Icon name="whatsapp" className="btn-icon" />
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}