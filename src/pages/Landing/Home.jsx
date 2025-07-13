import { images } from "../../assets/assets";
import { FaHome, FaHandshake, FaUser, FaMapMarkerAlt, FaMobileAlt, FaBroadcastTower, FaPlay, FaArrowRight, FaStar, FaUsers, FaRoute, FaHeadphones, FaCheckCircle, FaArrowDown } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { audio } from "../../assets/assets";

const Home = () => {
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const heroRef = useRef(null);
  const audioRef = useRef(null);

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

  // Audio player functionality
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickX = e.nativeEvent.offsetX;
      const width = progressBar.offsetWidth;
      const newTime = (clickX / width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full bg-slate-900 scroll-smooth">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center min-h-screen gap-6 px-6 py-8 bg-gradient-to-br from-white via-gray-50 to-gray-100">
        {/* Navigation */}
        <div className="flex flex-row items-center justify-between w-full h-10 max-w-7xl">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-lg font-bold tracking-tight text-slate-900">Roamio</h1>
          </div>

          {/* Navigation Menu */}
          <div className="items-center hidden px-4 py-2 border rounded-full md:flex bg-slate-800/70 backdrop-blur-lg border-slate-700">
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-xs font-medium text-white transition-colors duration-300 hover:text-teal-400">Home</Link>
              <Link to="/tours" className="text-xs font-medium transition-colors duration-300 text-slate-300 hover:text-teal-400">Tours</Link>
              <Link to="/about" className="text-xs font-medium transition-colors duration-300 text-slate-300 hover:text-teal-400">About Us</Link>
              <Link to="/contact" className="text-xs font-medium transition-colors duration-300 text-slate-300 hover:text-teal-400">Contact</Link>
            </nav>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center w-10 h-10 transition-all duration-300 border rounded-full bg-slate-800/70 backdrop-blur-lg hover:bg-slate-700 border-slate-700 hover:scale-110">
              <FaRoute className="w-3 h-3 text-slate-300" />
            </button>
            <button className="flex items-center justify-center w-10 h-10 transition-all duration-300 border rounded-full bg-slate-800/70 backdrop-blur-lg hover:bg-slate-700 border-slate-700 hover:scale-110">
              <FaUser className="w-3 h-3 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="flex flex-row items-center justify-between w-full gap-8 max-w-7xl">
          {/* Hero Text */}
          <div className="flex flex-col items-start max-w-2xl">
            <h1 className="mb-4 text-4xl font-normal leading-tight tracking-tight lg:text-5xl text-slate-900 animate-fade-in">
              Your Next Audio Adventure Awaits
            </h1>
          </div>

          {/* Hero Description & CTA */}
          <div className="flex flex-col items-start max-w-sm gap-3">
            <p className="text-sm font-light leading-relaxed tracking-tight text-slate-700">
              Explore stunning destinations through immersive audio experiences and unforgettable GPS-guided journeys with Roamio.
            </p>
            <Link
              to="/login"
              className="flex items-center justify-center px-6 py-2 text-xs font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 hover:scale-105 hover:shadow-lg"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Hero Image & Search */}
        <div className="flex flex-col items-center w-full max-w-9xl h-[90%]">
          {/* Main Hero Image */}
          <div 
            className="relative w-full mb-4 overflow-hidden h-96 rounded-xl"
            style={{
              backgroundImage: `url(${images.Train})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
          </div>

        </div>
      </section>

      {/* Tour Packages Section */}
      <section className="flex flex-col items-end gap-6 px-6 py-8 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
        {/* Section Header */}
        <div className="flex flex-row items-end justify-between w-full gap-8 max-w-7xl">
          <div className="flex flex-col items-start max-w-lg gap-2">
            <span className="text-xs font-medium tracking-tight text-teal-400">Audio Tour Packages</span>
            <h2 className="text-2xl font-light leading-tight tracking-tight text-white lg:text-3xl">
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
        <div className="flex flex-row items-start justify-center w-full gap-3 max-w-7xl">
          {/* Featured Tour Card */}
          <div className="flex flex-col items-start max-w-md gap-3 p-3 transition-all duration-500 shadow-xl bg-slate-800 hover:bg-slate-700 rounded-xl hover:scale-105 hover:shadow-2xl group">
            {/* Tour Image */}
            <div 
              className="relative w-full h-48 overflow-hidden rounded-lg"
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
            <div className="flex flex-col items-start w-full gap-3">
              {/* Title & Rating */}
              <div className="flex flex-col items-start gap-1.5 w-full">
                <div className="flex flex-row items-center justify-between w-full">
                  <h3 className="text-lg font-medium tracking-tight text-white">Sigiriya Audio Journey</h3>
                  <div className="flex items-center gap-0.5">
                    <FaStar className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-normal text-slate-300">4.9</span>
                  </div>
                </div>
                <span className="text-base font-semibold text-teal-400">$29.99</span>
              </div>

              {/* Features & CTA */}
              <div className="flex flex-row items-end justify-between w-full gap-6">
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
          <div className="flex flex-col items-center max-w-xs gap-3 p-3 transition-all duration-500 shadow-xl bg-slate-800 hover:bg-slate-700 rounded-xl hover:scale-105 group">
            <div 
              className="relative w-full h-56 overflow-hidden rounded-lg"
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
              <div className="flex flex-row items-center justify-between w-full">
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
          <div className="flex flex-col items-center max-w-xs gap-3 p-3 transition-all duration-500 shadow-xl bg-slate-800 hover:bg-slate-700 rounded-xl hover:scale-105 group">
            <div 
              className="relative w-full h-56 overflow-hidden rounded-lg"
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
              <div className="flex flex-row items-center justify-between w-full">
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
            className="flex items-center justify-center w-32 h-32 transition-all duration-500 cursor-pointer rounded-xl hover:scale-110 bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 group"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${images.Morning})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="flex items-center justify-center w-10 h-10 transition-transform duration-300 rounded-full shadow-lg bg-white/20 backdrop-blur-sm group-hover:scale-110">
              <FaArrowRight className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="flex flex-row items-center justify-between gap-8 px-6 py-8 bg-gradient-to-br from-white via-gray-50 to-gray-100">
        {/* Left: Content Card */}
        <div className="flex flex-col items-start max-w-3xl gap-3">
          <div 
            className="relative flex flex-col items-start gap-3 p-6 overflow-hidden border rounded-xl border-slate-200/30"
            style={{
              backgroundImage: `url(${images.Sigiriya})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            {/* Backdrop blur effect */}
            <div className="absolute inset-0 backdrop-blur-sm"></div>
            
            {/* Content */}
            <div className="relative z-10 w-full">
              <div className="flex flex-row items-center justify-between w-full">
                <h3 className="px-3 py-1 text-xl font-medium tracking-tight text-white rounded-lg backdrop-blur-sm">Every Step of the Way</h3>
                
              </div>
              <p className="px-3 py-2 mt-2 text-sm font-light leading-relaxed text-white rounded-lg">
                Travel with ease and immersion. From GPS navigation to cultural insights, we ensure seamless audio experiences throughout your journey.
              </p>

              {/* Audio Player */}
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={togglePlayPause}
                  className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 hover:scale-105"
                >
                  {isPlaying ? (
                    <div className="w-3 h-3 ">
                      <div className="flex gap-0.5">
                        <div className="w-1 h-3 bg-white"></div>
                        <div className="w-1 h-3 bg-white"></div>
                      </div>
                    </div>
                  ) : (
                    <FaPlay className="w-3 h-3 text-white ml-0.5" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-white  px-2 py-0.5 rounded backdrop-blur-sm">Sigiriya Audio Preview</h4>
                    <div className="text-xs font-medium text-white  px-2 py-0.5 rounded backdrop-blur-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div 
                    className="w-full h-1.5 overflow-hidden rounded-full cursor-pointer bg-white/40 backdrop-blur-sm"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="h-full transition-all duration-150 bg-gradient-to-r from-teal-500 to-blue-600"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Hidden audio element */}
                <audio
                  ref={audioRef}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                >
                  <source src={audio.seegiriya} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          </div>

          {/* Experience Images */}
          <div className="flex items-start w-full gap-3">
            <div 
              className="flex-1 h-48 transition-transform duration-500 rounded-xl hover:scale-105"
              style={{
                backgroundImage: `url(${images.Mosque})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
            <div 
              className="h-24 transition-all duration-500 cursor-pointer w-28 rounded-xl hover:scale-110 group"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${images.Train})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="flex items-center justify-center w-full h-full">
                <div className="flex items-center justify-center w-8 h-8 transition-transform duration-300 rounded-full shadow-lg bg-white/20 backdrop-blur-sm group-hover:scale-110">
                  <FaArrowRight className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Features List */}
        <div className="flex flex-col items-start max-w-md gap-4 ml-4">
          <div className="flex flex-col items-start gap-2">
            <span className="px-2 py-0.5 text-xs font-medium tracking-tight text-teal-700 bg-teal-100 rounded-full">Audio Features</span>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-slate-900">
              Effortless Audio Travel
            </h2>
            <p className="text-xs leading-relaxed text-slate-600">
              Discover destinations through cutting-edge audio technology.
            </p>
          </div>

          <div className="flex flex-col items-start w-full gap-2">
            {/* GPS Audio Navigation */}
            <div className="flex items-center w-full gap-3 p-3 transition-all duration-300 bg-white border rounded-lg shadow-sm border-slate-200 hover:shadow-md hover:border-teal-200 group">
              <div className="flex items-center justify-center w-8 h-8 transition-transform duration-300 rounded-lg bg-teal-50 group-hover:scale-110 group-hover:bg-teal-100">
                <FaMapMarkerAlt className="w-3 h-3 text-teal-600" />
              </div>
              <div className="flex flex-col items-start gap-0.5 flex-1">
                <h4 className="text-sm font-semibold text-slate-900">GPS Audio Navigation</h4>
                <p className="text-xs font-normal leading-relaxed text-slate-600">
                  Intelligent location-based audio triggers automatically.
                </p>
              </div>
            </div>

            {/* Offline Audio */}
            <div className="flex items-center w-full gap-3 p-3 transition-all duration-300 bg-white border rounded-lg shadow-sm border-slate-200 hover:shadow-md hover:border-blue-200 group">
              <div className="flex items-center justify-center w-8 h-8 transition-transform duration-300 rounded-lg bg-blue-50 group-hover:scale-110 group-hover:bg-blue-100">
                <FaHeadphones className="w-3 h-3 text-blue-600" />
              </div>
              <div className="flex flex-col items-start gap-0.5 flex-1">
                <h4 className="text-sm font-semibold text-slate-900">Offline Audio Access</h4>
                <p className="text-xs font-normal leading-relaxed text-slate-600">
                  Download high-quality content for uninterrupted tours.
                </p>
              </div>
            </div>

            {/* Cultural Stories */}
            <div className="flex items-center w-full gap-3 p-3 transition-all duration-300 bg-white border rounded-lg shadow-sm border-slate-200 hover:shadow-md hover:border-purple-200 group">
              <div className="flex items-center justify-center w-8 h-8 transition-transform duration-300 rounded-lg bg-purple-50 group-hover:scale-110 group-hover:bg-purple-100">
                <FaBroadcastTower className="w-3 h-3 text-purple-600" />
              </div>
              <div className="flex flex-col items-start gap-0.5 flex-1">
                <h4 className="text-sm font-semibold text-slate-900">Cultural Stories</h4>
                <p className="text-xs font-normal leading-relaxed text-slate-600">
                  Rich narratives from certified local experts.
                </p>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section 
        className="flex flex-col items-center gap-6 px-8 py-12 mx-6 rounded-xl"
        style={{
          backgroundImage: `linear-gradient(261.03deg, rgba(0, 0, 0, 0.6) 1.3%, rgba(0, 0, 0, 0.8) 42.14%), url(${images.Sunset})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center max-w-3xl gap-2">
          <span className="text-xs font-medium tracking-tight text-center text-teal-400">Testimonials</span>
          <div className="flex flex-col items-center gap-1.5">
            <h2 className="text-2xl font-medium leading-tight tracking-tight text-center text-white">
              What Our Audio Travelers Say
            </h2>
            <p className="text-xs font-normal tracking-tight text-center text-slate-300">
              Honest opinions from our travelers. Read how they enjoyed audio tours specially designed to provide the best cultural experience.
            </p>
          </div>
        </div>

        {/* Testimonial Card */}
        <div className="flex flex-col items-start max-w-xl gap-3 p-6 border bg-black/40 backdrop-blur-lg rounded-xl border-white/10">
          <div className="flex flex-row items-center justify-between w-full">
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
          
          <div className="flex items-start w-full gap-4">
            <span className="font-serif text-2xl text-white">"</span>
            <p className="text-base font-light leading-relaxed tracking-tight text-white">
              Roamio's audio tours transformed my Sri Lanka trip! The GPS navigation was seamless, and the cultural stories made every location come alive. An unforgettable experience!
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center w-10 h-10 transition-all duration-300 rotate-180 rounded-full bg-slate-700/70 backdrop-blur-sm hover:bg-slate-600 hover:scale-110">
            <FaArrowRight className="w-3 h-3 text-slate-300" />
          </button>
          <button className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 hover:scale-110">
            <FaArrowRight className="w-3 h-3 text-white" />
          </button>
        </div>
      </section>

      {/* About Us Section */}
      <section className="flex flex-col items-center px-6 py-8 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
        <div className="flex flex-col items-start w-full gap-8 p-6 border max-w-7xl bg-slate-800/50 backdrop-blur-sm rounded-xl border-slate-700">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-col items-start max-w-lg gap-2">
              <span className="text-xs font-medium tracking-tight text-teal-400">About Us</span>
              <h2 className="text-2xl font-medium leading-tight tracking-tight text-white">
                More Than Audio Tours, It's Cultural Immersion
              </h2>
            </div>
            <div className="flex flex-col items-start max-w-sm gap-4">
              <p className="text-sm font-normal leading-relaxed tracking-tight text-slate-300">
                Roamio transforms travel into unforgettable audio experiences. We craft journeys that inspire, connect, and leave lasting cultural memories.
              </p>
              <button className="flex items-center justify-center px-6 py-2 text-xs font-medium text-teal-400 transition-all duration-300 border border-teal-500 rounded-full hover:bg-teal-500 hover:text-white hover:scale-105">
                Learn More
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-slate-600" />

          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl font-semibold tracking-tight text-center text-teal-400">50K+</span>
              <span className="text-xs font-normal tracking-tight text-center text-slate-300">Audio Tour Users</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl font-semibold tracking-tight text-center text-white">3</span>
              <span className="text-xs font-normal tracking-tight text-center text-slate-300">Years of Experience</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl font-semibold tracking-tight text-center text-white">200+</span>
              <span className="text-xs font-normal tracking-tight text-center text-slate-300">Audio Tours Worldwide</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl font-semibold tracking-tight text-center text-teal-400">95+</span>
              <span className="text-xs font-normal tracking-tight text-center text-slate-300">Partner Collaborations</span>
            </div>
          </div>
        </div>
      </section>
                
    </div>
  );
};

export default Home;