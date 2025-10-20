import { useState } from 'react';
import { Link } from 'react-router-dom';
import { images } from "../../assets/assets";
import { FaSearch, FaFilter, FaMapMarkerAlt, FaClock, FaUsers, FaStar, FaHeadphones, FaDownload, FaPlay, FaPause, FaHeart, FaShare, FaArrowLeft } from 'react-icons/fa';

const Tours = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [playingAudio, setPlayingAudio] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  const categories = [
    { id: 'all', name: 'All Tours' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'nature', name: 'Nature' },
    { id: 'historical', name: 'Historical' },
    { id: 'urban', name: 'Urban' },
  ];

  const tours = [
    {
      id: 1,
      title: "Sigiriya Rock Fortress Audio Journey",
      location: "Sigiriya, Sri Lanka",
      duration: "2-3 hours",
      groupSize: "Solo or Small Group",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.9,
      reviews: 1274,
      category: "historical",
      image: images.Island,
      features: ["GPS Navigation", "Offline Access", "Expert Narration", "3D Audio"],
      description: "Explore the ancient rock fortress with immersive audio stories that bring its rich history to life."
    },
    {
      id: 2,
      title: "Temple of the Sacred Tooth Walk",
      location: "Kandy, Sri Lanka",
      duration: "1-2 hours",
      groupSize: "Small Group",
      price: 19.99,
      originalPrice: 24.99,
      rating: 4.8,
      reviews: 892,
      category: "cultural",
      image: images.Kovil,
      features: ["Cultural Insights", "Local Stories", "Peaceful Atmosphere"],
      description: "Discover the spiritual heart of Kandy with guided audio through this sacred temple complex."
    },
    {
      id: 3,
      title: "Ella Nature Sound Trail",
      location: "Ella, Sri Lanka",
      duration: "3-4 hours",
      groupSize: "Solo or Group",
      price: 24.99,
      originalPrice: 29.99,
      rating: 4.7,
      reviews: 654,
      category: "nature",
      image: images.Waterfall,
      features: ["Wildlife Sounds", "Nature Immersion", "Waterfall Visit"],
      description: "Immerse yourself in the sounds of nature while hiking through Ella's stunning landscapes."
    },
    {
      id: 4,
      title: "Colombo City Audio Walk",
      location: "Colombo, Sri Lanka",
      duration: "2-3 hours",
      groupSize: "Solo",
      price: 22.99,
      originalPrice: 27.99,
      rating: 4.6,
      reviews: 543,
      category: "urban",
      image: images.Mosque,
      features: ["City History", "Modern Architecture", "Local Markets"],
      description: "Experience the vibrant capital city through stories of its colonial past and modern transformation."
    },
    {
      id: 5,
      title: "Galle Fort Historical Tour",
      location: "Galle, Sri Lanka",
      duration: "2 hours",
      groupSize: "Small Group",
      price: 26.99,
      originalPrice: 32.99,
      rating: 4.9,
      reviews: 789,
      category: "historical",
      image: images.Train,
      features: ["Dutch Architecture", "Maritime History", "Fort Walls Walk"],
      description: "Step back in time with audio stories from the Dutch colonial era in this UNESCO World Heritage site."
    },
    {
      id: 6,
      title: "Mirissa Beach Soundscape",
      location: "Mirissa, Sri Lanka",
      duration: "1-2 hours",
      groupSize: "Solo",
      price: 18.99,
      originalPrice: 22.99,
      rating: 4.5,
      reviews: 432,
      category: "nature",
      image: images.Morning,
      features: ["Ocean Sounds", "Whale Watching", "Beach Culture"],
      description: "Relax to the sounds of the ocean while learning about marine life and local beach culture."
    }
  ];

  const filteredTours = activeCategory === 'all' 
    ? tours 
    : tours.filter(tour => tour.category === activeCategory);

  const toggleFavorite = (tourId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(tourId)) {
      newFavorites.delete(tourId);
    } else {
      newFavorites.add(tourId);
    }
    setFavorites(newFavorites);
  };

  const toggleAudio = (tourId) => {
    setPlayingAudio(playingAudio === tourId ? null : tourId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section with Navbar Overlay */}
      <section className="relative py-16 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
        {/* Navigation Overlay */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <div className="relative flex flex-row items-center justify-between w-full max-w-7xl px-6 py-4 mx-auto">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src={images.darkLogo} alt="Roamio" className="h-24 w-24" />
            </div>

            {/* Navigation Menu */}
          <div className="items-center hidden px-6 py-3 border rounded-full md:flex bg-white backdrop-blur-xl border-slate-200/60 shadow-lg">
              <nav className="flex items-center gap-8">
                {[
                  { path: "/", label: "Home" },
                  { path: "/tours", label: "Tours" },
                  { path: "/about", label: "About Us" },
                  { path: "/contact", label: "Contact" },
                ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm font-medium text-slate-700 transition-all duration-300 hover:text-teal-500 hover:scale-110"
                >
                  {item.label}
                </Link>
                ))}
              </nav>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="flex items-center justify-center gap-3 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-105 hover:shadow-2xl shadow-lg transform hover:-translate-y-1"
              >
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-6 text-center pt-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Discover Your Next
            <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              Audio Adventure
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Choose from our curated collection of immersive audio tours. Each journey tells a unique story.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tours, locations, or themes..."
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-400 hover:to-blue-500 transition-all duration-300">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Categories Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-300 hover:text-teal-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <div key={tour.id} className="group bg-white rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url(${tour.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Overlay Actions */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <div className="flex items-center gap-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                      <FaMapMarkerAlt className="w-3 h-3 text-teal-300" />
                      <span className="text-xs text-white font-medium">{tour.location}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFavorite(tour.id)}
                        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                          favorites.has(tour.id)
                            ? 'bg-red-500/90 text-white'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <FaHeart className="w-3 h-3" />
                      </button>
                      <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300">
                        <FaShare className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Audio Preview */}
                  <div className="absolute bottom-3 left-3">
                    <button
                      onClick={() => toggleAudio(tour.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300"
                    >
                      {playingAudio === tour.id ? (
                        <FaPause className="w-3 h-3 text-teal-600" />
                      ) : (
                        <FaPlay className="w-3 h-3 text-teal-600" />
                      )}
                      <span className="text-xs font-medium text-slate-700">Preview</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors duration-300 flex-1">
                    {tour.title}
                  </h3>
                  <div className="flex items-center gap-1 bg-slate-100 rounded-full px-2 py-1">
                    <FaStar className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-medium text-slate-700">{tour.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {tour.description}
                </p>

                {/* Tour Details */}
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FaClock className="w-3 h-3" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaUsers className="w-3 h-3" />
                    <span>{tour.groupSize}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {tour.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full border border-teal-200"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-teal-600">Rs.{tour.price}</span>
                    <span className="text-sm text-slate-400 line-through">Rs.{tour.originalPrice}</span>
                  </div>
                  <Link
                    to={`/tour/${tour.id}`}
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-teal-400 hover:to-blue-500 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    View Tour
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:border-teal-300 hover:text-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl">
            Load More Tours
          </button>
        </div>
      </main>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 py-16 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Never Miss a New Adventure
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Subscribe to get notified about new audio tours, exclusive deals, and travel inspiration.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-xl hover:from-teal-400 hover:to-blue-500 transition-all duration-300 shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tours;