import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { api } from '../../utils/api';
import './AdminQueries.css';

/* Icon component */
function Icon({ name, className }) {
  const paths = {
    delete: (
      <>
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </>
    ),
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
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
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    email: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
    phone: (
      <>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </>
    ),
    message: (
      <>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    filter: (
      <>
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </>
    ),
    reply: (
      <>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <polyline points="16 10 12 14 8 10" />
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

export default function AdminQueries() {
  const { data, refreshAdminData } = useData();
  const { queries = [] } = data || {};
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [loading, setLoading] = useState(false);

  const password = localStorage.getItem('adminPassword');

  // Filter queries
  const filteredQueries = queries.filter(query => {
    const matchesSearch = 
      query.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (query.Phone && query.Phone.includes(searchTerm)) ||
      query.Message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'today') {
      const today = new Date().toDateString();
      const queryDate = new Date(query.CreatedAt).toDateString();
      return matchesSearch && queryDate === today;
    }
    if (selectedFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const queryDate = new Date(query.CreatedAt);
      return matchesSearch && queryDate >= weekAgo;
    }
    if (selectedFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const queryDate = new Date(query.CreatedAt);
      return matchesSearch && queryDate >= monthAgo;
    }
    return matchesSearch;
  });

  // Sort queries by date (newest first)
  const sortedQueries = [...filteredQueries].sort((a, b) => 
    new Date(b.CreatedAt) - new Date(a.CreatedAt)
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this query?')) return;
    
    setLoading(true);
    try {
      const result = await api.deleteQuery(password, id);
      if (result.success) {
        await refreshAdminData(password);
        setMessage({ type: 'success', text: 'Query deleted successfully!' });
        setTimeout(() => setMessage(null), 3000);
        if (selectedQuery?.ID === id) setSelectedQuery(null);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete query' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuery = (query) => {
    setSelectedQuery(query);
  };

  const handleCloseDetails = () => {
    setSelectedQuery(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilterCount = (filter) => {
    if (filter === 'all') return queries.length;
    if (filter === 'today') {
      const today = new Date().toDateString();
      return queries.filter(q => new Date(q.CreatedAt).toDateString() === today).length;
    }
    if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return queries.filter(q => new Date(q.CreatedAt) >= weekAgo).length;
    }
    if (filter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return queries.filter(q => new Date(q.CreatedAt) >= monthAgo).length;
    }
    return 0;
  };

  return (
    <div className="admin-queries">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h2>Contact Queries</h2>
          <p className="header-subtitle">Manage all inquiries from your website visitors</p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">
            <Icon name="message" className="stat-icon" />
            Total: {queries.length}
          </span>
          <span className="stat-badge">
            <Icon name="calendar" className="stat-icon" />
            Today: {getFilterCount('today')}
          </span>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`message ${message.type}`}>
          <Icon name={message.type === 'success' ? 'check' : 'alert'} className="message-icon" />
          <span>{message.text}</span>
          <button className="message-close" onClick={() => setMessage(null)}>
            <Icon name="close" className="close-icon" />
          </button>
        </div>
      )}

      {/* Search and Filter */}
      <div className="table-controls">
        <div className="search-wrapper">
          <Icon name="search" className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <Icon name="close" className="close-icon" />
            </button>
          )}
        </div>
        <div className="filter-wrapper">
          <Icon name="filter" className="filter-icon" />
          <select 
            value={selectedFilter} 
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Queries ({getFilterCount('all')})</option>
            <option value="today">Today ({getFilterCount('today')})</option>
            <option value="week">This Week ({getFilterCount('week')})</option>
            <option value="month">This Month ({getFilterCount('month')})</option>
          </select>
        </div>
      </div>

      {/* Queries Table */}
      <div className="queries-table-wrapper">
        {sortedQueries.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <Icon name="user" className="th-icon" />
                  Name
                </th>
                <th>
                  <Icon name="email" className="th-icon" />
                  Email
                </th>
                <th>
                  <Icon name="phone" className="th-icon" />
                  Phone
                </th>
                <th>
                  <Icon name="message" className="th-icon" />
                  Message
                </th>
                <th>
                  <Icon name="calendar" className="th-icon" />
                  Date
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedQueries.map(query => (
                <tr key={query.ID} onClick={() => handleViewQuery(query)} className="clickable">
                  <td>
                    <div className="name-cell">
                      <span className="name-initial">
                        {query.Name.charAt(0).toUpperCase()}
                      </span>
                      <span className="name-text">{query.Name}</span>
                    </div>
                  </td>
                  <td>
                    <a href={`mailto:${query.Email}`} className="email-link">
                      {query.Email}
                    </a>
                  </td>
                  <td>
                    {query.Phone ? (
                      <a href={`tel:${query.Phone}`} className="phone-link">
                        {query.Phone}
                      </a>
                    ) : (
                      <span className="no-phone">—</span>
                    )}
                  </td>
                  <td>
                    <div className="message-cell">
                      {query.Message.length > 60 
                        ? `${query.Message.substring(0, 60)}...` 
                        : query.Message}
                    </div>
                  </td>
                  <td className="date-cell">{formatDate(query.CreatedAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="view-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewQuery(query);
                        }}
                        title="View Details"
                      >
                        <Icon name="message" className="action-icon" />
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(query.ID);
                        }}
                        title="Delete"
                        disabled={loading}
                      >
                        <Icon name="delete" className="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-queries">
            <Icon name="message" className="no-queries-icon" />
            <p>No queries found</p>
            {searchTerm || selectedFilter !== 'all' ? (
              <span className="no-queries-hint">Try adjusting your search or filters</span>
            ) : (
              <span className="no-queries-hint">Queries from your website visitors will appear here</span>
            )}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {queries.length > 0 && (
        <div className="table-footer">
          <span className="footer-count">
            Showing {sortedQueries.length} of {queries.length} queries
          </span>
        </div>
      )}

      {/* Query Details Modal */}
      {selectedQuery && (
        <div className="query-modal-overlay" onClick={handleCloseDetails}>
          <div className="query-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Icon name="message" className="modal-icon" />
                Query Details
              </h3>
              <button className="modal-close" onClick={handleCloseDetails}>
                <Icon name="close" className="close-icon" />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-grid">
                <div className="modal-field">
                  <span className="field-label">
                    <Icon name="user" className="field-icon" />
                    Name
                  </span>
                  <span className="field-value">{selectedQuery.Name}</span>
                </div>
                <div className="modal-field">
                  <span className="field-label">
                    <Icon name="email" className="field-icon" />
                    Email
                  </span>
                  <a href={`mailto:${selectedQuery.Email}`} className="field-value field-link">
                    {selectedQuery.Email}
                  </a>
                </div>
                <div className="modal-field">
                  <span className="field-label">
                    <Icon name="phone" className="field-icon" />
                    Phone
                  </span>
                  {selectedQuery.Phone ? (
                    <a href={`tel:${selectedQuery.Phone}`} className="field-value field-link">
                      {selectedQuery.Phone}
                    </a>
                  ) : (
                    <span className="field-value">Not provided</span>
                  )}
                </div>
                <div className="modal-field">
                  <span className="field-label">
                    <Icon name="calendar" className="field-icon" />
                    Date Received
                  </span>
                  <span className="field-value">{formatDate(selectedQuery.CreatedAt)}</span>
                </div>
                <div className="modal-field full-width">
                  <span className="field-label">
                    <Icon name="message" className="field-icon" />
                    Message
                  </span>
                  <div className="field-value message-value">{selectedQuery.Message}</div>
                </div>
              </div>

              <div className="modal-actions">
                <a 
                  href={`mailto:${selectedQuery.Email}?subject=Re: ${selectedQuery.Name}'s Query`} 
                  className="btn-reply"
                >
                  <Icon name="reply" className="btn-icon" />
                  Reply via Email
                </a>
                <button 
                  className="btn-delete" 
                  onClick={() => {
                    handleDelete(selectedQuery.ID);
                    setSelectedQuery(null);
                  }}
                >
                  <Icon name="delete" className="btn-icon" />
                  Delete Query
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}