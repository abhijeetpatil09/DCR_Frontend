import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import * as actions from "../../redux/actions/index";
import BgVideo from "../../Assets/loginbg.mp4";
import BgVideoGreen from "../../Assets/loginbg_green.mp4";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginDetails, setLoginDetails] = useState({
    userName: "",
    password: "",
    captcha: "",
  });

  const [errors, setErrors] = useState({
    userName: null,
    password: null,
    captcha: null,
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOnChange = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;

    if (inputName === "userName") {
      if (inputValue === "") {
        setErrors({ ...errors, userName: "Please enter User Name" });
      } else {
        setErrors({ ...errors, userName: null });
      }
    } else if (inputName === "password") {
      if (inputValue === "") {
        setErrors({ ...errors, password: "Please enter password" });
      } else {
        setErrors({ ...errors, password: null });
      }
    }
    setLoginDetails({ ...loginDetails, [inputName]: inputValue });
  };

  const getAllConsumers = async (userRole) => {
    await axios
      .get(`http://127.0.0.1:5000/${loginDetails?.userName}`, {
        params: {
          query: `select user from CONSUMER_ATTRIBUTES_VW where admin = 'true';`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          setIsSubmitted(true);

          let data = response?.data?.data?.[0];
          dispatch(
            actions.loginRequest({
              isLoggedIn: true,
              name: loginDetails?.userName,
              role: userRole,
              Consumer: data?.USER,
            })
          );
          navigate("/home");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = async (event) => {
    //Prevent page reload
    event.preventDefault();
    if (loginDetails?.userName === "") {
      setErrors({ ...errors, userName: "Please enter User name" });
      return;
    } else if (loginDetails?.password === "") {
      setErrors({ ...errors, password: "Please enter password" });
      return;
    }

    if (loginDetails?.userName !== "") {
      setLoading(true);
      await axios
        .get(`http://127.0.0.1:5000/${loginDetails?.userName}`, {
          params: {
            query: `select * from CONSUMER_ATTRIBUTES_VW WHERE USER = '${loginDetails?.userName}';`,
          },
        })
        .then((response) => {
          if (response?.data?.data) {
            let data = response?.data?.data; // Find user login info

            const userData = data ? data[0] : [];

            // Compare user info
            if (userData) {
              if (userData.PASSWORD !== loginDetails?.password) {
                setErrors({ ...errors, password: "Invalid Password" });
                setLoading(false);
              } else {
                const userRole = [];
                if (userData?.PUBLISHER?.toLowerCase() === "true") {
                  userRole.push("Publisher");
                }
                if (userData?.PROVIDER?.toLowerCase() === "true") {
                  userRole.push("Provider");
                }
                if (userData?.CONSUMER?.toLowerCase() === "true") {
                  userRole.push("Consumer");
                }
                if (
                  userData?.PROVIDER?.toLowerCase() === "true" &&
                  userData?.ADMIN?.toLowerCase() === "true"
                ) {
                  userRole.push("Provider_Admin");
                }

                if (
                  userData?.CONSUMER?.toLowerCase() === "true" &&
                  userData?.ADMIN?.toLowerCase() === "true"
                ) {
                  userRole.push("Consumer_Admin");
                }
                getAllConsumers(userRole);
              }
            } else {
              // Username not found
              setLoading(false);
              setErrors({ ...errors, userName: "User name not found" });
              toast.error(
                "You entered an incorrect username, password or both."
              );
            }
          }
        })
        .catch((error) => {
          setErrors({ ...errors, userName: "User name not found" });
          setLoading(false);
          console.log(error);
        });
    }
  };

  // JSX code for login form
  const renderForm = (
    <div className="space-y-6">
      <div>
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
            onChange={handleOnChange}
            required
            className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
          />
          {errors.userName !== null ? (
            <span className="text-[#f44336] text-sm">{errors.userName}</span>
          ) : null}
        </div>
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-electric-green"
        >
          Password
        </label>
        <div className="mt-2">
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Please enter your password."
            required
            onChange={handleOnChange}
            className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
          />
          {errors.password !== null ? (
            <span className="text-[#f44336] text-sm">{errors.password}</span>
          ) : null}
        </div>
      </div>

      <div>
        <button
          onClick={handleSubmit}
          className="flex w-full justify-center rounded-md bg-electric-green px-3 py-1.5 text-sm font-semibold leading-6 text-deep-navy shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"
        >
          {loading ? (
            <CircularProgress
              style={{ width: "24px", height: "24px", color: "#FFFFFF" }}
            />
          ) : (
            "Log In"
          )}
        </button>
      </div>
    </div>
  );

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
          Sign in to your account
        </h2>
        {/* </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm relative z-30"> */}
        {isSubmitted ? <div>User is successfully logged in</div> : renderForm}
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
    </div>
  );
};

export default Login;
