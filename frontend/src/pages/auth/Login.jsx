import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useForm } from '../../hooks/useForm';
import { schemas } from '../../utils/validation';
import { ROUTES } from '../../constants';
import bannerImage from '../../assets/images/banner.png';
import logoImage from '../../assets/images/logo.png';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, navigate]);

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
  } = useForm(
    { email: '', password: '', showPassword: false },
    schemas.login,
    async (formData) => {
      const result = await login(formData.email, formData.password);

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
        throw new Error(result.error || 'Login failed');
      }
    }
  );

  const togglePasswordVisibility = () => {
    handleChange({ target: { name: 'showPassword', value: !values.showPassword } });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

        {/* Left Side - University Info */}
        <div className="flex-1 text-white text-center lg:text-left">
          {/* Logo */}
          <div className="mb-6 lg:mb-8 flex justify-center lg:justify-start">
            <div className="w-16 h-16 sm:w-20 sm:h-20">
              <img
                src={logoImage}
                alt="BML Munjal University Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 lg:mb-4">
            BML MUNJAL UNIVERSITY
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 lg:mb-6 text-orange-300">
            A HERO GROUP INITIATIVE
          </h2>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md lg:w-96">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl">
            {/* Login Title */}
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Login</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Global Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{errors.submit}</span>
                </div>
              )}

              {/* Email Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    {...getFieldProps('email', 'email')}
                    type="email"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 ${
                      getErrorProps('email').hasError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Email Address"
                  />
                </div>
                {getErrorProps('email').error && (
                  <p className="mt-1 text-sm text-red-600">{getErrorProps('email').error}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    {...getFieldProps('password', values.showPassword ? 'text' : 'password')}
                    type={values.showPassword ? "text" : "password"}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 ${
                      getErrorProps('password').hasError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {values.showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {getErrorProps('password').error && (
                  <p className="mt-1 text-sm text-red-600">{getErrorProps('password').error}</p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link to="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Login'
                )}
              </button>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to={ROUTES.REGISTER} className="text-blue-600 hover:text-blue-700 font-semibold">
                    Register here
                  </Link>
                </p>
              </div>

              {/* Demo Credentials */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <h4 className="text-xs sm:text-sm font-semibold text-blue-800 mb-2 sm:mb-3">Demo Credentials:</h4>
                <div className="text-xs text-blue-700 space-y-0.5 sm:space-y-1">
                  <p><span className="font-semibold">Student:</span> student@test.edu</p>
                  <p><span className="font-semibold">Faculty:</span> faculty@test.edu</p>
                  <p><span className="font-semibold">Password:</span> password123</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;