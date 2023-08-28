import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import EnrichmentVideo from "../../Assets/Videos/Enrichment.mp4";
import MatchRateVideo from "../../Assets/Videos/Match_rate.mp4";
import AdminConsoleVideo from "../../Assets/Videos/Admin_console_Status.mp4";

const HowToVideos = () => {
  const navigate = useNavigate();

  const [currentVideo, setCurrentVideo] = useState(-1);

  const videoRefs = [useRef(), useRef(), useRef(), useRef()];

  const playVideo = (index) => {
    if (currentVideo !== index) {
      if (currentVideo !== -1) {
        videoRefs[currentVideo].current.pause();
      }
      setCurrentVideo(index);
      videoRefs[index].current.play();
    }
  };

  const handleVideoPlay = (index) => {
    playVideo(index);
  };

  const handleVideoPause = () => {
    if (currentVideo !== -1) {
      videoRefs[currentVideo].current.pause();
      setCurrentVideo(-1);
    }
  };

  return (
    <div className="flex flex-col w-full px-4">
      <div className="flex flex-row justify-start items-center w-full m-4">
        <div
          className="text-xl font-bold text-deep-navy mr-4 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <ArrowBackIcon />
        </div>
        <h1 className="text-xl font-bold text-deep-navy mr-2">How to Videos</h1>
      </div>

      <div className="relative mb-4 mr-12 w-full flex flex-col items-start p-4 border border-neutral-100 bg-white shadow-lg rounded-lg bg-opacity-40 ">
        <div className="flex w-full">
          <video
            ref={videoRefs[0]}
            width="350"
            height="100"
            controls
            className="w-1/3 h-full rounded-lg"
            onPlay={() => handleVideoPlay(0)}
            onPause={handleVideoPause}
            onEnded={handleVideoPause}
          >
            <source src={MatchRateVideo} type="video/mp4" />
          </video>

          <div className="py-8 pl-6">
            <h5 className="text-deep-navy text-lg font-bold mb-2">
              What is Match Rate?
            </h5>
            <p className="text-deep-navy text-base mb-4">
              Some quick examples of Match Rate
            </p>
          </div>
        </div>
      </div>
      <div className="mb-4 mr-12 w-full flex flex-col items-start p-4 border border-neutral-100 bg-white shadow-lg rounded-lg bg-opacity-40 ">
        <div className="flex w-full">
          <video
            ref={videoRefs[1]}
            width="350"
            height="100"
            controls
            className="w-1/3 h-full rounded-lg"
            onPlay={() => handleVideoPlay(1)}
            onPause={handleVideoPause}
            onEnded={handleVideoPause}
          >
            <source src={EnrichmentVideo} type="video/mp4" />
          </video>

          <div className="py-8 pl-6">
            <h5 className="text-deep-navy text-lg font-bold mb-2">
              What is Enrichment?
            </h5>
            <p className="text-deep-navy text-base mb-4">
              Some quick reference of Enrichment.
            </p>
          </div>
        </div>
      </div>
      <div className="relative mb-4 mr-12 w-full flex flex-col items-start p-4 border border-neutral-100 bg-white shadow-lg rounded-lg bg-opacity-40 ">
        <div className="flex w-full">
          <video
            ref={videoRefs[2]}
            width="350"
            height="100"
            controls
            className="w-1/3 h-full rounded-lg"
            onPlay={() => handleVideoPlay(2)}
            onPause={handleVideoPause}
            onEnded={handleVideoPause}
          >
            <source src={AdminConsoleVideo} type="video/mp4" />
          </video>

          <div className="py-8 pl-6">
            <h5 className="text-deep-navy text-lg font-bold mb-2">
              What is Admin Console?
            </h5>
            <p className="text-deep-navy text-base mb-4">
              Some quick Journey of Admin Console
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToVideos;
