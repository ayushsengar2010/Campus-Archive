/**
 * Authentication utility functions
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Get stored authentication token
 * @returns {string|null} Authentication token
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Set authentication token
 * @param {string} token - Authentication token
 */
export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

/**
 * Remove authentication token
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

/**
 * Get stored user data
 * @returns {Object|null} User data
 */
export const getUser = () => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Set user data
 * @param {Object} user - User data
 */
export const setUser = (user) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error setting user data:', error);
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user && !isTokenExpired(token));
};

/**
 * Check if token is expired (mock implementation)
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
export const isTokenExpired = (token) => {
  try {
    // For mock tokens, check if they're older than 24 hours
    if (token.startsWith('mock.jwt.token.')) {
      const timestamp = parseInt(token.split('.').pop());
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      return (now - timestamp) > twentyFourHours;
    }
    
    // For real JWT tokens, you would decode and check the exp claim
    // const decoded = jwt.decode(token);
    // return decoded.exp < Date.now() / 1000;
    
    return false;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Get authorization header for API requests
 * @returns {Object} Authorization header
 */
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};