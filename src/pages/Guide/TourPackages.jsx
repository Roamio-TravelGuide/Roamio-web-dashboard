import React from "react";
import { FaMapMarkerAlt, FaStar, FaCheckCircle, FaArrowRight, FaEdit, FaChartLine, FaUsers, FaSearch, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const TourPackages = () => {
  const myTours = [
    {
      id: 1,
      title: "Sigiriya Rock Fortress Tour",
      location: "Sigiriya, Sri Lanka",
      price: 29.99,
      rating: 4.9,
      bookings: 142,
      revenue: 4158.58,
      status: "active",
      features: [
        "GPS Auto-Navigation",
        "Professional Narration",
        "Offline Accessibility",
        "2-3 Hour Experience"
      ],
      image: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Kandy Temple Walk",
      location: "Kandy, Sri Lanka",
      price: 19.99,
      rating: 4.8,
      bookings: 87,
      revenue: 1739.13,
      status: "active",
      features: [
        "Cultural Insights",
        "Historical Context",
        "Self-Paced Tour",
        "1-2 Hour Experience"
      ],
      image: "https://images.unsplash.com/photo-1581857514791-6defb6f8c1b6?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Ella Nature Trail",
      location: "Ella, Sri Lanka",
      price: 24.99,
      rating: 4.7,
      bookings: 63,
      revenue: 1574.37,
      status: "active",
      features: [
        "Wildlife Spotting Guide",
        "Nature Sounds",
        "Geology Explanations",
        "3-4 Hour Experience"
      ],
      image: "https://images.unsplash.com/photo-1518544866330-95b5af6d2367?w=800&h=600&fit=crop"
    },
    {
      id: 4,
      title: "Colombo City Explorer",
      location: "Colombo, Sri Lanka",
      price: 22.99,
      rating: 4.6,
      bookings: 45,
      revenue: 1034.55,
      status: "draft",
      features: [
        "Urban Exploration",
        "Architecture Guide",
        "Food Recommendations",
        "2-3 Hour Experience"
      ],
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop"
    }
  ];

  const performanceStats = [
    { name: "Total Tours", value: 4, icon: FaMapMarkerAlt, trend: "neutral" },
    { name: "Active Tours", value: 3, icon: FaChartLine, trend: "up" },
    { name: "Total Bookings", value: 337, icon: FaUsers, trend: "up" },
    { name: "Total Revenue", value: "$8,506.63", icon: FaUsers, trend: "up" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="px-6 py-8 bg-gradient-to-r from-slate-900 to-blue-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="text-sm font-medium tracking-wide text-teal-400">TOUR MANAGEMENT</span>
              <h1 className="text-3xl font-light text-white leading-tight">My Tour Packages</h1>
              <p className="text-slate-300">Manage and analyze your audio tour offerings with detailed insights</p>
            </div>
            <Link
              to="/guide/tours/view"
              className="flex items-center px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              <FaEdit className="w-4 h-4 mr-2" />
              Create New Tour
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-5 pb-12">
        <div className="mx-auto sm:px-6 lg:px-12">
          {/* Action Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <select className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Archived</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tours..."
                  className="pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FaSearch className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Tours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myTours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group">
                {/* Tour Image */}
                <div className="relative h-48 w-full">
                  <img 
                    src={tour.image} 
                    alt={tour.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                      tour.status === "active" ? "bg-teal-100 text-teal-800" : 
                      tour.status === "draft" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-800"
                    }`}>
                      {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                    </div>
                  </div>
                </div>

                {/* Tour Details */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{tour.title}</h3>
                      <div className="flex items-center mt-1 text-sm text-slate-500">
                        <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                        {tour.location}
                      </div>
                    </div>
                    <div className="flex items-center bg-slate-100 px-2 py-1 rounded-full">
                      <FaStar className="w-3 h-3 text-amber-400 mr-1" />
                      <span className="text-xs font-medium">{tour.rating}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {tour.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <FaCheckCircle className="w-3 h-3 text-teal-500 mr-2 flex-shrink-0" />
                        <span className="text-xs text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500">Bookings</div>
                      <div className="text-sm font-medium text-slate-800">{tour.bookings}</div>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="text-xs text-slate-500">Revenue</div>
                      <div className="text-sm font-medium text-slate-800">${tour.revenue.toFixed(2)}</div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/guide/tours/${tour.id}/edit`}
                        className="p-2 text-slate-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/guide/tours/${tour.id}/analytics`}
                        className="p-2 text-slate-500 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-colors"
                        title="Analytics"
                      >
                        <FaChartLine className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Tour Card */}
            <Link
              to="/guide/tourcreate"
              className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-6 border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
                <FaEdit className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-1">Create New Tour</h3>
              <p className="text-sm text-slate-500 text-center">Design a new audio tour experience for your audience</p>
            </Link>
          </div>

          {/* Performance Section */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Tour Performance Insights</h3>
            
            {/* Best Performing Tour */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-xl overflow-hidden shadow-xl">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0 md:w-1/3">
                    <img 
                      src={myTours[0].image} 
                      alt={myTours[0].title} 
                      className="w-full h-48 md:h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-1 bg-teal-500/20 text-teal-400 rounded-full">TOP PERFORMING</span>
                      <span className="text-xs text-slate-300">Avg. rating {myTours[0].rating}</span>
                    </div>
                    <h4 className="text-2xl font-light text-white mb-2">{myTours[0].title}</h4>
                    <p className="text-slate-300 mb-6">{myTours[0].location}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-slate-800/30 p-3 rounded-lg backdrop-blur-sm">
                        <p className="text-xs text-slate-400">Price</p>
                        <p className="text-lg font-medium text-white">${myTours[0].price.toFixed(2)}</p>
                      </div>
                      <div className="bg-slate-800/30 p-3 rounded-lg backdrop-blur-sm">
                        <p className="text-xs text-slate-400">Bookings</p>
                        <p className="text-lg font-medium text-white">{myTours[0].bookings}</p>
                      </div>
                      <div className="bg-slate-800/30 p-3 rounded-lg backdrop-blur-sm">
                        <p className="text-xs text-slate-400">Revenue</p>
                        <p className="text-lg font-medium text-white">${myTours[0].revenue.toFixed(2)}</p>
                      </div>
                      <div className="bg-slate-800/30 p-3 rounded-lg backdrop-blur-sm">
                        <p className="text-xs text-slate-400">Features</p>
                        <p className="text-lg font-medium text-white">{myTours[0].features.length}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/guide/tours/${myTours[0].id}/analytics`}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        View Analytics
                      </Link>
                      <Link
                        to={`/guide/tours/${myTours[0].id}/edit`}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Edit Tour
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPackages;