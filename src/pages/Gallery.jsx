import { useData } from '../context/DataContext';
import { useEffect, useRef, useState } from 'react';
import './Gallery.css';

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
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    expand: (
      <>
        <path d="M15 3h6v6" />
        <path d="M9 21H3v-6" />
        <path d="M21 3l-7 7" />
        <path d="M3 21l7-7" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
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

export default function Gallery() {
  const { data } = useData();
  const { gallery = [] } = data || {};
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');

  // Get unique categories from gallery items
  const categories = ['all', ...new Set(gallery.map(item => item.Category || item.category || 'General'))];
  
  // Filter gallery items
  const filteredGallery = filter === 'all' 
    ? gallery 
    : gallery.filter(item => (item.Category || item.category || 'General') === filter);

  // Open lightbox
  const openLightbox = (item) => {
    setSelectedImage(item);
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && selectedImage) {
        const currentIndex = filteredGallery.findIndex(item => item.ID === selectedImage.ID);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredGallery.length - 1;
        setSelectedImage(filteredGallery[prevIndex]);
      }
      if (e.key === 'ArrowRight' && selectedImage) {
        const currentIndex = filteredGallery.findIndex(item => item.ID === selectedImage.ID);
        const nextIndex = currentIndex < filteredGallery.length - 1 ? currentIndex + 1 : 0;
        setSelectedImage(filteredGallery[nextIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, filteredGallery]);

  return (
    <div className="gallery-page">
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="gallery-hero-backdrop" aria-hidden="true">
          <div className="gallery-hero-grid" />
        </div>
        <div className="container gallery-hero-inner">
          <Reveal>
            <span className="eyebrow">Our Work</span>
            <h1 className="gallery-hero-title">
              <span className="text-accent">Visual</span> Showcase
            </h1>
            <p className="gallery-hero-copy">
              Explore our manufacturing capabilities, products, and facilities through our image gallery.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section gallery-section">
        <div className="container">
          {/* Category Filter */}
          {gallery.length > 0 && (
            <Reveal className="gallery-filters">
              <div className="filter-buttons">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`filter-btn ${filter === category ? 'active' : ''}`}
                    onClick={() => setFilter(category)}
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                ))}
              </div>
              <div className="gallery-count">
                <Icon name="image" className="count-icon" />
                <span>{filteredGallery.length} {filteredGallery.length === 1 ? 'Image' : 'Images'}</span>
              </div>
            </Reveal>
          )}

          {/* Gallery Grid */}
          {filteredGallery.length > 0 ? (
            <div className="gallery-grid">
              {filteredGallery.map((item, index) => (
                <Reveal key={item.ID || item.id || index} delay={`${(index % 6) * 0.05}s`}>
                  <div 
                    className="gallery-item"
                    onClick={() => openLightbox(item)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${item.Title || 'image'}`}
                  >
                    <img 
                      src={item.ImageURL || item.Image || item.image} 
                      alt={item.Title || item.title || 'Gallery image'} 
                      loading="lazy"
                    />
                    <div className="gallery-overlay">
                      <div className="gallery-overlay-content">
                        {item.Title && <h3>{item.Title}</h3>}
                        {item.Description && <p>{item.Description}</p>}
                        <span className="gallery-expand">
                          <Icon name="expand" className="expand-icon" />
                        </span>
                      </div>
                    </div>
                    {item.Category && (
                      <span className="gallery-tag">{item.Category}</span>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="no-gallery">
              <Icon name="image" className="no-gallery-icon" />
              <h3>No Images Available</h3>
              <p>Gallery images will be added soon.</p>
              <p className="no-gallery-sub">Check back later to see our work.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <Icon name="close" className="close-icon" />
            </button>
            <img 
              src={selectedImage.ImageURL || selectedImage.Image || selectedImage.image} 
              alt={selectedImage.Title || selectedImage.title || 'Gallery image'} 
            />
            {(selectedImage.Title || selectedImage.Description) && (
              <div className="lightbox-info">
                {selectedImage.Title && <h3>{selectedImage.Title}</h3>}
                {selectedImage.Description && <p>{selectedImage.Description}</p>}
                {selectedImage.Category && (
                  <span className="lightbox-category">{selectedImage.Category}</span>
                )}
              </div>
            )}
            <div className="lightbox-nav">
              <button 
                className="lightbox-nav-btn prev"
                onClick={() => {
                  const currentIndex = filteredGallery.findIndex(item => item.ID === selectedImage.ID);
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredGallery.length - 1;
                  setSelectedImage(filteredGallery[prevIndex]);
                }}
              >
                ‹
              </button>
              <span className="lightbox-counter">
                {filteredGallery.findIndex(item => item.ID === selectedImage.ID) + 1} / {filteredGallery.length}
              </span>
              <button 
                className="lightbox-nav-btn next"
                onClick={() => {
                  const currentIndex = filteredGallery.findIndex(item => item.ID === selectedImage.ID);
                  const nextIndex = currentIndex < filteredGallery.length - 1 ? currentIndex + 1 : 0;
                  setSelectedImage(filteredGallery[nextIndex]);
                }}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="gallery-cta">
        <div className="cta-hazard" aria-hidden="true" />
        <div className="container cta-inner">
          <Reveal>
            <span className="eyebrow eyebrow--onDark">Want to See More?</span>
            <h3 className="cta-title">Visit Our Facility</h3>
            <p className="cta-copy">
              Schedule a visit to see our manufacturing capabilities in person.
            </p>
            <div className="cta-actions">
              <a href="/contact" className="btn btn--primary">
                Schedule a Visit
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