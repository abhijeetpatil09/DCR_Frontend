import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { CircularProgress } from "@mui/material";
import * as actions from "../../redux/actions/index";
import BgVideo from "../../Assets/loginbg.mp4";
import BgVideoGreen from "../../Assets/loginbg_green.mp4";
// import "./pure-react.css";
// import "./styles.css";
import AWS from "aws-sdk";

const Login = () => {
  //const blob = new Blob([data.Body.toString()], { type: 'text/csv' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [attributes, setAttributes] = useState("");

  const s3 = new AWS.S3({
    accessKeyId: "AKIA57AGVWXYVR36XIEC",
    secretAccessKey: "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",
    // signatureVersion: 'v4',
    region: "ap-south-1",
    // region: 'ap-south-1',
  });

  const params = {
    // Bucket: 'dcr-poc/query_request',
    Bucket: "dcr-poc",
    Key: "consumer_attributes/consumer_attributes.csv",
    //Body: blob,
    // ACL: 'private',
  };

  // s3.listBuckets(function(err, data) {
  //     if (err) console.log(err, err.stack);
  //     else console.log(data);
  // });
  //const consumer_attr = s3.getObject(params).promise();
  //console.log(consumer_attr)
  s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      //console.log(data.Body.toString('utf-8'));
      console.log(data.Body.toString("utf-8").split("\n"));
      //const attr = data.Body.toString('utf-8').split("\n");
      //const attr2 = attr.toString('utf-8').split(",");
      //console.log(attr.toString('utf-8'));
      //alert('file downloaded successfully')
    }
  });

  const errors = {
    uname: "invalid username",
    pass: "invalid password",
  };

  const handleSubmit = (event) => {
    setLoading(true);
    //Prevent page reload
    event.preventDefault();

    if (userName !== "") {
      axios
        .get(`http://127.0.0.1:5000/${userName}`, {
          params: {
            query:
              "select * from DCR_PROVIDER1.CLEANROOM.CONSUMER_ATTRIBUTES_VW;",
          },
        })
        .then((response) => {
          if (response?.data?.data) {
            let data = response?.data?.data;

            // Find user login info
            const userData = data.find((user) => user.USER === userName);

            // Compare user info
            if (userData) {
              if (userData.PASSWORD !== password) {
                // Invalid password
                setErrorMessages({ name: "pass", message: errors.pass });
              } else {
                const userRole = [];
                if (userData.PUBLISHER === "TRUE") {
                  userRole.push("Publisher");
                }
                if (userData.PROVIDER === "TRUE") {
                  userRole.push("Provider");
                }
                if (userData.CONSUMER === "TRUE") {
                  userRole.push("Consumer");
                }
                setIsSubmitted(true);

                dispatch(
                  actions.loginRequest({
                    name: userName,
                    role: userRole,
                  })
                );
                toast.success("Logged in sucessfully...");
                navigate("/home");
              }
            } else {
              // Username not found
              setLoading(false);
              setErrorMessages({ name: "uname", message: errors.uname });
              toast.error(
                "You entered an incorrect username, password or both."
              );
            }
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }

    fetch("http://localhost:5000/upload", {
      method: "GET",
    })
      .then((response) => {
        setAttributes(response.status_code);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="uname"
          className="block text-sm font-medium leading-6 text-electric-green"
        >
          Username{" "}
        </label>
        <div className="mt-2">
          <input
            id="uname"
            type="text"
            name="uname"
            placeholder="Please enter a username. e.g. aditi_nair"
            onChange={(e) => setUserName(e.target.value)}
            required
            className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
          />
        </div>
        {renderErrorMessage("uname")}
      </div>
      <div>
        <label
          htmlFor="pass"
          className="block text-sm font-medium leading-6 text-electric-green"
        >
          Password
        </label>
        <div className="mt-2">
          <input
            id="pass"
            type="password"
            name="pass"
            placeholder="Please enter your password."
            required
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
          />
        </div>
        {renderErrorMessage("pass")}
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
            "Submit"
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="   flex flex-row  flex-1   justify-center items-center bg-deep-navy">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm w-2/6  bg-deep-navy mb-10 lg:mb-20">
        <div class=" flex flex-row items-center justify-center  ">
          <span class=" text-white font-semi-bold  text-2xl  ">
            <span class="text-electric-green text-4xl">D</span>ata
            <span class="text-electric-green text-4xl">X</span>change
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
          autoplay="autoplay"
          loop="true"
          muted
          class="absolute z-10 w-auto min-w-full min-h-full max-w-none  backdrop-contrast-100 backdrop-blur-sm"
        >
          <source src={BgVideoGreen} type="video/mp4" />
          <source src={BgVideo} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default Login;

// const database = [
//   {
//     username: "admin",
//     password: "admin",
//     role:["Consumer","Publisher","Provider"]
//   },
//   {
//     username: "provider",
//     password: "provider",
//     role:["Consumer","Provider"]
//   },
//   {
//     username: "Hoonartek",
//     password: "Hoonartek",
//     role:["Consumer","Publisher"]
//   },
//   {
//     username: "HTmedia",
//     password: "HTmedia",
//     role:["Consumer"]
//   }
// ];
