import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Alert } from "@mui/material";
import ReactDatePicker from "react-datepicker";

const baseURL = process.env.REACT_APP_BASE_URL;
const redirectionUser = process.env.REACT_APP_REDIRECTION_URL;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ItemisedBills = ({ handleToggleDrawer }) => {
  const state = useSelector((state) => state);
  const user = state && state.user;

  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedConsumer, setSelectedConsumer] = useState("");

  const [errors, setErrors] = useState({
    consumerError: "",
    dateError: "",
  });

  const [billError, setBillError] = useState("");
  const [data, setData] = useState([]);

  const handleConsumerChange = (event) => {
    setSelectedConsumer(event.target.value);
    setErrors({ ...errors, consumerError: "" });
    setBillError("");
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setErrors({ ...errors, dateError: "" });
    setBillError("");
  };

  const handleViewBill = () => {
    let selectedValue = "";
    if (user?.role && user?.role?.includes("Consumer_Admin") || user?.role?.includes("Provider_Admin") ) {
      selectedValue =
        user?.name +
        "_" +
        months[selectedDate?.getMonth()] +
        "_" +
        selectedDate?.getFullYear() +
        ".pdf";
    } else {
      if (selectedConsumer === "") {
        setErrors({ ...errors, consumerError: "Please select Consumer" });
        return;
      }
      selectedValue =
        selectedConsumer +
        "_" +
        months[selectedDate?.getMonth()] +
        "_" +
        selectedDate?.getFullYear() +
        ".pdf";
    }
    if (selectedDate === null) {
      setErrors({ ...errors, dateError: "Please select Month and Year" });
      return;
    }
    const billsFolder = "/bills/";
    const filePath = billsFolder + selectedValue;
    checkIfFileExists(filePath);
  };

  const checkIfFileExists = async (filePath) => {
    try {
      await axios
        .get(filePath)
        .then((response) => {
          if (response?.status === 200) {
            setBillError("");
            window.open(filePath, "_blank");
          } else {
            setBillError(
              "For selected month and year bill is not generated, please select correct month and year."
            );
          }
        })
        .catch((error) => {
          setBillError(
            "For selected month and year bill is not generated, please select correct month and year."
          );
        });
    } catch (error) {
      setBillError(
        "For selected month and year bill is not generated, please select correct month and year."
      );
    }
  };

  useEffect(() => {
    if (user?.role && user?.role?.includes("DATAEXADMIN")) {
      axios
        .get(`${baseURL}/${redirectionUser}`, {
          params: {
            query: `select * from DATAEXCHANGEDB.DATACATALOG.CONSUMER_ATTRIBUTES where ADMIN='TRUE';`,
          },
        })
        .then((response) => {
          if (response?.data?.data) {
            setData(response?.data?.data);
          } else {
            setData([]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user?.name, user?.role]);

  return (
    <div className="w-96">
      <div className="pt-8 bg-opacity-75 backdrop-filter backdrop-blur-lg">
        <div className="flex flex-row items-start text-electric-green">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6 mt-1 mr-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
            />
          </svg>
          <div className="flex flex-col w-full">
            <div className="flex justify-between">
              <h3 className="text-lg font-bold text-electric-green uppercase">
                Itemised Bills
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
              Check monthly itemised bills.
            </span>
          </div>
        </div>
      </div>
      <img
        className="absolute w-96 h-64 bottom-5 opacity-90 z-10 right-0 text-amarant-400"
        src={
          "https://tailwindcss-templates.netlify.com/fair-rate-mortgage/images/icon-home-3.svg"
        }
        alt=""
      />
      <div className="pl-8">
        {user?.role && user?.role?.includes("DATAEXADMIN") && (
          <>
            <div className="mt-2 flex flex-col">
              <label className="block text-sm font-medium leading-6 text-electric-green ">
                Select Consumer
              </label>
              <select
                value={selectedConsumer}
                onChange={handleConsumerChange}
                required
                className="bg-deep-navy  block rounded-md border-0 py-1.5 text-electric-green shadow-sm ring-1 ring-inset ring-electric-green  placeholder:text-electric-green  focus:ring-2 focus:ring-inset focus:ring-electric-green  sm:text-sm sm:leading-6"
              >
                <option value="">Select Consumer</option>
                {data.map((consumer, index) => {
                  return (
                    <option key={index} value={consumer.USER}>
                      {consumer.USER}
                    </option>
                  );
                })}
              </select>
            </div>
            {errors.consumerError !== "" && (
              <Alert className="my-4 text-red-600" severity="error">
                {errors.consumerError}
              </Alert>
            )}
          </>
        )}

        <div className="my-4">
          <label className="block text-sm font-medium leading-6 text-electric-green ">
            Select Month and Year
          </label>
          <ReactDatePicker
            className="flex align-center rounded-md w-full bg-deep-navy pl-8 ring-1 ring-inset ring-electric-green placeholder:text-electric-green  focus:ring-2 focus:ring-inset focus:ring-electric-green  sm:text-sm sm:leading-6 text-electric-green"
            showIcon
            selected={selectedDate}
            onChange={(date) => handleDateChange(date)}
            showMonthYearPicker
            dateFormat="MM/yyyy"
            placeholderText="Select Month and Year"
            isClearable
          />
        </div>

        {errors.dateError !== "" && (
          <Alert className="my-4 text-red-600" severity="error">
            {errors.dateError}
          </Alert>
        )}

        <div className="flex justify-end">
          <button
            className="flex w-full justify-center rounded-md bg-electric-green px-3 py-1.5 text-sm font-semibold leading-6 text-deep-navy shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green mt-4"
            type="submit"
            onClick={handleViewBill}
          >
            View Bill
          </button>
        </div>
        {billError !== "" && (
          <Alert className="my-4 text-red-600" severity="error">
            {billError}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ItemisedBills;
