import { useEffect, useState } from 'react';
import './Loader.css';

export default function Loader({ 
  label = 'Loading...', 
  subLabel = 'Please wait while we prepare your experience',
  showProgress = true,
  progress = 0,
  variant = 'fullscreen' // 'fullscreen' | 'inline' | 'overlay'
}) {
  const [dots, setDots] = useState(0);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const dotString = '.'.repeat(dots);

  // Determines if progress is indeterminate or controlled
  const isIndeterminate = progress === 0;

  return (
    <div className={`loader-container ${variant}`}>
      <div className="loader-wrapper">
        {/* Main Spinner */}
        <div className="loader-spinner-wrapper">
          <div className="loader-spinner">
            <svg className="spinner-ring" viewBox="0 0 50 50">
              <circle 
                className="spinner-ring-path" 
                cx="25" 
                cy="25" 
                r="20" 
                fill="none" 
                strokeWidth="3"
              />
            </svg>
            <div className="loader-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="loader-brand">
          <span className="loader-brand-name">SHIVA</span>
          <span className="loader-brand-industry">HYDRAULIC & BIOMASS</span>
          <span className="loader-brand-tagline">Industries</span>
        </div>

        {/* Text Content */}
        <div className="loader-content">
          <h3 className="loader-label">
            {label}
            <span className="loader-dots">{dotString}</span>
          </h3>
          {subLabel && (
            <p className="loader-sub-label">{subLabel}</p>
          )}
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="loader-progress-wrapper">
            <div className="loader-progress-bar">
              <div 
                className={`loader-progress-fill ${isIndeterminate ? 'indeterminate' : ''}`}
                style={!isIndeterminate ? { width: `${Math.min(Math.max(progress, 0), 100)}%` } : {}}
              />
            </div>
            {!isIndeterminate && (
              <span className="loader-progress-text">{Math.round(progress)}%</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}