import React from 'react';
import { 
  FiTrendingUp, 
  FiMapPin, 
  FiStar,
  FiChevronRight,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight as FiRight
} from 'react-icons/fi';

const VendorDashboard = () => {
  // Mock data
  const vendorData = {
    name: "Sunset Café",
    logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200",
    coverPhoto: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
    location: { lat: 25.7617, lng: -80.1918 },
    stats: [
      { title: "Monthly Views", value: "1,240", change: "+12%", icon: <FiTrendingUp /> },
      { title: "Recommendations", value: "89", change: "+8%", icon: <FiMapPin /> },
      { title: "Avg. Rating", value: "4.7", change: "+0.2", icon: <FiStar /> }
    ],
    reviews: [
      { user: "Alex M.", comment: "Best coffee in town!", rating: 5 },
      { user: "Sarah K.", comment: "Loved the avocado toast.", rating: 4 },
      { user: "James L.", comment: "Great place to unwind.", rating: 5 }
    ],
    activePackages: [
      {
        id: 1,
        name: "Morning Coffee Bundle",
        description: "2 coffees + breakfast pastry",
        price: "$12.99",
        duration: "1 hour",
        bookings: 24,
        status: "active"
      },
      {
        id: 2,
        name: "Sunset Happy Hour",
        description: "2 cocktails + appetizer platter",
        price: "$22.99",
        duration: "2 hours", 
        bookings: 18,
        status: "active"
      },
      {
        id: 3,
        name: "Family Brunch",
        description: "4 meals + unlimited coffee",
        price: "$45.99",
        duration: "1.5 hours",
        bookings: 12,
        status: "active"
      },
      {
        id: 4,
        name: "Date Night Special",
        description: "3-course meal + wine",
        price: "$59.99",
        duration: "2.5 hours",
        bookings: 8,
        status: "active"
      }
    ]
  };

  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen vendor-dashboard bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-96">
        <img 
          src={vendorData.coverPhoto} 
          alt="Cafe Cover" 
          className="object-cover w-full h-full"
        />
        
        <div className="absolute bottom-0 left-0 right-0 w-4/5 p-6 mx-auto -mb-12 border shadow-xl bg-white/80 backdrop-blur-sm rounded-xl border-white/20">
          <div className="flex items-end gap-6">
            <div className="w-24 h-24 -mt-16 overflow-hidden border-4 border-white rounded-full shadow-lg">
              <img 
                src={vendorData.logo} 
                alt="Business Logo" 
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{vendorData.name}</h1>
              <p className="mt-2 text-gray-600">Open today: 8:00 AM - 9:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-6 pt-20 pb-12 mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
          {vendorData.stats.map((stat, index) => (
            <div key={index} className="p-6 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-3 text-indigo-600 bg-indigo-100 rounded-full">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="mt-1 text-2xl font-bold">{stat.value}</h3>
                  <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change} from last month
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Packages Section with Horizontal Scroll */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Active Packages</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => scroll('left')}
                className="p-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <FiChevronLeft />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <FiRight />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div 
              ref={scrollRef}
              className="flex pb-4 space-x-4 overflow-x-auto scrollbar-hide"
            >
              {vendorData.activePackages.map(pkg => (
                <div 
                  key={pkg.id} 
                  className="flex-shrink-0 p-4 transition-shadow border rounded-lg w-86 hover:shadow-md"
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800 truncate">{pkg.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      pkg.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {pkg.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 truncate">{pkg.description}</p>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                    <div className="flex flex-col items-center text-gray-500">
                      <FiDollarSign size={14} />
                      <span>{pkg.price}</span>
                    </div>
                    <div className="flex flex-col items-center text-gray-500">
                      <FiClock size={14} />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex flex-col items-center text-gray-500">
                      <FiUsers size={14} />
                      <span>{pkg.bookings}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map and Reviews Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden bg-white shadow-sm rounded-xl">
              <h2 className="p-6 pb-0 text-xl font-semibold text-gray-800">Location</h2>
              <div className="relative w-full bg-gray-200 h-96">
                <iframe
                  title="Business Location"
                  className="absolute inset-0 w-full h-full"
                  src={`https://maps.google.com/maps?q=${vendorData.location.lat},${vendorData.location.lng}&z=15&output=embed`}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>

          <div>
            <div className="overflow-hidden bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Recent Reviews</h2>
                <a href="/reviews" className="flex items-center text-sm text-indigo-600 hover:underline">
                  View all <FiChevronRight className="ml-1" />
                </a>
              </div>
              <div className="divide-y">
                {vendorData.reviews.map((review, index) => (
                  <div key={index} className="p-6">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{review.user}</h4>
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={`${i < review.rating ? 'fill-current' : 'text-gray-300'}`} 
                            size={16}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                    <p className="mt-3 text-xs text-gray-400">2 days ago</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styling */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default VendorDashboard;