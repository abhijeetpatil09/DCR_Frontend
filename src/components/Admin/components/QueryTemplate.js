import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

import CommonModal from "../../CommonComponent/Modal";
import Query_Template_Image from "../../../Assets/admin_console_query_template.svg";

const baseURL = process.env.REACT_APP_BASE_URL;

const QueryTemplate = ({ user, handleToggleDrawer }) => {
  const [queryData, setQueryData] = useState({
    consumer: "",
    template: "",
    status: "",
  });

  const [consumers, setConsumers] = useState([]);
  const [templateNames, setTemplateNames] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    axios
      .get(`${baseURL}/${user?.name}`, {
        params: {
          query:
            "select distinct CONSUMER_NAME from DCR_SAMP_PROVIDER_DB.TEMPLATES.DCR_TEMPLATES;",
        },
      })
      .then((response) => {
        if (response?.data) {
          setConsumers(response?.data?.data);
        } else {
          setConsumers([]);
        }
      })
      .catch((error) => console.log(error));
  }, [user?.name]);

  useEffect(() => {
    if (queryData.consumer !== "") {
      axios
        .get(`${baseURL}/${user?.name}`, {
          params: {
            query: `select distinct * from DCR_SAMP_PROVIDER_DB.TEMPLATES.DCR_TEMPLATES where CONSUMER_NAME = '${queryData.consumer}';`,
          },
        })
        .then((response) => {
          if (response?.data) {
            setTemplateNames(response?.data?.data);
          } else {
            setTemplateNames([]);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [user?.name, queryData.consumer]);

  useEffect(() => {
    if (queryData.consumer !== "" && queryData.template !== "") {
      axios
        .get(`${baseURL}/${user?.name}`, {
          params: {
            query: `select TEMPLATE_STATUS from DCR_SAMP_PROVIDER_DB.TEMPLATES.DCR_TEMPLATES where CONSUMER_NAME = '${queryData.consumer}' AND TEMPLATE_NAME = '${queryData.template}';`,
          },
        })
        .then((response) => {
          if (response?.data?.data?.length > 0) {
            setQueryData({
              ...queryData,
              status: response?.data?.data[0]?.TEMPLATE_STATUS,
            });
          } else {
            setQueryData({ ...queryData, status: "" });
          }
        })
        .catch((error) => console.log(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryData.consumer, queryData.template]);

  const handleClickYes = () => {
    setOpenModal(!openModal);
    setLoading(true);
    axios
      .get(`${baseURL}/${user?.name}`, {
        params: {
          query: `insert into DCR_SAMP_PROVIDER_DB.TEMPLATES.JSON_TABLE select PARSE_JSON('
                  {
                     "Consumer_Name": "${queryData.consumer}",
                     "Template_Name": "${queryData.template}",
                     "Template_Status" : ${
                       queryData.status === true ? "false" : "true"
                     }
                  }
                  ');`,
        },
      })
      .then((response) => {
        if (response) {
          callByPass();
        }
      })
      .catch((error) => {
        toast.error("Fetching error...");
        console.log(error);
      });
  };

  const handleSubmit = () => {
    if (queryData.consumer === "" || queryData.template === "") {
      return;
    } else {
      setMessage(
        `Are you sure, you want to ${
          queryData.status === true ? "Disable" : "Enable"
        } this template?`
      );
      setOpenModal(!openModal);
    }
  };

  const callByPass = () => {
    setTimeout(() => {
      axios
        .get(`${baseURL}/${user?.name}`, {
          params: {
            query: `CALL DCR_SAMP_PROVIDER_DB.TEMPLATES.UPDATETEMPLATESTATUS();`,
          },
        })
        .then((response) => {
          setLoading(false);
          setQueryData({ consumer: "", template: "", status: "" });
          handleToggleDrawer("right", false);
          toast.success(response?.data?.data?.[0]?.UPDATETEMPLATESTATUS);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }, 2000);
  };

  return (
    <div className="w-96">
      <div className="pt-8 bg-opacity-75 backdrop-filter backdrop-blur-lg">
        <div className="flex flex-row items-start text-electric-green">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mt-1 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
            />
          </svg>
          <div className="flex flex-col w-full">
            <div className="flex justify-between">
              <h3 className="text-lg font-bold text-electric-green uppercase">
                Configure Query Template
              </h3>
              <button onClick={handleToggleDrawer("right", false, "")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <span className="text-sm mb-4 font-light text-electric-green">
              {" "}
              Enable/Disable Query Template for particular consumer.
            </span>
          </div>
        </div>
      </div>
      <img
        className="absolute w-96 h-64 bottom-5 opacity-90 z-10 right-0 text-amarant-400"
        src={Query_Template_Image}
        alt=""
      />
      <div className="pl-8">
        <div className="my-4 flex flex-col ">
          <label className="block text-sm font-medium leading-6 text-electric-green ">
            Consumer Name
          </label>
          <select
            value={queryData.consumer}
            onChange={(e) =>
              setQueryData({ ...queryData, consumer: e.target.value })
            }
            required
            className="bg-deep-navy block w-full rounded-md border-0 py-1.5 text-electric-green  shadow-sm ring-1 ring-inset ring-electric-green  placeholder:text-electric-green  focus:ring-2 focus:ring-inset focus:ring-electric-green  sm:text-sm sm:leading-6"
          >
            <option value="">Please select</option>
            {consumers?.map((consumer, index) => (
              <option key={index} value={consumer?.CONSUMER_NAME}>
                {consumer?.CONSUMER_NAME}
              </option>
            ))}
          </select>
        </div>

        <div className="my-4 flex flex-col ">
          <label className="block text-sm font-medium leading-6 text-electric-green ">
            Query Name
          </label>
          <select
            value={queryData.template}
            onChange={(e) => {
              setQueryData({ ...queryData, template: e.target.value });
              console.log("e.target.value", e.target.value);
            }}
            required
            className="bg-deep-navy block w-full rounded-md border-0 py-1.5 text-electric-green shadow-sm ring-1 ring-inset ring-electric-green  placeholder:text-electric-green  focus:ring-2 focus:ring-inset focus:ring-electric-green  sm:text-sm sm:leading-6"
          >
            <option value="">Please select</option>
            {templateNames?.map((template, index) => (
              <option key={index} value={template?.TEMPLATE_NAME}>
                {template?.TEMPLATE_NAME}
              </option>
            ))}
          </select>
        </div>

        {queryData.status !== "" ? (
          <div className="flex justify-end">
            {loading ? (
              <div className="flex w-full justify-center rounded-md bg-electric-green px-3 py-1.5 text-sm font-semibold leading-6 text-deep-navy shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green m-4">
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
                className="flex w-full justify-center rounded-md bg-electric-green px-3 py-1.5 text-sm font-semibold leading-6 text-deep-navy shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green mt-4"
                type="submit"
                onClick={handleSubmit}
              >
                {`${queryData.status === true ? "Disable" : "Enable"}`}
              </button>
            )}
          </div>
        ) : null}

        <CommonModal
          open={openModal}
          handleClose={handleCloseModal}
          handleClickYes={handleClickYes}
          message={message}
          buttons={true}
        />
      </div>
    </div>
  );
};

export default QueryTemplate;
