import React from "react";
import { useState } from "react";
import axios from "axios";

import {
  Alert,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import BgVideo from "../../../../Assets/loginbg.mp4";
import BgVideoGreen from "../../../../Assets/loginbg_green.mp4";
import ModalForgotPassword from "./ModalForgotPassword";

const baseURL = process.env.REACT_APP_BASE_URL;
const redirectionUser = process.env.REACT_APP_REDIRECTION_URL;

const ForgotPassword = () => {
  const [forgotPassword, setForgotPassword] = useState(false);
  const [radio, setRadio] = useState("yes");

  const [details, setDetails] = useState({
    userName: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    userName: null,
    email: null,
  });

  const [outputError, setOutputError] = useState(null);
  const [loader, setLoader] = useState(false);

  const handleChange = (event) => {
    setRadio(event.target.value);
  };

  const validateEmail = (mail) => {
    var mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (mail.match(mailformat)) return true;
    else return false;
  };

  const handleOnChange = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;
    setOutputError(null);
    if (inputName === "userName") {
      if (inputValue === "") {
        setErrors({ ...errors, userName: "Please enter User Name" });
      } else {
        setErrors({ ...errors, userName: null });
      }
    } else if (inputName === "email") {
      let isEmailValid = validateEmail(inputValue);
      if (inputValue === "") {
        setErrors({ ...errors, email: "Please enter Email" });
      } else if (!isEmailValid) {
        setErrors({ ...errors, email: "Please enter a valid email address." });
      } else {
        setErrors({ ...errors, email: null });
      }
    }
    setDetails({ ...details, [inputName]: inputValue });
  };

  const sendEmail = (data) => {
    axios
      .get(`${baseURL}/mailtoadmin`, {
        params: {
          recipient: `${data?.EMAIL}`,
          subject: `Forgot Password for user ${data?.USER}`,
          message: `Hello,
                      Please check your User Name followed by Password below: 
                        User Name: ${data?.USER}
                        Password: ${data?.PASSWORD}
                        Email: ${data?.EMAIL}
                        
                      Please use the above credentials to login again. 
                    Thanks and Regards,
                    Data Exchange`,
        },
      })
      .then((response) => {
        if (response) {
          setOutputError(null);
          setForgotPassword(true);
          setLoader(false);
        } else {
          setOutputError(
            "There is an issue to send the mail Please try again later."
          );
          setLoader(false);
        }
      })
      .catch((error) => {
        setOutputError(
          "There is an issue to send the mail Please try again later."
        );
        setLoader(false);

        console.log(error);
      });
  };

  const getUsersData = (userName) => {
    axios
      .get(`${baseURL}/${userName}`, {
        params: {
          query: `select * from DATAEXCHANGE_ADMIN.ADMIN.USER_CREDENTIALS where user = '${userName}';`,
        },
      })

      .then((response) => {
        if (response?.data?.data) {
          sendEmail(response?.data?.data[0]);
        } else {
          setOutputError(
            "Invalid User Name. Please check the user Name again!"
          );
          setLoader(false);
        }
      })
      .catch((error) => {
        setOutputError("Invalid User Name. Please check the user Name again!");
        setLoader(false);

        console.log(error);
      });
  };

  const handleForgotPassword = () => {
    if (errors.userName !== null || errors.email !== null) {
      return;
    } else {
      setLoader(true);
      if (radio === "no") {
        axios
          .get(`${baseURL}/${redirectionUser}`, {
            params: {
              query: `select USERNAME from DATAEXCHANGEDB.DATACATALOG.USER_DETAILS_REGISTRATION where email_id='${details.email}'`,
            },
          })
          .then((response) => {
            if (response?.data?.data?.length > 0) {
              getUsersData(response?.data?.data[0]?.USERNAME);
            } else {
              setOutputError(
                "Invalid Email Id. Please check the Email Id again!"
              );
              setLoader(false);
            }
          })
          .catch((error) => {
            setOutputError(
              "Invalid Email Id. Please check the Email Id again!"
            );
            setLoader(false);
            console.log(error);
          });
      } else {
        getUsersData(details.userName);
      }
    }
  };

  return (
    <div className="flex flex-row flex-1 justify-center items-center bg-deep-navy">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm w-2/6  bg-deep-navy mb-10 lg:mb-20">
        <div className=" flex flex-row items-center justify-center  ">
          <span className=" text-white font-semi-bold  text-2xl  ">
            <span className="text-electric-green text-4xl">D</span>ata
            <span className="text-electric-green text-4xl">X</span>change
          </span>
        </div>
        <h2 className="mt-10 mb-10 text-center text-2xl font-light leading-9 tracking-tight text-electric-green">
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
                  value={radio}
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
            {radio === "yes" && (
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
                    onChange={handleOnChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                  />
                  {errors.userName !== null ? (
                    <span className="text-[#f44336] text-sm">
                      {errors.userName}
                    </span>
                  ) : null}
                </div>
              </div>
            )}
          </div>
          {radio === "no" && (
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
                    name="email"
                    placeholder="e.g. aditi.nair@groupm.com"
                    onChange={handleOnChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                  />
                  {errors?.email && errors?.email !== null ? (
                    <span className="text-[#f44336] text-sm">
                      {errors.email}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          )}
          <div>
            {loader ? (
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
        <div className="my-4">
          {outputError && (
            <Alert className="text-red-600" severity="error">
              {outputError}
            </Alert>
          )}
        </div>
      </div>
      <div className="relative overflow-hidden h-screen w-4/6 ">
        <video
          autoPlay="autoplay"
          loop={true}
          muted
          className="absolute z-10 w-auto min-w-full min-h-full max-w-none backdrop-contrast-100 backdrop-blur-sm"
        >
          <source src={BgVideoGreen} type="video/mp4" />
          <source src={BgVideo} type="video/mp4" />
        </video>
      </div>
      <div>
        {forgotPassword ? (
          <ModalForgotPassword
            open={forgotPassword}
            handleClose={() => setForgotPassword(!forgotPassword)}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ForgotPassword;
