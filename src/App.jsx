import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
      behavior: 'smooth' // Adds smooth scrolling animation
    });
  }, [pathname]); // Triggers on every route change

  return null;
}

function Shell() {
  const { loading, error } = useData();
  const [showLoader, setShowLoader] = useState(true);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    // Check if data is loaded
    if (!loading) {
      setDataReady(true);
    }
  }, [loading]);

  useEffect(() => {
    // Show loader for minimum 1 second even if data loads faster
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // If there's an error, show error immediately
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-sage text-ink font-body">
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

  // Show loader if:
  // 1. Data is still loading AND (showLoader is true OR data is not ready)
  // 2. OR showLoader is true and data is not ready yet (minimum 2 seconds)
  if ((loading && showLoader) || (!dataReady && showLoader)) {
    return (
      <div className="min-h-screen flex flex-col bg-sage text-ink font-body">
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
      <ScrollToTop /> {/* Add this component to handle scroll to top */}
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