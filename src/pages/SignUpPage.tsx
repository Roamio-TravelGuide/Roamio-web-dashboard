import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  MapPin, 
  ChefHat,
  Users,
  ArrowRight,
  ArrowLeft,
  Compass,
  Building,
  CreditCard
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  contactNumber?: string;
  guideId?: string;
  restaurantType?: string;
  address?: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage = () => {
  const { userType } = useParams<{ userType: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    contactNumber: '',
    guideId: '',
    restaurantType: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const getUserTypeConfig = () => {
    switch (userType) {
      case 'explorer':
        return {
          title: 'Create Explorer Account',
          subtitle: 'Join thousands of travelers discovering amazing destinations',
          icon: MapPin,
          gradient: 'from-blue-500 to-teal-600'
        };
      case 'guide':
        return {
          title: 'Become a Tour Guide',
          subtitle: 'Share your expertise and create memorable experiences',
          icon: Users,
          gradient: 'from-emerald-500 to-green-600'
        };
      case 'restaurant':
        return {
          title: 'Register Your Restaurant',
          subtitle: 'Showcase your culinary excellence to food lovers',
          icon: ChefHat,
          gradient: 'from-orange-500 to-red-600'
        };
      default:
        navigate('/signup');
        return null;
    }
  };

  const config = getUserTypeConfig();
  if (!config) return null;

  const IconComponent = config.icon;

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (userType !== 'explorer') {
      if (!formData.contactNumber?.trim()) newErrors.contactNumber = 'Contact number is required';
      else if (!/^\+?[\d\s-()]+$/.test(formData.contactNumber)) newErrors.contactNumber = 'Contact number is invalid';
    }

    if (userType === 'guide' && !formData.guideId?.trim()) {
      newErrors.guideId = 'Guide ID is required';
    }

    if (userType === 'restaurant') {
      if (!formData.restaurantType?.trim()) newErrors.restaurantType = 'Restaurant type is required';
      if (!formData.address?.trim()) newErrors.address = 'Address is required';
    }

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Sign up data:', { userType, ...formData });
      // Redirect based on user type
      navigate('/signin');
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const restaurantTypes = [
    'Fine Dining',
    'Casual Dining',
    'Fast Food',
    'Cafe',
    'Bar & Grill',
    'Food Truck',
    'Bakery',
    'Other'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      {/* Main Content */}
      <div className="w-full max-w-md">
        <div className="rounded-xl shadow-lg overflow-hidden bg-white border border-gray-200">
          <div className="p-8 sm:p-10">
            <Link 
              to="/signup" 
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-teal-600 mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to selection
            </Link>

            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className={`p-3 bg-gradient-to-r ${config.gradient} rounded-full`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {config.title}
              </h1>
              <p className="text-gray-600">
                {config.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    className="block w-full pl-10 pr-3 py-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:ring-teal-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="block w-full pl-10 pr-3 py-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:ring-teal-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              {userType !== 'explorer' && (
                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium mb-2 text-gray-700">
                    Contact Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="contactNumber"
                      className="block w-full pl-10 pr-3 py-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:ring-teal-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      placeholder="+1 (555) 123-4567"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    />
                  </div>
                  {errors.contactNumber && <p className="mt-1 text-sm text-red-500">{errors.contactNumber}</p>}
                </div>
              )}

              {userType === 'guide' && (
                <div>
                  <label htmlFor="guideId" className="block text-sm font-medium mb-2 text-gray-700">
                    Guide ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="guideId"
                      className="block w-full pl-10 pr-3 py-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:ring-teal-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      placeholder="Enter your guide ID"
                      value={formData.guideId}
                      onChange={(e) => handleInputChange('guideId', e.target.value)}
                    />
                  </div>
                  {errors.guideId && <p className="mt-1 text-sm text-red-500">{errors.guideId}</p>}
                </div>
              )}

              {userType === 'restaurant' && (
                <>
                  <div>
                    <label htmlFor="restaurantType" className="block text-sm font-medium mb-2 text-gray-700">
                      Restaurant Type
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="restaurantType"
                        className="block w-full pl-10 pr-3 py-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:ring-teal-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                        value={formData.restaurantType}
                        onChange={(e) => handleInputChange('restaurantType', e.target.value)}
                      >
                        <option value="" className="text-gray-800">Select restaurant type</option>
                        {restaurantTypes.map((type) => (
                          <option key={type} value={type} className="text-gray-800">{type}</option>
                        ))}
                      </select>
                    </div>
                    {errors.restaurantType && <p className="mt-1 text-sm text-red-500">{errors.restaurantType}</p>}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-2 text-gray-700">
                      Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        id="address"
                        rows={3}
                        className="block w-full pl-10 pr-3 py-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:ring-teal-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                        placeholder="Enter your restaurant address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </div>
                    {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                  </div>
                </>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="block w-full pl-10 pr-10 py-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:ring-teal-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500 hover:text-teal-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500 hover:text-teal-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className="block w-full pl-10 pr-10 py-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:ring-teal-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500 hover:text-teal-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500 hover:text-teal-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r ${config.gradient} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;