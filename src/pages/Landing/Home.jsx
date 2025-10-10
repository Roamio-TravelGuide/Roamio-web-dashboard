import { images } from "../../assets/assets";
import {
  FaHome,
  FaHandshake,
  FaUser,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaBroadcastTower,
  FaPlay,
  FaArrowRight,
  FaStar,
  FaUsers,
  FaRoute,
  FaHeadphones,
  FaCheckCircle,
  FaArrowDown,
} from "react-icons/fa";
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
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
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
      heroElement.addEventListener("mousemove", handleMouseMove);
      return () =>
        heroElement.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full bg-slate-900 scroll-smooth">
      {/* Hero Section */}
<section className="relative flex flex-col items-center min-h-screen px-6 py-12 bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden">
  {/* Animated Background Elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/4 -left-20 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl animate-float-slow"></div>
    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl animate-float-reverse"></div>
  </div>

  {/* Navigation */}
  <div className="relative flex flex-row items-center justify-between w-full max-w-7xl mb-2">
    {/* Logo */}
<div className="flex items-center gap-3">
  <img 
    src={images.darkLogo} 
    alt="Roamio" 
    className="h-10 w-auto" 
  />
</div>

    {/* Navigation Menu */}
    <div className="items-center hidden px-6 py-3 border rounded-full md:flex bg-white backdrop-blur-xl border-slate-200/60 shadow-lg">
      <nav className="flex items-center gap-8">
        {[
          { path: "/", label: "Home" },
          { path: "/tours", label: "Tours" },
          { path: "/about", label: "About Us" },
          { path: "/contact", label: "Contact" }
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

    {/* Action Icons */}
    <div className="flex items-center gap-3">
    </div>
  </div>

  {/* Hero Content */}
  <div className="relative flex flex-row items-center justify-between w-full max-w-7xl gap-1 -mb-10">
    {/* Hero Text */}
    <div className="flex flex-col items-start max-w-2xl">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-100 mb-6">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-teal-700">Immersive Audio Experiences</span>
        </div>
        <h1 className="text-5xl lg:text-6xl font-light leading-tight tracking-tight text-slate-900 mb-6">
          Your Next
          <span className="block bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent font-semibold">
            Audio Adventure
          </span>
          Awaits
        </h1>
      </div>
    </div>

    {/* Hero Description & CTA */}
    <div className="flex flex-col items-start max-w-md gap-6">
      <p className="text-lg font-light leading-relaxed text-slate-600">
        Explore stunning destinations through immersive audio experiences and unforgettable GPS-guided journeys with Roamio. Let stories unfold around you as you explore.
      </p>
      <div className="flex flex-col gap-4 w-full">
        <Link
          to="/login"
          className="flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white transition-all duration-300 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 hover:scale-105 hover:shadow-2xl shadow-lg transform hover:-translate-y-1"
        >
          <span>Start Your Journey</span>
          <FaArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>50K+ Happy Travelers</span>
          </div>
          <div className="w-px h-4 bg-slate-300"></div>
          <div className="flex items-center gap-2">
            <FaStar className="w-4 h-4 text-yellow-400" />
            <span>4.9/5 Rating</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Hero Image */}
<div className="relative w-full max-w-8xl">
  <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
    {/* Main Image with Overlay - Shorter */}
    <div
      className="relative w-full h-[300px] transform transition-transform duration-700 group-hover:scale-105"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.2)), url(${images.Train})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Floating Elements */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 shadow-lg">
          <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-slate-700">Currently Exploring Sri Lanka</span>
        </div>
      </div>
      </div>

    {/* Floating Action Cards - Adjusted Position */}
    <div className="absolute bottom-4 right-4 flex gap-3">
      <div className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
        <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
          <FaHeadphones className="w-3 h-3 text-white" />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-900">Audio Guides</div>
          <div className="text-[10px] text-slate-600">200+ Tours</div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
          <FaMapMarkerAlt className="w-3 h-3 text-white" />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-900">GPS Navigation</div>
          <div className="text-[10px] text-slate-600">Seamless</div>
        </div>
      </div>
    </div>
  </div>
