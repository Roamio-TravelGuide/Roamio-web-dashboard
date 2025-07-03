import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Users, 
  ChefHat, 
  ArrowRight,
  ArrowLeft,
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  Building,
  CreditCard
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// TypeScript Types and Interfaces
type UserType = 'traveler' | 'guide' | 'restaurant';
type FormLevel = 1 | 2;

interface UserTypeConfig {
  id: UserType;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  subtitle: string;
  levels: FormLevel[];
}

interface FormData {
  name: string;
  email: string;
  contactNumber: string;
  guideId: string;
  restaurantType: string;
  address: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  contactNumber?: string;
  guideId?: string;
  restaurantType?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface FieldConfig {
  key: keyof FormData;
  label: string;
  type: string;
  placeholder: string;
  icon: LucideIcon;
  required: boolean;
  showFor: UserType[];
  level: FormLevel;
}

// Configuration Data
const userTypes: UserTypeConfig[] = [
  {
    id: 'traveler',
    title: 'Traveler',
    description: 'Discover amazing places and connect with local guides for unforgettable experiences.',
    icon: MapPin,
    gradient: 'from-blue-500 to-teal-500',
    subtitle: 'Start your journey of discovery',
    levels: [1]
  },
  {
    id: 'guide',
    title: 'Local Guide',
    description: 'Share your local knowledge and help travelers discover the hidden gems of your area.',
    icon: Users,
    gradient: 'from-emerald-500 to-teal-500',
    subtitle: 'Share your local expertise',
    levels: [1]
  },
  {
    id: 'restaurant',
    title: 'Restaurant',
    description: 'Showcase your culinary offerings and attract food lovers from around the world.',
    icon: ChefHat,
    gradient: 'from-blue-500 to-teal-500',
    subtitle: 'Showcase your culinary excellence',
    levels: [1, 2]
  }
];

const fieldConfigs: FieldConfig[] = [
  {
    key: 'name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Enter your full name',
    icon: User,
    required: true,
    showFor: ['traveler', 'guide', 'restaurant'],
    level: 1
  },
  {
    key: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email',
    icon: Mail,
    required: true,
    showFor: ['traveler', 'guide', 'restaurant'],
    level: 1
  },
  {
    key: 'contactNumber',
    label: 'Contact Number',
    type: 'tel',
    placeholder: 'Enter your contact number',
    icon: Phone,
    required: true,
    showFor: ['traveler', 'guide', 'restaurant'],
    level: 1
  },
  {
    key: 'guideId',
    label: 'Guide License ID',
    type: 'text',
    placeholder: 'Enter your guide license ID',
    icon: CreditCard,
    required: true,
    showFor: ['guide'],
    level: 1
  },
  {
    key: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Create a strong password',
    icon: Lock,
    required: true,
    showFor: ['traveler', 'guide'],
    level: 1
  },
  {
    key: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Confirm your password',
    icon: Lock,
    required: true,
    showFor: ['traveler', 'guide'],
    level: 1
  },
  // Restaurant Level 1
  {
    key: 'restaurantType',
    label: 'Restaurant Type',
    type: 'text',
    placeholder: 'e.g., Italian, Asian, Casual Dining',
    icon: ChefHat,
    required: true,
    showFor: ['restaurant'],
    level: 1
  },
  {
    key: 'address',
    label: 'Business Address',
    type: 'text',
    placeholder: 'Enter your business address',
    icon: Building,
    required: true,
    showFor: ['restaurant'],
    level: 1
  },
  // Restaurant Level 2
  {
    key: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Create a strong password',
    icon: Lock,
    required: true,
    showFor: ['restaurant'],
    level: 2
  },
  {
    key: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Confirm your password',
    icon: Lock,
    required: true,
    showFor: ['restaurant'],
    level: 2
  }
];

const UnifiedSignup: React.FC = () => {
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [currentLevel, setCurrentLevel] = useState<FormLevel>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
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
  
  const [errors, setErrors] = useState<FormErrors>({});

  // Get configuration for selected user type
  const config = selectedUserType ? userTypes.find(type => type.id === selectedUserType) : null;

  // Animated Background Component
  const AnimatedBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-400/10 blur-[60px] animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-emerald-400/10 blur-[60px] animate-bounce"></div>
      <div className="absolute top-2/3 left-1/3 w-72 h-72 rounded-full bg-purple-400/10 blur-[60px] animate-pulse"></div>
      
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/20 animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );

