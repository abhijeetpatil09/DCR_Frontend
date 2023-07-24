import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const HowToVideos = () => {
  const navigate = useNavigate();

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
      <div className="mb-4 mr-12 w-full flex flex-col items-start p-4 border border-neutral-100 bg-white shadow-lg rounded-lg bg-opacity-40 ">
        <div className="flex w-full">
          <video
            width="350"
            height="100"
            controls
            className="w-1/3 h-full rounded-lg"
          >
            <source
              src="https://www.youtube.com/watch?v=GXV-eNBdNz0"
              type="video/mp4"
            />
            <source src="movie.ogg" type="video/ogg" />
            Your browser does not support the video tag.
          </video>

          <div className="py-8 pl-6">
            <h5 className="text-deep-navy text-lg font-bold mb-2">
              How to create a clean room
            </h5>
            <p className="text-deep-navy text-base mb-4">
              Some quick examples to build a data clean room using Snowflake.
            </p>
          </div>
        </div>
      </div>
      <div className="relative mb-4 mr-12 w-full flex flex-col items-start p-4 border border-neutral-100 bg-white shadow-lg rounded-lg bg-opacity-40 ">
        <div className="flex w-full">
          <video
            width="350"
            height="100"
            controls
            className="w-1/3 h-full rounded-lg"
          >
            <source
              src="https://www.youtube.com/watch?v=GXV-eNBdNz0"
              type="video/mp4"
            />
            <source src="movie.ogg" type="video/ogg" />
            Your browser does not support the video tag.
          </video>

          <div className="py-8 pl-6">
            <h5 className="text-deep-navy text-lg font-bold mb-2">
              How to create a clean room
            </h5>
            <p className="text-deep-navy text-base mb-4">
              Some quick examples to build a data clean room using Snowflake.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToVideos;