</div>
</section>

      {/* Tour Packages Section */}
<section className="flex flex-col items-center gap-8 px-6 py-12 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 overflow-hidden">
  {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl gap-4">
          <span className="px-4 py-2 text-sm font-semibold tracking-wide text-teal-700 bg-teal-100 rounded-full uppercase">
            Audio Tour Packages
          </span>
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Immersive Audio Journeys
          </h2>
          <p className="text-lg leading-relaxed text-white/90">
            Step into stories that unfold around you. Our audio tours transform locations into living narratives.
          </p>
        </div>

  {/* Cards Grid - Smaller */}
  <div className="relative w-full max-w-6xl">
    {/* Cards Grid - Compact Size */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
      {/* Tour Card 1 */}
      <div className="group relative">
        <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-teal-400/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg overflow-hidden h-full flex flex-col">
          {/* Floating Rating */}
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full px-2 py-1 border border-white/10">
              <FaStar className="w-2 h-2 text-yellow-400" />
              <span className="text-xs font-medium text-white">4.9</span>
            </div>
          </div>

          {/* Image Container */}
          <div className="relative h-32 rounded-lg overflow-hidden mb-3 flex-shrink-0">
            <div
              className="w-full h-full transform group-hover:scale-110 transition-transform duration-500"
              style={{
                backgroundImage: `url(${images.Island})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-2 left-2">
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/20">
                <FaMapMarkerAlt className="w-2 h-2 text-teal-300" />
                <span className="text-xs font-medium text-white">Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1">
            <div className="space-y-2 flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white group-hover:text-teal-300 transition-colors duration-300 mb-1">
                    Sigiriya Audio Journey
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-teal-400">$29.99</span>
                    <span className="text-xs text-slate-400 line-through">$39.99</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-1">
                {[
                  "GPS Navigation",
                  "Professional Audio",
                  "Offline Access",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
                    <span className="text-xs text-slate-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <Link
                to="/discover"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-xs font-semibold rounded-full hover:from-teal-400 hover:to-blue-500 transition-all duration-300 hover:scale-105 w-full justify-center"
              >
                <span>Explore</span>
                <FaArrowRight className="w-2 h-2 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Card 2 */}
      <div className="group relative">
        <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-blue-400/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg overflow-hidden h-full flex flex-col">
          {/* Floating Rating */}
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full px-2 py-1 border border-white/10">
              <FaStar className="w-2 h-2 text-yellow-400" />
              <span className="text-xs font-medium text-white">4.8</span>
            </div>
          </div>

          {/* Image Container */}
          <div className="relative h-32 rounded-lg overflow-hidden mb-3 flex-shrink-0">
            <div
              className="w-full h-full transform group-hover:scale-110 transition-transform duration-500"
              style={{
                backgroundImage: `url(${images.Kovil})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-2 left-2">
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/20">
                <FaMapMarkerAlt className="w-2 h-2 text-blue-300" />
                <span className="text-xs font-medium text-white">Kandy</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1">
            <div className="space-y-2 flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors duration-300 mb-1">
                    Temple Audio Walk
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-400">$19.99</span>
                    <span className="text-xs text-slate-400 line-through">$24.99</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-1">
                {[
                  "Cultural Heritage",
                  "Local Guides", 
                  "1-2 Hours"
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-slate-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <Link
                to="/discover"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-xs font-semibold rounded-full hover:from-teal-400 hover:to-blue-500 transition-all duration-300 hover:scale-105 w-full justify-center"
              >
                <span>Explore</span>
                <FaArrowRight className="w-2 h-2 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Card 3 */}
      <div className="group relative">
        <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-green-400/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg overflow-hidden h-full flex flex-col">
          {/* Floating Rating */}
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full px-2 py-1 border border-white/10">
              <FaStar className="w-2 h-2 text-yellow-400" />
              <span className="text-xs font-medium text-white">4.7</span>
            </div>
          </div>

          {/* Image Container */}
          <div className="relative h-32 rounded-lg overflow-hidden mb-3 flex-shrink-0">
            <div
              className="w-full h-full transform group-hover:scale-110 transition-transform duration-500"
              style={{
                backgroundImage: `url(${images.Waterfall})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-2 left-2">
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/20">
                <FaMapMarkerAlt className="w-2 h-2 text-green-300" />
                <span className="text-xs font-medium text-white">Ella</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1">
            <div className="space-y-2 flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white group-hover:text-green-300 transition-colors duration-300 mb-1">
                    Nature Audio Trail
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-400">$24.99</span>
                    <span className="text-xs text-slate-400 line-through">$29.99</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-1">
                {[
                  "Wildlife Sounds",
                  "Nature Immersion",
                  "3-4 Hours"
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-slate-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <Link
                to="/discover"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-xs font-semibold rounded-full hover:from-teal-400 hover:to-blue-500 transition-all duration-300 hover:scale-105 w-full justify-center"
              >
                <span>Explore</span>
                <FaArrowRight className="w-2 h-2 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* View More Card */}
      <div className="group relative">
        <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-purple-400/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg overflow-hidden h-full flex flex-col">
          {/* Background Image */}
          <div
            className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
            style={{
              backgroundImage: `url(${images.Morning})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center flex-1 space-y-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
              <FaArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Discover More
              </h3>
              <p className="text-xs text-slate-300">
                Explore all audio adventures
              </p>
            </div>
            <Link
              to="/tours"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-xs font-semibold rounded-full hover:from-teal-400 hover:to-blue-500 transition-all duration-300 hover:scale-105"
            >
              <span>View All</span>
              <FaArrowRight className="w-2 h-2 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Experience Section */}
      <section className="flex flex-col items-center gap-10 px-6 py-16 bg-gradient-to-br from-white via-gray-50 to-gray-100">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center max-w-2xl gap-4">
          <span className="px-4 py-2 text-sm font-semibold tracking-wide text-teal-700 bg-teal-100 rounded-full uppercase">
            Immersive Audio Experience
          </span>
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-slate-900">
            Journey Through Sound
          </h2>
          <p className="text-lg leading-relaxed text-slate-600">
            Discover the world through carefully crafted audio narratives that
            bring destinations to life.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl">
          {/* Left Column - Interactive Demo */}
          <div className="flex flex-col gap-8">
            {/* Audio Experience Card */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              <div
                className="aspect-video relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${images.Sigiriya})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Animated Sound Waves */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-end gap-1 transform scale-150">
                    {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((height, index) => (
                      <div
                        key={index}
                        className={`w-1 bg-teal-400 rounded-t transition-all duration-300 ${
                          isPlaying ? "animate-pulse" : ""
                        }`}
                        style={{
                          height: `${height * 8}px`,
                          animationDelay: `${index * 0.1}s`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-2xl font-bold text-white">
                        Sigiriya Rock Fortress
                      </h3>
                      <p className="text-teal-200 text-sm">
                        Ancient Kingdom Audio Tour
                      </p>
                    </div>
                    <button
                      onClick={togglePlayPause}
                      className="flex items-center justify-center w-14 h-14 transition-all duration-300 rounded-full shadow-2xl bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 hover:scale-110 hover:shadow-3xl"
                    >
                      {isPlaying ? (
                        <div className="flex gap-1">
                          <div className="w-1 h-4 bg-white rounded-full"></div>
                          <div className="w-1 h-4 bg-white rounded-full"></div>
                        </div>
                      ) : (
                        <FaPlay className="w-5 h-5 text-white ml-1" />
                      )}
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div
                      className="w-full h-2 bg-white/30 rounded-full cursor-pointer overflow-hidden"
                      onClick={handleProgressClick}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-full transition-all duration-150"
                        style={{
                          width: `${
                            duration ? (currentTime / duration) * 100 : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-teal-200">
                        {formatTime(currentTime)}
                      </span>
                      <span className="text-xs text-slate-300">
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>
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

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className="aspect-square rounded-2xl shadow-lg overflow-hidden group cursor-pointer relative"
                style={{
                  backgroundImage: `url(${images.Mosque})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                      <FaMapMarkerAlt className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-white font-semibold text-sm">
                      Cultural Sites
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="aspect-square rounded-2xl shadow-lg overflow-hidden group cursor-pointer relative"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${images.Train})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FaArrowRight className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-semibold text-sm">
                      Explore More
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="flex flex-col gap-8">
            {/* Feature Cards */}
            <div className="space-y-6">
              {/* GPS Navigation Feature */}
              <div className="flex gap-6 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-slate-200 hover:border-teal-200 group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <div className="relative">
                      <FaMapMarkerAlt className="w-7 h-7 text-teal-600" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Smart GPS Navigation
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-3">
                    Audio content automatically plays based on your location,
                    creating a seamless hands-free experience.
                  </p>
                  <div className="flex gap-2">
                    {["Auto-play", "Location Sync", "Route Optimized"].map(
                      (tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Offline Access Feature */}
              <div className="flex gap-6 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-slate-200 hover:border-blue-200 group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <FaHeadphones className="w-7 h-7 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Offline Audio Access
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-3">
                    Download entire tours for offline listening. Perfect for
                    remote areas with limited connectivity.
                  </p>
                  <div className="flex gap-2">
                    {["Download", "No Internet", "High Quality"].map(
                      (tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Cultural Stories Feature */}
              <div className="flex gap-6 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-slate-200 hover:border-purple-200 group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <FaBroadcastTower className="w-7 h-7 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Cultural Narratives
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-3">
                    Authentic stories from local experts and historians that
                    bring cultural heritage to life.
                  </p>
                  <div className="flex gap-2">
                    {["Local Experts", "Historical", "Immersive"].map(
                      (tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl shadow-lg bg-gradient-to-r from-slate-800 to-slate-900">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-400">50K+</div>
                <div className="text-xs text-slate-300 mt-1">Audio Tours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9★</div>
                <div className="text-xs text-slate-300 mt-1">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-400">200+</div>
                <div className="text-xs text-slate-300 mt-1">Destinations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section
        className="flex flex-col items-center gap-6 px-8 py-12 mx-6 rounded-xl"
        style={{
          backgroundImage: `linear-gradient(261.03deg, rgba(0, 0, 0, 0.6) 1.3%, rgba(0, 0, 0, 0.8) 42.14%), url(${images.Sunset})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col items-start w-full gap-8 p-6 border max-w-7xl bg-slate-800/50 backdrop-blur-sm rounded-xl border-slate-700">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-col items-start max-w-lg gap-2">
              <span className="text-xs font-medium tracking-tight text-teal-400">
                About Us
              </span>
              <h2 className="text-2xl font-medium leading-tight tracking-tight text-white">
                More Than Audio Tours, It's Cultural Immersion
              </h2>
            </div>
            <div className="flex flex-col items-start max-w-sm gap-4">
              <p className="text-sm font-normal leading-relaxed tracking-tight text-slate-300">
                Roamio transforms travel into unforgettable audio experiences.
                We craft journeys that inspire, connect, and leave lasting
                cultural memories.
              </p>
              <button className="flex items-center justify-center px-6 py-2 text-xs font-medium text-teal-400 transition-all duration-300 border border-teal-500 rounded-full hover:bg-teal-500 hover:text-white hover:scale-105">
                Learn More
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-slate-600" />

          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl font-semibold tracking-tight text-center text-teal-400">
                50K+
              </span>
              <span className="text-xs font-normal tracking-tight text-center text-slate-300">
                Audio Tour Users
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl font-semibold tracking-tight text-center text-white">
                3
              </span>
              <span className="text-xs font-normal tracking-tight text-center text-slate-300">
                Years of Experience
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl font-semibold tracking-tight text-center text-white">
                200+
              </span>
              <span className="text-xs font-normal tracking-tight text-center text-slate-300">
                Audio Tours Worldwide
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl font-semibold tracking-tight text-center text-teal-400">
                95+
              </span>
              <span className="text-xs font-normal tracking-tight text-center text-slate-300">
                Partner Collaborations
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
