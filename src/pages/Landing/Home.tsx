import { images } from "../../assets/assets";
import { FaHome, FaHandshake, FaUser, FaMapMarkerAlt, FaMobileAlt, FaBroadcastTower } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { audio } from "../../assets/assets";

type Props = {};

const Home = (props : Props) => {
  const backgroundImages  = [images.Evening,images.Mosque,images.beach,images.Train,images.Lake,images.Kovil];
  
  // State to track current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [isImageLoaded, setIsImageLoaded] = useState(true);

useEffect(() => {
  // Preload images
  backgroundImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  const interval = setInterval(() => {
    setIsImageLoaded(false); // Show loader or keep current image

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
    <>
      <div
        className="relative flex flex-col items-center md:w-full justify-center h-150 bg-transparent"
        style={{
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
        <div className="relative z-10 text-center px-4">
          <p className="flex sm:text-3xl md:text-5xl lg:text-7xl sm:items-center sm:justify-center font-bold mb-4 text-white">
            Where footsteps find meaning
          </p>
          <p className="md:text-3xl sm:text-xl lg:4xl text-white mb-8">
            It's your intelligent, cultural travel companion
          </p>
        </div>
      </div>

      <div className="relative py-16 px-6 bg-gray-100 overflow-hidden">
  {/* Floating abstract shapes for visual interest */}
  <div className="absolute top-0 left-0 w-40 h-40 bg-teal-500 rounded-full opacity-10 -translate-x-20 -translate-y-20"></div>
  <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600 rounded-full opacity-10 translate-x-32 translate-y-32"></div>

  <div className="max-w-7xl mx-auto relative z-10">
    {/* Animated heading with gradient text */}
    <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-700 animate-gradient">
      The app that takes stories beyond the screen
    </h2>

    {/* Split layout with interactive phone mockup */}
    <div className="flex flex-col lg:flex-row items-center gap-12 mt-12">
      {/* Left content with animated list */}
      <div className="lg:w-1/2 space-y-8">
        <p className="text-xl text-center lg:text-left text-gray-700 leading-relaxed">
          Experience the magic of Roamio GPS audio walks, cycles, drives and even boat trips. 
          <span className="block mt-2">They're like podcasts that move with you, telling stories about what you're seeing right now.</span>
        </p>

        <div className="space-y-6">
          {[
            "Produced by insightful local storytellers including journalists, filmmakers, and tour guides",
            "Works offline with downloadable tours and maps",
            "GPS autoplay lets you focus on your surroundings",
            "Audio alerts if you wander off route"
          ].map((item, index) => (
            <div 
              key={index}
              className="flex items-start group hover:bg-white/50 p-4 rounded-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center">
                  <svg 
                    className="w-3 h-3 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="ml-4 text-gray-700 group-hover:text-gray-900 transition-colors">
                {item}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <a
            href="#"
            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors group"
          >
            Learn more about our audio tour app
            <svg 
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <div className="flex gap-4">
            <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
              <img 
                src={images.PlayStore} 
                alt="Get on Google Play" 
                className="h-12 hover:scale-105 transition-transform"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Phone mockup with floating animation */}
      <div className="lg:w-1/2 relative hidden lg:block">
        <div className="relative w-72 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-600 rounded-[40px] opacity-20 -rotate-6"></div>
          <div className="relative z-10 animate-float">
            <img 
              src={images.Phone} 
              alt="Roamio app preview" 
              className="w-full h-auto drop-shadow-xl"
            />
          </div>
          
          {/* Floating screenshots decoration */}
          <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg animate-float-delay">
            <img 
              src={images.sarah} 
              alt="App screenshot" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -top-8 -left-8 w-20 h-20 rounded-xl overflow-hidden border-4 border-white shadow-lg animate-float-delay-2">
            <img 
              src={images.River} 
              alt="App screenshot" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      <div className="flex flex-row items-center justify-center text-white px-4 py-8 bg-gray-600 shadow-md mb-10">
        <div className="flex flex-row mr-20">
          <img src={images.Island} alt="Island" className="rotate-30 w-35 h-35 rounded-2xl" />
          <img src={images.Waterfall} alt="Waterfall" className="rotate-30 w-35 h-35 rounded-2xl" />
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white text-center mb-2">
            Discover the World with Roamio
          </h2>
          <p className="text-white text-center text-lg mb-6">
            Immerse yourself in audio-guided experiences from iconic locations.
          </p>
          <audio
            src={audio.seegiriya}
            controls
            className="w-full max-w-4xl py-3 px-4 border border-transparent transition-all"
          />
        </div>
        <div className="flex flex-row ml-20">
          <img src={images.Morning} alt="Morning" className="rotate-30 w-35 h-35 rounded-2xl" />
          <img src={images.Woodframe} alt="Woodframe" className="rotate-30 w-35 h-35 rounded-2xl" />
        </div>
      </div>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-600 font-medium">PARTNERS</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Publish Your Tour With Roamio</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the market-leading audio tour platform and get a partner committed to quality
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaHome className="text-teal-600 text-xl" />
            </div>
            <h3 className="text-xl font-bold mb-3">Top Discoverability</h3>
            <p className="text-gray-600">
              Roamio is the most discoverable audio tour app, optimized for search and distributed through a wide partner network.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaHandshake className="text-teal-600 text-xl" />
            </div>
            <h3 className="text-xl font-bold mb-3">End-to-End Support</h3>
            <p className="text-gray-600">
              We know what works and will guide you through publishing and promoting the perfect tour.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaUser className="text-teal-600 text-xl" />
            </div>
            <h3 className="text-xl font-bold mb-3">Flexible Distribution</h3>
            <p className="text-gray-600">
              Choose public or private, paid or free. Sell your tour or build it into other products.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaBroadcastTower className="text-teal-600 text-xl" />
            </div>
            <h3 className="text-xl font-bold mb-3">Comprehensive Features</h3>
            <p className="text-gray-600">
              Add images, music, 360 videos and AR to enhance your storytelling.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaMapMarkerAlt className="text-teal-600 text-xl" />
            </div>
            <h3 className="text-xl font-bold mb-3">Multiple Use Cases</h3>
            <p className="text-gray-600">
              Whether outdoors, indoors, or virtual, our app has features that fit your context.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaMobileAlt className="text-teal-600 text-xl" />
            </div>
            <h3 className="text-xl font-bold mb-3">Transparent Reporting</h3>
            <p className="text-gray-600">
              Track metrics like ratings and sales through our publisher dashboard with regular payments.
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col md:flex-row bg-gray-100 p-8 mt-12 gap-10">
        <div className="flex flex-col md:flex-row bg-white p-8 mt-12 w-full md:w-1/2 h-auto border border-transparent rounded-lg">
          <img
            src={images.Creator}
            alt="Creator"
            className="w-full md:w-55 h-50 -mt-8 -ml-8 border border-transparent rounded-l-lg rounded-r-none"
          />
          <div className="mt-4 md:mt-0">
            <p className="text-lg font-bold ml-7 text-gray-600">Create a new tour</p>
            <p className="text-sm text-gray-500 ml-7">
              You can start using our collaborative publishing tool straight
              away. There's no upfront cost and an experienced audio tour editor
              will help you through each step of the process
            </p>
            <Link
              to="/signin"
              className="w-1/3 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all ml-7 mt-3"
            >
              Start Now
            </Link>
          </div>
        </div>
        <div className="flex flex-col md:flex-row bg-white p-8 mt-12 w-full md:w-1/2 h-auto border border-transparent rounded-lg">
          <img
            src={images.Explore}
            alt="Explore"
            className="w-full md:w-55 h-50 -mt-8 -ml-8 border border-transparent rounded-l-lg rounded-r-none"
          />
          <div className="mt-4 md:mt-0">
            <p className="text-lg font-bold ml-7 text-gray-600">
              Continue exploring
            </p>
            <p className="text-sm text-gray-500 ml-7">
              Our flexible pricing and distribution options work for partners
              large and small, covering everything from a marriage proposal by
              audio guide to 42 of them in 7 languages for a tourism board.
            </p>
            <a
              href="#"
              className="w-1/3 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all ml-7 mt-3"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;