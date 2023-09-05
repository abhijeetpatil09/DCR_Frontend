import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import LockIcon from "@mui/icons-material/Lock";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HandshakeIcon from "@mui/icons-material/Handshake";

import GroupMLogo from "../../Assets/logo-download-01.png";
// import HTWLogo from "../../Assets/hoonartek-logo.png";
import { useNavigate } from "react-router-dom";
import EnrichmentVideo from "../../Assets/Videos/Enrichment.mp4";

import match_rate from "../../Assets/landing/match_rate.jpg";
import enrichment from "../../Assets/landing/enrichment.jpg";
import search_catalogue from "../../Assets/landing/search_catalogue.jpg";
import data_catalogue from "../../Assets/landing/data_catalogue.jpg";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const [isMobileFixed, setIsMobileFixed] = useState(false);
  const [isDesktopFixed, setIsDesktopFixed] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 550) {
      setIsDesktopFixed(true);
    } else {
      setIsDesktopFixed(false);
    }
  };

  const handleLoad = () => {
    if (window.innerHeight >= 0) {
      setIsMobileFixed(true);
    } else {
      setIsMobileFixed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // const startVideo = () => {
  //   const player = document.getElementById("player");
  //   player.play();
  // };

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
      {/* Banner */}
      <div className="main-container ">
        <div className="banner">
          <div className="row pt-32">
            <div className="col-lg-12 content text-center">
              <div className=" flex flex-row items-center justify-center">
                <span className="text-deep-navy font-bold text-5xl">
                  <span className="text-electric-green text-6xl">D</span>ata
                  <span className="text-electric-green text-6xl">X</span>change
                </span>
              </div>
              <h2 className="w-1/2 my-0 mx-auto py-8 leading-10">
                Secure and Compliant Sharing with Unmatched Experience
              </h2>
              <div className="butns">
                <button
                  className="get-btn bg-electric-green text-deep-navy font-bold hover:bg-deep-navy hover:text-white"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
                <button
                  className="learn-btn font-bold hover:bg-deep-navy hover:text-white"
                  onClick={() => navigate("/register")}
                >
                  Get Started Today!!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Header Desktop */}
      <div
        className={
          isDesktopFixed
            ? "main-container fixed-top desktop-nav nav-bkg-color hidden-md-down to d-none d-lg-block"
            : "main-container desktop-nav nav-bkg-color hidden-md-down to d-none d-lg-block"
        }
      >
        <div className="inside-container nav-contain">
          <nav className="navbar navbar-expand-lg navbar-light">
            <img
              src={GroupMLogo}
              alt=""
              className=" flex flex-grow h-10 pl-0 pr-4"
            />
            <div className="navbar-nav nav-list flex justify-between w-full items-center">
              <div>
                <a
                  className="menu text-deep-navy hover:font-bold"
                  href="#features"
                >
                  Features
                </a>
                <a
                  className="menu text-deep-navy hover:font-bold"
                  href="#use-cases"
                >
                  Use Cases
                </a>
              </div>
              <div>
                <a
                  className="menu text-deep-navy hover:font-bold"
                  href="/login"
                >
                  Sign in
                </a>
                <a
                  className="menu group inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white bg-deep-navy hover:bg-electric-green hover:text-deep-navy focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-800 active:text-blue-100"
                  href="/register"
                >
                  <span>
                    Get started <span className="hidden lg:inline">today</span>
                  </span>
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
      {/* Header Mobile */}
      <div
        className={
          isMobileFixed
            ? "main-container fixed-top mobile-nav nav-bkg-color hidden-lg-up to d-lg-none"
            : "main-container mobile-nav nav-bkg-color hidden-lg-up to d-lg-none"
        }
      >
        <div className="inside-container nav-contain">
          <nav className="navbar navbar-expand-lg navbar-light">
            <img
              src={GroupMLogo}
              class
              alt=""
              className=" flex flex-grow h-14 pl-0 pr-4"
            />
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav nav-list flex justify-between w-full items-center">
                <div>
                  <a className="menu" href="#features">
                    Features
                  </a>
                  <a className="menu" href="#Screenshots">
                    Screenshots
                  </a>
                </div>
                <div>
                  <a className="menu" href="/login">
                    Sign in
                  </a>
                  <a
                    className="menu group inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-800 active:text-blue-100"
                    href="/register"
                  >
                    <span>
                      Get started{" "}
                      <span className="hidden lg:inline">today</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
      {/* Welcome */}
      <div className="main-container text-deep-navy">
        <div className="inside-container">
          <div className="row welcome-content">
            <div className="col-12">
              <h2>
                WelCome to{" "}
                <span className="text-deep-navy font-bold text-5xl">
                  <span className="text-electric-green text-6xl">D</span>ata
                  <span className="text-electric-green text-6xl">X</span>
                  change
                </span>
              </h2>
              <p className="mt-6">
                Unlock the true potential of your data by embracing secure and
                compliant sharing.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Why choose Us */}
      <div className="inside-container text-deep-navy pb-8">
        <div className="row chose">
          <div className="flex">
            <div className="col-lg-6">
              <video
                id="player"
                preload="auto"
                controls
                className="w-full h-full rounded-lg"
              >
                <source src={EnrichmentVideo} type="video/mp4" />
              </video>
            </div>
            <div className="col-lg-6 chose-detail">
              <h2 className="font-bold">Why Chose Us?</h2>

              <hr />
              <p className="flex items-center py-2">
                <i className="far fa-thumbs-up"></i>Our platform offers both
                security and an unparalleled user experience.
              </p>
              <p className="flex items-center py-2">
                <i className="fas fa-cogs"></i>It's a one-of-a-kind solution,
                fortified by Snowflake Data Clean Room technology, ensuring your
                data's protection today and tomorrow.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Features */}
      <div id="features" className="main-container features-sec text-deep-navy">
        <div className="inside-container features-row pb-8">
          <div className="row">
            <div className="col-lg-12">
              <div className="row detail-features">
                <div className="col-12">
                  <h2 className="font-bold">Features</h2>
                  <hr />
                  {/* <p>
                    Aenean sollicitudin, lorem quis bibendum auctor, nisi elit
                    consequat ipsum, nec sagittis sem nibh id elit. Duis sed
                    odio sit amet nibh vulputate
                  </p> */}
                </div>
              </div>
              <div className="row features-cols ">
                <div className="col-12">
                  <div className="row">
                    <div className="col-lg-6 services">
                      <div className="row">
                        <div className="col-3 icon-img">
                          <LockIcon className="text-electric-green text-6xl" />
                          {/* <i className="fas fa-star"></i> */}
                        </div>
                        <div className="col-9">
                          <h3 className="font-bold text-lg">Privacy First</h3>
                          <p>
                            Safeguarding user data is paramount to us. We ensure
                            the security of your data by employing robust
                            methods to shield sensitive Personally Identifiable
                            Information (PII),safeguarding your personal details
                            and preserving your privacy.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 services">
                      <div className="row">
                        <div className="col-3 icon-img">
                          <FileCopyIcon className="text-electric-green text-6xl" />
                        </div>
                        <div className="col-9">
                          <h3 className="font-bold text-lg">
                            Compliance-Oriented Approach
                          </h3>
                          <p>
                            We're committed to upholding regulatory compliance
                            at DataXchange. Count on us to guarantee that your
                            data collaboration meets the stringent requirements
                            of industry-specific regulations and standards,
                            including GDPR, HIPAA, and CCPA
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 services">
                      <div className="row">
                        <div className="col-3 icon-img">
                          <LocalGroceryStoreIcon className="text-electric-green text-6xl" />
                        </div>
                        <div className="col-9">
                          <h3 className="font-bold text-lg">
                            Marketplace creation
                          </h3>
                          <p className="pt-4 pb-8 m-0 leading-7 text-gray-700 border-0 border-gray-300 sm:pr-10 lg:text-lg">
                            Establish a thriving data marketplace ecosystem,
                            where data providers and consumers unite under the
                            vigilant protection of DataXchange.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 services">
                      <div className="row">
                        <div className="col-3 icon-img">
                          <i className="fas fa-heart"></i>
                        </div>
                        <div className="col-9">
                          <h3 className="font-bold text-lg">
                            User-friendly interface
                          </h3>
                          <p>
                            DataXchange welcomes users of all backgrounds; no
                            coding skills or data expertise required. Our
                            platform features an intuitive and user-friendly UI,
                            ensuring a smooth and hassle-free experience for
                            everyone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 services">
                      <div className="row">
                        <div className="col-3 icon-img">
                          <HandshakeIcon className="text-electric-green text-6xl" />
                        </div>
                        <div className="col-9">
                          <h3 className="font-bold text-lg">
                            Data Collaborations
                          </h3>
                          <p>
                            Forge a new business landscape by harmonizing
                            first-party data with provider data, fostering
                            collaborative growth for your business
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 services">
                      <div className="row">
                        <div className="col-3 icon-img">
                          <TrendingUpIcon className="text-electric-green text-6xl" />
                        </div>
                        <div className="col-9">
                          <h3 className="font-bold text-lg">
                            Scalable and Flexible
                          </h3>
                          <p className="pt-4 pb-8 m-0 leading-7 text-gray-700 border-0 border-gray-300 sm:pr-10 lg:text-lg">
                            DataXchange is your versatile solution. Regardless
                            of your dataset's size, it is designed to scale
                            effortlessly to meet your needs. Its seamless
                            integration with Snowflake's powerful data
                            warehousing features ensures both top-notch
                            performance and steadfast reliability making it a
                            future-proof solution, ready to meet evolving
                            demands.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-4 phone-col">
              <img
                src="image/phone.png"
                className="img-fluid text-center"
                alt=""
              />
            </div> */}
          </div>
        </div>
      </div>
      {/* Download Section */}
      {/* <div className="main-container downl-sec">
        <div className="inside-container">
          <div className="row">
            <div className="col-12 detail-down">
              <h2>Download Apps iMobil Now</h2>
              <hr />
              <p>
                Aenean sollicitudin, lorem quis bibendum auctor, nisi elit
                consequat ipsum, nec sagittis sem nibh id elit.
              </p>
            </div>
          </div>
          <div className="row mobiles-down justify-center">
            <div className="col-lg-4">
              <a href="/" className="apple-store">
                <i className="fas fa-mobile-alt"></i>
                <p>
                  <span style={{ fontSize: "20px" }}>Available on the</span>{" "}
                  <br />
                  <span style={{ fontSize: "40px" }}>App Store</span>
                </p>
              </a>
            </div>
            <div className="col-lg-4">
              <a href="/" className="google-store">
                <object
                  data="image/play-store.svg"
                  type="image/svg+xml"
                  id="play-store"
                  className="play-store"
                  name="play-store"
                  aria-label="play-store"
                ></object>
                <p>
                  <b>
                    <span style={{ fontSize: "24px" }}>
                      Get it on <br />
                      GOOGLE PLAY
                    </span>
                  </b>
                </p>
              </a>
            </div>
          </div>
        </div>
      </div> */}

      {/* Use Cases */}
      <div id="use-cases" className="main-container use-cases text-deep-navy py-20">
        <div className="inside-container ">
          <div className="row screen-detail">
            <div className="col-12">
              <h2 className="font-bold">Use cases</h2>
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-12 owl-seci text-deep-navy">
              <Slider {...settings}>
                <div className="bg-[#dbeafe] text-deep-navy box-border flex flex-col items-center content-center px-8 mx-auto mt-10 leading-6  border-0 border-gray-300 border-solid md:flex-row max-w-7xl lg:px-16">
                  {/* Image */}
                  <div className="w-full h-96  relative overflow-hidden rounded-md shadow-xl sm:rounded-xl md:w-1/2 ">
                    <img src={match_rate} className="h-96 w-full" alt="" />
                  </div>
                  {/* Content */}
                  <div className="box-border order-first w-full  border-solid md:w-1/2 md:pl-10 md:order-none">
                    <h2 className="m-0 text-xl font-semibold leading-tight border-0 border-gray-300 lg:text-3xl md:text-2xl">
                      Match Rate
                    </h2>
                    <p className="pt-4 pb-8 m-0 leading-7 text-gray-700 border-0 border-gray-300 sm:pr-12 xl:pr-32 lg:text-lg">
                      DataHaven provides a secure environment for collaboration,
                      enabling multiple stakeholders to collaborate on sensitive
                      data projects without the risk of unauthorized access or
                      data breaches.
                    </p>
                  </div>
                  {/* End  Content */}
                </div>
                <div className="bg-[#dbeafe] text-deep-navy box-border flex flex-col items-center content-center px-8 mx-auto mt-10 leading-6  border-0 border-gray-300 border-solid md:flex-row max-w-7xl lg:px-16">
                  {/* Image */}
                  <div className="w-full h-96  relative overflow-hidden rounded-md shadow-xl sm:rounded-xl md:w-1/2 ">
                    <img src={enrichment} className="h-96 w-full" alt="" />
                  </div>
                  {/* Content */}
                  <div className="box-border order-first w-full  border-solid md:w-1/2 md:pl-10 md:order-none">
                    <h2 className="m-0 text-xl font-semibold leading-tight border-0 border-gray-300 lg:text-3xl md:text-2xl">
                      Enrichment
                    </h2>
                    <p className="pt-4 pb-8 m-0 leading-7 text-gray-700 border-0 border-gray-300 sm:pr-12 xl:pr-32 lg:text-lg">
                      DataHaven provides a secure environment for collaboration,
                      enabling multiple stakeholders to collaborate on sensitive
                      data projects without the risk of unauthorized access or
                      data breaches.
                    </p>
                  </div>
                  {/* End  Content */}
                </div>
                <div className="bg-[#dbeafe] text-deep-navy box-border flex flex-col items-center content-center px-8 mx-auto mt-10 leading-6  border-0 border-gray-300 border-solid md:flex-row max-w-7xl lg:px-16">
                  {/* Image */}
                  <div className="w-full h-96  relative overflow-hidden rounded-md shadow-xl sm:rounded-xl md:w-1/2 ">
                    <img
                      src={search_catalogue}
                      className="h-96 w-full"
                      alt=""
                    />
                  </div>
                  {/* Content */}
                  <div className="box-border order-first w-full  border-solid md:w-1/2 md:pl-10 md:order-none">
                    <h2 className="m-0 text-xl font-semibold leading-tight border-0 border-gray-300 lg:text-3xl md:text-2xl">
                      Search Catalogue
                    </h2>
                    <p className="pt-4 pb-8 m-0 leading-7 text-gray-700 border-0 border-gray-300 sm:pr-12 xl:pr-32 lg:text-lg">
                      DataHaven provides a secure environment for collaboration,
                      enabling multiple stakeholders to collaborate on sensitive
                      data projects without the risk of unauthorized access or
                      data breaches.
                    </p>
                    <ul className="p-0 m-0 leading-6 border-0 border-gray-300">
                      <li className="box-border relative py-1 pl-0 text-left text-gray-500 border-solid">
                        <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-amaranth-300 rounded-full">
                          <span className="text-sm font-bold">✓</span>
                        </span>{" "}
                        Enhanced data privacy
                      </li>
                      <li className="box-border relative py-1 pl-0 text-left text-gray-500 border-solid">
                        <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-amaranth-300 rounded-full">
                          <span className="text-sm font-bold">✓</span>
                        </span>{" "}
                        Compliance with Regulations
                      </li>
                      <li className="box-border relative py-1 pl-0 text-left text-gray-500 border-solid">
                        <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-amaranth-300 rounded-full">
                          <span className="text-sm font-bold">✓</span>
                        </span>{" "}
                        Controlled Access and Authorization
                      </li>
                    </ul>
                  </div>
                  {/* End  Content */}
                </div>
                <div className="bg-[#dbeafe] text-deep-navy box-border flex flex-col items-center content-center px-8 mx-auto mt-10 leading-6  border-0 border-gray-300 border-solid md:flex-row max-w-7xl lg:px-16">
                  {/* Image */}
                  <div className="w-full h-96  relative overflow-hidden rounded-md shadow-xl sm:rounded-xl md:w-1/2 ">
                    <img src={data_catalogue} className="h-96 w-full" alt="" />
                  </div>
                  {/* Content */}
                  <div className="box-border order-first w-full  border-solid md:w-1/2 md:pl-10 md:order-none">
                    <h2 className="m-0 text-xl font-semibold leading-tight border-0 border-gray-300 lg:text-3xl md:text-2xl">
                      Upload Catalogue
                    </h2>
                    <p className="pt-4 pb-8 m-0 leading-7 text-gray-700 border-0 border-gray-300 sm:pr-12 xl:pr-32 lg:text-lg">
                      DataHaven provides a secure environment for collaboration,
                      enabling multiple stakeholders to collaborate on sensitive
                      data projects without the risk of unauthorized access or
                      data breaches.
                    </p>
                    <ul className="p-0 m-0 leading-6 border-0 border-gray-300">
                      <li className="box-border relative py-1 pl-0 text-left text-gray-500 border-solid">
                        <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-amaranth-300 rounded-full">
                          <span className="text-sm font-bold">✓</span>
                        </span>{" "}
                        Enhanced data privacy
                      </li>
                      <li className="box-border relative py-1 pl-0 text-left text-gray-500 border-solid">
                        <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-amaranth-300 rounded-full">
                          <span className="text-sm font-bold">✓</span>
                        </span>{" "}
                        Compliance with Regulations
                      </li>
                      <li className="box-border relative py-1 pl-0 text-left text-gray-500 border-solid">
                        <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-amaranth-300 rounded-full">
                          <span className="text-sm font-bold">✓</span>
                        </span>{" "}
                        Controlled Access and Authorization
                      </li>
                    </ul>
                  </div>
                  {/* End  Content */}
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </div>
      {/* Video */}
      {/* <div className="main-container bg-[#ecf0f1] py-20">
        <div className="row">
          <div className="col-12 video-row flex pt-12">
            <div className="col-lg-6">
              <video
                id="player"
                preload="auto"
                controls
                className="w-full h-full rounded-lg"
              >
                <source src={EnrichmentVideo} type="video/mp4" />
              </video>
            </div>
            <div className="row detail-video text-deep-navy col-lg-6">
              <div className="col-12 text-deep-navy ">
                <h2 className="font-bold">Watch How it Works</h2>
                <hr />
                <p className="text-left w-full">
                  Aenean sollicitudin, lorem quis bibendum auctor, nisi elit
                  consequat ipsum, nec sagittis sem nibh id elit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* Our Partners */}
      <div className="main-container team-section text-deep-navy">
        <div className="inside-container">
          <div className="row">
            <div className="col-12 detail-team">
              <h2 className="font-bold">Our Partners</h2>
              <hr />
            </div>
          </div>
          <div className="row team-members">
            <div className="col-lg-2">
              <div className="team-hover">
                <img
                  src={process.env.PUBLIC_URL + `/Logos/Provider_logo.svg`}
                  className="img-fluid"
                  alt=""
                />
              </div>
              <h3>Provider</h3>
              <p className="team-role">Provider</p>
            </div>
            <div className="col-lg-2">
              <div className="team-hover">
                <img
                  src={process.env.PUBLIC_URL + `/Logos/Provider_logo.svg`}
                  className="img-fluid"
                  alt=""
                />
              </div>
              <h3>Provider2</h3>
              <p className="team-role">Provider</p>
            </div>
            <div className="col-lg-2">
              <div className="team-hover">
                <img
                  src={process.env.PUBLIC_URL + `/Logos/Provider_logo.svg`}
                  className="img-fluid"
                  alt=""
                />
              </div>
              <h3>Provider</h3>
              <p className="team-role">Provider</p>
            </div>
            <div className="col-lg-2">
              <div className="team-hover">
                <img
                  src={process.env.PUBLIC_URL + `/Logos/Provider_logo.svg`}
                  className="img-fluid"
                  alt=""
                />
              </div>
              <h3>Provider2</h3>
              <p className="team-role">Provider</p>
            </div>
            <div className="col-lg-2">
              <div className="team-hover">
                <img
                  src={process.env.PUBLIC_URL + `/Logos/Provider_logo.svg`}
                  className="img-fluid"
                  alt=""
                />
              </div>
              <h3>Provider</h3>
              <p className="team-role">Provider</p>
            </div>
            <div className="col-lg-2">
              <div className="team-hover">
                <img
                  src={process.env.PUBLIC_URL + `/Logos/Provider_logo.svg`}
                  className="img-fluid"
                  alt=""
                />
              </div>
              <h3>Provider2</h3>
              <p className="team-role">Provider</p>
            </div>
          </div>
        </div>
      </div>

      {/* Commented for now */}
      {/* <div className="main-container review-sec">
        <div className="inside-container">
          <div className="row">
            <div className="col-lg-8 detail-reviwe">
              <h2>App Reviews</h2>
              <hr />
              <p className="desc">
                Aenean sollicitudin, lorem quis bibendum auctor, nisi elit
                consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio
                sit amet nibh vulputate
              </p>
              <div className="row">
                <div className="col-12">
                  <div className="owl-carousel owl-theme owl-testimonial">
                    <div className="item item-over">
                      <div className="testimonial">
                        <blockquote>
                          Proin gravida nibh vel velit auctor aliquet. Aenean
                          sollicitudin, lorem quis bibendum auctor, nisi elit
                          consequat ipsum, nec sagittis sem nibh id elit. Duis
                          sed odio sit amet nibh vulputate cursus a sit amet
                          mauris. Morbi accumsan ipsum velit.
                        </blockquote>
                        <div className="testimonial-arrow">
                          <img src="image/testimonial-arrow.png" alt="" />
                        </div>
                        <div className="person">
                          <img src="image/testimonial-picture.png" alt="" />
                          <div className="name">
                            <h3>Alex Sander</h3>
                            <p>
                              CEO - <a href="/">www.webdomus.net</a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="item item-over">
                      <div className="testimonial">
                        <blockquote>
                          Proin gravida nibh vel velit auctor aliquet. Aenean
                          sollicitudin, lorem quis bibendum auctor, nisi elit
                          consequat ipsum, nec sagittis sem nibh id elit. Duis
                          sed odio sit amet nibh vulputate cursus a sit amet
                          mauris. Morbi accumsan ipsum velit.
                        </blockquote>
                        <div className="testimonial-arrow">
                          <img src="image/testimonial-arrow.png" alt="" />
                        </div>
                        <div className="person">
                          <img src="image/testimonial-picture.png" alt="" />
                          <div className="name">
                            <h3>Ben Ross</h3>
                            <p>
                              Designer - <a href="/">www.webdomus.net</a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="item item-over">
                      <div className="testimonial">
                        <blockquote>
                          Proin gravida nibh vel velit auctor aliquet. Aenean
                          sollicitudin, lorem quis bibendum auctor, nisi elit
                          consequat ipsum, nec sagittis sem nibh id elit. Duis
                          sed odio sit amet nibh vulputate cursus a sit amet
                          mauris. Morbi accumsan ipsum velit.
                        </blockquote>
                        <div className="testimonial-arrow">
                          <img src="image/testimonial-arrow.png" alt="" />
                        </div>
                        <div className="person">
                          <img src="image/testimonial-picture.png" alt="" />
                          <div className="name">
                            <h3>Alan Tarmon</h3>
                            <p>
                              Developer - <a href="/">www.webdomus.net</a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 phone-reviwe">
              <img src="image/phone-reviwe.png" className="img-fluid" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="main-container partners-sec">
        <div className="inside-container">
          <div className="row">
            <div className="col-12 logo-partner flex">
              <img src="image/fysio.png" alt="" />
              <img src="image/quiq.png" alt="" />
              <img src="image/volk.png" alt="" />
              <img src="image/deao.png" alt="" />
              <img src="image/flux.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="main-container plan-sec">
        <div className="inside-container">
          <div className="row">
            <div className="col-12 detail-plan">
              <h2>Choose Your Plan</h2>
              <hr />
              <p>
                Aenean sollicitudin, lorem quis bibendum auctor, nisi elit
                consequat ipsum, nec sagittis sem nibh id elit.
              </p>
            </div>
          </div>
          <div className="row offert-plan">
            <div className="col-lg-4 plans-col">
              <div className="row">
                <div className="col-12 standart-title">
                  <h2>Standart</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-12 standart-img">
                  <img src="image/standart-price.png" alt="" />
                </div>
              </div>
              <div className="row">
                <div className="col-12 standart-desc">
                  <p>
                    <i className="fas fa-power-off"></i>First Description Goes
                    Here
                  </p>
                  <p>
                    <i className="fas fa-inbox"></i>Second Description Goes Here
                  </p>
                  <p>
                    <img src="image/book-blu.svg" alt="" />
                    Third Description Goes Here
                  </p>
                  <p>
                    <i className="fas fa-cog"></i>Fourth Description Goes Here
                  </p>
                  <div className="row">
                    <div className="col-12 button-plan">
                      <button type="button">Sign Up Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 plans-col">
              <div className="row">
                <div className="col-12 profs-title ">
                  <h2>Professional</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-12 profs-img">
                  <img src="image/prof-price.png" alt="" />
                </div>
              </div>
              <div className="row">
                <div className="col-12 profs-desc">
                  <p>
                    <i className="fas fa-power-off"></i>First Description Goes
                    Here
                  </p>
                  <p>
                    <i className="fas fa-inbox"></i>Second Description Goes Here
                  </p>
                  <p>
                    <img src="image/book-red.svg" alt="" />
                    Third Description Goes Here
                  </p>
                  <p>
                    <i className="fas fa-cog"></i>Fourth Description Goes Here
                  </p>
                  <div className="row">
                    <div className="col-12 button-plan">
                      <button type="button">Sign Up Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 plans-col">
              <div className="row">
                <div className="col-12 ultimate-title">
                  <h2>Ultimate</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-12 ultimate-img">
                  <img src="image/ultimate-price.png" alt="" />
                </div>
              </div>
              <div className="row">
                <div className="col-12 ultimate-desc">
                  <p>
                    <i className="fas fa-power-off"></i>First Description Goes
                    Here
                  </p>
                  <p>
                    <i className="fas fa-inbox"></i>Second Description Goes Here
                  </p>
                  <p>
                    <img src="image/book-blu.svg" alt="" />
                    Third Description Goes Here
                  </p>
                  <p>
                    <i className="fas fa-cog"></i>Fourth Description Goes Here
                  </p>
                  <div className="row">
                    <div className="col-12 button-plan">
                      <button type="button">Sign Up Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-container">
        <div className="inside-container news-row">
          <div className="row">
            <div className="col-lg-5 detail-newsletter">
              <h2>Newsletter Sign Up</h2>
              <hr />
            </div>
            <div className="col-lg-7 ">
              <div className="input-group mb-3 input-mobile">
                <input
                  type="text"
                  className="form-control news-form"
                  placeholder="Enter Your Email Address Here.."
                  aria-label="Email"
                />
                <div className="input-group-append">
                  <button className="news-btn" type="button">
                    SUBSCRIBE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       <div className="main-container contact-bckg">
        <div className="inside-container">
          <div className="row">
            <div className="col-12 contact-title">
              <h2>Get In Touch</h2>
              <hr />
              <p>
                Aenean sollicitudin, lorem quis bibendum auctor, nisi elit
                consequat
                <br /> ipsum, nec sagittis sem nibh id elit. Duis sed odio sit
                amet nibh vulputate
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 contact-detail">
              <h2>Contact Details</h2>
              <p>
                Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt
                auctor a ornare odio. Sed non mauris vitae erat consequat auctor
                eu in elit.
              </p>
              <p className="contct">
                <i className="fas fa-map-marker-alt"></i> Via Colle Dell’Orso, 21
                86100 Campobasso – Italy
              </p>
              <p className="contct">
                <img src="image/phone-icon.svg" alt="" />{" "}
                <a href="/">+61 1234 56789</a>, <a href="/">+61 1234 56789</a>
              </p>
              <p className="contct">
                <img src="image/fax.svg" alt="" />{" "}
                <a href="/">+61 1234 56789</a>, <a href="/">+61 1234 56789</a>
              </p>
              <p className="contct">
                <i className="fas fa-envelope"></i>{" "}
                <a href="/">contact@appsimobil.com</a>
              </p>
            </div>
            <div className="col-lg-8 form-contact">
              <h2>Contact Us</h2>
              <form>
                <div className="form-group-edit">
                  <input type="text" className="form-control" placeholder="Name" />
                </div>
                <div className="form-group-edit">
                  <input
                    type="email"
                    className="form-control"
                    id="staticEmail"
                    placeholder="Email*"
                    required
                  />
                </div>
                <div className="form-group-edit">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Subject"
                  />
                </div>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="4"
                    placeholder="Message"
                  ></textarea>
                </div>
                <button type="submit" className="btn form-btn">
                  Send us
                </button>
              </form>
            </div>
          </div>
        </div>
      </div> */}

      {/* Footer Section */}
      <div
        className="footer main-container"
        style={{ backgroundImage: `url('image/landing/landing_page1.jpg')` }}
      >
        <div className="inside-container footer-content">
          <div className="social-icons">
            <a href="/">
              <span>
                <i className="fab fa-twitter"></i>
              </span>
            </a>{" "}
            <a href="/">
              <span>
                <i className="fab fa-facebook-f"></i>
              </span>
            </a>{" "}
            <a href="/">
              <span>
                <i className="fab fa-github-alt"></i>
              </span>
            </a>{" "}
            <a href="/">
              <span>
                <i className="fab fa-pinterest-p"></i>
              </span>
            </a>{" "}
            <a href="/">
              <span>
                <i className="fab fa-vimeo-v"></i>
              </span>
            </a>{" "}
            <a href="/">
              <span>
                <i className="fab fa-dribbble"></i>
              </span>
            </a>{" "}
            <a href="/">
              <span>
                <i className="fab fa-linkedin-in"></i>
              </span>
            </a>{" "}
            <a href="/">
              <span>
                <i className="fab fa-google-plus-g"></i>
              </span>
            </a>
          </div>
          <div className="copyright">
            <a href="https://hoonartek.com/">
              <strong>© 2023 Hoonartek. All rights reserved.</strong>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
