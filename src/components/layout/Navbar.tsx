// src/components/layout/Navbar.tsx
import { Link } from 'react-router-dom';
import { images } from '../../assets/assets';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <nav className={`w-full fixed top-0 z-50 px-[10%] transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-sm border-slate-200' 
        : 'bg-transparent'
    }`}>
      <div className="flex items-center mx-auto h-16 justify-between">
        
        {/* Logo */}
        <div className="logo flex-shrink-0">
          <Link to="/" className="flex items-center">
            <img 
              src={images.darkLogo} 
              alt="Roamio Logo" 
              className="h-12 w-auto" 
            />
          </Link>
        </div>

        {/* Navigation Links - Center section */}
        <div className="nav-links hidden lg:flex space-x-1">
          <Link 
            to="/about" 
            className={`${
              scrolled ? 'text-slate-700' : 'text-white'
            } hover:text-teal-600 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-teal-50 relative group`}
          >
            About
          </Link>
          <Link 
            to="/explore" 
            className={`${
              scrolled ? 'text-slate-700' : 'text-white'
            } hover:text-teal-600 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-teal-50 relative group`}
          >
            Explore
          </Link>
          <Link 
            to="/create" 
            className={`${
              scrolled ? 'text-slate-700' : 'text-white'
            } hover:text-teal-600 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-teal-50 relative group`}
          >
            Create
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button className={`p-2 rounded-md ${
            scrolled ? 'text-slate-700' : 'text-white'
          } hover:text-teal-600 hover:bg-teal-50 transition-colors`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Auth buttons */}
        <div className="auth hidden lg:flex items-center space-x-3">
          <Link 
            to="/signin" 
            className={`px-4 py-2 ${
              scrolled ? 'text-teal-600' : 'text-white'
            } hover:text-teal-700 font-medium transition-all duration-200 rounded-lg hover:bg-teal-50`}
          >
            Sign in
          </Link>
          <Link 
            to="/signup" 
            className="px-6 py-2 bg-gradient-to-r from-teal-600 to-blue-700 text-white rounded-lg hover:from-teal-700 hover:to-blue-800 font-medium transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden hidden border-t border-slate-200 py-4" id="mobile-menu">
        <div className="flex flex-col space-y-2">
          <Link 
            to="/" 
            className="text-slate-700 hover:text-teal-600 font-medium transition-colors px-4 py-3 rounded-lg hover:bg-teal-50"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="text-slate-700 hover:text-teal-600 font-medium transition-colors px-4 py-3 rounded-lg hover:bg-teal-50"
          >
            About
          </Link>
          <Link 
            to="/explore" 
            className="text-slate-700 hover:text-teal-600 font-medium transition-colors px-4 py-3 rounded-lg hover:bg-teal-50"
          >
            Explore
          </Link>
          <Link 
            to="/create" 
            className="text-slate-700 hover:text-teal-600 font-medium transition-colors px-4 py-3 rounded-lg hover:bg-teal-50"
          >
            Create
          </Link>
          <div className="border-t border-slate-200 pt-3 mt-3 flex flex-col space-y-2">
            <Link 
              to="/signin" 
              className="text-teal-600 hover:text-teal-700 font-medium transition-colors px-4 py-3 rounded-lg hover:bg-teal-50"
            >
              Sign in
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-700 text-white rounded-lg hover:from-teal-700 hover:to-blue-800 font-medium transition-all duration-200 shadow-sm text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;