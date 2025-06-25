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
      <div
        className="relative flex flex-col items-center justify-center w-full h-screen"
        style={{
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 1.5s ease-in-out"
        }}
      >
        <div className="absolute inset-0 z-0 bg-black/40"></div>
        <div className="relative z-10 px-4 space-y-6 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-lg animate-fadeIn">
            Where footsteps find meaning
          </h1>
          <p className="mb-8 text-xl font-medium delay-100 md:text-2xl lg:text-3xl text-white/90 animate-fadeIn">
            Your intelligent, cultural travel companion
          </p>
          <div className="flex flex-col justify-center gap-4 delay-200 sm:flex-row animate-fadeIn">
            <Link
              to="/discover"
              className="px-8 py-3 font-medium text-white transition-all transform bg-teal-600 rounded-lg shadow-lg hover:bg-teal-700 hover:scale-105"
            >
              Explore Tours
            </Link>
            <Link
              to="/signin"
              className="px-8 py-3 font-medium text-white transition-all transform rounded-lg shadow-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm hover:scale-105"
            >
              Create Account
            </Link>
          </div>
        </div>
        <div className="absolute left-0 right-0 flex justify-center space-x-2 bottom-8">
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
      <div className="relative px-6 py-20 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 rounded-full w-72 h-72 bg-blue-600/10 blur-3xl"></div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-800 md:text-4xl lg:text-5xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-700">
              The app that takes stories beyond the screen
            </span>
          </h2>

          <div className="flex flex-col items-center gap-12 mt-12 lg:flex-row">
            <div className="space-y-8 lg:w-1/2">
              <p className="text-xl leading-relaxed text-center text-gray-700 lg:text-left">
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
                    className="flex items-start p-4 transition-all duration-300 border border-gray-100 cursor-pointer group hover:bg-white/70 rounded-xl hover:border-teal-100 hover:shadow-sm"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-blue-600">
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
                    <p className="ml-4 text-gray-700 transition-colors group-hover:text-gray-900">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center justify-between gap-4 mt-10 sm:flex-row">
                <a
                  href="#"
                  className="inline-flex items-center font-medium text-blue-600 transition-colors hover:text-blue-800 group"
                >
                  Learn more about our audio tour app
                  <svg 
                    className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" 
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
                      className="h-12 transition-transform hover:scale-105"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Phone mockup with enhanced styling */}
            <div className="relative hidden lg:w-1/2 lg:block">
              <div className="relative mx-auto w-80">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-600 rounded-[40px] opacity-20 -rotate-6 blur-md"></div>
                <div className="relative z-10 animate-float">
                  <img 
                    src={images.Phone} 
                    alt="Roamio app preview" 
                    className="w-full h-auto drop-shadow-2xl rounded-[40px] border-8 border-white"
                  />
                </div>
                
                {/* Floating screenshots decoration */}
                <div className="absolute overflow-hidden border-4 border-white shadow-xl -bottom-10 -right-10 w-28 h-28 rounded-2xl animate-float-delay">
                  <img 
                    src={images.sarah} 
                    alt="App screenshot" 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute w-24 h-24 overflow-hidden border-4 border-white shadow-xl -top-10 -left-10 rounded-xl animate-float-delay-2">
                  <img 
                    src={images.River} 
                    alt="App screenshot" 
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative px-4 py-20 overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')" }}></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-12 lg:flex-row">
            <div className="grid grid-cols-2 gap-4 lg:w-1/2">
              <div className="relative group">
                <img 
                  src={images.Island} 
                  alt="Island" 
                  className="object-cover w-full h-48 transition-all duration-500 transform shadow-lg rounded-xl group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
              </div>
              <div className="relative mt-8 group">
                <img 
                  src={images.Waterfall} 
                  alt="Waterfall" 
                  className="object-cover w-full h-48 transition-all duration-500 transform shadow-lg rounded-xl group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
              </div>
              <div className="relative group">
                <img 
                  src={images.Morning} 
                  alt="Morning" 
                  className="object-cover w-full h-48 transition-all duration-500 transform shadow-lg rounded-xl group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
              </div>
              <div className="relative mt-8 group">
                <img 
                  src={images.Woodframe} 
                  alt="Woodframe" 
                  className="object-cover w-full h-48 transition-all duration-500 transform shadow-lg rounded-xl group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
              </div>
            </div>

            <div className="text-center lg:w-1/2 lg:text-left">
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                  Discover the World with Roamio
                </span>
              </h2>
              <p className="mb-8 text-lg text-gray-300">
                Immerse yourself in audio-guided experiences from iconic locations. Let the stories of each destination come alive as you explore.
              </p>
              <div className="p-6 border bg-white/10 backdrop-blur-sm rounded-xl border-white/20">
                <h3 className="mb-3 font-medium text-white">Sample Tour: Sigiriya Rock Fortress</h3>
                <audio
                  src={audio.seegiriya}
                  controls
                  className="w-full max-w-2xl px-4 py-3 border rounded-lg bg-white/5 border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <section className="px-4 py-20 mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <span className="text-sm font-medium tracking-widest text-teal-600 uppercase">PARTNERS</span>
          <h2 className="mt-4 mb-6 text-3xl font-bold text-gray-800 md:text-4xl">
            Publish Your Tour With Roamio
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Choose the market-leading audio tour platform and get a partner committed to quality
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: <FaHome className="text-xl text-teal-600" />, title: "Top Discoverability", content: "Roamio is the most discoverable audio tour app, optimized for search and distributed through a wide partner network." },
            { icon: <FaHandshake className="text-xl text-teal-600" />, title: "End-to-End Support", content: "We know what works and will guide you through publishing and promoting the perfect tour." },
            { icon: <FaUser className="text-xl text-teal-600" />, title: "Flexible Distribution", content: "Choose public or private, paid or free. Sell your tour or build it into other products." },
            { icon: <FaBroadcastTower className="text-xl text-teal-600" />, title: "Comprehensive Features", content: "Add images, music, 360 videos and AR to enhance your storytelling." },
            { icon: <FaMapMarkerAlt className="text-xl text-teal-600" />, title: "Multiple Use Cases", content: "Whether outdoors, indoors, or virtual, our app has features that fit your context." },
            { icon: <FaMobileAlt className="text-xl text-teal-600" />, title: "Transparent Reporting", content: "Track metrics like ratings and sales through our publisher dashboard with regular payments." }
          ].map((feature, index) => (
            <div 
              key={index}
              className="p-8 transition-all duration-300 transform bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md hover:border-teal-100 hover:-translate-y-2"
            >
              <div className="flex items-center justify-center mb-6 bg-gray-100 rounded-full w-14 h-14">
                {feature.icon}
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">
                {feature.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="px-6 py-20 bg-gray-50">
        <div className="grid max-w-6xl gap-8 mx-auto md:grid-cols-2">
          <div className="flex flex-col overflow-hidden transition-shadow duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl md:flex-row">
            <div className="overflow-hidden md:w-2/5">
              <img
                src={images.Creator}
                alt="Creator"
                className="object-cover w-full h-full transition-transform duration-500 transform hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-8 md:w-3/5">
              <h3 className="mb-3 text-2xl font-bold text-gray-800">Create a new tour</h3>
              <p className="mb-6 text-gray-600">
                You can start using our collaborative publishing tool straight away. There's no upfront cost and an experienced audio tour editor will help you through each step of the process.
              </p>
              <Link
                to="/signin"
                className="px-6 py-3 font-medium text-white transition-all transform rounded-lg shadow-md w-fit bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 hover:scale-105"
              >
                Start Now
              </Link>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden transition-shadow duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl md:flex-row">
            <div className="overflow-hidden md:w-2/5">
              <img
                src={images.Explore}
                alt="Explore"
                className="object-cover w-full h-full transition-transform duration-500 transform hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-8 md:w-3/5">
              <h3 className="mb-3 text-2xl font-bold text-gray-800">Continue exploring</h3>
              <p className="mb-6 text-gray-600">
                Our flexible pricing and distribution options work for partners large and small, covering everything from a marriage proposal by audio guide to 42 of them in 7 languages for a tourism board.
              </p>
              <a
                href="#"
                className="px-6 py-3 font-medium text-white transition-all transform rounded-lg shadow-md w-fit bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 hover:scale-105"
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