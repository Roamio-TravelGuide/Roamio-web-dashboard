import React from 'react';
import { 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  Zap, 
  Target, 
  Users, 
  Star,
  AlertCircle,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

interface SubscriptionProps {
  onBack: () => void;
}

const Payments: React.FC<SubscriptionProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Full-width header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mt-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-3xl mb-6 shadow-xl backdrop-blur-sm">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Join Roamio Business Network</h1>
            <p className="text-xl text-white/90 max-w-4xl mx-auto">
              Amplify your restaurant's visibility and connect with travelers in your area
            </p>
          </div>
        </div>
      </div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Value proposition section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Hyper-Local Visibility</h2>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Your restaurant will automatically appear to travelers within a <strong className="text-teal-600">5-meter radius</strong>, 
              bringing spontaneous visitors directly to your door.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <p className="ml-3 text-gray-700">Real-time visibility to nearby travelers</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <p className="ml-3 text-gray-700">No complicated setup - works automatically</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <p className="ml-3 text-gray-700">Perfect for impulse visitors and foot traffic</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Targeted Audience</h2>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Reach travelers who are actively looking for dining options in your exact location, 
              with higher conversion rates than traditional advertising.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <p className="ml-3 text-gray-700">Pre-qualified, hungry customers</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <p className="ml-3 text-gray-700">Tourists looking for authentic experiences</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <p className="ml-3 text-gray-700">Locals discovering new spots</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Pricing card */}
            <div className="p-8 lg:p-10 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Business Subscription</h3>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
              <div className="mb-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">$29</div>
                <div className="text-lg text-gray-600">per month</div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>5-meter radius visibility</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Unlimited menu items</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Photo gallery (up to 20 images)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Customer reviews & ratings</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Basic analytics dashboard</span>
                </div>
              </div>
              <button className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 to-blue-700 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center">
                Subscribe Now
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>

            {/* Feature details */}
            <div className="p-8 lg:p-10 lg:col-span-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Everything Included</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/50 rounded-xl p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Location Visibility</h4>
                  <p className="text-gray-700">Appear automatically when travelers are within 5 meters</p>
                </div>
                <div className="bg-white/50 rounded-xl p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Profile</h4>
                  <p className="text-gray-700">Showcase your menu, photos, and special offers</p>
                </div>
                <div className="bg-white/50 rounded-xl p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Customer Insights</h4>
                  <p className="text-gray-700">View visitor statistics and peak hours</p>
                </div>
                <div className="bg-white/50 rounded-xl p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <CreditCard className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Flexible Billing</h4>
                  <p className="text-gray-700">Cancel anytime with no long-term contracts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Onboarding steps */}
        \</div>
    </div>
  );
};

export default Payments;