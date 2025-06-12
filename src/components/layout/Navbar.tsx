// src/components/layout/Navbar.tsx
import { Link } from 'react-router-dom';
import { images } from '../../assets/assets';

const Navbar = () => {
  return (
    <nav className="navbar bg-white shadow-sm border-b border-slate-200 w-full sticky top-0 z-50 px-[10%]">
      <div className="flex items-center mx-auto h-16 justify-between">
        
        {/* Logo - Much larger size while maintaining alignment */}
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
            className="text-slate-700 hover:text-[#ef4444] font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-red-50 relative group"
          >
            About
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#ef4444] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
          </Link>
          <Link 
            to="/explore" 
            className="text-slate-700 hover:text-[#ef4444] font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-red-50 relative group"
          >
            Explore
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#ef4444] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
          </Link>
          <Link 
            to="/create" 
            className="text-slate-700 hover:text-[#ef4444] font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-red-50 relative group"
          >
            Create
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#ef4444] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
          </Link>
        </div>

        <div className="lg:hidden">
          <button className="p-2 rounded-md text-slate-700 hover:text-[#ef4444] hover:bg-red-50 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="auth hidden lg:flex items-center space-x-3">
          <Link 
            to="/signin" 
            className="px-4 py-2 text-[#ef4444] hover:text-[#dc2626] font-medium transition-all duration-200 rounded-lg hover:bg-red-50"
          >
            Sign in
          </Link>
          <Link 
            to="/signup" 
            className="px-6 py-2 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-lg hover:from-[#dc2626] hover:to-[#b91c1c] font-medium transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="lg:hidden hidden border-t border-slate-200 py-4" id="mobile-menu">
        <div className="flex flex-col space-y-2">
          <Link 
            to="/" 
            className="text-slate-700 hover:text-[#ef4444] font-medium transition-colors px-4 py-3 rounded-lg hover:bg-red-50"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="text-slate-700 hover:text-[#ef4444] font-medium transition-colors px-4 py-3 rounded-lg hover:bg-red-50"
          >
            About
          </Link>
          <Link 
            to="/explore" 
            className="text-slate-700 hover:text-[#ef4444] font-medium transition-colors px-4 py-3 rounded-lg hover:bg-red-50"
          >
            Explore
          </Link>
          <Link 
            to="/create" 
            className="text-slate-700 hover:text-[#ef4444] font-medium transition-colors px-4 py-3 rounded-lg hover:bg-red-50"
          >
            Create
          </Link>
          <div className="border-t border-slate-200 pt-3 mt-3 flex flex-col space-y-2">
            <Link 
              to="/signin" 
              className="text-[#ef4444] hover:text-[#dc2626] font-medium transition-colors px-4 py-3 rounded-lg hover:bg-red-50"
            >
              Sign in
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-3 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-lg hover:from-[#dc2626] hover:to-[#b91c1c] font-medium transition-all duration-200 shadow-sm text-center"
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