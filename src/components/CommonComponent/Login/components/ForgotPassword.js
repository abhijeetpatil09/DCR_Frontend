import React from "react";
import { useState } from "react";
import BgVideo from "../../../../Assets/loginbg.mp4";
import BgVideoGreen from "../../../../Assets/loginbg_green.mp4";
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
const ForgotPassword = () => {
  const [forgotPassword, setForgotPassword] = useState(false);
  const [radio, setRadio] = useState({
    userName: "yes",
    email: "yes",
  });
  const [error, setError] = useState({
    userName: null,
    email: null,
  });

  const handleChange = (event) => {
    setRadio({ ...radio, [event.target.name]: event.target.value });
    setError(false);
  };

  const handleForgotPassword = () => {
    if (radio.userName === "no" && radio.email === "no") {
      setError(true);
    }
  };

  return (
    <div className="   flex flex-row  flex-1   justify-center items-center bg-deep-navy">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm w-2/6  bg-deep-navy mb-10 lg:mb-20">
        <div className=" flex flex-row items-center justify-center  ">
          <span className=" text-white font-semi-bold  text-2xl  ">
            <span className="text-electric-green text-4xl">D</span>ata
            <span className="text-electric-green text-4xl">X</span>change
          </span>
        </div>
        <h2 className="mt-10 mb-10 text-center text-2xl font-light   leading-9 tracking-tight text-electric-green">
          Forgot User Name or Password
        </h2>
        <div className="space-y-6">
          <div className="block text-sm font-medium leading-6 text-electric-green">
            <div className="my-4">
              <FormControl>
                <FormLabel
                  id="demo-radio-buttons-group-label"
                  className="text-base font-medium leading-6 text-electric-green"
                >
                  Do you remember your User Name?
                </FormLabel>
                <RadioGroup
                  defaultValue="yes"
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="userName"
                  value={radio.userName}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio className="text-electric-green" />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio className="text-electric-green" />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            {radio.userName === "yes" && (
              <div className="py-4 border-t-[1px] border-opacity-50 border-electric-green ">
                <label
                  htmlFor="uname"
                  className="block text-sm font-medium leading-6 text-electric-green"
                >
                  User Name{" "}
                </label>
                <div className="mt-2">
                  <input
                    id="userName"
                    type="text"
                    name="userName"
                    placeholder="Please enter a username. e.g. aditi_nair"
                    //   onChange={handleOnChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                  />
                  {/* {errors.userName !== null ? (
                  <span className="text-[#f44336] text-sm">
                    {errors.userName}
                  </span>
                ) : null} */}
                </div>
              </div>
            )}
          </div>
          {radio.userName === "no" && (
            <div className="block text-sm font-medium leading-6 text-electric-green">
              <div className="py-4 border-t-[1px] border-opacity-50 border-electric-green ">
                <label
                  htmlFor="uname"
                  className="block text-sm font-medium leading-6 text-electric-green"
                >
                  Registered Email{" "}
                </label>
                <div className="mt-2">
                  <input
                    id="userName"
                    type="text"
                    name="userName"
                    placeholder="Please enter a username. e.g. aditi_nair"
                    //   onChange={handleOnChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                  />
                  {/* {errors.userName !== null ? (
                  <span className="text-[#f44336] text-sm">
                    {errors.userName}
                  </span>
                ) : null} */}
                </div>
              </div>
            </div>
          )}
          {error && (
            <div>
              <span className="text-red-600 text-base">
                Please select either User Name or Email to forgot the password!!
              </span>
            </div>
          )}
          <div>
            {false ? (
              <div className="flex w-full justify-center rounded-md bg-electric-green px-3 py-1.5 text-sm font-semibold leading-6 text-deep-navy shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green">
                <CircularProgress
                  style={{
                    width: "24px",
                    height: "24px",
                    color: "#FFFFFF",
                  }}
                />
              </div>
            ) : (
              <button
                onClick={handleForgotPassword}
                className="flex w-full justify-center rounded-md bg-electric-green px-3 py-1.5 text-sm font-semibold leading-6 text-deep-navy shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden h-screen w-4/6 ">
        <video
          autoPlay="autoplay"
          loop={true}
          muted
          className="absolute z-10 w-auto min-w-full min-h-full max-w-none  backdrop-contrast-100 backdrop-blur-sm"
        >
          <source src={BgVideoGreen} type="video/mp4" />
          <source src={BgVideo} type="video/mp4" />
        </video>
      </div>
      <div>
        {forgotPassword ? (
          <ForgotPassword
            open={forgotPassword}
            handleClose={() => setForgotPassword(!forgotPassword)}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ForgotPassword;
