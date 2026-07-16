// For testing - hardcoded URL
const API_URL = 'https://script.google.com/macros/s/AKfycbzx30yp2V04EqftD9ASkivh88tpre4lgPG5-6boqzFO0_FfxsvpfQIrOOPwRjNGw8Lfbg/exec';

// Uncomment this line and comment the above when using environment variables
// const API_URL = import.meta.env.VITE_API_URL;

// if (!API_URL) {
//   console.warn('VITE_API_URL is not set. Copy .env.example to .env and add your Apps Script Web App URL.');
// }

/** GET request — used for the two read actions (publicData / adminData) */
async function get(action, params = {}) {
  try {
    const query = new URLSearchParams({ action, ...params }).toString();
    const url = `${API_URL}?${query}`;
    console.log('Fetching:', url);
    
    const res = await fetch(url);
    console.log('Response status:', res.status);
    
    if (!res.ok) {
      const text = await res.text();
      console.log('Response text:', text.substring(0, 200));
      throw new Error(`Request failed: ${res.status} - ${text.substring(0, 100)}`);
    }
    
    const data = await res.json();
    console.log('Data received:', data);
    return data;
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
}

/**
 * POST request — sent as text/plain to avoid a CORS preflight,
 * which Apps Script web apps do not handle. The body is still
 * a JSON string; Code.gs parses it with JSON.parse(e.postData.contents).
 */
async function post(action, payload = {}) {
  try {
    console.log('POST request:', action, payload);
    
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload })
    });
    
    console.log('POST response status:', res.status);
    
    if (!res.ok) {
      const text = await res.text();
      console.log('Response text:', text.substring(0, 200));
      throw new Error(`Request failed: ${res.status} - ${text.substring(0, 100)}`);
    }
    
    const data = await res.json();
    console.log('POST response data:', data);
    return data;
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
}

export const api = {
  // ---- public reads ----
  getPublicData: () => get('publicData'),
  getAdminData: (password) => get('adminData', { password }),

  // ---- auth ----
  login: (password) => post('login', { password }),
  updatePassword: (password, newPassword) => post('updatePassword', { password, newPassword }),

  // ---- products ----
  addProduct: (password, product) => post('addProduct', { password, product }),
  updateProduct: (password, id, product) => post('updateProduct', { password, id, product }),
  deleteProduct: (password, id) => post('deleteProduct', { password, id }),
  toggleFeatured: (password, id) => post('toggleFeatured', { password, id }),

  // ---- upcoming sites ----
  addUpcoming: (password, site) => post('addUpcoming', { password, site }),
  updateUpcoming: (password, id, site) => post('updateUpcoming', { password, id, site }),
  deleteUpcoming: (password, id) => post('deleteUpcoming', { password, id }),

  // ---- coming soon products ----
  addComingSoon: (password, product) => post('addComingSoon', { password, product }),
  updateComingSoon: (password, id, product) => post('updateComingSoon', { password, id, product }),
  deleteComingSoon: (password, id) => post('deleteComingSoon', { password, id }),

  // ---- gallery ----
  addGallery: (password, item) => post('addGallery', { password, item }),
  updateGallery: (password, id, item) => post('updateGallery', { password, id, item }),
  deleteGallery: (password, id) => post('deleteGallery', { password, id }),

  // ---- reviews ----
  addReview: (review) => post('addReview', { review }),
  toggleReview: (password, id) => post('toggleReview', { password, id }),
  deleteReview: (password, id) => post('deleteReview', { password, id }),

  // ---- contact queries ----
  addQuery: (query) => post('addQuery', { query }),
  deleteQuery: (password, id) => post('deleteQuery', { password, id })
};