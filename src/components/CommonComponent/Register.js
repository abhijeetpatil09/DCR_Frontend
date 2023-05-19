import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from '@mui/material';
import * as actions from "../../redux/actions/index";
import BgVideo from '../../Assets/loginbg.mp4';
import BgVideoGreen from '../../Assets/loginbg_green.mp4';
// import "./pure-react.css";
// import "./styles.css";
import AWS from "aws-sdk";

const Register = () => {
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

  useEffect(() => {
    // axios
    //   .get("http://127.0.0.1:5000/data_fetcher", {
    //     params: {
    //       query:
    //         "select * from DCR_PROVIDER1.CLEANROOM.CONSUMER_ATTRIBUTES_VW;",
    //     },
    //   })
    //   .then((response) => setData(response.data.data))
    //   .catch((error) => console.log(error));
  }, []);

  const errors = {
    uname: "invalid username",
    pass: "invalid password",
  };

  const handleSubmit = (event) => {
    setLoading(true);
    //Prevent page reload
    event.preventDefault();

    axios
      .get("http://127.0.0.1:5000/data_fetcher", {
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
              toast.success('Logged in sucessfully...');
              navigate("/home");
            }
          } else {
            // Username not found
            setLoading(false);
            setErrorMessages({ name: "uname", message: errors.uname });
            toast.error('You entered an incorrect username, password or both.');
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error)
      });

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
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="flex flex-row  gap-2 border-b-[1px] border-opacity-50 border-electric-green pb-4 mb-4">
          <div className="w-1/2 ">
            <div className="">
              <label htmlFor="fullname" className="block text-sm font-medium leading-6 text-electric-green">Full name </label>
              <div className="mt-2">
                <input
                  id="fullname"
                  type="text"
                  name="fullname"
                  placeholder="e.g. Aditi Nair"
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                />
              </div>
              {renderErrorMessage("fullname")}
            </div>
            <div className="mt-2">
              <label htmlFor="designation" className="block text-sm font-medium leading-6 text-electric-green">Designation</label>
              <div className="mt-2">
                <input
                  id="designation"
                  type="text"
                  name="designation"
                  placeholder="e.g. Associate"
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                />
              </div>
              {renderErrorMessage("designation")}
            </div>
          </div>
          <div className="w-1/2">
            <div className="">
              <label htmlFor="company" className="block text-sm font-medium leading-6 text-electric-green">Company</label>
              <div className="mt-2">
                <input
                  id="company"
                  type="text"
                  name="company"
                  placeholder="e.g. GroupM inc"
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                />
              </div>
              {renderErrorMessage("company")}
            </div>
            <div className="mt-2">
              <label htmlFor="emailid" className="block text-sm font-medium leading-6 text-electric-green">Email id</label>
              <div className="mt-2">
                <input
                  id="emailid"
                  type="text"
                  name="emailid"
                  placeholder="e.g. aditi.nair@groupm.com"
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                />
              </div>
              {renderErrorMessage("emailid")}
            </div>
          </div>
        </div>
        <div className="pb-4 flex flex-row border-b-[1px] border-opacity-50 border-electric-green">
          <div className=" ">
            <label htmlFor="sfid" className="block text-sm font-medium leading-6 text-electric-green">Does your company have a Snowflake account that will be used as a Tenant/Consumer account for data collaboration?</label>
            <div className="mt-2">
              <div class="flex justify-start">
                <div class="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                  <input
                    class="relative bg-deep-navy float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-electric-green before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-electric-green checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-electric-green checked:after:bg-electric-green checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-electric-green dark:checked:border-electric-green dark:checked:after:border-electric-green dark:checked:after:bg-electric-green dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-electric-green  dark:checked:focus:before:shadow-[0px_0px_0px_13px_#00FFB4]"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio1"
                    value="option1" />
                  <label
                    class="mt-px inline-block pl-[0.15rem] hover:cursor-pointer text-electric-green"
                    for="inlineRadio1"
                  >Yes</label>
                </div>

                <div class="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                  <input
                    class="relative bg-deep-navy float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-electric-green before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-electric-green checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-electric-green checked:after:bg-electric-green checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-electric-green dark:checked:border-electric-green dark:checked:after:border-electric-green dark:checked:after:bg-electric-green dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-electric-green  dark:checked:focus:before:shadow-[0px_0px_0px_13px_#00FFB4]"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio2"
                    value="option2" />
                  <label
                    class="mt-px inline-block pl-[0.15rem] hover:cursor-pointer text-electric-green"
                    for="inlineRadio2"
                  >No</label
                  >
                </div>

              </div>
            </div>
            {renderErrorMessage("sfid")}
          </div>
        </div>
        <div className="flex flex-row gap-2 pt-2 pb-4 mb-4 border-b-[1px] border-opacity-50 border-electric-green">

          <div className="w-1/3">
            <label htmlFor="uname" className="block text-sm font-medium leading-6 text-electric-green">Username </label>
            <div className="mt-2">
              <input
                id="uname"
                type="text"
                name="uname"
                placeholder="e.g. aditi_nair"
                onChange={(e) => setUserName(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
              />
            </div>
            {renderErrorMessage("uname")}
          </div>
          <div className="w-1/3 ">
            <label htmlFor="pass" className="block text-sm font-medium leading-6 text-electric-green">
              Password
            </label>
            <div className="mt-2">

              <input
                id="pass"
                type="password"
                name="pass"
                placeholder=" "
                required
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
              />
            </div>
            {renderErrorMessage("pass")}
          </div>
          <div className="w-1/3">
            <label htmlFor="pass" className="block text-sm font-medium leading-6 text-electric-green">
              Confirm Password
            </label>
            <div className="mt-2">

              <input
                id="pass"
                type="password"
                name="pass"
                placeholder=" "
                required
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
              />
            </div>
            {renderErrorMessage("pass")}
          </div>

        </div>
      </div>
      <div className="flex flex-row mt-4 gap-2 justify-end">
      <a
          href={'/'}
          className="flex  justify-center rounded-md bg-deep-navy px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green border border-electric-green"
        >
          Back
         </a>
        <button
          onClick={handleSubmit}
          className="flex  justify-center rounded-md bg-electric-green px-3 py-1.5 text-sm font-semibold leading-6 text-deep-navy shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"
        >
          {loading ? <CircularProgress style={{ width: '24px', height: '24px', color: '#FFFFFF' }} /> : "Submit"}
        </button>
      </div>
    </div>

  );

  return (
    <div className="flex flex-row  flex-1   justify-center items-center relative h-screen">
      <div className="absolute overflow-hidden h-screen w-full z-10">
        <video autoplay="autoplay" loop="true" muted
          class="absolute z-10 w-auto min-w-full min-h-full max-w-none  backdrop-contrast-100 backdrop-blur-sm">
          <source src={BgVideoGreen} type="video/mp4" />
          <source src={BgVideo} type="video/mp4" />
        </video>
      </div>
      <div className="absolute overflow-hidden h-auto w-1/2 z-10 bg-deep-navy mx-auto top-11 p-10">
        <div class=" flex flex-row items-center justify-center  ">
          <span class=" text-white font-semi-bold  text-2xl  ">
            <span class="text-electric-green text-4xl">D</span>ata<span class="text-electric-green text-4xl">X</span>change</span>
        </div>
        <h2 className=" mb-4 text-center text-md font-light   leading-9 tracking-tight text-electric-green">
          Register yourself by giving us some basic details below.
        </h2>
        {isSubmitted ? (
          <div>User is successfully logged in</div>
        ) : (
          renderForm
        )}
      </div>

    </div>
  );
}

export default Register;
