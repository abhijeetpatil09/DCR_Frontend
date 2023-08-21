import React, { useState, useEffect } from "react";
import { Alert, CircularProgress } from "@mui/material";
import axios from "axios";
import {
  loadCaptchaEnginge,
  validateCaptcha,
  LoadCanvasTemplateNoReload,
} from "react-simple-captcha";

import BgVideo from "../../Assets/loginbg.mp4";
import BgVideoGreen from "../../Assets/loginbg_green.mp4";

const baseURL = process.env.REACT_APP_BASE_URL;
const redirectionUser = process.env.REACT_APP_REDIRECTION_URL;

const Register = () => {
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    designation: "",
    company: "",
    userName: "",
    password: "",
    confirmPassword: "",
    accountRadio: "no",
    captcha: "",
  });
  const [errors, setErrors] = useState({
    fullName: null,
    email: null,
    designation: null,
    company: null,
    userName: null,
    password: null,
    confirmPassword: null,
    accountRadio: null,
    captcha: null,
  });

  const [loading, setLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const loadCaptchaAgain = () => {
    loadCaptchaEnginge(6);
  };

  const validateEmail = (mail) => {
    var mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (mail.match(mailformat)) return true;
    else return false;
  };

  const isValidInput = (input) => {
    const specialCharactersRegex = /[!@#$%^&*~`()_+\-=[\]{};':"\\|,.<>/?]+/;
    const pattern = /^[a-zA-Z\s]+$/;

    if (specialCharactersRegex.test(input)) {
      return "specialCharacter";
    } else if (!pattern.test(input)) {
      return "number";
    } else {
      return "";
    }
  };

  const validatePassword = (password) => {
    // let regex =
    //   "^(?=.*[A-Za-z])(?=.*d)(?=.*[@#$%^&+=!])(?=.*[a-zA-Z0-9]).{8,}$"; // 1 letter(upper or lower), min 8 max 16, 1 number, 1 special char
    // let regex = '/(?=^.{8,24}$)(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/'; // Only letter and numbers, no special character
    // const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?=.*[a-zA-Z0-9@#$%^&+=!]).{8,}$/
    return password.match(
      /(?=^.{8,16}$)(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
    ); /// // Only letter and numbers, no special character
  };

  const onChangehandler = (e) => {
    const emptyMsg = "Required field";

    const inputName = e.target.name;
    const inputValue = e.target.value;

    setRegistrationError(null);
    if (inputName === "fullName") {
      let character = isValidInput(inputValue);
      if (inputValue === "") {
        setErrors({ ...errors, fullName: emptyMsg });
      } else if (character === "specialCharacter") {
        setErrors({
          ...errors,
          fullName: "Special Characters are not allowed",
        });
      } else if (character === "number") {
        setErrors({ ...errors, fullName: "Numbers are not allowed" });
      } else {
        setErrors({ ...errors, fullName: null });
      }
    } else if (inputName === "company") {
      if (inputValue === "") {
        setErrors({ ...errors, company: emptyMsg });
      } else {
        setErrors({ ...errors, company: null });
      }
    } else if (inputName === "email") {
      let isEmailValid = validateEmail(inputValue);
      if (inputValue === "") {
        setErrors({ ...errors, email: emptyMsg });
      } else if (!isEmailValid) {
        setErrors({ ...errors, email: "Please enter a valid email address." });
      } else {
        setErrors({ ...errors, email: null });
      }
    } else if (inputName === "userName") {
      if (inputValue === "") {
        setErrors({ ...errors, userName: emptyMsg });
      } else {
        setErrors({ ...errors, userName: null });
      }
    } else if (inputName === "password") {
      let isPasswordValid = validatePassword(inputValue);
      if (inputValue === "") {
        setErrors({ ...errors, password: emptyMsg });
      } else if (!isPasswordValid) {
        let passErrorMsg =
          "Password must be between 8 to 16 characters long with Characters(Uppercase or Lowercase) and numbers. No special characters are allowed.";
        setErrors({ ...errors, password: passErrorMsg });
      } else if (
        userDetails.confirmPassword !== "" &&
        userDetails.confirmPassword !== inputValue
      ) {
        setErrors({
          ...errors,
          password: null,
          confirmPassword: "Password doesn't match",
        });
      } else {
        setErrors({ ...errors, password: null, confirmPassword: null });
      }
    } else if (inputName === "confirmPassword") {
      if (inputValue === "") {
        setErrors({ ...errors, confirmPassword: emptyMsg });
      } else if (userDetails.password !== inputValue) {
        setErrors({ ...errors, confirmPassword: "Password doesn't match" });
      } else {
        setErrors({ ...errors, confirmPassword: null });
      }
    }
    if (inputName === "captcha") {
      if (inputValue === "") {
        setErrors({ ...errors, captcha: "Please enter Captcha" });
      } else {
        setErrors({ ...errors, captcha: null });
      }
    }
    setUserDetails({ ...userDetails, [inputName]: inputValue });
  };

  const validateForm = () => {
    const emptyMsg = "Required field";

    const newErrors = {};

    if (userDetails.fullName === "") {
      newErrors.fullName = emptyMsg;
    }
    if (userDetails.company === "") {
      newErrors.company = emptyMsg;
    }
    if (userDetails.email === "") {
      newErrors.email = emptyMsg;
    }
    if (userDetails.userName === "") {
      newErrors.userName = emptyMsg;
    }
    if (userDetails.password === "") {
      newErrors.password = emptyMsg;
    }
    if (userDetails.confirmPassword === "") {
      newErrors.confirmPassword = emptyMsg;
    }
    if (validateCaptcha(userDetails?.captcha) === true) {
      loadCaptchaEnginge(6);
    } else {
      newErrors.captcha = "Please enter correct Captcha";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const sendEmail = () => {
    axios
      .get(`${baseURL}/mailtoadmin`, {
        params: {
          recipient: `${userDetails?.email}`,
          subject: `${userDetails?.fullName} wants to register.`,
          message: `Hello,
                        ${userDetails?.fullName} wants to register for Data Exchange. He/she is filled the information as below.
                        
                        *Full Name    : ${userDetails?.fullName}
                        *Company Name : ${userDetails?.company}
                        *Designation  : ${userDetails?.designation}
                        *Email Id     : ${userDetails?.email}
                        *Does company
                        have snowflake
                        account       : ${userDetails?.accountRadio}
                        *User Name    : ${userDetails?.userName}
                        *Password     : ${userDetails?.password}

                        Please connect with ${userDetails?.fullName} as soon as possible for the completion of the registration process.`,
        },
      })
      .then((response) => {
        if (response) {
          setLoading(false);
          setRegistrationError(
            "Our Expert team will connect with you within next 24 hours for the further process."
          );
        } else {
          setLoading(false);
          setRegistrationError(
            "We are facing some issue, Please, try Again to register."
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        setRegistrationError(
          "We are facing some issue, Please, try Again to register."
        );
        console.log(error);
      });
  };

  const registerUser = () => {
    axios
      .get(`${baseURL}/${redirectionUser}`, {
        params: {
          query: `insert into DATAEXCHANGEDB.DATACATALOG.USER_DETAILS_REGISTRATION(full_name,company,designation,email_id,snowflake_account,username,password) values('${userDetails?.fullName}','${userDetails?.company}','${userDetails?.designation}', '${userDetails?.email}','${userDetails?.accountRadio}','${userDetails?.userName}','${userDetails?.password}');`,
        },
      })
      .then((response) => {
        if (response) {
          sendEmail();
        } else {
          setLoading(false);
          setRegistrationError(
            "We are facing some issue, Please, try Again to register."
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        setRegistrationError(
          "We are facing some issue, Please, try Again to register."
        );
        console.log(error);
      });
  };

  const handleSubmit = () => {
    const isFormValid = validateForm();

    if (isFormValid) {
      setLoading(true);

      axios
        .get(`${baseURL}/${redirectionUser}`, {
          params: {
            query: `select count(*) as count from DATAEXCHANGEDB.DATACATALOG.CONSUMER_ATTRIBUTES where user='${userDetails.userName}';`,
          },
        })
        .then((response) => {
          if (response?.data?.data) {
            let count = response?.data?.data[0]?.COUNT;
            if (count) {
              setRegistrationError(
                "The User Name is already exist. Please use another User Name to register"
              );
              setLoading(false);
            } else {
              registerUser();
            }
          } else {
            setLoading(false);
            setRegistrationError(
              "We are facing some issue, Please, try Again to register."
            );
          }
        })
        .catch((error) => {
          setLoading(false);
          setRegistrationError(
            "We are facing some issue, Please, try Again to register."
          );
          console.log(error);
        });
    }
  };

  // JSX code for login form
  const renderForm = (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="flex flex-row  gap-2 border-b-[1px] border-opacity-50 border-electric-green pb-4 mb-4">
          <div className="w-1/2 ">
            <div className="">
              <label
                htmlFor="fullname"
                className="flex text-sm font-medium leading-6 text-electric-green"
              >
                Full name<p className="text-red-600 pl-1">*</p>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Aditi Nair"
                  onChange={onChangehandler}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                />
                {errors?.fullName && errors?.fullName !== null ? (
                  <span className="text-[#f44336] text-sm">
                    {errors.fullName}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mt-2">
              <label
                htmlFor="designation"
                className="block text-sm font-medium leading-6 text-electric-green"
              >
                Designation
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="designation"
                  placeholder="e.g. Associate"
                  onChange={onChangehandler}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                />
                {errors?.designation && errors?.designation !== null ? (
                  <span className="text-[#f44336] text-sm">
                    {errors.designation}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <div className="">
              <label
                htmlFor="company"
                className="flex text-sm font-medium leading-6 text-electric-green"
              >
                Company<p className="text-red-600 pl-1">*</p>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="company"
                  placeholder="e.g. GroupM inc"
                  onChange={onChangehandler}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                />
                {errors?.company && errors?.company !== null ? (
                  <span className="text-[#f44336] text-sm">
                    {errors.company}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mt-2">
              <label
                htmlFor="email"
                className="flex text-sm font-medium leading-6 text-electric-green"
              >
                Email Id<p className="text-red-600 pl-1">*</p>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="email"
                  placeholder="e.g. aditi.nair@groupm.com"
                  onChange={onChangehandler}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                />
                {errors?.email && errors?.email !== null ? (
                  <span className="text-[#f44336] text-sm">{errors.email}</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="pb-4 flex flex-row border-b-[1px] border-opacity-50 border-electric-green">
          <div className=" ">
            <label className="block text-sm font-medium leading-6 text-electric-green">
              Does your company have a Snowflake account that will be used as a
              Tenant/Consumer account for data collaboration?
            </label>
            <div className="mt-2">
              <div className="flex justify-start">
                <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                  <input
                    className="relative bg-deep-navy float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-electric-green before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-electric-green checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-electric-green checked:after:bg-electric-green checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-electric-green dark:checked:border-electric-green dark:checked:after:border-electric-green dark:checked:after:bg-electric-green dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-electric-green  dark:checked:focus:before:shadow-[0px_0px_0px_13px_#00FFB4]"
                    type="radio"
                    name="accountRadio"
                    value="yes"
                    checked={userDetails.accountRadio === "yes"}
                    onChange={onChangehandler}
                  />
                  <label
                    className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer text-electric-green"
                    htmlFor="inlineRadio1"
                  >
                    Yes
                  </label>
                </div>

                <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                  <input
                    className="relative bg-deep-navy float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-electric-green before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-electric-green checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-electric-green checked:after:bg-electric-green checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-electric-green dark:checked:border-electric-green dark:checked:after:border-electric-green dark:checked:after:bg-electric-green dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-electric-green  dark:checked:focus:before:shadow-[0px_0px_0px_13px_#00FFB4]"
                    type="radio"
                    name="accountRadio"
                    value="no"
                    checked={userDetails.accountRadio === "no"}
                    onChange={onChangehandler}
                  />
                  <label
                    className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer text-electric-green"
                    htmlFor="inlineRadio2"
                  >
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2 pt-2 pb-4 mb-4 border-b-[1px] border-opacity-50 border-electric-green">
          <div className="w-1/3">
            <label
              htmlFor="userName"
              className="flex text-sm font-medium leading-6 text-electric-green"
            >
              Username<p className="text-red-600 pl-1">*</p>
            </label>
            <div className="mt-2">
              <input
                id="userName"
                type="text"
                name="userName"
                placeholder="e.g. aditi_nair"
                onChange={onChangehandler}
                required
                className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
              />
              {errors?.userName && errors?.userName !== null ? (
                <span className="text-[#f44336] text-sm">
                  {errors.userName}
                </span>
              ) : null}
            </div>
          </div>
          <div className="w-1/3 ">
            <label
              htmlFor="password"
              className="flex text-sm font-medium leading-6 text-electric-green"
            >
              Password<p className="text-red-600 pl-1">*</p>
            </label>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                placeholder=" "
                required
                onChange={onChangehandler}
                className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
              />
              {errors?.password && errors?.password !== null ? (
                <span className="text-[#f44336] text-sm">
                  Please check assumption
                </span>
              ) : null}
            </div>
          </div>
          <div className="w-1/3">
            <label
              htmlFor="confirmPassword"
              className="flex text-sm font-medium leading-6 text-electric-green"
            >
              Confirm Password<p className="text-red-600 pl-1">*</p>
            </label>
            <div className="mt-2">
              <input
                type="password"
                name="confirmPassword"
                placeholder=" "
                required
                onChange={onChangehandler}
                className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
              />
              {errors?.confirmPassword && errors.confirmPassword !== null ? (
                <span className="text-[#f44336] text-sm">
                  {errors.confirmPassword}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        {errors?.password && errors?.password !== null && (
          <span className="text-[#f44336] text-sm">
            Password Policy : Password must be between 8 to 16 characters long
            with Characters(Uppercase or Lowercase) and numbers. No special
            characters are allowed.
          </span>
        )}
      </div>
      <div className="flex items-center">
        <div className="mx-2">
          <label
            htmlFor="captcha"
            className="flex text-sm font-medium leading-6 text-electric-green"
          >
            Your Captcha
          </label>
          <div className="flex mx-0 items-center justify-between bg-[#E8F4FE] h-[45px] rounded-md px-4">
            <div>
              <LoadCanvasTemplateNoReload
                reloadColor="red"
                reloadText="reload"
              />
            </div>
            <div
              className="align-center text-xl cursor-pointer"
              onClick={loadCaptchaAgain}
            >
              &#x21bb;
            </div>
          </div>
        </div>
        <div className="mx-2">
          <label
            htmlFor="captcha"
            className="flex text-sm font-medium leading-6 text-electric-green"
          >
            Enter Captcha<p className="text-red-600 pl-1">*</p>
          </label>
          <input
            id="user_captcha_input"
            type="text"
            name="captcha"
            placeholder="Please enter your Captcha"
            required
            onChange={onChangehandler}
            className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
          />
          {errors?.captcha && errors?.captcha !== null ? (
            <span className="text-[#f44336] text-sm">{errors.captcha}</span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-row mt-4 gap-2 justify-center">
        <a
          href={"/"}
          className="flex  justify-center rounded-md bg-deep-navy px-6 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green border border-electric-green"
        >
          Back
        </a>
        <div>
          {loading ? (
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
              onClick={handleSubmit}
              className="flex w-full justify-center rounded-md bg-electric-green px-6 py-1.5 text-sm font-semibold leading-6 text-deep-navy shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"
            >
              Register
            </button>
          )}
        </div>
      </div>
      {/* for showing error */}
      <div className="my-4">
        {registrationError && (
          <Alert className="text-red-600" severity="error">
            {registrationError}
          </Alert>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-row flex-1 overflow-x-hidden justify-center items-center relative h-screen">
      <div className="absolute h-screen w-full z-10">
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
      <div className="absolute overflow-hidden h-auto w-1/2 z-10 bg-deep-navy mx-auto top-11 px-10 py-4 rounded-md">
        <div className=" flex flex-row items-center justify-center  ">
          <span className=" text-white font-semi-bold  text-2xl  ">
            <span className="text-electric-green text-4xl">D</span>ata
            <span className="text-electric-green text-4xl">X</span>change
          </span>
        </div>
        <h2 className=" mb-4 text-center text-md font-light   leading-9 tracking-tight text-electric-green">
          Register yourself by giving us some basic details below.
        </h2>
        {renderForm}
      </div>
    </div>
  );
};

export default Register;
