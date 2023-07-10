import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
import axios from "axios";
import { toast } from "react-toastify";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import * as actions from "../redux/actions/index";
import Table from "./CommonComponent/Table";

import "./styles.css";
import "./pure-react.css";
import { Alert, SwipeableDrawer } from "@mui/material";
import enrichment from "../Assets/Data organization_Isometric.svg";
import searchillustration from "../Assets/Data storage_Two Color.svg";

const s3 = new AWS.S3({
  accessKeyId: "AKIA57AGVWXYVR36XIEC",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const initialState = {
  Query_Name: "",
  Provider_Name: "",
  Column_Names: "",
  Consumer_Name: "",
  File_Name: "",
  Match_Attribute: "",
  Match_Attribute_Value: "",
};

const MatchRate = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const user = state && state.user;
  const TableData =
    state && state.PublisherForm && state.PublisherForm.TableData;
  const requestId =
    state && state.PublisherForm && state.PublisherForm.RequestId;
  const fetchData =
    state && state.PublisherForm && state.PublisherForm.fetchData;

  const [formData, setFormData] = useState({
    ...initialState,
    Provider_Name: user?.name,
    Consumer_Name: "Hoonartek",
  });

  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("age_0_6");

  const [tableHead, setTableHead] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  const [byPassAPICalled, setByPassAPICalled] = useState(false);
  const [toggleDrawerPosition, setToggleDrawerPosition] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
    search: false,
  });

  // useEffect for set match attribute values..
  useEffect(() => {
    if (formData["Match_Attribute"] === "gender") {
      setFormData({
        ...formData,
        Match_Attribute_Value: gender,
      });
    } else if (formData["Match_Attribute"] === "age") {
      setFormData({
        ...formData,
        Match_Attribute_Value: age,
      });
    } else if (formData["Match_Attribute"] === "overall") {
      setFormData({
        ...formData,
        Match_Attribute_Value: "overall",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [age, formData?.Match_Attribute, gender]);

  useEffect(() => {
    if (TableData) {
      setTableHead(TableData?.head || []);
      setTableRows(TableData?.rows || []);
    }
  }, [TableData]);

  const handleCustomerFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileInput = (event) => {
    event.preventDefault();
    var fileInput = document.getElementById("myFileInput");
    var file = fileInput.files[0];

    // Upload file in Local uploadedFiles folder..
    const formData = new FormData();
    formData.append("myFile", file);

    axios.post("http://localhost:9000/api/localFileUpload", formData, {
      headers: {
        "content-type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    });
    setFormData({ ...formData, File_Name: file.name });
  };

  // const isValidInput = (inputString) => {
  //   const regex = /^[0-9][0-9,-]*[0-9]$/; // regex pattern to match only comma, hyphen, and numeric values and start and end with numeric values
  //   return regex.test(inputString); // returns true if inputString matches the regex pattern, false otherwise
  // };

  const callByPassAPI = () => {
    setByPassAPICalled(true);
    setTimeout(() => {
      axios
        .get(`http://127.0.0.1:5000/${user?.name}/procedure`, {
          params: {
            query: `call DCR_SAMP_CONSUMER1.PUBLIC.PROC_BYPASS_1();`,
          },
        })
        .then((response) => {
          if (response) {
            fetchcsvTableData();
            setByPassAPICalled(false);
          } else {
            setByPassAPICalled(false);
            dispatch(
              actions.PublisherForm({
                fetchData: false,
              })
            );
          }
        })
        .catch((error) => {
          console.log(error);
          setByPassAPICalled(false);
          dispatch(
            actions.PublisherForm({
              fetchData: false,
            })
          );
        });
    }, 10000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (byPassAPICalled) {
      toast.error(
        "We are fetching the data for current request. Please wait..."
      );
      return;
    }

    formData.RunId = Date.now();

    const keys = Object.keys(formData);
    let csv = keys.join(",") + "\n";
    for (const obj of [formData]) {
      const values = keys.map((key) => obj[key]);
      csv += values.join(",") + "\n";
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const file1 = new File(
      [blob],
      formData["Query_Name"] + "_" + formData["RunId"] + ".csv",
      { type: "text/csv" }
    );

    const params = {
      Bucket: "dcr-poc",
      Key:
        "query_request/" +
        formData["Query_Name"] +
        "_" +
        formData["RunId"] +
        ".csv",
      Body: blob,
    };

    s3.putObject(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`File uploaded successfully. ETag: ${data.ETag}`);
      }
    });

    var inputFile = document.getElementById("myFileInput");

    const params2 = {
      Bucket: "dcr-poc",
      Key: "query_request_data/" + inputFile.files[0].name,
      Body: inputFile.files[0],
    };

    s3.putObject(params2, (err, data) => {
      if (err) {
        console.log("err", err);
      } else {
        console.log("data", data);
      }
    });

    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query: `insert into DCR_SAMP_CONSUMER1.PUBLIC.dcr_query_request1(template_name,provider_name,columns,consumer_name,run_id,file_name,attribute_name,attribute_value) values ('${formData.Query_Name}', '${formData.Provider_Name}','${formData.Column_Names}','${formData.Consumer_Name}','${formData.RunId}', '${formData.File_Name}','${formData.Match_Attribute}','${formData.Match_Attribute_Value}');`,
        },
      })
      .then((response) => {
        if (response) {
          dispatch(
            actions.PublisherForm({
              RequestId: formData?.RunId,
              fetchData: true,
            })
          );
          callByPassAPI();
        }
      })
      .catch((error) => {
        console.log(error);
      });

    const formData2 = new FormData();
    formData2.append("file", inputFile.files[0]);

    const formData3 = new FormData();
    formData3.append("file", file1);
  };

  const fetchTable = (data) => {
    let head = [];
    let row = [];
    if (data?.length > 0) {
      head = data && Object.keys(data[0]);
      data?.map((obj) => {
        return row.push(head?.map((key) => obj[key]));
      });
    }
    dispatch(
      actions.PublisherForm({
        TableData: { head: head, rows: row },
        fetchData: false,
      })
    );
  };

  const fetchcsvTableData = async () => {
    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query: `select * from DCR_SAMP_CONSUMER1.PUBLIC.${formData?.Query_Name}_${formData?.RunId} limit 1000;`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          fetchTable(response?.data?.data);
          toast.success(
            `Data fetched successfully. Request Id: ${formData?.RunId}`
          );
        }
      })
      .catch((error) => {
        console.log("In API catch", error);
      });
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setToggleDrawerPosition({ ...toggleDrawerPosition, [anchor]: open });
  };

  return (
    <div className="flex flex-col w-full px-4">
      <div className="flex flex-row justify-between items-center w-full mt-2 mb-4">
        <div>
          <h3 className="text-xl font-bold text-deep-navy mr-2">
            Publisher query
          </h3>
          <p>
            Choose your query type, upload the data and publish it for your
            consumers.
          </p>
        </div>
        {["right"].map((anchor) => (
          <React.Fragment key={anchor}>
            <button
              className="my-2 pr-4 flex items-center justify-center rounded-md bg-deep-navy px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-electric-green hover:text-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"
              onClick={toggleDrawer(anchor, true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Create new
            </button>
            <SwipeableDrawer
              anchor={anchor}
              open={toggleDrawerPosition[anchor]}
              onClose={toggleDrawer(anchor, false)}
              onOpen={toggleDrawer(anchor, true)}
            >
              <div className="flex flex-col flex-shrink h-full w-full px-5    bg-deep-navy text-electric-green bg-[url('/static/media/Target audience _Two Color.6aa8a9f45675ef6dfbc33c3c3b61aa03.svg')] ">
                <img
                  className="absolute  w-96  bottom-1 opacity-90 z-10 right-0 text-amarant-400"
                  src={searchillustration}
                  alt=""
                />
                <form
                  className="  my-4 px-4 py-2 h-auto w-96 z-20  bg-deep-navy/50 "
                  name="myForm"
                  onSubmit={handleSubmit}
                >
                  <div className="flex flex-row justify-between ">
                    <h3 className="text-xl font-semibold">
                      New publisher query
                    </h3>
                    <button onClick={toggleDrawer("right", false)}>
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
                  <div>
                    <div className=" mt-2 pb-2 flex flex-col">
                      <label>Query name</label>
                      <select
                        name="Query_Name"
                        onChange={handleCustomerFormData}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                      >
                        <option value="">Please select</option>
                        <option value="advertiser_match">
                          Advertiser match
                        </option>
                      </select>
                    </div>

                    <div className="mt-2 pb-21 flex flex-col">
                      <label>Upload File</label>
                      <input
                        // className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                        className="block w-full text-sm text-true-teal
                        file:mr-4 file:py-2 file:px-4 file:rounded-md
                        file:border-0 file:text-sm file:font-semibold
                        file:bg-electric-green file:text-deep-navy
                        hover:file:bg-true-teal hover:file:cursor-pointer"
                        type="file"
                        id="myFileInput"
                        onChange={handleFileInput}
                        required
                      />
                    </div>

                    <div className="mt-2 pb-21 flex flex-col">
                      <label>Identifier type</label>
                      <select
                        name="Column_Names"
                        onChange={handleCustomerFormData}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                      >
                        <option value="">Please select</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="MAID">MAID-WIP</option>
                      </select>
                    </div>

                    <div className="mt-2 pb-21 flex flex-col">
                      <label>Match attribute</label>
                      <select
                        name="Match_Attribute"
                        onChange={handleCustomerFormData}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                      >
                        <option value="">Please select</option>
                        <option value="overall">Overall</option>
                        <option value="age">Age</option>
                        <option value="gender">Gender</option>
                      </select>
                      {formData["Match_Attribute"] === "gender" && (
                        <div className="mt-2 pb-21 flex flex-col">
                          Select Gender
                          <label>
                            <input
                              type="radio"
                              value="male"
                              checked={gender === "male"}
                              onChange={(e) => setGender(e.target.value)}
                            />
                            <span className="pl-2">Male</span>
                          </label>
                          <label>
                            <input
                              type="radio"
                              value="female"
                              checked={gender === "female"}
                              onChange={(e) => setGender(e.target.value)}
                            />
                            <span className="pl-2">Female</span>
                          </label>
                        </div>
                      )}
                      {formData["Match_Attribute"] === "age" && (
                        <div className="mt-2 pb-21 flex flex-col">
                          Select Age
                          <label>
                            <input
                              type="radio"
                              value="age_0_6"
                              checked={age === "age_0_6"}
                              onChange={(e) => setAge(e.target.value)}
                            />
                            <span className="pl-2">0-6</span>
                          </label>
                          <label>
                            <input
                              type="radio"
                              value="age_7_16"
                              checked={age === "age_7_16"}
                              onChange={(e) => setAge(e.target.value)}
                            />
                            <span className="pl-2">7-16</span>
                          </label>
                          <label>
                            <input
                              type="radio"
                              value="age_17_25"
                              checked={age === "age_17_25"}
                              onChange={(e) => setAge(e.target.value)}
                            />
                            <span className="pl-2">17-25</span>
                          </label>
                          <label>
                            <input
                              type="radio"
                              value="age_26_40"
                              checked={age === "age_26_40"}
                              onChange={(e) => setAge(e.target.value)}
                            />
                            <span className="pl-2">26-40</span>
                          </label>
                          <label>
                            <input
                              type="radio"
                              value="age_41_above"
                              checked={age === "age_41_above"}
                              onChange={(e) => setAge(e.target.value)}
                            />
                            <span className="pl-2">41-above</span>
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="flex w-full justify-center rounded-md bg-electric-green px-3 py-1.5 text-sm font-semibold leading-6 text-deep-navy shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green mt-4"
                        type="submit"
                      >
                        Submit query
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </SwipeableDrawer>
          </React.Fragment>
        ))}
      </div>

      <img
        className="absolute  w-2/5 -z-50 bottom-1 opacity-20 -right-20"
        src={enrichment}
        alt=""
      />
      <div className="flex flex-row  gap-3  w-full">
        {!fetchData ? (
          <div className=" flex flex-grow">
            {tableHead?.length > 0 && tableRows?.length > 0 ? (
              <Table id={requestId} head={tableHead} rows={tableRows} />
            ) : null}
          </div>
        ) : (
          <Alert
            // icon={<AccessTimeIcon fontSize="inherit" />}
            severity="info"
          >
            We are fetching the data you requested: Request Id -{" "}
            <strong> {requestId}</strong>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default MatchRate;
