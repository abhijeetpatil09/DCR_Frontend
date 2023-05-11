import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import BackgroundImage from "../Assets/DCR-background.png"
import { login } from "../features/userSlice";
import "./pure-react.css";
import "./styles.css";
import AWS from 'aws-sdk';

function Login() {
  //const blob = new Blob([data.Body.toString()], { type: 'text/csv' });
  const navigate = useNavigate();
  const [userName, setUserName] = useState('')
  const [role, setRole] = useState([])
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useDispatch();
  const [attributes, setAttributes] = useState('')
  const s3 = new AWS.S3({
    accessKeyId: 'AKIA57AGVWXYVR36XIEC',
    secretAccessKey: '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',
    // signatureVersion: 'v4',
    region: 'ap-south-1',
    // region: 'ap-south-1',
    });

    const params = {
    // Bucket: 'dcr-poc/query_request',
    Bucket: 'dcr-poc',
    Key: 'consumer_attributes/consumer_attributes.csv'
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
          console.log(data.Body.toString('utf-8').split("\n"));
          //const attr = data.Body.toString('utf-8').split("\n");
          //const attr2 = attr.toString('utf-8').split(",");
          //console.log(attr.toString('utf-8'));
          //alert('file downloaded successfully')
        }
    });
  // User Login info
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
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/data_fetcher', {
      params: {
        query: 'select * from DCR_PROVIDER1.CLEANROOM.CONSUMER_ATTRIBUTES_VW;'
      }
    })
    .then(response => setData(response.data.data))
    .catch(error => console.log(error));
  }, []);

  

  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  };

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    

    // Find user login info
    const userData = data.find((user) => user.USER === uname.value);

    

    // Compare user info
    if (userData) {
      if (userData.PASSWORD !== pass.value) {
        // Invalid password
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
      const userRole = [];
      if (userData.PUBLISHER==="TRUE") {
        userRole.push("Publisher");
      }
      if (userData.PROVIDER==="TRUE") {
        userRole.push("Provider");
      }
      if (userData.CONSUMER==="TRUE") {
        userRole.push("Consumer");
      }
      setRole(userRole);
        setIsSubmitted(true);
        dispatch(login({
          name:userName,
          role:userRole
        }))
        
        navigate('/home')
        alert("You have logged in sucessfully. Click on ok to proceed")
      }
    } else {
      // Username not found
      setErrorMessages({ name: "uname", message: errors.uname });
    }
    console.log("Role" , role)
    fetch('http://localhost:5000/upload', {

        method: 'GET',

       })

        .then((response) => {

        console.log(response);
        setAttributes(response.status_code)

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
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" onChange={(e)=> setUserName(e.target.value)} required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );

  return (
    <div className="homecenter">
        <div className="center">
          <div className="login-form">
            <div className="title">Sign In</div>
            {isSubmitted ? <div>User is successfully logged in</div> : renderForm}
          </div>
        </div>
    </div>
  );
}

export default Login;