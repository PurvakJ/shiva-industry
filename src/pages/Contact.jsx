import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import './Contact.css';

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
    'contact us',
    'get a quote',
    'industrial solutions'
  ],
  contact: {
    phone1: '+91 92168 00934',
    phone2: '+91 92168 00996',
    phoneLink1: 'tel:+919216800934',
    phoneLink2: 'tel:+919216800996',
    whatsappLink: 'https://wa.me/919216800934',
    email: 'shivahydraulicandbiomass@gmail.com',
    address: 'Sardulgarh, Mansa District, Punjab, India',
    hours: 'Mon-Sat: 9:00 AM - 6:00 PM'
  }
};

/* Reusing icon component */
function Icon({ name, className }) {
  const paths = {
    phone: (
      <>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </>
    ),
    email: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
    location: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    send: (
      <>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </>
    ),
    check: (
      <>
        <path d="M20 6L9 17l-5-5" />
      </>
    ),
    building: (
      <>
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="9" y1="6" x2="15" y2="6" />
        <line x1="9" y1="10" x2="15" y2="10" />
        <line x1="9" y1="14" x2="15" y2="14" />
        <line x1="9" y1="18" x2="12" y2="18" />
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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Business contact information
  const contactInfo = {
    address: 'Shiva Industries, Sardulgarh, Mansa District, Punjab, India',
    phone1: siteConfig.contact.phone1,
    phone2: siteConfig.contact.phone2,
    phoneLink1: siteConfig.contact.phoneLink1,
    phoneLink2: siteConfig.contact.phoneLink2,
    whatsappLink: siteConfig.contact.whatsappLink,
    email: siteConfig.contact.email,
    hours: siteConfig.contact.hours,
    location: 'Sardulgarh, Mansa, Punjab'
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    
    try {
      const result = await api.addQuery(formData);
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitStatus(null), 4000);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="contact-page">
      <Helmet>
        <title>Contact Us | Shiva Hydraulic & Biomass Industries | Sardulgarh, Mansa</title>
        <meta name="description" content="Contact Shiva Hydraulic & Biomass Industries for hydraulic cylinders, biomass briquettes, and industrial spare parts. Call +91 92168 00934 or email shivahydraulicandbiomass@gmail.com. Located in Sardulgarh, Mansa, Punjab." />
        <meta name="keywords" content={`contact us, get a quote, industrial solutions, ${siteConfig.keywords.join(', ')}`} />
        <link rel="canonical" href={`https://${siteConfig.domain}/contact`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Contact Us | Shiva Hydraulic & Biomass Industries" />
        <meta property="og:description" content="Contact us for hydraulic cylinders, biomass briquettes, and industrial spare parts. Call +91 92168 00934 or email shivahydraulicandbiomass@gmail.com." />
        <meta property="og:url" content={`https://${siteConfig.domain}/contact`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Shiva Hydraulic & Biomass Industries" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | Shiva Hydraulic & Biomass Industries" />
        <meta name="twitter:description" content="Contact us for hydraulic cylinders, biomass briquettes, and industrial spare parts." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Us",
            "description": "Contact Shiva Hydraulic & Biomass Industries for industrial solutions",
            "url": `https://${siteConfig.domain}/contact`,
            "about": {
              "@type": "LocalBusiness",
              "name": siteConfig.name,
              "telephone": siteConfig.contact.phone1,
              "email": siteConfig.contact.email,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Sardulgarh",
                "addressRegion": "Punjab",
                "addressCountry": "India"
              },
              "openingHours": siteConfig.contact.hours,
              "priceRange": "$$",
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
              ]
            },
            "potentialAction": {
              "@type": "ContactAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `mailto:${siteConfig.contact.email}`
              }
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-backdrop" aria-hidden="true">
          <div className="contact-hero-grid" />
        </div>
        <div className="container contact-hero-inner">
          <Reveal>
            <span className="eyebrow">Get in Touch</span>
            <h1 className="contact-hero-title">
              Let's <span className="text-accent">Connect</span>
            </h1>
            <p className="contact-hero-copy">
              Have a question about our products or need a custom solution? 
              Reach out to us — we're here to help.
            </p>
            <div className="contact-hero-phone">
              <a href={siteConfig.contact.phoneLink1} className="contact-hero-call">
                <Icon name="phone" className="contact-hero-phone-icon" />
                {siteConfig.contact.phone1}
              </a>
              <span className="contact-hero-divider">|</span>
              <a href={siteConfig.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="contact-hero-whatsapp">
                <Icon name="whatsapp" className="contact-hero-whatsapp-icon" />
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section contact-main">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information */}
            <Reveal className="contact-info">
              <div className="contact-info-header">
                <Icon name="building" className="info-header-icon" />
                <h2>Contact Information</h2>
                <p>Reach out to us through any of these channels</p>
              </div>

              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon-wrap">
                    <Icon name="location" className="info-icon" />
                  </div>
                  <div className="info-content">
                    <strong>Address</strong>
                    <p>{contactInfo.address}</p>
                    <p className="info-sub">Sardulgarh, Mansa District</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon-wrap">
                    <Icon name="phone" className="info-icon" />
                  </div>
                  <div className="info-content">
                    <strong>Phone</strong>
                    <p>
                      <a href={siteConfig.contact.phoneLink1}>
                        {siteConfig.contact.phone1}
                      </a>
                    </p>
                    <p>
                      <a href={siteConfig.contact.phoneLink2}>
                        {siteConfig.contact.phone2}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon-wrap">
                    <Icon name="email" className="info-icon" />
                  </div>
                  <div className="info-content">
                    <strong>Email</strong>
                    <p>
                      <a href={`mailto:${siteConfig.contact.email}`}>
                        {siteConfig.contact.email}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon-wrap">
                    <Icon name="clock" className="info-icon" />
                  </div>
                  <div className="info-content">
                    <strong>Working Hours</strong>
                    <p>{siteConfig.contact.hours}</p>
                    <p className="info-sub">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Quick Contact Buttons */}
              <div className="quick-contact">
                <a href={siteConfig.contact.phoneLink1} className="quick-btn">
                  <Icon name="phone" className="quick-icon" />
                  Call Now
                </a>
                <a href={siteConfig.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="quick-btn whatsapp-btn">
                  <Icon name="whatsapp" className="quick-icon" />
                  WhatsApp
                </a>
                <a href={`mailto:${siteConfig.contact.email}`} className="quick-btn email-btn">
                  <Icon name="email" className="quick-icon" />
                  Email Us
                </a>
              </div>

              {/* Location Tags */}
              <div className="location-tags">
                <span className="location-tag">📍 Sardulgarh</span>
                <span className="location-tag">📍 Mansa</span>
                <span className="location-tag">📍 Tibbi</span>
              </div>

              {/* Business Profiles */}
              <div className="business-profiles">
                <h4>Find us on</h4>
                <div className="profile-links">
                  <a 
                    href="https://www.indiamart.com/shivaindustries-sardulgarh/profile.html?srsltid=AfmBOoq0Bz51w8fS7dUtwD_Z2fV49dorBbky1gyyG0T47Ztad9gpFQMH" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="profile-link indiamart"
                  >
                    <span className="profile-link-text">IndiaMART</span>
                  </a>
                  <a 
                    href="https://www.justdial.com/Mansa/Shiva-Industries/9999P1652-1652-140221093516-F6I5_BZDET" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="profile-link justdial"
                  >
                    <span className="profile-link-text">Justdial</span>
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Contact Form */}
            <Reveal className="contact-form-wrapper" delay="0.1s">
              <div className="contact-form-card">
                <h2>Send Us a Message</h2>
                <p>Fill in the form below and we'll get back to you within 24 hours.</p>
                
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className={submitStatus === 'submitting' ? 'disabled' : ''}
                        disabled={submitStatus === 'submitting'}
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
                        placeholder="Enter your email"
                        className={submitStatus === 'submitting' ? 'disabled' : ''}
                        disabled={submitStatus === 'submitting'}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className={submitStatus === 'submitting' ? 'disabled' : ''}
                        disabled={submitStatus === 'submitting'}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What's this about?"
                        className={submitStatus === 'submitting' ? 'disabled' : ''}
                        disabled={submitStatus === 'submitting'}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us how we can help you with hydraulic, biomass, or industrial solutions..."
                      className={submitStatus === 'submitting' ? 'disabled' : ''}
                      disabled={submitStatus === 'submitting'}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn" 
                    disabled={submitStatus === 'submitting'}
                  >
                    {submitStatus === 'submitting' ? (
                      <>
                        <span className="spinner" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Icon name="send" className="submit-icon" />
                        Send Message
                      </>
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <div className="status-message success">
                      <Icon name="check" className="status-icon" />
                      <span>Thank you! Your message has been sent successfully.</span>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="status-message error">
                      <span>Failed to send message. Please try again or contact us directly.</span>
                    </div>
                  )}
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section contact-map">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <span className="eyebrow">Visit Us</span>
            <h2 className="section-title">
              Find Us <span className="text-accent">On The Map</span>
            </h2>
            <p className="section-subtitle">
              Visit our facility in Sardulgarh, Mansa — we'd love to show you our workshop.
            </p>
          </Reveal>

          <Reveal className="map-container">
            <div className="map-wrapper">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3464.83365750987!2d75.26032!3d29.724577299999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39113f39c019472f%3A0x1bb17a9e1a8a2e7b!2sShiva%20Industries!5e0!3m2!1sen!2sin!4v1784168519770!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Shiva Industries Location Map - Sardulgarh, Mansa"
                onLoad={() => setMapLoaded(true)}
                className={mapLoaded ? 'map-loaded' : 'map-loading'}
              />
              <div className="map-overlay">
                <div className="map-pin">
                  <Icon name="location" className="map-pin-icon" />
                  <span>Shiva Industries</span>
                </div>
                <div className="map-location-details">
                  <span>Sardulgarh, Mansa</span>
                  <span>Punjab, India</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact-cta">
        <div className="cta-hazard" aria-hidden="true" />
        <div className="container cta-inner">
          <Reveal>
            <span className="eyebrow eyebrow--onDark">Ready to Work Together?</span>
            <h3 className="cta-title">Let's Build Something Great</h3>
            <p className="cta-copy">
              From custom components to complete systems — we're here to bring your vision to life.
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
                Explore Products
              </Link>
              <Link to="/gallery" className="btn btn--outline-light">
                View Our Work
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}