import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useForm } from '../../hooks/useForm';
import { schemas, createRule, validationRules, errorMessages } from '../../utils/validation';
import { ROUTES, USER_ROLES } from '../../constants';
import logoImage from '../../assets/images/logo.png';

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, navigate]);

  // Extended validation schema for registration
  const registerSchema = {
    ...schemas.register,
    confirmPassword: [
      createRule(validationRules.required, errorMessages.required),
    ],
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldProps,
    getErrorProps,
    setFieldError,
  } = useForm(
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      department: '',
    },
    registerSchema,
    async (formData) => {
      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        setFieldError('confirmPassword', 'Passwords do not match');
        throw new Error('Passwords do not match');
      }

      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department,
      });

      if (result.success) {
        const { role } = result.user;
        switch (role) {
          case 'student': navigate(ROUTES.STUDENT_DASHBOARD); break;
          case 'faculty': navigate(ROUTES.FACULTY_DASHBOARD); break;
          case 'admin': navigate(ROUTES.ADMIN_DASHBOARD); break;
          case 'researcher': navigate(ROUTES.RESEARCHER_DASHBOARD); break;
          default: navigate(ROUTES.HOME);
        }
      } else {
        setFieldError('submit', result.error || 'Registration failed');
        throw new Error(result.error || 'Registration failed');
      }
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16">
              <img 
                src={logoImage} 
                alt="BML Munjal University Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            BML Munjal University
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow-lg sm:rounded-2xl sm:px-10 border border-gray-100 transition-colors duration-300">
          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            {/* Global Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{errors.submit}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                {...getFieldProps('name')}
                type="text"
                className={`appearance-none block w-full px-3 py-2.5 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                  getErrorProps('name').hasError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {getErrorProps('name').error && (
                <p className="mt-1 text-sm text-red-600">{getErrorProps('name').error}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                {...getFieldProps('email')}
                type="email"
                className={`appearance-none block w-full px-3 py-2.5 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                  getErrorProps('email').hasError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {getErrorProps('email').error && (
                <p className="mt-1 text-sm text-red-600">{getErrorProps('email').error}</p>
              )}
            </div>

            {/* Role & Department - Side by Side on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  {...getFieldProps('role')}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                >
                  <option value={USER_ROLES.STUDENT}>Student</option>
                  <option value={USER_ROLES.FACULTY}>Faculty</option>
                  <option value={USER_ROLES.RESEARCHER}>Researcher</option>
                  <option value={USER_ROLES.ADMIN}>Admin</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  {...getFieldProps('department')}
                  type="text"
                  className={`appearance-none block w-full px-3 py-2.5 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    getErrorProps('department').hasError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Computer Science"
                />
                {getErrorProps('department').error && (
                  <p className="mt-1 text-sm text-red-600">{getErrorProps('department').error}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                {...getFieldProps('password')}
                type="password"
                className={`appearance-none block w-full px-3 py-2.5 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                  getErrorProps('password').hasError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {getErrorProps('password').error && (
                <p className="mt-1 text-sm text-red-600">{getErrorProps('password').error}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                {...getFieldProps('confirmPassword')}
                type="password"
                className={`appearance-none block w-full px-3 py-2.5 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                  getErrorProps('confirmPassword').hasError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              {getErrorProps('confirmPassword').error && (
                <p className="mt-1 text-sm text-red-600">{getErrorProps('confirmPassword').error}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;