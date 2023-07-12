import React from "react";
import image from "../Assets/DRC.png";
// import "./styles.css";
// import "./pure-react.css";
import dash1 from "../Assets/Designer _Two Color.svg";
const Home = () => {

    return (
        <><div className="flex flex-row gap-2 h-full w-full px-5">
            <div className="flex flex-col  text-coal w-full ">
                <div className="flex flex-row w-full ">
                    <div className="w-2/3 relative bg-electric-green mt-4 rounded-xl py-2 px-4 h-60 overflow-hidden shadow-lg">
                        <img src={dash1} className="absolute z-0   w-72  -bottom-8 -right-12" />
                        <div className="absolute z-10">
                            <h2 className="text-deep-navy text-3xl font-semibold mt-3">Welcome Jane!</h2>
                            {/* <p className="text-gray-500 mt-4">Snowflake Data Clean Room is a secure multi-party collaboration
        environment to share data without revealing PII or compromising privacy.
    </p> */}
                            <p className=" text-coal w-2/3 mt-3 text-sm ">
                                Build your DCR in Snowflake for use cases like a <strong className=" italic">marketing campaign</strong>,<strong className=" italic"> optimizing ad placement</strong>,
                                identifying common transaction patterns to improve fraud detection, etc.
                            </p>
                            <button className="mt-7 pr-4 flex items-center justify-center rounded-md bg-deep-navy px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-deep-navy/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green">
                                Start exploring


                            </button>
                        </div>
                    </div>
                    <div class="relative p-5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl shadow-lg overflow-hidden w-1/3 mx-2 mt-4">
                        <div class="relative z-10 mb-4 text-white text-8xl leading-none font-semibold">110</div>
                        <div class="relative z-10 text-blue-200 leading-none text-3xl font-semibold">Consumers</div>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="absolute right-0 bottom-0 h-32 w-32 -mr-8 -mb-8 text-blue-700 opacity-50">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                </div>
                <div className="flex flex-row w-full ">

                    <div class="relative p-5 bg-gradient-to-r from-teal-400 to-green-500 rounded-md overflow-hidden mt-4">
                        <div class="relative z-10 mb-4 text-white text-4xl leading-none font-semibold">Provider 1</div>
                        <div class="relative z-10 text-green-200 leading-none font-semibold">5000 requests</div>

                        {/* <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="absolute right-0 bottom-0 h-32 w-32 -mr-8 -mb-8 text-green-600 opacity-50">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg> */}
                    </div>
                </div>

            </div>
            <div className="flex flex-col   w-2/5">
                {/* <h1 className="mt-6 mb-2 text-2xl font-bold text-deep-navy pb-4 border-b border-gray-200">How to videos</h1> */}
                <div className="flex justify-center mt-4">
                    <div className="rounded-lg shadow-lg bg-white max-w-sm">

                        <video width="320" height="240" controls className="w-full rounded-t-xl">
                            <source src="https://youtu.be/QTA8UfoR4WU" type="video/mp4" />
                            <source src="movie.ogg" type="video/ogg" />
                            Your browser does not support the video tag.
                        </video>

                        <div className="p-6 pb-8">
                            <h5 className="text-deep-navy text-xl font-medium mb-2">How to create a clean room</h5>
                            <p className="text-deep-navy text-base mb-4">
                                Some quick examples to build a data clean room using Snowflake.
                            </p>
                            {/* <button type="button" className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Button</button> */}
                        </div>
                    </div>
                </div>

            </div>
        </div><div className="flex flex-col flex-1">
                {/* <h1 className="mt-6 mb-2 text-2xl font-bold text-deep-navy pb-4 border-b border-gray-200">How to videos</h1> */}
                <div className="flex justify-center mt-4">
                    <div className="rounded-lg shadow-lg bg-white max-w-sm">
                        <video
                            width="320"
                            height="240"
                            controls
                            className="w-full rounded-t-xl"
                        >
                            <source src="https://youtu.be/QTA8UfoR4WU" type="video/mp4" />
                            <source src="movie.ogg" type="video/ogg" />
                            Your browser does not support the video tag.
                        </video>

                        <div className="p-6 pb-8">
                            <h5 className="text-deep-navy text-xl font-medium mb-2">
                                How to create a clean room
                            </h5>
                            <p className="text-deep-navy text-base mb-4">
                                Some quick examples to build a data clean room using Snowflake.
                            </p>
                            {/* <button type="button" className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Button</button> */}
                        </div>
                    </div>
                </div>
            </div></>
   );
};

export default Home;
