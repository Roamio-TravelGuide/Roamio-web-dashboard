import { images } from "../../assets/assets";
import { FaHome, FaHandshake, FaUser, FaMapMarkerAlt, FaMobileAlt, FaBroadcastTower, FaPlay, FaArrowRight, FaStar, FaUsers, FaRoute, FaHeadphones, FaCheckCircle, FaArrowDown } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { audio } from "../../assets/assets";

const Home = () => {
  const backgroundImages = [images.Evening, images.Mosque, images.Church, images.Train, images.Lake, images.Kovil];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(true);
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x: x - 0.5, y: y - 0.5 });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    backgroundImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      setIsImageLoaded(false);
      const nextIndex = (currentImageIndex + 1) % backgroundImages.length;
      const img = new Image();
      img.src = backgroundImages[nextIndex];

      img.onload = () => {
        setCurrentImageIndex(nextIndex);
        setIsImageLoaded(true);
      };
    }, 6000);

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  return (
    <div className="relative w-full bg-slate-900 scroll-smooth">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center px-6 py-8 gap-6 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        {/* Navigation */}
        <div className="flex flex-row justify-between items-center w-full max-w-7xl h-10">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-white tracking-tight">Roamio</h1>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center px-4 py-2 bg-slate-800/70 backdrop-blur-lg rounded-full border border-slate-700">
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-xs font-medium text-white hover:text-teal-400 transition-colors duration-300">Home</Link>
              <Link to="/tours" className="text-xs font-medium text-slate-300 hover:text-teal-400 transition-colors duration-300">Tours</Link>
              <Link to="/about" className="text-xs font-medium text-slate-300 hover:text-teal-400 transition-colors duration-300">About Us</Link>
              <Link to="/contact" className="text-xs font-medium text-slate-300 hover:text-teal-400 transition-colors duration-300">Contact</Link>
            </nav>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center w-10 h-10 bg-slate-800/70 backdrop-blur-lg rounded-full hover:bg-slate-700 transition-all duration-300 border border-slate-700 hover:scale-110">
              <FaRoute className="w-3 h-3 text-slate-300" />
            </button>
            <button className="flex items-center justify-center w-10 h-10 bg-slate-800/70 backdrop-blur-lg rounded-full hover:bg-slate-700 transition-all duration-300 border border-slate-700 hover:scale-110">
              <FaUser className="w-3 h-3 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="flex flex-row justify-between items-center w-full max-w-7xl gap-8">
          {/* Hero Text */}
          <div className="flex flex-col items-start max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-normal leading-tight tracking-tight text-white mb-4 animate-fade-in">
              Your Next Audio Adventure Awaits
            </h1>
          </div>

          {/* Hero Description & CTA */}
          <div className="flex flex-col items-start gap-3 max-w-sm">
            <p className="text-sm font-light leading-relaxed tracking-tight text-slate-300">
              Explore stunning destinations through immersive audio experiences and unforgettable GPS-guided journeys with Roamio.
            </p>
            <Link
              to="/discover"
              className="flex items-center justify-center px-6 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-xs font-medium rounded-full hover:from-teal-400 hover:to-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Start Exploring
            </Link>
          </div>
        </div>

        {/* Hero Image & Search */}
        <div className="flex flex-col items-center w-full max-w-7xl">
          {/* Main Hero Image */}
          <div 
            className="relative w-full h-56 rounded-xl overflow-hidden mb-4"
            style={{
              backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "background-image 1.5s ease-in-out"
            }}
          >
            {/* Image indicators */}
            <div className="absolute left-0 right-0 flex justify-center space-x-1.5 bottom-3">
              {backgroundImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    currentImageIndex === index 
                      ? 'bg-white w-4 shadow-lg' 
                      : 'bg-white/50 w-1 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Search Location Card */}
          <div className="flex items-center px-6 py-4 gap-8 w-full max-w-4xl bg-slate-800/90 backdrop-blur-lg rounded-xl shadow-2xl border border-slate-700">
            <div className="flex items-center gap-8 flex-1">
              {/* Location */}
              <div className="flex flex-col justify-center items-start gap-1">
                <div className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="w-3 h-3 text-slate-400" />
                  <span className="text-xs font-medium text-slate-400">Location</span>
                </div>
                <span className="text-sm font-medium text-white">Sri Lanka</span>
              </div>

              {/* Tour Type */}
              <div className="flex flex-col justify-center items-start gap-1">
                <div className="flex items-center gap-1.5">
                  <FaHeadphones className="w-3 h-3 text-slate-400" />
                  <span className="text-xs font-medium text-slate-400">Tour Type</span>
                </div>
                <span className="text-sm font-medium text-white">Audio Walking Tour</span>
              </div>

              {/* Duration */}
              <div className="flex flex-col justify-center items-start gap-1">
                <div className="flex items-center gap-1.5">
                  <FaPlay className="w-3 h-3 text-slate-400" />
                  <span className="text-xs font-medium text-slate-400">Duration</span>
                </div>
                <span className="text-sm font-medium text-white">2-3 Hours</span>
              </div>

              {/* Difficulty */}
              <div className="flex flex-col justify-center items-start gap-1">
                <div className="flex items-center gap-1.5">
                  <FaUsers className="w-3 h-3 text-slate-400" />
                  <span className="text-xs font-medium text-slate-400">Difficulty</span>
                </div>
                <span className="text-sm font-medium text-white">Easy to Moderate</span>
              </div>
            </div>

            {/* Search Button */}
            <button className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full hover:from-teal-400 hover:to-blue-500 transition-all duration-300 hover:scale-110">
              <FaArrowRight className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* Tour Packages Section */}
      <section className="flex flex-col items-end px-6 py-8 gap-6 bg-slate-900">
        {/* Section Header */}
        <div className="flex flex-row justify-between items-end w-full max-w-7xl gap-8">
          <div className="flex flex-col items-start gap-2 max-w-lg">
            <span className="text-xs font-medium tracking-tight text-teal-400">Audio Tour Packages</span>
            <h2 className="text-2xl lg:text-3xl font-light leading-tight tracking-tight text-white">
              Explore Our Exclusive Audio Tour Packages
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-sm font-normal leading-relaxed tracking-tight text-slate-300">
              Find your perfect audio adventure with our curated tour packages. Culture, nature, or history—it's all here for you!
            </p>
          </div>
        </div>

        {/* Tour Cards */}
        <div className="flex flex-row justify-center items-start gap-3 w-full max-w-7xl">
          {/* Featured Tour Card */}
          <div className="flex flex-col items-start p-3 gap-3 bg-slate-800 hover:bg-slate-700 shadow-xl rounded-xl max-w-md transition-all duration-500 hover:scale-105 hover:shadow-2xl group">
            {/* Tour Image */}
            <div 
              className="relative w-full h-48 rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(${images.Island})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="absolute top-3 left-3">
                <div className="flex items-center px-2 py-0.5 gap-1 bg-black/40 backdrop-blur-md rounded-full">
                  <FaMapMarkerAlt className="w-2.5 h-2.5 text-white" />
                  <span className="text-xs font-light text-white">Sri Lanka</span>
                </div>
              </div>
            </div>

            {/* Tour Details */}
            <div className="flex flex-col items-start gap-3 w-full">
              {/* Title & Rating */}
              <div className="flex flex-col items-start gap-1.5 w-full">
                <div className="flex flex-row justify-between items-center w-full">
                  <h3 className="text-lg font-medium tracking-tight text-white">Sigiriya Audio Journey</h3>
                  <div className="flex items-center gap-0.5">
                    <FaStar className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-normal text-slate-300">4.9</span>
                  </div>
                </div>
                <span className="text-base font-semibold text-teal-400">$29.99</span>
              </div>

              {/* Features & CTA */}
              <div className="flex flex-row justify-between items-end gap-6 w-full">
                <div className="flex flex-col items-start gap-0.5">
                  {[
                    "GPS Auto-Navigation",
                    "Professional Narration", 
                    "Offline Accessibility",
                    "2-3 Hour Experience"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <FaCheckCircle className="w-2.5 h-2.5 text-teal-400" />
                      <span className="text-xs font-light text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/discover"
                  className="flex items-center justify-center px-4 py-1.5 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-xs font-medium rounded-full hover:from-teal-400 hover:to-blue-500 transition-all duration-300 hover:scale-110 group-hover:shadow-lg"
                >
                  Explore
                </Link>
              </div>
            </div>
          </div>

          {/* Tour Card 2 */}
          <div className="flex flex-col items-center p-3 gap-3 bg-slate-800 hover:bg-slate-700 shadow-xl rounded-xl max-w-xs transition-all duration-500 hover:scale-105 group">
            <div 
              className="relative w-full h-56 rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(${images.Kovil})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="absolute top-3 left-3">
                <div className="flex items-center px-2 py-0.5 gap-1 bg-black/40 backdrop-blur-md rounded-full">
                  <FaMapMarkerAlt className="w-2.5 h-2.5 text-white" />
                  <span className="text-xs font-light text-white">Kandy</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start px-1 gap-1.5 w-full">
              <div className="flex flex-row justify-between items-center w-full">
                <h3 className="text-base font-medium tracking-tight text-white">Temple Audio Walk</h3>
                <div className="flex items-center gap-0.5">
                  <FaStar className="w-2.5 h-2.5 text-yellow-400" />
                  <span className="text-xs font-medium text-slate-300">4.8</span>
                </div>
              </div>
              <span className="text-sm font-semibold text-teal-400">$19.99</span>
            </div>
          </div>

          {/* Tour Card 3 */}
          <div className="flex flex-col items-center p-3 gap-3 bg-slate-800 hover:bg-slate-700 shadow-xl rounded-xl max-w-xs transition-all duration-500 hover:scale-105 group">
            <div 
              className="relative w-full h-56 rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(${images.Waterfall})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="absolute top-3 left-3">
                <div className="flex items-center px-2 py-0.5 gap-1 bg-black/40 backdrop-blur-md rounded-full">
                  <FaMapMarkerAlt className="w-2.5 h-2.5 text-white" />
                  <span className="text-xs font-light text-white">Ella</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start px-1 gap-1.5 w-full">
              <div className="flex flex-row justify-between items-center w-full">
                <h3 className="text-base font-medium tracking-tight text-white">Nature Audio Trail</h3>
                <div className="flex items-center gap-0.5">
                  <FaStar className="w-2.5 h-2.5 text-yellow-400" />
                  <span className="text-xs font-medium text-slate-300">4.7</span>
                </div>
              </div>
              <span className="text-sm font-semibold text-teal-400">$24.99</span>
            </div>
          </div>

          {/* View More Card */}
          <div 
            className="flex items-center justify-center w-32 h-32 rounded-xl cursor-pointer hover:scale-110 transition-all duration-500 bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 group"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${images.Morning})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FaArrowRight className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="flex flex-row justify-between items-center px-6 py-8 gap-6 bg-slate-800">
        {/* Left: Content Card */}
        <div className="flex flex-col items-start gap-3 max-w-2xl">
          <div className="flex flex-col items-start p-6 gap-3 bg-slate-700/50 backdrop-blur-sm rounded-xl border border-slate-600">
            <div className="flex flex-row justify-between items-center w-full">
              <h3 className="text-xl font-medium tracking-tight text-white">Every Step of the Way</h3>
              <button className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full hover:scale-110 transition-all duration-300">
                <FaArrowRight className="w-3 h-3 text-white" />
              </button>
            </div>
            <p className="text-sm font-light leading-relaxed text-teal-300">
              Travel with ease and immersion. From GPS navigation to cultural insights, we ensure seamless audio experiences throughout your journey.
            </p>
          </div>

          {/* Experience Images */}
          <div className="flex items-start gap-3 w-full">
            <div 
              className="flex-1 h-48 rounded-xl transition-transform hover:scale-105 duration-500"
              style={{
                backgroundImage: `url(${images.Train})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
            <div 
              className="w-28 h-24 rounded-xl cursor-pointer hover:scale-110 transition-all duration-500 group"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${images.Church})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="flex items-center justify-center w-full h-full">
                <div className="flex items-center justify-center w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaArrowRight className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Features List */}
        <div className="flex flex-col items-start gap-8 max-w-lg">
          <div className="flex flex-col items-start gap-2">
            <span className="text-xs font-medium tracking-tight text-teal-400">Audio Features</span>
            <h2 className="text-2xl font-medium leading-tight tracking-tight text-white">
              Effortless Audio Travel
            </h2>
          </div>

          <div className="flex flex-col items-start gap-3 w-full">
            {/* GPS Audio Navigation */}
            <div className="flex items-center p-4 gap-4 w-full bg-gradient-to-r from-teal-500/20 to-blue-600/20 border border-teal-500/30 rounded-xl transition-all duration-300 hover:from-teal-500/30 hover:to-blue-600/30 group">
              <div className="flex items-center justify-center w-10 h-10 bg-teal-500/30 backdrop-blur-lg rounded-lg group-hover:scale-110 transition-transform duration-300">
                <FaMapMarkerAlt className="w-4 h-4 text-teal-400" />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <h4 className="text-base font-medium text-white">GPS Audio Navigation</h4>
                <p className="text-xs font-light text-slate-300 leading-relaxed">
                  GPS-guided audio tours with automatic location triggers.
                </p>
              </div>
            </div>

            {/* Offline Audio */}
            <div className="flex items-center p-4 gap-4 w-full bg-slate-700/50 rounded-xl transition-all duration-300 hover:bg-slate-600/50 group">
              <div className="flex items-center justify-center w-10 h-10 bg-slate-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <FaHeadphones className="w-4 h-4 text-teal-400" />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <h4 className="text-base font-medium text-white">Offline Audio</h4>
                <p className="text-xs font-light text-slate-300 leading-relaxed">
                  Download audio content for tours that work completely offline.
                </p>
              </div>
            </div>

            {/* Cultural Stories */}
            <div className="flex items-center p-4 gap-4 w-full bg-slate-700/50 rounded-xl transition-all duration-300 hover:bg-slate-600/50 group">
              <div className="flex items-center justify-center w-10 h-10 bg-slate-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <FaBroadcastTower className="w-4 h-4 text-teal-400" />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <h4 className="text-base font-medium text-white">Cultural Stories</h4>
                <p className="text-xs font-light text-slate-300 leading-relaxed">
                  Rich narratives and historical insights from local experts.
                </p>
              </div>
            </div>

            {/* Smart Recommendations */}
            <div className="flex items-center p-4 gap-4 w-full bg-slate-700/50 rounded-xl transition-all duration-300 hover:bg-slate-600/50 group">
              <div className="flex items-center justify-center w-10 h-10 bg-slate-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <FaMobileAlt className="w-4 h-4 text-teal-400" />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <h4 className="text-base font-medium text-white">Smart Recommendations</h4>
                <p className="text-xs font-light text-slate-300 leading-relaxed">
                  AI-powered suggestions based on your interests and location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section 
        className="flex flex-col items-center px-8 py-12 gap-6 mx-6 rounded-xl"
        style={{
          backgroundImage: `linear-gradient(261.03deg, rgba(0, 0, 0, 0.6) 1.3%, rgba(0, 0, 0, 0.8) 42.14%), url(${images.Sunset})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2 max-w-3xl">
          <span className="text-xs font-medium text-center tracking-tight text-teal-400">Testimonials</span>
          <div className="flex flex-col items-center gap-1.5">
            <h2 className="text-2xl font-medium text-center leading-tight tracking-tight text-white">
              What Our Audio Travelers Say
            </h2>
            <p className="text-xs font-normal text-center tracking-tight text-slate-300">
              Honest opinions from our travelers. Read how they enjoyed audio tours specially designed to provide the best cultural experience.
            </p>
          </div>
        </div>

        {/* Testimonial Card */}
        <div className="flex flex-col items-start p-6 gap-3 bg-black/40 backdrop-blur-lg rounded-xl max-w-xl border border-white/10">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex items-start gap-2.5">
              <div 
                className="w-8 h-8 rounded-full"
                style={{
                  backgroundImage: `url(${images.sarah})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
              <div className="flex flex-col items-start gap-0">
                <span className="text-sm font-medium text-white">Sarah Mitchell</span>
                <span className="text-xs font-light text-slate-300">Audio Tour Enthusiast from Australia</span>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <FaStar className="w-3 h-3 text-yellow-400" />
              <span className="text-xs font-light text-slate-300">4.9/5</span>
            </div>
          </div>
          
          <div className="flex items-start gap-4 w-full">
            <span className="text-2xl text-white font-serif">"</span>
            <p className="text-base font-light leading-relaxed tracking-tight text-white">
              Roamio's audio tours transformed my Sri Lanka trip! The GPS navigation was seamless, and the cultural stories made every location come alive. An unforgettable experience!
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center w-10 h-10 bg-slate-700/70 backdrop-blur-sm rounded-full rotate-180 hover:bg-slate-600 transition-all duration-300 hover:scale-110">
            <FaArrowRight className="w-3 h-3 text-slate-300" />
          </button>
          <button className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full hover:scale-110 transition-all duration-300">
            <FaArrowRight className="w-3 h-3 text-white" />
          </button>
        </div>
      </section>

      {/* About Us Section */}
      <section className="flex flex-col items-center px-6 py-8 bg-slate-900">
        <div className="flex flex-col items-start p-6 gap-8 w-full max-w-7xl bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-col items-start gap-2 max-w-lg">
              <span className="text-xs font-medium tracking-tight text-teal-400">About Us</span>
              <h2 className="text-2xl font-medium leading-tight tracking-tight text-white">
                More Than Audio Tours, It's Cultural Immersion
              </h2>
            </div>
            <div className="flex flex-col items-start gap-4 max-w-sm">
              <p className="text-sm font-normal leading-relaxed tracking-tight text-slate-300">
                Roamio transforms travel into unforgettable audio experiences. We craft journeys that inspire, connect, and leave lasting cultural memories.
              </p>
              <button className="flex items-center justify-center px-6 py-2 border border-teal-500 text-teal-400 text-xs font-medium rounded-full hover:bg-teal-500 hover:text-white transition-all duration-300 hover:scale-105">
                Learn More
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-slate-600" />

          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl font-semibold text-center tracking-tight text-teal-400">50K+</span>
              <span className="text-xs font-normal text-center tracking-tight text-slate-300">Audio Tour Users</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl font-semibold text-center tracking-tight text-white">3</span>
              <span className="text-xs font-normal text-center tracking-tight text-slate-300">Years of Experience</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl font-semibold text-center tracking-tight text-white">200+</span>
              <span className="text-xs font-normal text-center tracking-tight text-slate-300">Audio Tours Worldwide</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl font-semibold text-center tracking-tight text-teal-400">95+</span>
              <span className="text-xs font-normal text-center tracking-tight text-slate-300">Partner Collaborations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Action Cards Section */}
      <div 
        id="action-cards" 
        data-animate
        className={`px-6 py-12 bg-gradient-to-b from-slate-900 to-slate-800 transition-all duration-1000 ${
          isVisible['action-cards'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="grid gap-6 mx-auto max-w-7xl lg:grid-cols-2">
          {/* Create Tour Card */}
          <div className={`group overflow-hidden transition-all duration-700 bg-slate-800 hover:bg-slate-700 shadow-xl rounded-xl hover:shadow-2xl hover:scale-105 border border-slate-700 ${
            isVisible['action-cards'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
          }`}>
            <div className="relative overflow-hidden lg:h-40">
              <img
                src={images.Creator}
                alt="Creator"
                className="object-cover w-full h-full transition-transform duration-700 transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute top-3 left-3">
                <div className="px-2 py-0.5 text-xs font-medium text-white rounded-full bg-black/40 backdrop-blur-sm">
                  For Creators
                </div>
              </div>
            </div>
            <div className="p-5 lg:p-6">
              <h3 className="mb-2 text-lg font-semibold text-white lg:text-xl">
                Create a new tour
              </h3>
              <p className="mb-4 leading-relaxed text-slate-300 text-xs">
                Start using our collaborative publishing tool straight away. There's no upfront cost and an experienced audio tour editor will help you through each step of the process.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Link
                  to="/signin"
                  className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white transition-all duration-300 rounded-full shadow-xl group bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 hover:scale-105 hover:shadow-2xl text-xs"
                >
                  Start Creating
                  <FaArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-1" />
                </Link>
                <button className="inline-flex items-center gap-1.5 px-3 py-2 font-medium text-slate-300 transition-all duration-300 border border-slate-600 rounded-full hover:bg-slate-700 hover:border-slate-500 text-xs">
                  <FaPlay className="w-2.5 h-2.5" />
                  Watch Tutorial
                </button>
              </div>
            </div>
          </div>

          {/* Explore Tours Card */}
          <div className={`group overflow-hidden transition-all duration-700 delay-300 bg-slate-800 hover:bg-slate-700 shadow-xl rounded-xl hover:shadow-2xl hover:scale-105 border border-slate-700 ${
            isVisible['action-cards'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
          }`}>
            <div className="relative overflow-hidden lg:h-40">
              <img
                src={images.Explore}
                alt="Explore"
                className="object-cover w-full h-full transition-transform duration-700 transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute top-3 left-3">
                <div className="px-2 py-0.5 text-xs font-medium text-white rounded-full bg-black/40 backdrop-blur-sm">
                  For Travelers
                </div>
              </div>
            </div>
            <div className="p-5 lg:p-6">
              <h3 className="mb-2 text-lg font-semibold text-white lg:text-xl">
                Continue exploring
              </h3>
              <p className="mb-4 leading-relaxed text-slate-300 text-xs">
                Our flexible pricing and distribution options work for partners large and small, covering everything from a marriage proposal by audio guide to 42 of them in 7 languages for a tourism board.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Link
                  to="/discover"
                  className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white transition-all duration-300 rounded-full shadow-xl group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:scale-105 hover:shadow-2xl text-xs"
                >
                  Explore Tours
                  <FaMapMarkerAlt className="w-2.5 h-2.5 transition-transform group-hover:scale-110" />
                </Link>
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 px-3 py-2 font-medium text-slate-300 transition-all duration-300 border border-slate-600 rounded-full hover:bg-slate-700 hover:border-slate-500 text-xs"
                >
                  Learn More
                  <FaArrowRight className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;