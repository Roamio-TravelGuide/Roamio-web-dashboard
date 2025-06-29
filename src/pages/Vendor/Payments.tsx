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
  ArrowLeft
} from 'lucide-react';

interface SubscriptionProps {
  onBack: () => void;
}

const Payments: React.FC<SubscriptionProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-600 to-blue-700 rounded-2xl mb-6 shadow-xl">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Roamio</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let travelers discover your café or restaurant and boost your business visibility
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-teal-600 to-blue-700 px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <Target className="w-16 h-16 text-white mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold text-white mb-4">Get Discovered by Travelers</h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Your restaurant will be visible to travelers within a 5-meter radius, bringing more customers to your door
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Main Message */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200 mb-8">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Connect with Travelers Near You
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  For you to join Roamio and let travelers know about your café/restaurant, please follow the instructions below. 
                  Your restaurant will be visible to travelers in a <strong>5-meter radius</strong> around your location.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Benefits */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">What You Get:</h3>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">5-Meter Radius Visibility</h4>
                    <p className="text-gray-600">Travelers within 5 meters of your location will see your restaurant in their Roamio app</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Increased Foot Traffic</h4>
                    <p className="text-gray-600">Connect with tourists and locals looking for authentic dining experiences</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Visibility</h4>
                    <p className="text-gray-600">Showcase your menu, photos, and reviews to potential customers</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border-2 border-blue-200">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Subscription Required</h3>
                  <div className="text-5xl font-bold text-gray-900 mb-2">$29</div>
                  <div className="text-lg text-gray-600 mb-6">per month</div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">5-meter radius visibility</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Profile management</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Photo gallery</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Customer reviews</span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                    <p className="text-sm text-gray-700 font-medium">
                      To have this privilege, you have to pay this amount monthly
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border-2 border-yellow-200 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-6 h-6 text-yellow-600 mr-3" />
                Instructions to Get Started
              </h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-600 text-white rounded-full text-sm font-bold mr-4 mt-0.5">1</span>
                  <div>
                    <h4 className="font-semibold mb-1">Complete Your Business Profile</h4>
                    <p className="text-sm">Fill in all your restaurant details, contact information, and business hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-600 text-white rounded-full text-sm font-bold mr-4 mt-0.5">2</span>
                  <div>
                    <h4 className="font-semibold mb-1">Upload High-Quality Photos</h4>
                    <p className="text-sm">Add attractive photos of your restaurant, food, and ambiance</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-600 text-white rounded-full text-sm font-bold mr-4 mt-0.5">3</span>
                  <div>
                    <h4 className="font-semibold mb-1">Subscribe to Roamio</h4>
                    <p className="text-sm">Pay the monthly subscription to activate your 5-meter radius visibility</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-600 text-white rounded-full text-sm font-bold mr-4 mt-0.5">4</span>
                  <div>
                    <h4 className="font-semibold mb-1">Start Welcoming Travelers</h4>
                    <p className="text-sm">Your restaurant will now appear to travelers within 5 meters of your location</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onBack}
                className="flex items-center justify-center space-x-2 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Profile</span>
              </button>
              <button className="px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                Subscribe Now - $29/month
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;