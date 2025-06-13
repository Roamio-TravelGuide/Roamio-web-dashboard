import { images } from '../../assets/assets';
import { FaHome } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaMobileAlt } from "react-icons/fa";
import { FaBroadcastTower } from "react-icons/fa";
import { useState, useEffect } from "react";


type Props = {};

const Home = (props : Props) => {
  const backgroundImages  = [images.Evening,images.Mosque,images.Church,images.Train,images.Lake,images.Kovil];
  
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

  {/* Content goes here */}
  <div className="relative z-10 text-center px-4">
    <p className="flex sm:text-3xl md:text-5xl lg:text-7xl sm:items-center sm:justify-center font-bold mb-4 text-white">
      Where footsteps find meaning
    </p>
    <p className="md:text-3xl sm:text-xl lg:4xl text-white mb-8">
      It’s your intelligent, cultural travel companion
    </p>
  </div>
</div>

      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-8 p-8 ">
        <div className="flex flex-raw items-center justify-center h-40 bg-white mr-5">
          <div>
            <img src={images.Tourist} className="h-40" />
          </div>
          <div className="mt-10">
            <p className="font-bold  ml-10 text-xl">Independence</p>
            <p className="mb-10 ml-10">
              No awkward groups <br /> or right schedule
            </p>
          </div>
          <div className='ml-30'>
            <img src={images.Grouptrip} alt="" className="w-60 ml-30 " />
          </div>
        </div>
        <div className="flex flex-raw items-center justify-center h-40 bg-white mr-5">
          <div className="flex flex-col items-center justify-center">
            <p className=" font-bold text-xl">Easy to use</p>
            <p className="mb-4 ml-22">
              Tours work offline and play <br /> automatically using GPS
            </p>
          </div>
          <div>
            <img src={images.Map} alt="" className="h-40 ml-45" />
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-gray-100 p-8 ">
        <p className="md:text-4xl sm:text-2xl font-bold text-center">
          The app that takes stories beyond the screen
        </p>
        <p className="text-center md:text-xl sm:text-lg mt-5">
          Experience the magic of the Romio GPS audio walks, cycles, drives and
          even boat trips. They're like
        </p>
        <p className="text-center md:text-xl sm:text-lg">
          podcasts that move with you, to tell stories about what you are seeing
          right now.
        </p>
        <div className="flex flex-row items-center mt-8">
          <div className="w-2/5g ml-40 mt-10 h-100">
            <ul className="list-disc pl-5 space-y-4">
              <li>
                Roamio's tours are produced by insightful local storytellers,
                including journalists, filmmakers, novelists, podcasters, and
                tour guides.
              </li>
              <li>
                Roamio works offline. After you download a tour, the audio
                will be available offline along with an offline map.
              </li>
              <li>
                With GPS autoplay, you can focus on your surroundings. Put in
                your headphones, tap on Start, and let Roamio guide you.
              </li>
              <li>
                If you do wander off in the wrong direction, Roamio will play
                an audio alert, and you can follow the map on your screen to the
                next location.
              </li>
            </ul>
            <a
              href="#"
              className="mt-5 inline-block hover:underline text-blue-600 ml-5"
            >
              Learn more about our audio tour app &gt;
            </a>
            <div className="flex flex-row items-center justify-center">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={images.PlayStore}
                  alt="Get it on Google Play"
                  className="w-40 h-14"
                />
              </a>
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4"
              >
                <img
                  src={images.AppStore}
                  alt="Download on the App Store"
                  className="w-45 h-32"
                />
              </a>
            </div>
          </div>
          {/* Hidden on mobile (small screens), visible from md breakpoint up */}
          <div className="hidden md:block w-2/5 ml-40 -mt-10 h-auto">
            <img src={images.Phone} alt="Mobile app preview" className="mb-10" />
          </div>
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

      <div className="flex flex-row  bg-gray-100 p-8 mt-12 gap-10 -ml-4">
        <div className="flex flex-row  bg-white p-8 mt-12 w-150 h-50 border border-transparent rounded-lg ml-30">
          <img
            src={images.Creator}
            alt=""
            className="w-55 h-50 -mt-8 -ml-8 border border-transparent rounded-l-lg rounded-r-none  sm:flex flex-row"
          />
          <div>
            <p className="text-lg font-bold ml-7 text-gray-600 -mt-3">
              Create a new tour
            </p>
            <p className=" text-sm text-gray-500  ml-7">
              You can start using our collaborative publishing tool straight
              away. There’s no upfront cost and an experienced audio tour editor
              will help you through each step of the process
            </p>
            <a
              href="#"
              className="text-white no-underline bg-gradient-to-r from-teal-600 to-blue-700 ml-7 mt-3 px-4 py-2 rounded transition inline-block  hover:from-teal-700 hover:to-blue-800"
            >
              <p className="text-white">Start Now</p>
            </a>
          </div>
        </div>
        <div className="flex flex-row   bg-white p-8 mt-12 w-150 h-50 border border-transparent rounded-lg">
          <img
            src={images.Explore}
            className="w-55 h-50 -mt-8 -ml-8 border border-transparent rounded-l-lg rounded-r-none "
          />
          <div>
            <p className="text-lg font-bold ml-7 text-gray-600 -mt-3">
              Continue exploring
            </p>
            <p className=" text-sm text-gray-500  ml-7">
              Our flexible pricing and distribution options work for partners
              large and small, covering everything from a marriage proposal by
              audio guide to 42 of them in 7 languages for a tourism board.
            </p>
            <a
              href="#"
              className="text-white no-underline bg-gradient-to-r from-teal-600 to-blue-700 ml-7 mt-3 px-4 py-2 rounded transition inline-block hover:from-teal-700 hover:to-blue-800"
            >
              <p className="text-white">Learn More</p>
            </a>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-row p-8 mt-12 w-250 justify-center items-center ml-65">
        <img src={images.Contactus} alt="" className="w-50 rounded" />
        <div className="flex flex-col ml-30">
          <p className="text-3xl text-gray-700">
            Celebrate curiosity with Roamio’s newsletter
          </p>
          <p className="text-lg text-gray-500 mt-5">
            Subscribe to our monthly newsletter. It celebrates the human
            curiosity and connections that make travel meaningful.
          </p>
          <div className="flex flex-row mt-5  ">
            <input
              type="text"
              className="w-120 h-12  px-2 border-1 border-gray-300 rounded-lg rounded-r-none  focus:outline-none hover:border-[#ef4444] hover:border-2"
              placeholder="Enter your Email address"
            />
            <a
              href="#"
              className="text-white no-underline bg-gradient-to-r from-teal-600 to-blue-700 ml- 1 px-4 py-2 rounded-lg rounded-l-none transition inline-block-transparent hover:from-teal-700 hover:to-blue-800"
            >
              <p className="text-white">Subscribe</p>
            </a>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default Home