import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getToken, 
  getUser, 
  setToken, 
  setUser, 
  removeToken, 
  isAuthenticated,
  isTokenExpired 
} from '../utils/auth';
import apiService from '../services/apiService';

/**
 * Authentication Context
 */
const AuthContext = createContext(null);

/**
 * Authentication Provider Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      const userData = getUser();

      if (token && userData && !isTokenExpired(token)) {
        try {
          // Verify token with backend
          const response = await apiService.verifyToken();
          if (response.success) {
            setUserState(userData);
          } else {
            // Token invalid, clear auth data
            removeToken();
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          removeToken();
        }
      } else {
        // Clear invalid/expired auth data
        removeToken();
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Login function - Uses real API call to backend
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login response
   */
  const login = async (email, password) => {
    try {
      const response = await apiService.login({ email, password });
      
      if (response.user && response.token) {
        // Store auth data in localStorage and state
        setToken(response.token);
        setUser(response.user);
        setUserState(response.user);
        
        return { success: true, user: response.user };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  /**
   * Register function - Uses real API call to backend
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   */
  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      
      if (response.user && response.token) {
        // Store auth data in localStorage and state
        setToken(response.token);
        setUser(response.user);
        setUserState(response.user);
        
        return { success: true, user: response.user };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  /**
   * Logout function - Calls backend and clears local state
   */
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
      setUserState(null);
    }
  };

  /**
   * Update user profile
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} Update response
   */
  const updateProfile = async (updates) => {
    try {
      const updatedUser = await apiService.updateProfile(updates);
      setUser(updatedUser);
      setUserState(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Change password
   * @param {Object} passwordData - Old and new password
   * @returns {Promise<Object>} Change password response
   */
  const changePassword = async (passwordData) => {
    try {
      await apiService.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean} True if user has role
   */
  const hasRole = (role) => {
    return user && user.role === role;
  };

  const value = {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use authentication context
 * @returns {Object} Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};