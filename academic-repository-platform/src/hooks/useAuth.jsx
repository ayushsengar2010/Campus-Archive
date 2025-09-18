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
    const initializeAuth = () => {
      const token = getToken();
      const userData = getUser();

      if (token && userData && !isTokenExpired(token)) {
        setUserState(userData);
      } else {
        // Clear invalid/expired auth data
        removeToken();
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Login function
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login response
   */
  const login = async (email, password) => {
    try {
      // TODO: Replace with actual API call
      const mockResponse = await mockLogin(email, password);
      
      if (mockResponse.success) {
        const { token, user: userData } = mockResponse.data;
        
        // Store auth data
        setToken(token);
        setUser(userData);
        setUserState(userData);
        
        return { success: true, user: userData };
      } else {
        throw new Error(mockResponse.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Register function
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   */
  const register = async (userData) => {
    try {
      // TODO: Replace with actual API call
      const mockResponse = await mockRegister(userData);
      
      if (mockResponse.success) {
        const { token, user: newUser } = mockResponse.data;
        
        // Store auth data
        setToken(token);
        setUser(newUser);
        setUserState(newUser);
        
        return { success: true, user: newUser };
      } else {
        throw new Error(mockResponse.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    removeToken();
    setUserState(null);
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

// Mock functions for development (TODO: Replace with actual API calls)
const mockLogin = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data based on email
  const mockUsers = {
    'student@university.edu': {
      id: '1',
      email: 'student@university.edu',
      name: 'John Student',
      role: 'student',
      department: 'Computer Science',
      avatar: null,
      createdAt: new Date(),
      lastLogin: new Date(),
    },
    'faculty@university.edu': {
      id: '2',
      email: 'faculty@university.edu',
      name: 'Dr. Jane Faculty',
      role: 'faculty',
      department: 'Computer Science',
      avatar: null,
      createdAt: new Date(),
      lastLogin: new Date(),
    },
    'admin@university.edu': {
      id: '3',
      email: 'admin@university.edu',
      name: 'Admin User',
      role: 'admin',
      department: 'Administration',
      avatar: null,
      createdAt: new Date(),
      lastLogin: new Date(),
    },
    'researcher@university.edu': {
      id: '4',
      email: 'researcher@university.edu',
      name: 'Dr. Research Smith',
      role: 'researcher',
      department: 'Research Division',
      avatar: null,
      createdAt: new Date(),
      lastLogin: new Date(),
    },
  };

  const user = mockUsers[email];
  
  if (user && password === 'password123') {
    // Generate mock JWT token
    const token = `mock.jwt.token.${Date.now()}`;
    
    return {
      success: true,
      data: { token, user },
    };
  } else {
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }
};

const mockRegister = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful registration
  const newUser = {
    id: Date.now().toString(),
    email: userData.email,
    name: userData.name,
    role: userData.role || 'student',
    department: userData.department,
    avatar: null,
    createdAt: new Date(),
    lastLogin: new Date(),
  };
  
  const token = `mock.jwt.token.${Date.now()}`;
  
  return {
    success: true,
    data: { token, user: newUser },
  };
};