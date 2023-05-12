import React from "react";
import { ToastContainer } from "react-toastify";

import LandingPage from "./components/CommonComponent/LandingPage";
import Login from "./components/Login";
import Queryform from "./components/Queryform";
import Querystatus from "./components/Querystatus";
import Sidebar from "./components/CommonComponent/Sidebar";
import Requestinfo from "./components/Requestinfo";
import Home from "./components/Home";
import S3fileupload from "./components/S3fileupload";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Publisherform from "./components/Publisherform";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <Sidebar>
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/queryform" element={<Queryform />} />
                  <Route path="/querystatus" element={<Querystatus />} />
                  <Route path="/requestinfo" element={<Requestinfo />} />
                  <Route path="/publisherform" element={<Publisherform />} />
                  <Route path="/s3fileupload" element={<S3fileupload />} />
                </Routes>
              </Sidebar>
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
