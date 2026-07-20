import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { DataProvider, useData } from './context/DataContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';
import { useState, useEffect } from 'react';

import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Gallery from './pages/Gallery';
import UpcomingSites from './pages/UpcomingSites';
import ComingSoon from './pages/ComingSoon';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminGallery from './pages/admin/AdminGallery';
import AdminUpcoming from './pages/admin/AdminUpcoming';
import AdminComingSoon from './pages/admin/AdminComingSoon';
import AdminReviews from './pages/admin/AdminReviews';
import AdminQueries from './pages/admin/AdminQueries';
import AdminSettings from './pages/admin/AdminSettings';

import './App.css';

// Site configuration for SEO
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
    email: 'info@shivahydraulicandbiomass.com',
    address: 'Sardulgarh, Mansa District, Punjab, India'
  }
};

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Shell />
      </DataProvider>
    </BrowserRouter>
  );
}

// Custom hook for scroll to top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

function Shell() {
  const { loading, error } = useData();
  const [showLoader, setShowLoader] = useState(true);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      setDataReady(true);
    }
  }, [loading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // If there's an error, show error immediately
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-sage text-ink font-body">
        <Helmet>
          <title>Error | Shiva Hydraulic & Biomass Industries</title>
        </Helmet>
        <Navbar />
        <main className="flex-1">
          <div className="error-container">
            <p className="error-title">Something went wrong</p>
            <p className="error-text">{error}</p>
            <p className="error-hint">
              Check that VITE_API_URL in your .env file points to a deployed Apps Script web app.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show loader if data is loading
  if ((loading && showLoader) || (!dataReady && showLoader)) {
    return (
      <div className="min-h-screen flex flex-col bg-sage text-ink font-body">
        <Helmet>
          <title>Loading | Shiva Hydraulic & Biomass Industries</title>
        </Helmet>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader label="Loading your experience..." />
        </main>
        <Footer />
      </div>
    );
  }

  // Data is ready, show the full app
  return (
    <div className="min-h-screen flex flex-col bg-sage text-ink font-body">
      <Helmet>
        <title>{siteConfig.name} | Hydraulic & Biomass Solutions in Punjab</title>
        <meta name="description" content={siteConfig.description} />
        <meta name="keywords" content={siteConfig.keywords.join(', ')} />
        <link rel="canonical" href={`https://${siteConfig.domain}`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={`${siteConfig.name} | Hydraulic & Biomass Industry Leaders`} />
        <meta property="og:description" content={siteConfig.description} />
        <meta property="og:url" content={`https://${siteConfig.domain}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteConfig.name} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${siteConfig.name} | Hydraulic & Biomass Solutions`} />
        <meta name="twitter:description" content={siteConfig.description} />
        
        {/* Structured Data / JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": siteConfig.name,
            "description": siteConfig.description,
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
            }
          })}
        </script>
      </Helmet>

      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/upcoming-sites" element={<UpcomingSites />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminProducts />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="upcoming-sites" element={<AdminUpcoming />} />
            <Route path="coming-soon" element={<AdminComingSoon />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="queries" element={<AdminQueries />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}