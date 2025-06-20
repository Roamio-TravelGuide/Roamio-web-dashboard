import { images } from "../../assets/assets";
import { FaHome, FaHandshake, FaUser, FaMapMarkerAlt, FaMobileAlt, FaBroadcastTower } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { audio } from "../../assets/assets";

type Props = {};

const Home = (props: Props) => {
  const backgroundImages = [images.Evening, images.Mosque, images.Church, images.Train, images.Lake, images.Kovil];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(true);

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
    <>
      {/* Hero Section with Enhanced Styling */}
      <div
        className="relative flex flex-col items-center justify-center h-screen w-full"
        style={{
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 1.5s ease-in-out"
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="relative z-10 text-center px-4 space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg animate-fadeIn">
            Where footsteps find meaning
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-medium mb-8 animate-fadeIn delay-100">
            Your intelligent, cultural travel companion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn delay-200">
            <Link
              to="/discover"
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              Explore Tours
            </Link>
            <Link
              to="/signin"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg shadow-lg backdrop-blur-sm transition-all transform hover:scale-105"
            >
              Create Account
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${currentImageIndex === index ? 'bg-white w-6' : 'bg-white/50'}`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Value Proposition Section */}
      <div className="relative py-20 px-6 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-gray-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-700">
              The app that takes stories beyond the screen
            </span>
          </h2>

          <div className="flex flex-col lg:flex-row items-center gap-12 mt-12">
            <div className="lg:w-1/2 space-y-8">
              <p className="text-xl text-center lg:text-left text-gray-700 leading-relaxed">
                Experience the magic of Roamio GPS audio walks, cycles, drives and even boat trips. 
                <span className="block mt-4 text-gray-600">They're like podcasts that move with you, telling stories about what you're seeing right now.</span>
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
                    className="flex items-start group hover:bg-white/70 p-4 rounded-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-teal-100 hover:shadow-sm"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center">
                        <svg 
                          className="w-4 h-4 text-white" 
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

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
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

            {/* Phone mockup with enhanced styling */}
            <div className="lg:w-1/2 relative hidden lg:block">
              <div className="relative w-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-600 rounded-[40px] opacity-20 -rotate-6 blur-md"></div>
                <div className="relative z-10 animate-float">
                  <img 
                    src={images.Phone} 
                    alt="Roamio app preview" 
                    className="w-full h-auto drop-shadow-2xl rounded-[40px] border-8 border-white"
                  />
                </div>
                
                {/* Floating screenshots decoration */}
                <div className="absolute -bottom-10 -right-10 w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl animate-float-delay">
                  <img 
                    src={images.sarah} 
                    alt="App screenshot" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-10 -left-10 w-24 h-24 rounded-xl overflow-hidden border-4 border-white shadow-xl animate-float-delay-2">
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

      <div className="relative py-20 px-4 bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')" }}></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="relative group">
                <img 
                  src={images.Island} 
                  alt="Island" 
                  className="w-full h-48 object-cover rounded-xl transform group-hover:scale-105 transition-all duration-500 shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
              </div>
              <div className="relative group mt-8">
                <img 
                  src={images.Waterfall} 
                  alt="Waterfall" 
                  className="w-full h-48 object-cover rounded-xl transform group-hover:scale-105 transition-all duration-500 shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
              </div>
              <div className="relative group">
                <img 
                  src={images.Morning} 
                  alt="Morning" 
                  className="w-full h-48 object-cover rounded-xl transform group-hover:scale-105 transition-all duration-500 shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
              </div>
              <div className="relative group mt-8">
                <img 
                  src={images.Woodframe} 
                  alt="Woodframe" 
                  className="w-full h-48 object-cover rounded-xl transform group-hover:scale-105 transition-all duration-500 shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
              </div>
            </div>

            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400">
                  Discover the World with Roamio
                </span>
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Immerse yourself in audio-guided experiences from iconic locations. Let the stories of each destination come alive as you explore.
              </p>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <h3 className="text-white font-medium mb-3">Sample Tour: Sigiriya Rock Fortress</h3>
                <audio
                  src={audio.seegiriya}
                  controls
                  className="w-full max-w-2xl py-3 px-4 bg-white/5 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-teal-600 font-medium tracking-widest text-sm uppercase">PARTNERS</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-gray-800">
            Publish Your Tour With Roamio
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the market-leading audio tour platform and get a partner committed to quality
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <FaHome className="text-teal-600 text-xl" />, title: "Top Discoverability", content: "Roamio is the most discoverable audio tour app, optimized for search and distributed through a wide partner network." },
            { icon: <FaHandshake className="text-teal-600 text-xl" />, title: "End-to-End Support", content: "We know what works and will guide you through publishing and promoting the perfect tour." },
            { icon: <FaUser className="text-teal-600 text-xl" />, title: "Flexible Distribution", content: "Choose public or private, paid or free. Sell your tour or build it into other products." },
            { icon: <FaBroadcastTower className="text-teal-600 text-xl" />, title: "Comprehensive Features", content: "Add images, music, 360 videos and AR to enhance your storytelling." },
            { icon: <FaMapMarkerAlt className="text-teal-600 text-xl" />, title: "Multiple Use Cases", content: "Whether outdoors, indoors, or virtual, our app has features that fit your context." },
            { icon: <FaMobileAlt className="text-teal-600 text-xl" />, title: "Transparent Reporting", content: "Track metrics like ratings and sales through our publisher dashboard with regular payments." }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-teal-100 transform hover:-translate-y-2"
            >
              <div className="bg-gray-100 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">
                {feature.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row">
            <div className="md:w-2/5 overflow-hidden">
              <img
                src={images.Creator}
                alt="Creator"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="md:w-3/5 p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Create a new tour</h3>
              <p className="text-gray-600 mb-6">
                You can start using our collaborative publishing tool straight away. There's no upfront cost and an experienced audio tour editor will help you through each step of the process.
              </p>
              <Link
                to="/signin"
                className="w-fit px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-105"
              >
                Start Now
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row">
            <div className="md:w-2/5 overflow-hidden">
              <img
                src={images.Explore}
                alt="Explore"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="md:w-3/5 p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Continue exploring</h3>
              <p className="text-gray-600 mb-6">
                Our flexible pricing and distribution options work for partners large and small, covering everything from a marriage proposal by audio guide to 42 of them in 7 languages for a tourism board.
              </p>
              <a
                href="#"
                className="w-fit px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-105"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;