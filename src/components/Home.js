import React, { useEffect } from "react";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as actions from "../redux/actions/index";
import dash1 from "../Assets/Designer _Two Color.svg";

// import { latestPartners } from "../utils/data";

const baseURL = process.env.REACT_APP_BASE_URL;
const redirectionUser = process.env.REACT_APP_REDIRECTION_URL;

const Home = () => {
  const state = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = state && state.user;
  const latestPartners = state && state.Home && state.Home.latestPartners;
  const countProviderConsumer =
    state && state.Home && state.Home.countProviderConsumer;

  const startExploring = () => {
    if (user?.role?.includes("Consumer")) {
      navigate("/search-catalog");
      return;
    } else if (user?.role?.includes("Provider")) {
      navigate("/upload-catalog");
      return;
    } else if (user?.role?.includes("Consumer_Admin")) {
      navigate("/admin-console");
    }
  };

  useEffect(() => {
    axios
      .get(`${baseURL}/${redirectionUser}`, {
        params: {
          query:
            "SELECT COUNT(*) AS Count, 'Consumers' AS Type FROM DCR_SAMP_APP.DATAEX.CONSUMER_ATTRIBUTES_VW WHERE CONSUMER ='TRUE' AND ADMIN='TRUE' UNION ALL SELECT COUNT(*) AS Count, 'Providers' AS Type FROM DCR_SAMP_APP.DATAEX.CONSUMER_ATTRIBUTES_VW WHERE PROVIDER ='TRUE' AND ADMIN='TRUE';",
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          let res = response?.data?.data;
          res = res?.map((item) => {
            return { [item.TYPE]: item.COUNT };
          });
          dispatch(
            actions.Home({
              countProviderConsumer: res,
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch, user.name]);

  useEffect(() => {
    axios
      .get(`${baseURL}/${redirectionUser}`, {
        params: {
          query:
            "SELECT partner_name, SUM(request_processed) AS total_requests, ARRAY_TO_STRING(ARRAY_AGG(template_name), ', ') AS all_templates, role FROM (SELECT * FROM DATAEXCHANGEDB.DATACATALOG.HOME_PAGE_VW WHERE role IN ('CONSUMER', 'CONSUMER_ADMIN')) AS filtered_data GROUP BY partner_name, role;",
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          let result = response?.data?.data;
          dispatch(
            actions.Home({
              latestPartners: result,
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch, user.name]);

  return (
    <>
      <div className="flex flex-row gap-2 w-full px-5">
        <div className="flex flex-row w-full ">
          <div className="w-2/3 relative bg-electric-green mt-4 rounded-xl py-2 px-4 h-60 overflow-hidden shadow-lg">
            <img
              src={dash1}
              className="absolute z-0   w-72  -bottom-8 -right-12"
              alt=""
            />
            <div className="absolute z-10">
              <h2 className="text-deep-navy text-3xl font-semibold mt-3">
                Welcome {user?.name}!
              </h2>
              <p className=" text-coal w-2/3 mt-3 text-sm ">
                Build your DCR in Snowflake for use cases like a{" "}
                <strong className=" italic">marketing campaign</strong>,
                <strong className=" italic"> optimizing ad placement</strong>,
                identifying common transaction patterns to improve fraud
                detection, etc.
              </p>
              <button
                onClick={startExploring}
                className="mt-7 pr-4 flex items-center justify-center rounded-md bg-deep-navy px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-deep-navy/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"
              >
                Start exploring
              </button>
            </div>
          </div>
          {countProviderConsumer?.map((item) => {
            return (
              <div className="w-1/3 relative p-5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl shadow-lg overflow-hidden mx-2 mt-4">
                <div className="relative z-10 mb-4 text-white text-8xl leading-none font-semibold">
                  {Object.values(item)}
                </div>
                <div className="relative z-10 text-blue-200 leading-none text-3xl font-semibold">
                  {Object.keys(item)}
                </div>
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="absolute right-0 bottom-0 h-32 w-32 -mr-8 -mb-8 text-blue-700 opacity-50"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-row gap-4 px-5 justify-around h-full w-full">
        <div className="flex flex-col text-coal w-full ">
          {/* Latest partners */}
          <div className="flex flex-row w-full mt-6 mb-2 px-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                fillRule="evenodd"
                d="M3 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5H15v-18a.75.75 0 000-1.5H3zM6.75 19.5v-2.25a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75zM6 6.75A.75.75 0 016.75 6h.75a.75.75 0 010 1.5h-.75A.75.75 0 016 6.75zM6.75 9a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM6 12.75a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM10.5 6a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm-.75 3.75A.75.75 0 0110.5 9h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM10.5 12a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM16.5 6.75v15h5.25a.75.75 0 000-1.5H21v-12a.75.75 0 000-1.5h-4.5zm1.5 4.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zm.75 2.25a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75h-.008zM18 17.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z"
                clipRule="evenodd"
              />
            </svg>

            <h1 className="pl-2 text-deep-navy">Latest partners</h1>
          </div>
          {latestPartners?.length > 0 ? (
            <div className="flex flex-wrap flex-row items-stretch w-full gap-y-3">
              {latestPartners?.map((item) => {
                return (
                  <div className="w-1/3 px-1">
                    <div className="relative flex flex-col items-start p-4 border border-neutral-100 bg-white shadow-lg rounded-lg bg-opacity-40 ">
                      <h4 className=" text-md font-medium text-deep-navy">
                        {item.PARTNER_NAME}
                      </h4>
                      <div className="flex flex-row flex-wrap gap-2 mt-2">
                        {item?.ALL_TEMPLATES?.split(",")?.map(
                          (template, index) => {
                            if (index < 2) {
                              return (
                                <span className="flex items-center h-6 px-3 text-[10px] font-semibold text-deep-navy/80 bg-electric-green/50 rounded-full">
                                  {template}
                                </span>
                              );
                            } else if (index === 2) {
                              return (
                                <span className="flex items-center h-6 px-3 text-[10px] font-semibold text-deep-navy/80 bg-electric-green/50 rounded-full">
                                  {`+${
                                    item?.ALL_TEMPLATES?.split(",")?.length - 2
                                  } more`}
                                </span>
                              );
                            } else {
                              return null;
                            }
                          }
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-4 w-full text-xs gap-2 font-medium text-gray-400 h-8">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 text-gray-300 fill-current"
                          >
                            <path
                              fillRule="evenodd"
                              d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3.375 15h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h7.5a.375.375 0 00.375-.375v-1.5A.375.375 0 0010.875 9h-7.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="ml-1 leading-none">
                            {item.TOTAL_REQUESTS} requests processed
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 text-gray-300 fill-current"
                          >
                            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                          </svg>
                          <span className="ml-1 leading-none">{item.ROLE}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* <div className="w-1/3 px-1">
              <div className="relative flex flex-col items-start p-4 border border-neutral-100 bg-white shadow-lg rounded-lg bg-opacity-40 ">
                <h4 className=" text-md font-medium text-deep-navy">
                  Acme Pvt Ltd.
                </h4>
                <div className="flex flex-row flex-wrap gap-1 mt-2">
                  <span className="flex items-center h-6 px-3 text-xs font-semibold text-deep-navy/80 bg-electric-green/50 rounded-full">
                    Enrichment
                  </span>
                </div>
                <div className="flex items-center w-full mt-3 text-xs gap-2 font-medium text-gray-400">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-gray-300 fill-current"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3.375 15h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h7.5a.375.375 0 00.375-.375v-1.5A.375.375 0 0010.875 9h-7.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-1 leading-none">
                      1,34,000 records matched
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-gray-300 fill-current"
                    >
                      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>
                    <span className="ml-1 leading-none">Consumer</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/3 px-1">
              <div className="relative flex flex-col items-start p-4 border border-neutral-100 bg-white shadow-lg rounded-lg bg-opacity-40 ">
                <h4 className=" text-md font-medium text-deep-navy">
                  Acme Solutions
                </h4>
                <div className="flex flex-row flex-wrap gap-1 mt-2">
                  <span className="flex items-center h-6 px-3 text-xs font-semibold text-deep-navy/80 bg-electric-green/50 rounded-full">
                    Match rate
                  </span>
                </div>
                <div className="flex items-center w-full mt-3 text-xs gap-2 font-medium text-gray-400">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-gray-300 fill-current"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3.375 15h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h7.5a.375.375 0 00.375-.375v-1.5A.375.375 0 0010.875 9h-7.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-1 leading-none">
                      1,23,000 records matched
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-gray-300 fill-current"
                    >
                      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>
                    <span className="ml-1 leading-none">Provider</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/3 px-1">
              <div className="relative flex flex-col items-start p-4 border border-neutral-100 bg-white shadow-lg rounded-lg bg-opacity-40 ">
                <h4 className=" text-md font-medium text-deep-navy">
                  Acme Solutions
                </h4>
                <div className="flex flex-row flex-wrap gap-1 mt-2">
                  <span className="flex items-center h-6 px-3 text-xs font-semibold text-deep-navy/80 bg-electric-green/50 rounded-full">
                    Match rate
                  </span>
                </div>
                <div className="flex items-center w-full mt-3 text-xs gap-2 font-medium text-gray-400">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-gray-300 fill-current"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3.375 15h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h7.5a.375.375 0 00.375-.375v-1.5A.375.375 0 0010.875 9h-7.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-1 leading-none">
                      1,23,000 records matched
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-gray-300 fill-current"
                    >
                      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>
                    <span className="ml-1 leading-none">Provider</span>
                  </div>
                </div>
              </div>
            </div> */}
            </div>
          ) : (
            <div>
              <span className="text-deep-navy font-bold text-sm w-full">
                We are fetching the Latest Partners data. Please wait!!
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col w-2/5">
          {/* <h1 className="mt-6 mb-2 text-2xl font-bold text-deep-navy pb-4 border-b border-gray-200">How to videos</h1> */}
          <div className="flex flex-row w-full mt-6 mb-2 px-1 justify-between">
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-gray-400"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zm1.5 0v1.5c0 .207.168.375.375.375h1.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-1.5A.375.375 0 003 5.625zm16.125-.375a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h1.5A.375.375 0 0021 7.125v-1.5a.375.375 0 00-.375-.375h-1.5zM21 9.375A.375.375 0 0020.625 9h-1.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h1.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-1.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h1.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-1.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h1.5a.375.375 0 00.375-.375v-1.5zM4.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-1.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h1.5zM3.375 15h1.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-1.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h1.5a.375.375 0 00.375-.375v-1.5A.375.375 0 004.875 9h-1.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375zm4.125 0a.75.75 0 000 1.5h9a.75.75 0 000-1.5h-9z"
                  clipRule="evenodd"
                />
              </svg>

              <h1 className="pl-2 text-deep-navy">How to videos</h1>
            </div>
            <h3
              className="pl-2 text-downriver-600 dark:text-white cursor-pointer"
              onClick={() => navigate("/how-to-videos")}
            >
              View All
            </h3>
          </div>
          <div className="flex justify-center">
            <div className="rounded-lg shadow-lg bg-white max-w-sm w-full">
              <video
                width="320"
                height="100"
                controls
                className="w-full h-full rounded-lg"
              >
                <source src="https://youtu.be/QTA8UfoR4WU" type="video/mp4" />
                <source src="movie.ogg" type="video/ogg" />
                Your browser does not support the video tag.
              </video>

              <div className="p-6 pb-8">
                {/* <h5 className="text-deep-navy text-base font-medium mb-2">How to create a clean room</h5> */}
                {/*   <p className="text-deep-navy text-base mb-4">
                                Some quick examples to build a data clean room using Snowflake.
                            </p>
                            <button type="button" className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Button</button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
