import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { ROUTES } from '../../constants';
import bannerImage from '../../assets/images/banner.png';
import logoImage from '../../assets/images/logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
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
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
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
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex items-center justify-between">

        {/* Left Side - University Info */}
        <div className="flex-1 text-white pr-8">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-20 h-20 mb-6">
              <img
                src={logoImage}
                alt="BML Munjal University Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4">BML MUNJAL UNIVERSITY</h1>
          <h2 className="text-2xl font-semibold mb-6 text-orange-300">A HERO GROUP INITIATIVE</h2>

          {/* <div className="max-w-2xl text-lg leading-relaxed space-y-4">
            <p>
              Named after the chairman and founder of the Hero Group, Dr. Brijmohan Lall Munjal, BML Munjal
              University is engaged in creating, preserving and imparting internationally benchmarked knowledge
              and skills to a diverse community of students from across the world. BMU's aim is to nurture ethical
              leaders who are self-reliant, knowledgeable and have the life skills needed to lead organisations to
              success.
            </p>

            <p>
              BMU seeks to transform higher education in India by creating a world-class and innovative teaching,
              learning and research environment. Founded by the Hero Group and mentored by Imperial College
              London, BMU is a not-for-profit initiative offering undergraduate and post-graduate courses.
            </p>
          </div> */}
        </div>

        {/* Right Side - Login Form */}
        <div className="w-96">
          <div className="bg-transparent backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
            {/* Login Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Login</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Username Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-black-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                  placeholder="Username"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-black-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-white-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-black-400"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link to="#" className="text-sm text-white-500 hover:text-black-600 transition-colors">
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-200 disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Login'
                )}
              </button>

              {/* Social Login */}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">or login with social platforms</p>
                <div className="flex justify-center space-x-4">
                  <button type="button" className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <span className="text-xl font-bold text-gray-600">G</span>
                  </button>
                  <button type="button" className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <span className="text-xl font-bold text-blue-600">f</span>
                  </button>
                  <button type="button" className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-3">Demo Credentials:</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <p><span className="font-semibold">Student:</span> student@university.edu</p>
                  <p><span className="font-semibold">Faculty:</span> faculty@university.edu</p>
                  <p><span className="font-semibold">Admin:</span> admin@university.edu</p>
                  <p><span className="font-semibold">Researcher:</span> researcher@university.edu</p>
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