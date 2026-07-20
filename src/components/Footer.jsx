import './Footer.css';

/* Icon component for footer */
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
    facebook: (
      <>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </>
    ),
    instagram: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
    linkedin: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
    youtube: (
      <>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </>
    ),
    twitter: (
      <>
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
      </>
    ),
    arrow: (
      <>
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
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

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Business contact information
  const contactInfo = {
    address: 'Shiva Industries, Sardulgarh, Mansa District, Punjab, India',
    phone1: '+91 92168 00934',
    phone2: '+91 92168 00996',
    phoneLink1: 'tel:+919216800934',
    phoneLink2: 'tel:+919216800996',
    whatsappLink: 'https://wa.me/919216800934',
    email: 'shivahydraulicandbiomass@gmail.com',
    emailLink: 'mailto:shivahydraulicandbiomass@gmail.com',
    hours: 'Mon-Sat: 9:00 AM - 6:00 PM',
    locations: ['Sardulgarh', 'Mansa', 'Tibbi'],
    // Business profile links
    indiamart: 'https://www.indiamart.com/shivaindustries-sardulgarh/profile.html?srsltid=AfmBOoq0Bz51w8fS7dUtwD_Z2fV49dorBbky1gyyG0T47Ztad9gpFQMH',
    justdial: 'https://www.justdial.com/Mansa/Shiva-Industries/9999P1652-1652-140221093516-F6I5_BZDET'
  };

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/products', label: 'Products' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/upcoming-sites', label: 'Upcoming Sites' },
    { path: '/coming-soon', label: 'Coming Soon' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/contact', label: 'Contact' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-container">
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="footer-logo-text">
                <span className="logo-brand">Shiva</span>
                <span className="logo-industry">Hydraulic & Biomass</span>
                <span className="logo-tagline">Industries</span>
              </div>
            </div>
            <p className="footer-description">
              For over two decades, we've been manufacturing hydraulic systems, 
              biomass machinery parts and shredder components for plants that 
              can't afford downtime.
            </p>
            <div className="footer-locations">
              <span className="location-tag">📍 Sardulgarh</span>
              <span className="location-tag">📍 Mansa</span>
              <span className="location-tag">📍 Tibbi</span>
            </div>
            <div className="footer-tagline">
              <span className="tagline-text">Engineered to Outlast.</span>
            </div>
            <button className="scroll-top-btn" onClick={scrollToTop} aria-label="Scroll to top">
              <Icon name="arrow" className="scroll-icon" />
            </button>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <a href={link.path} className="footer-link">
                    <span className="link-dot" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-heading">Contact Us</h3>
            <div className="contact-item">
              <Icon name="location" className="contact-icon" />
              <div>
                <span className="contact-label">Address</span>
                <p className="contact-value">{contactInfo.address}</p>
              </div>
            </div>
            <div className="contact-item">
              <Icon name="phone" className="contact-icon" />
              <div>
                <span className="contact-label">Phone</span>
                <a href={contactInfo.phoneLink1} className="contact-value phone-link">
                  {contactInfo.phone1}
                </a>
                <br />
                <a href={contactInfo.phoneLink2} className="contact-value phone-link">
                  {contactInfo.phone2}
                </a>
              </div>
            </div>
            <div className="contact-item">
              <Icon name="whatsapp" className="contact-icon" />
              <div>
                <span className="contact-label">WhatsApp</span>
                <a href={contactInfo.whatsappLink} target="_blank" rel="noopener noreferrer" className="contact-value whatsapp-link">
                  Chat on WhatsApp
                </a>
              </div>
            </div>
            <div className="contact-item">
              <Icon name="email" className="contact-icon" />
              <div>
                <span className="contact-label">Email</span>
                <a href={contactInfo.emailLink} className="contact-value email-link">
                  {contactInfo.email}
                </a>
              </div>
            </div>
            <div className="contact-item">
              <Icon name="clock" className="contact-icon" />
              <div>
                <span className="contact-label">Working Hours</span>
                <p className="contact-value">{contactInfo.hours}</p>
                <p className="contact-sub">Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Business Profiles */}
          <div className="footer-section">
            <h3 className="footer-heading">Business Profiles</h3>
            <p className="social-description">Find us on leading business platforms:</p>
            <div className="profile-links">
              <a 
                href={contactInfo.indiamart} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="profile-link indiamart"
              >
                <Icon name="external" className="profile-icon" />
                <span>IndiaMART</span>
              </a>
              <a 
                href={contactInfo.justdial} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="profile-link justdial"
              >
                <Icon name="external" className="profile-icon" />
                <span>Justdial</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Centered */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="footer-copyright">
            &copy; {currentYear} Shiva Hydraulic & Biomass Industries. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}