import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Toast Context for managing toast notifications
 */
const ToastContext = createContext(null);

/**
 * Toast Provider Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Show toast notification
   * @param {Object} toast - Toast configuration
   */
  const showToast = useCallback((toast) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto dismiss after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, newToast.duration);
    }
  }, []);

  /**
   * Dismiss toast by ID
   * @param {string} id - Toast ID
   */
  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  /**
   * Show success toast
   * @param {string} message - Toast message
   * @param {Object} options - Additional options
   */
  const success = useCallback((message, options = {}) => {
    showToast({
      type: 'success',
      message,
      ...options,
    });
  }, [showToast]);

  /**
   * Show error toast
   * @param {string} message - Toast message
   * @param {Object} options - Additional options
   */
  const error = useCallback((message, options = {}) => {
    showToast({
      type: 'error',
      message,
      duration: 7000, // Longer duration for errors
      ...options,
    });
  }, [showToast]);

  /**
   * Show warning toast
   * @param {string} message - Toast message
   * @param {Object} options - Additional options
   */
  const warning = useCallback((message, options = {}) => {
    showToast({
      type: 'warning',
      message,
      ...options,
    });
  }, [showToast]);

  /**
   * Show info toast
   * @param {string} message - Toast message
   * @param {Object} options - Additional options
   */
  const info = useCallback((message, options = {}) => {
    showToast({
      type: 'info',
      message,
      ...options,
    });
  }, [showToast]);

  const value = {
    toasts,
    showToast,
    dismissToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
    </ToastContext.Provider>
  );
};

/**
 * Toast Container Component
 * @param {Object} props - Component props
 * @param {Array} props.toasts - Array of toasts
 * @param {Function} props.dismissToast - Function to dismiss toast
 */
const ToastContainer = ({ toasts, dismissToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};

/**
 * Toast Component
 * @param {Object} props - Component props
 * @param {Object} props.toast - Toast object
 * @param {Function} props.onDismiss - Dismiss handler
 */
const Toast = ({ toast, onDismiss }) => {
  const { id, type, message, title } = toast;

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div
      className={`${colors[type]} border rounded-lg shadow-lg p-4 pointer-events-auto transform transition-all duration-300 ease-in-out animate-slide-in-right`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
          )}
          <p className="text-sm text-gray-700">{message}</p>
        </div>
        <button
          onClick={() => onDismiss(id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

/**
 * Hook to use toast context
 * @returns {Object} Toast context value
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
