import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    products: [],
    gallery: [],
    upcomingSites: [],
    comingSoonProducts: [],
    reviews: [],
    queries: [],
  });

  const [adminData, setAdminData] = useState(null);

  // Fetch all public data on app load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api.getPublicData();
        if (result.error) {
          setError(result.error);
        } else {
          setData(result);
          setError(null);
        }
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Admin function to fetch all data including sensitive info
  const fetchAdminData = async (password) => {
    try {
      const result = await api.getAdminData(password);
      if (result.error) {
        throw new Error(result.error);
      }
      setAdminData(result);
      setData({
        products: result.products || [],
        gallery: result.gallery || [],
        upcomingSites: result.upcomingSites || [],
        comingSoonProducts: result.comingSoonProducts || [],
        reviews: result.reviews || [],
        queries: result.queries || [],
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Refresh public data
  const refreshData = async () => {
    try {
      const result = await api.getPublicData();
      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
        setError(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to refresh data');
    }
  };

  // Refresh admin data
  const refreshAdminData = async (password) => {
    try {
      const result = await api.getAdminData(password);
      if (result.error) {
        throw new Error(result.error);
      }
      setAdminData(result);
      setData({
        products: result.products || [],
        gallery: result.gallery || [],
        upcomingSites: result.upcomingSites || [],
        comingSoonProducts: result.comingSoonProducts || [],
        reviews: result.reviews || [],
        queries: result.queries || [],
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    loading,
    error,
    data,
    adminData,
    fetchAdminData,
    refreshData,
    refreshAdminData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}