  // Enhanced animation handler with smoother transitions
  const handleUserTypeSelect = (userType: UserType): void => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedUserType(userType);
      setCurrentLevel(1);
      setFormData({
        name: '',
        email: '',
        contactNumber: '',
        guideId: '',
        restaurantType: '',
        address: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
      setIsAnimating(false);
    }, 300);
  };

  const handleBack = (): void => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedUserType(null);
      setCurrentLevel(1);
      setFormData({
        name: '',
        email: '',
        contactNumber: '',
        guideId: '',
        restaurantType: '',
        address: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
      setIsAnimating(false);
    }, 300);
  };

  const handleNextLevel = (): void => {
    if (validateCurrentLevel()) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentLevel(2);
        setErrors({});
        setIsAnimating(false);
      }, 300);
    }
  };

  const handlePreviousLevel = (): void => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentLevel(1);
      setErrors({});
      setIsAnimating(false);
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateCurrentLevel = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!selectedUserType) return false;
    
    const relevantFields = fieldConfigs.filter(field => 
      field.showFor.includes(selectedUserType) && 
      field.required && 
      field.level === currentLevel
    );
    
    relevantFields.forEach(field => {
      const value = formData[field.key];
      if (!value.trim()) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });
    
    // Email validation
    if (currentLevel === 1 && formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation (only on the level where password is shown)
    const passwordField = fieldConfigs.find(field => 
      field.key === 'password' && 
      field.showFor.includes(selectedUserType) && 
      field.level === currentLevel
    );
    
    if (passwordField && formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    // Confirm password validation
    const confirmPasswordField = fieldConfigs.find(field => 
      field.key === 'confirmPassword' && 
      field.showFor.includes(selectedUserType) && 
      field.level === currentLevel
    );
    
    if (confirmPasswordField && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateCurrentLevel()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle successful signup
      console.log('Signup successful:', { userType: selectedUserType, ...formData });
      
      // You would typically redirect or show success message here
      alert('Account created successfully!');
      
    } catch (error) {
      setErrors({
        general: 'An error occurred while creating your account. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormField = (fieldConfig: FieldConfig, index: number): React.ReactElement | null => {
    if (!selectedUserType || 
        !fieldConfig.showFor.includes(selectedUserType) || 
        fieldConfig.level !== currentLevel) {
      return null;
    }

    const { key, label, type, placeholder, icon: Icon } = fieldConfig;
    const isPassword = type === 'password';
    const isConfirmPassword = key === 'confirmPassword';
    
    const showPasswordToggle = isPassword && key === 'password' ? showPassword : 
                              isConfirmPassword ? showConfirmPassword : false;
    
    const inputType = isPassword ? (showPasswordToggle ? 'text' : 'password') : type;

    return (
      <div 
        key={`${key}-${currentLevel}`}
        className={`transition-all duration-500 ease-out ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        style={{ transitionDelay: `${300 + index * 50}ms` }}
      >
        <label htmlFor={key} className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            id={key}
            name={key}
            type={inputType}
            value={formData[key]}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${
              errors[key] ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => {
                if (key === 'password') {
                  setShowPassword(!showPassword);
                } else {
                  setShowConfirmPassword(!showConfirmPassword);
                }
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showPasswordToggle ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {errors[key] && (
          <p className="mt-1 text-sm text-red-600">{errors[key]}</p>
        )}
      </div>
    );
  };

  if (!selectedUserType) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-950 via-teal-800 to-teal-900">
        <AnimatedBackground />
        
        {/* Main Content */}
        <div className={`relative z-10 px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="p-8 mb-16 text-center">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Begin Your Roamio Journey</h1>
            <p className="mt-4 text-xl text-white/80">Choose your role to get started</p>
            <p className="text-gray-400">
              Existing member? 
              <a href="/signin" className="ml-2 font-medium text-teal-400 transition-colors duration-200 hover:text-teal-300">
                Access your account
              </a>
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {userTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  onClick={() => handleUserTypeSelect(type.id)}
                  className={`group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 opacity-0 translate-y-5`}
                  style={{
                    animation: `fadeInUp 0.6s ease-out forwards ${index * 0.15}s`
                  }}
                >
                  <div className="flex flex-col h-full p-8 transition-all duration-500 ease-out border shadow-xl border-white/30 bg-white/10 backdrop-blur-lg rounded-2xl hover:shadow-2xl hover:-translate-y-3 hover:bg-white/20 hover:backdrop-blur-xl hover:border-white/50">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${type.gradient} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-center text-white">
                      {type.title}
                    </h3>
                    <p className="flex-grow text-center text-gray-200">
                      {type.description}
                    </p>
                    <div
                      className={`mt-6 text-center text-sm font-medium bg-gradient-to-r ${type.gradient} bg-clip-text text-transparent group-hover:underline`}
                    >
                      Get Started
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  // Signup Form View
  if (!config) return null;

  const IconComponent = config.icon;
  const isRestaurant = selectedUserType === 'restaurant';
  const maxLevel = Math.max(...config.levels);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-950 via-teal-800 to-teal-900">
      <AnimatedBackground />
      
      {/* Form Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8 ">
        <div className={`w-full max-w-lg transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="p-8 border shadow-2xl sm:p-10 border-white/30 bg-white/10 backdrop-blur-xl rounded-2xl">
            <button 
              onClick={handleBack}
              className="inline-flex items-center mb-6 text-sm font-medium transition-all duration-200 text-white/80 hover:text-white hover:translate-x-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to selection
            </button>
            
            <div className={`mb-8 text-center transition-all duration-500 delay-200 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <div className="flex justify-center mb-4">
                <div className={`p-3 bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${isAnimating ? 'scale-0' : 'scale-100'}`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-white">
                {config.title}
              </h1>
              <p className="text-white/80">
                {config.subtitle}
              </p>
              {isRestaurant && (
                <p className="mt-2 text-sm text-white/60">
                  Step {currentLevel} of {maxLevel}
                </p>
              )}
            </div>
            
            <div className={`space-y-5 transition-all duration-500 delay-300 ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
              {errors.general && (
                <div className="p-4 text-sm text-red-100 border border-red-300 rounded-lg bg-red-500/20">
                  {errors.general}
                </div>
              )}
              
              {fieldConfigs.map((field, index) => renderFormField(field, index))}
              
              <div className="flex space-x-4">
                {isRestaurant && currentLevel === 2 && (
                  <button
                    type="button"
                    onClick={handlePreviousLevel}
                    className="flex items-center justify-center flex-1 px-4 py-3 text-sm font-medium text-white transition-all duration-200 border rounded-lg border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </button>
                )}
                
                {isRestaurant && currentLevel < maxLevel ? (
                  <button
                    type="button"
                    onClick={handleNextLevel}
                    className={`flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r ${config.gradient} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-[1.02] active:scale-95`}
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r ${config.gradient} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-[1.02] active:scale-95 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 -ml-1 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account 
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            
            <div className={`mt-6 text-sm text-center text-white/60 transition-all duration-500 delay-700 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              Already have an account?{' '}
              <a href="/signin" className="font-medium text-teal-400 transition-colors hover:text-teal-300">
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedSignup;