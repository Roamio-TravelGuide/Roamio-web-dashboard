import { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCompass } from 'react-icons/fi';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const SignInPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Signed in with:', { email, password });
      // navigate('/discover'); // Redirect to travel discovery page
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      {/* Video Background Container - Only shows on larger screens */}
      <div className="hidden lg:block fixed inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/uploads/roamio3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/30"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md z-10">
        {/* Card with conditional background based on screen size */}
        <div className={`rounded-xl shadow-xl overflow-hidden ${window.innerWidth >= 1024 ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-white'}`}>
          <div className="p-8 sm:p-10">
            {/* Branding Section */}
            <div className="text-center mb-8">
              <div className="flex justify-center">
                <FiCompass className="h-10 w-10 text-teal-600" />
              </div>
              <h1 className="text-3xl font-bold mt-3 text-gray-800 lg:text-white">Welcome to Roamio</h1>
              <p className={`mt-2 ${window.innerWidth >= 1024 ? 'text-white/80' : 'text-gray-600'}`}>
                Sign in to manage your travel experiences
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${window.innerWidth >= 1024 ? 'text-white' : 'text-gray-700'}`}>
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className={`h-5 w-5 ${window.innerWidth >= 1024 ? 'text-white/70' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className={`block w-full pl-10 pr-3 py-3 rounded-lg ${window.innerWidth >= 1024 ? 'bg-white/20 text-white placeholder-white/70 border-white/30 focus:ring-white' : 'bg-white text-gray-800 border-gray-300 focus:ring-teal-500'} border focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-2 ${window.innerWidth >= 1024 ? 'text-white' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className={`h-5 w-5 ${window.innerWidth >= 1024 ? 'text-white/70' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`block w-full pl-10 pr-10 py-3 rounded-lg ${window.innerWidth >= 1024 ? 'bg-white/20 text-white placeholder-white/70 border-white/30 focus:ring-white' : 'bg-white text-gray-800 border-gray-300 focus:ring-teal-500'} border focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FiEyeOff className={`h-5 w-5 ${window.innerWidth >= 1024 ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-teal-600'}`} />
                    ) : (
                      <FiEye className={`h-5 w-5 ${window.innerWidth >= 1024 ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-teal-600'}`} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className={`h-4 w-4 rounded ${window.innerWidth >= 1024 ? 'text-white border-white/50 focus:ring-white' : 'text-teal-600 border-gray-300 focus:ring-teal-500'} focus:ring-2`}
                    checked={rememberMe}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className={`ml-2 block text-sm ${window.innerWidth >= 1024 ? 'text-white/80' : 'text-gray-700'}`}>
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className={`font-medium ${window.innerWidth >= 1024 ? 'text-white hover:text-white/80' : 'text-teal-600 hover:text-teal-500'}`}>
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <FiArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className={`mt-6 text-center text-sm ${window.innerWidth >= 1024 ? 'text-white/80' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <a href="/signup" className={`font-medium ${window.innerWidth >= 1024 ? 'text-white hover:text-white/90' : 'text-teal-600 hover:text-teal-500'}`}>
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;