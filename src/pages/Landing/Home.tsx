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
  const backgroundImages  = [images.River,images.Sunset,images.Rock,images.landingBG];
  
  // State to track current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % backgroundImages.length
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);


 
  return (
    <>
      <div
        className="flex flex-col items-center md:w-full   justify-center bg-gray-100 h-100"
        style={{
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <p className="flex sm:text-3xl md:text-5xl lg:text-7xl sm:items-center sm:justify-center font-bold mb-4 text-white">
          Stories that Move you
        </p>
        <p className="md:text-3xl sm:text-xl lg:4xl text-white mb-8">
          Explore at your own pace with Roamio immersive audio app
        </p>
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
          <div>
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
          <div className="w-2/5g ml-40 mt-20 h-100">
            <ul className="list-disc pl-5 space-y-4">
              <li>
                VoiceMap's tours are produced by insightful local storytellers,
                including journalists, filmmakers, novelists, podcasters, and
                tour guides.
              </li>
              <li>
                VoiceMap works offline. After you download a tour, the audio
                will be available offline along with an offline map.
              </li>
              <li>
                With GPS autoplay, you can focus on your surroundings. Put in
                your headphones, tap on Start, and let VoiceMap guide you.
              </li>
              <li>
                If you do wander off in the wrong direction, VoiceMap will play
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

      <div className="flex flex-col mt-12">
        <p className="flex justify-center items-center text-red-500">
          PARTNERS
        </p>
        <p className="flex justify-center items-center text-4xl font-bold text-gray-600">
          Publish your tour with VoiceMap
        </p>
        <p className="flex justify-center items-center text-2xl text-gray-500">
          Choose the market-leading audio tour platform and get a partner that
          believes in quality
        </p>

        <div className="flex flex-col items-center mt-10">
          {/* Row 1 - 3 items */}
          <div className="flex flex-row flex-wrap justify-center items-start gap-25">
            <div className="w-1/5 p-4 flex flex-col">
              <FaHome className="w-6 h-6 text-red-500 text-3xl" />
              <p className="text-lg font-bold text-gray-600">
                Users find us first
              </p>
              <p className="text-gray-500">
                VoiceMap is the most discoverable audio tour app. It’s optimised
                for search and it offers distribution through a wide network of
                partners. (Punch “audio tour” into Google or the App Store if
                you don’t believe us.)
              </p>
            </div>
            <div className="w-1/5 p-4 flex flex-col">
              <FaHandshake className="text-red-500 text-3xl" />
              <p className="text-lg font-bold text-gray-600">
                Partners from map to mic to market
              </p>
              <p className="text-gray-500">
                We know what works from experience and we’ll help you through
                every step of publishing and promoting the perfect tour.
              </p>
            </div>
            <div className="w-1/5 p-4 flex flex-col">
              <FaUser className="text-red-500 text-2xl" />
              <p className="text-lg font-bold text-gray-600">
                Public or private, paid or free
              </p>
              <p className="text-gray-500">
                Mix and match distribution options. Sell your tour, give it away
                to guests, or keep it private and build it into other products.
                It’s up to you.
              </p>
            </div>
          </div>

          {/* Row 2 - 3 items */}
          <div className="flex flex-row flex-wrap justify-center items-start  mt-10 gap-25">
            <div className="w-1/5 p-4 flex flex-col">
              <FaMapMarkerAlt className="text-red-600 text-2xl" />
              <p className="text-lg font-bold text-gray-600">
                Use it outside, indoors or at home
              </p>
              <p className="text-gray-500">
                Navigating backroads by car isn’t the same as weaving through
                alleyways on foot. Neither is listening at museums and taking a
                virtual tour at home. That’s why the VoiceMap app has features
                that fit your context.
              </p>
            </div>
            <div className="w-1/5 p-4 flex flex-col">
              <FaMobileAlt className="text-red-500 text-2xl" />
              <p className="text-lg font-bold text-gray-600">
                Images, music, 360 videos and AR
              </p>
              <p className="text-gray-500">
                If the screen helps to tell your story, you can add photos, 360
                videos and 3D objects to any location. You can also add music
                that plays independently.
              </p>
            </div>
            <div className="w-1/5 p-4 flex flex-col">
              <FaBroadcastTower className="text-red-600 text-2xl" />
              <p className="text-lg font-bold text-gray-600">
                Live reporting, regular payments
              </p>
              <p className="text-gray-500">
                Our dashboard for publishers makes it easy to track key metrics
                like ratings, downloads and sales. You can manage vouchers there
                too, as well as monthly payments.
              </p>
            </div>
          </div>
        </div>
      </div>

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
              className="text-white no-underline bg-red-600 ml-7 mt-3 px-4 py-2 rounded transition inline-block border-3 border-transparent hover:border-blue-300"
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
              className="text-white no-underline bg-red-600 ml-7 mt-3 px-4 py-2 rounded transition inline-block border-3 border-transparent hover:border-blue-300"
            >
              <p className="text-white">Learn More</p>
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-row p-8 mt-12 w-250 justify-center items-center ml-65">
        <img src={images.Contactus} alt="" className="w-50 rounded" />
        <div className="flex flex-col ml-30">
          <p className="text-3xl text-gray-700">
            Celebrate curiosity with VoiceMap’s newsletter
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
              className="text-white no-underline bg-red-600 ml- 1 px-4 py-2 rounded-lg rounded-l-none transition inline-block border-3 border-transparent hover:border-blue-300"
            >
              <p className="text-white">Subscribe</p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home