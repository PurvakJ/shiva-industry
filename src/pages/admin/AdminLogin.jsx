import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { api } from '../../utils/api';
import './AdminLogin.css';

/* Icon component */
function Icon({ name, className }) {
  const paths = {
    lock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    eye: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    eyeOff: (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </>
    ),
    alert: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
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

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const navigate = useNavigate();
  const { fetchAdminData } = useData();

  // Check for existing admin session
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token === 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  // Lock timer countdown
  useEffect(() => {
    let interval;
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if locked
    if (isLocked) {
      setError(`Too many attempts. Please wait ${lockTimer} seconds.`);
      return;
    }

    setLoading(true);

    try {
      const result = await api.login(password);
      if (result.success) {
        const dataResult = await fetchAdminData(password);
        if (dataResult.success) {
          localStorage.setItem('adminToken', 'true');
          localStorage.setItem('adminPassword', password);
          setAttempts(0);
          navigate('/admin');
        } else {
          setError(dataResult.error || 'Failed to fetch admin data');
          handleFailedAttempt();
        }
      } else {
        setError('Invalid password');
        handleFailedAttempt();
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      handleFailedAttempt();
    } finally {
      setLoading(false);
    }
  };

  const handleFailedAttempt = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    // Lock after 5 failed attempts
    if (newAttempts >= 5) {
      setIsLocked(true);
      setLockTimer(30); // Lock for 30 seconds
      setError('Too many failed attempts. Please wait 30 seconds.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="admin-login-page">
      {/* Background Decoration */}
      <div className="login-background" aria-hidden="true">
        <div className="login-grid" />
        <div className="login-glow" />
        <div className="login-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
      </div>

      <div className="login-container">
        <div className="login-box">
          {/* Logo */}
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="logo-text">
                <span className="logo-brand">Shiva</span>
                <span className="logo-industry">Industry</span>
              </div>
            </div>
            <div className="login-badge">
              <Icon name="shield" className="badge-icon" />
              <span>Admin Access</span>
            </div>
          </div>

          <div className="login-body">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">
              Enter your credentials to access the admin dashboard.
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <Icon name="lock" className="label-icon" />
                  Admin Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className={`form-input ${error ? 'error' : ''}`}
                    required
                    disabled={loading || isLocked}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    tabIndex="-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <Icon name={showPassword ? 'eyeOff' : 'eye'} className="toggle-icon" />
                  </button>
                </div>
                {error && (
                  <div className="error-message">
                    <Icon name="alert" className="error-icon" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className={`login-btn ${loading ? 'loading' : ''}`}
                disabled={loading || isLocked}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <Icon name="lock" className="btn-icon" />
                    Login
                  </>
                )}
              </button>

              {isLocked && (
                <div className="lock-message">
                  <Icon name="alert" className="lock-icon" />
                  <span>Locked for {lockTimer}s due to multiple failed attempts</span>
                </div>
              )}

              <div className="login-footer">
                <Link to="/" className="back-link">
                  ← Back to Home
                </Link>
                <span className="login-help">
                  <Icon name="user" className="help-icon" />
                  Need help? <a href="/contact">Contact Support</a>
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* Security Notice */}
        <div className="security-notice">
          <Icon name="shield" className="security-icon" />
          <div className="security-text">
            <strong>Secure Admin Access</strong>
            <p>This area is protected. All access attempts are logged.</p>
          </div>
        </div>
      </div>
    </div>
  );
}