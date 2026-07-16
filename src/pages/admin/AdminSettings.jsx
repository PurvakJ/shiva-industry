import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import './AdminSettings.css';

/* Icon component */
function Icon({ name, className }) {
  const paths = {
    lock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    unlock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      </>
    ),
    check: (
      <>
        <path d="M20 6L9 17l-5-5" />
      </>
    ),
    alert: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </>
    ),
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
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
    database: (
      <>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </>
    ),
    refresh: (
      <>
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </>
    ),
    key: (
      <>
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
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

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Check password strength
  useEffect(() => {
    if (newPassword.length === 0) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (newPassword.length >= 8) strength += 25;
    if (newPassword.length >= 12) strength += 25;
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) strength += 25;
    if (/\d/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword)) strength += 25;
    
    setPasswordStrength(strength);
  }, [newPassword]);

  // Get last password update from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('adminPasswordLastUpdated');
    if (saved) {
      setLastUpdated(new Date(parseInt(saved)));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate current password
    if (!currentPassword) {
      setMessage({ type: 'error', text: 'Current password is required' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 4) {
      setMessage({ type: 'error', text: 'New password must be at least 4 characters' });
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    if (newPassword === currentPassword) {
      setMessage({ type: 'error', text: 'New password must be different from current password' });
      setLoading(false);
      return;
    }

    try {
      const result = await api.updatePassword(currentPassword, newPassword);
      if (result.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        const now = Date.now();
        localStorage.setItem('adminPassword', newPassword);
        localStorage.setItem('adminPasswordLastUpdated', String(now));
        setLastUpdated(new Date(now));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordStrength(0);
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update password' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return '#charcoal-3';
    if (passwordStrength <= 25) return '#ef4444';
    if (passwordStrength <= 50) return '#f59e0b';
    if (passwordStrength <= 75) return '#60a5fa';
    return '#6ee7a6';
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-settings">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h2>Settings</h2>
          <p className="header-subtitle">Manage your admin account settings</p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">
            <Icon name="shield" className="stat-icon" />
            Admin Access
          </span>
        </div>
      </div>

      {/* Password Change Card */}
      <div className="settings-card">
        <div className="card-header">
          <div className="card-header-left">
            <Icon name="lock" className="card-icon" />
            <h3>Change Admin Password</h3>
          </div>
          {lastUpdated && (
            <span className="last-updated">
              <Icon name="refresh" className="update-icon" />
              Last updated: {formatDate(lastUpdated)}
            </span>
          )}
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            <Icon name={message.type === 'success' ? 'check' : 'alert'} className="message-icon" />
            <span>{message.text}</span>
            <button className="message-close" onClick={() => setMessage(null)}>
              <Icon name="close" className="close-icon" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label>
              <Icon name="lock" className="label-icon" />
              Current Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Enter current password"
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                tabIndex="-1"
                aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
              >
                <Icon name={showCurrentPassword ? 'eyeOff' : 'eye'} className="toggle-icon" />
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>
              <Icon name="unlock" className="label-icon" />
              New Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password (min 4 characters)"
                className="form-input"
                minLength="4"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex="-1"
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                <Icon name={showNewPassword ? 'eyeOff' : 'eye'} className="toggle-icon" />
              </button>
            </div>
            {newPassword.length > 0 && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ 
                      width: `${passwordStrength}%`,
                      backgroundColor: getStrengthColor()
                    }}
                  />
                </div>
                <span className="strength-label" style={{ color: getStrengthColor() }}>
                  {getStrengthLabel()}
                </span>
              </div>
            )}
            <div className="password-hint">
              <span className="hint-item">✓ Min 4 characters</span>
              <span className="hint-item">✓ Mixed case recommended</span>
              <span className="hint-item">✓ Numbers & symbols recommended</span>
            </div>
          </div>

          <div className="form-group">
            <label>
              <Icon name="check" className="label-icon" />
              Confirm New Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                <Icon name={showConfirmPassword ? 'eyeOff' : 'eye'} className="toggle-icon" />
              </button>
            </div>
            {confirmPassword.length > 0 && newPassword.length > 0 && (
              <div className={`password-match ${newPassword === confirmPassword ? 'match' : 'mismatch'}`}>
                {newPassword === confirmPassword ? (
                  <>
                    <Icon name="check" className="match-icon" />
                    Passwords match
                  </>
                ) : (
                  <>
                    <Icon name="alert" className="match-icon" />
                    Passwords do not match
                  </>
                )}
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Updating...
              </>
            ) : (
              <>
                <Icon name="key" className="btn-icon" />
                Update Password
              </>
            )}
          </button>
        </form>
      </div>

      {/* Information Card */}
      <div className="settings-card info-card">
        <div className="card-header">
          <div className="card-header-left">
            <Icon name="info" className="card-icon" />
            <h3>System Information</h3>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon-wrap">
              <Icon name="shield" className="info-icon" />
            </div>
            <div className="info-content">
              <span className="info-label">Admin Password Last Updated</span>
              <span className="info-value">{formatDate(lastUpdated)}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon-wrap">
              <Icon name="database" className="info-icon" />
            </div>
            <div className="info-content">
              <span className="info-label">Data Source</span>
              <span className="info-value">Google Sheets</span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon-wrap">
              <Icon name="refresh" className="info-icon" />
            </div>
            <div className="info-content">
              <span className="info-label">Version</span>
              <span className="info-value">2.0.0</span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon-wrap">
              <Icon name="key" className="info-icon" />
            </div>
            <div className="info-content">
              <span className="info-label">Access Level</span>
              <span className="info-value">Full Administrator</span>
            </div>
          </div>
        </div>

        <div className="security-tip">
          <Icon name="shield" className="tip-icon" />
          <div className="tip-content">
            <strong>Security Tip</strong>
            <p>For better security, use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.</p>
          </div>
        </div>
      </div>
    </div>
  );
}