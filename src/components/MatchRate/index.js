import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Papa from "papaparse";
import { read, utils } from "xlsx";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import {
  Alert,
  CircularProgress,
  SwipeableDrawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import * as actions from "../../redux/actions/index";
import CommonModal from "../CommonComponent/Modal";
import CustomTable from "../CommonComponent/Table";
import SampleTemplate from "../../Assets/CSVTemplates/Sample_Template_Match_Rate.xlsx";

import {
  ApprovedStatus,
  CompletedStatus,
  RejectedStatus,
  FailedStatus,
  WaitingStatus,
  OtherStatus,
} from "../CommonComponent/StatusColumn";
import { handleDate } from "../../utils/commonFunctions";

import enrichment from "../../Assets/Data organization_Isometric.svg";
import searchillustration from "../../Assets/Data storage_Two Color.svg";

import Spinner from "../CommonComponent/Spinner";
import { toast } from "react-toastify";

import "../styles.css";
import "../pure-react.css";

const baseURL = process.env.REACT_APP_BASE_URL;
const nodeURL = process.env.REACT_APP_NODE_URL;

const initialState = {
  Query_Name: "",
  Column_Names: "",
  Consumer_Name: "",
  File_Name: "",
  Match_Attribute: "",
  Match_Attribute_Value: "",
  file: "",
};

const MatchRate = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const user = state && state.user;
  const TableData =
    state && state.PublisherForm && state.PublisherForm.TableData;
  const requestId =
    state && state.PublisherForm && state.PublisherForm.RequestId;
  const loadingTable =
    state && state.PublisherForm && state.PublisherForm.loadingTable;
  const [formData, setFormData] = useState({
    ...initialState,
    Consumer_Name: user?.Consumer,
  });

  const [gender, setGender] = useState("male");
  const [providerName, setProviderName] = useState("");

  const [age, setAge] = useState("age_0_6");

  const [tableHead, setTableHead] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  const [byPassAPICalled, setByPassAPICalled] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [viewActionModal, setViewActionModal] = useState(false);
  const [requestFailedReason, setRequestFailedReason] = React.useState({
    openModal: false,
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [fileErrorMessage, setFileErrorMessage] = useState("");
  const [downloadSample, setDownloadSample] = useState(false);

  const [toggleDrawerPosition, setToggleDrawerPosition] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
    search: false,
  });

  useEffect(() => {
    let intervalId;
    if (byPassAPICalled === true) {
      intervalId = setInterval(() => {
        fetchMainTable();
      }, 5000);
    }
    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [byPassAPICalled]);

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

  useEffect(() => {
    dispatch(
      actions.PublisherForm({
        loadingTable: true,
      })
    );
    fetchMainTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // UseEffect used for Inserting the Provider...

  useEffect(() => {
    axios
      .get(`${baseURL}/${user?.name}`, {
        params: {
          query: "select provider from DCR_SAMP_CONSUMER1.PUBLIC.PROV_DETAILS;",
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          let provider_name = response?.data?.data?.[0];
          setProviderName(provider_name.PROVIDER);
        }
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.name]);

  const fetchMainTable = () => {
    axios
      .get(`${baseURL}/${user?.name}`, {
        params: {
          query:
            "select * from DCR_SAMP_CONSUMER1.PUBLIC.DASHBOARD_TABLE where TEMPLATE_NAME = 'ADVERTISER MATCH' order by RUN_ID desc limit 5;",
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          let res = response?.data?.data;
          setTableData(res);
          dispatch(
            actions.PublisherForm({
              loadingTable: false,
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(
          actions.PublisherForm({
            loadingTable: false,
          })
        );
      });
  };

  const handleCustomerFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileInput = (event) => {
    event.preventDefault();
    setFileErrorMessage("");
    var fileInput = document.getElementById("myFileInput");
    var file = fileInput?.files[0];
    setFormData({ ...formData, file: file });
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (fileExtension === "csv") {
        // Handle CSV file
        Papa.parse(file, {
          complete: function (results) {
            const jsonData = results?.data;
            // Assuming the first row contains the column names
            const headers = jsonData[0];

            if (jsonData?.length > 1) {
              if (headers?.length > 1) {
                setFileErrorMessage(
                  "Columns are added more than one in the CSV file"
                );
              } else if (headers?.length < 1) {
                setFileErrorMessage("Please add one Column in the CSV file");
              } else if (headers?.length === 1) {
                if (
                  headers[0]?.toUpperCase() === "EMAIL" ||
                  headers[0]?.toUpperCase() === "PHONE" ||
                  headers[0]?.toUpperCase() === "MAID-WIP"
                ) {
                  setFileErrorMessage("");
                } else {
                  setFileErrorMessage("Invalid CSV file. Upload not allowed.");
                }
              } else {
                setFileErrorMessage("Invalid CSV file. Upload not allowed.");
              }
            } else {
              setFileErrorMessage("Invalid CSV file. No Data present.");
            }
          },
        });
      } else if (fileExtension === "xlsx") {
        // Handle XLSX file
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;
          const workbook = read(arrayBuffer, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

          // Assuming the first row contains the column names
          const headers = jsonData[0];
          if (jsonData?.length > 1) {
            if (headers?.length > 1) {
              setFileErrorMessage(
                "Columns are added more than one in the XLSX file"
              );
            } else if (headers?.length < 1) {
              setFileErrorMessage("Please add one Column in the XLSX file");
            } else if (headers?.length === 1) {
              if (
                headers[0]?.toUpperCase() === "EMAIL" ||
                headers[0]?.toUpperCase() === "PHONE" ||
                headers[0]?.toUpperCase() === "MAID-WIP"
              ) {
                setFileErrorMessage("");
              } else {
                setFileErrorMessage("Invalid XLSX file. Upload not allowed.");
              }
            } else {
              setFileErrorMessage("Invalid XLSX file. Upload not allowed.");
            }
          } else {
            setFileErrorMessage("Invalid XLSX file. No Data present.");
          }
        };

        reader.readAsArrayBuffer(file);
      } else {
        setFileErrorMessage(
          "Invalid file type. Only CSV and XLSX files are allowed."
        );
      }
    }
  };

  // const isValidInput = (inputString) => {
  //   const regex = /^[0-9][0-9,-]*[0-9]$/; // regex pattern to match only comma, hyphen, and numeric values and start and end with numeric values
  //   return regex.test(inputString); // returns true if inputString matches the regex pattern, false otherwise
  // };

  const callByPassAPI = () => {
    setByPassAPICalled(true);
    axios
      .get(`${baseURL}/${user?.name}/procedure`, {
        params: {
          query: `call DCR_SAMP_CONSUMER1.PUBLIC.PROC_BYPASS_1();`,
        },
      })
      .then((response) => {
        if (response) {
          fetchMainTable();
          setByPassAPICalled(false);
        } else {
          setByPassAPICalled(false);
          fetchMainTable();
        }
      })
      .catch(() => {
        setByPassAPICalled(false);
        fetchMainTable();
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (downloadSample || fileErrorMessage !== "") {
      setDownloadSample(false);
      return;
    }

    formData.RunId = Date.now();
    setLoading(true);
    setErrorMessage("");
    // Upload file in Local uploadedFiles folder..
    const fileName = `${
      formData.RunId + "." + formData?.file?.name?.split(".")[1]
    }`;
    const modifiedFile = new File([formData?.file], fileName, {
      type: formData?.file.type,
    });
    formData.File_Name = fileName;
    formData.file = modifiedFile;
    const localFile = new FormData();

    localFile.append("myFile", modifiedFile);

    axios
      .post(`${nodeURL}/api/localFileUpload`, localFile, {
        headers: {
          "content-type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        if (parseInt(response?.status) === 200) {
          axios
            .get(`${baseURL}/${user?.name}/attachment`, {
              params: {
                filename: `${formData.File_Name}`,
                identifyer: `${formData.Column_Names.toUpperCase()}`,
              },
            })
            .then((response) => {
              if (response?.data?.data === true) {
                fetchMainTable();
                setLoading(false);

                axios
                  .get(`${baseURL}/${user?.name}`, {
                    params: {
                      query: `insert into DCR_SAMP_CONSUMER1.PUBLIC.dcr_query_request1(template_name,provider_name,columns,consumer_name,run_id,file_name,attribute_name,attribute_value) values ('${formData.Query_Name}', '${providerName}','${formData.Column_Names}','${formData.Consumer_Name}','${formData.RunId}', '${formData.File_Name}','${formData.Match_Attribute}','${formData.Match_Attribute_Value}');`,
                    },
                  })
                  .then((response) => {
                    if (response) {
                      // Reset the file input
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                      setFormData({
                        ...initialState,
                        Consumer_Name: user?.Consumer,
                      });
                      setToggleDrawerPosition({
                        ...toggleDrawerPosition,
                        right: false,
                      });
                      callByPassAPI();
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              } else {
                fetchMainTable();
                setLoading(false);
                setErrorMessage(
                  "The data is not matching with requested Identifier."
                );
              }
            })
            .catch((error) => {
              setLoading(false);
              setErrorMessage(
                "Something went wrong, please try again later !!!"
              );
              console.log(error);
            });
        }
      });
  };

  const fetchcsvTableData = async (templateName, runId) => {
    templateName = templateName.replace(/\s/g, "_");
    setViewActionModal(true);
    axios
      .get(`${baseURL}/${user?.name}`, {
        params: {
          query: `select * from DCR_SAMP_CONSUMER1.PUBLIC.${templateName}_${runId} limit 1000;`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          let data = response?.data?.data;
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
              RequestId: runId,
            })
          );
        }
      })
      .catch((error) => {
        console.log("In API catch", error);
      });
  };

  const downloadNewFile = () => {
    const link = document.createElement("a");
    link.href = SampleTemplate;
    link.download = "Sample_Template_Match_Rate.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`The File has been downloaded...`);
  };

  const handleToggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setFormData({ ...initialState, Consumer_Name: user?.Consumer });
    setToggleDrawerPosition({ ...toggleDrawerPosition, [anchor]: open });
  };

  return (
    <div className="flex flex-col w-full px-4 overflow-hidden">
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
              onClick={handleToggleDrawer(anchor, true)}
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
              onClose={handleToggleDrawer(anchor, false)}
              onOpen={handleToggleDrawer(anchor, true)}
            >
              <div className="flex flex-col flex-shrink h-full w-full px-5 bg-deep-navy text-electric-green bg-[url('/static/media/Target audience _Two Color.6aa8a9f45675ef6dfbc33c3c3b61aa03.svg')] ">
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
                    <button onClick={handleToggleDrawer("right", false)}>
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
                        value={formData.Query_Name}
                        className="block w-full rounded-md border-0 py-1.5 text-electric-green  bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
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
                        // className="block w-full rounded-md border-0 py-1.5 text-electric-green  bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                        className="block w-full text-sm text-true-teal
                        file:mr-4 file:py-2 file:px-4 file:rounded-md
                        file:border-0 file:text-sm file:font-semibold
                        file:bg-electric-green file:text-deep-navy
                        hover:file:bg-true-teal hover:file:cursor-pointer"
                        type="file"
                        id="myFileInput"
                        onChange={handleFileInput}
                        required
                        ref={fileInputRef}
                      />
                    </div>
                    <div className="my-4 flex flex-col">
                      <button
                        className="flex w-fit text-electric-green"
                        onClick={() => {
                          downloadNewFile();
                          setDownloadSample(true);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="pl-2 underline">
                          Download Template
                        </span>
                      </button>
                    </div>

                    <div className="my-2">
                      {fileErrorMessage !== "" && (
                        <Alert className="my-4 text-red-600" severity="error">
                          {fileErrorMessage}
                        </Alert>
                      )}
                    </div>

                    <div className="mt-2 pb-21 flex flex-col">
                      <label>Identifier type</label>
                      <select
                        name="Column_Names"
                        onChange={handleCustomerFormData}
                        required
                        value={formData.Column_Names}
                        className="block w-full rounded-md border-0 py-1.5 text-electric-green  bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
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
                        value={formData.Match_Attribute}
                        className="block w-full rounded-md border-0 py-1.5 text-electric-green  bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
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
                      {loading ? (
                        <div className="flex w-full justify-center rounded-md bg-electric-green px-3 py-1.5 text-sm font-semibold leading-6 text-deep-navy shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green mt-4">
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
                        >
                          Submit query
                        </button>
                      )}
                    </div>
                    <div className="py-2">
                      {errorMessage !== "" ? (
                        <Alert className="my-4 text-red-600" severity="error">
                          {errorMessage}
                        </Alert>
                      ) : (
                        loading && (
                          <Alert className="my-4 text-red-600" severity="error">
                            Uploading the Attachment. Please wait
                          </Alert>
                        )
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </SwipeableDrawer>
          </React.Fragment>
        ))}
      </div>

      <img
        className="absolute object-cover w-1/4 -z-50 bottom-1 opacity-20 right-0"
        src={enrichment}
        alt=""
      />
      {!loadingTable ? (
        <div className="flex flex-col w-full px-5">
          <h1 className=" mt-4 text-xl font-regular text-deep-navy pb-2 ">
            Recent queries
          </h1>
          <TableContainer>
            <Table
              sx={{ minWidth: 650, borderRadius: 0 }}
              stickyHeader
              size="small"
              classes={{ root: "w-100 bg-white/70" }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      fontSize: "0.9rem",
                      fontWeight: 900,
                      color: "#0A2756",
                      backgroundColor: "#e8effb",
                      borderRadius: 0,
                      borderTop: 1,
                      borderRight: 1,
                      borderColor: "#d6d3d1",
                    },
                    "& th:first-of-type": {
                      borderLeft: 1,
                      borderColor: "#d6d3d1",
                    },
                  }}
                >
                  <TableCell key={1} align="center">
                    Status
                  </TableCell>
                  <TableCell key={2} align="center">
                    Request ID
                  </TableCell>
                  <TableCell key={3} align="center">
                    Identifier Type
                  </TableCell>
                  <TableCell key={4} align="center">
                    Match Attribute
                  </TableCell>
                  <TableCell key={5} align="center">
                    Match count
                  </TableCell>
                  <TableCell key={6} align="center">
                    Requested
                  </TableCell>
                  <TableCell key={7} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData?.map((row, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "& td:last-child": {
                          borderRight: 1,
                          borderColor: "#d6d3d1",
                        },
                        "& td": {
                          borderLeft: 1,
                          borderColor: "#d6d3d1",
                          color: "#0A2756",
                        },
                      }}
                    >
                      <TableCell align="center">
                        <span>
                          {row.STATUS.toLowerCase() === "true"
                            ? ApprovedStatus("approved")
                            : row.STATUS.toLowerCase() === "false"
                            ? RejectedStatus("rejected")
                            : row.STATUS.toLowerCase() === "completed"
                            ? CompletedStatus(row.STATUS)
                            : row.STATUS.toLowerCase() === "failed"
                            ? FailedStatus(row.STATUS)
                            : row.STATUS.toLowerCase() ===
                              "waiting for approval"
                            ? WaitingStatus(row.STATUS)
                            : OtherStatus(row.STATUS)}
                        </span>
                      </TableCell>
                      <TableCell align="center">{row.RUN_ID}</TableCell>
                      <TableCell align="center">
                        {row.IDENTIFIER_TYPE}
                      </TableCell>
                      <TableCell align="center">{row.ATTRIBUTE}</TableCell>
                      <TableCell align="center">{row.MATCH_COUNT}</TableCell>
                      <TableCell align="center">
                        {handleDate(row.RUN_ID)}
                      </TableCell>
                      <TableCell align="center">
                        {row.STATUS.toLowerCase() === "failed" ||
                        row.STATUS.toLowerCase() === "false" ? (
                          <div className="flex flex-row items-center justify-center">
                            <button
                              onClick={() =>
                                setRequestFailedReason({
                                  ...requestFailedReason,
                                  openModal: true,
                                  message: row.ERROR,
                                })
                              }
                              className="flex flex-row px-2 text-red-600"
                              title="Request Error"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                />
                              </svg>
                              <span className="pl-2 underline">
                                Request Error
                              </span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <button
                              onClick={() =>
                                fetchcsvTableData(row.TEMPLATE_NAME, row.RUN_ID)
                              }
                              className={`${
                                row.STATUS.toLowerCase() === "completed"
                                  ? "text-deep-navy"
                                  : "text-electric-green/50"
                              } flex flex-row items-center px-2 justify-center`}
                              disabled={
                                row.STATUS.toLowerCase() !== "completed"
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span className="pl-2 underline">View</span>
                            </button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <div className="flex justify-center mt-8">
          <Spinner />
        </div>
      )}

      <CustomTable
        id={requestId}
        head={tableHead}
        rows={tableRows}
        pagination={"none"}
        open={viewActionModal}
        handleClose={() => {
          setViewActionModal(false);
          dispatch(
            actions.PublisherForm({
              TableData: { head: [], rows: [] },
            })
          );
        }}
        title={"Query Result"}
      />

      {requestFailedReason.openModal ? (
        <CommonModal
          open={requestFailedReason.openModal}
          handleClose={() =>
            setRequestFailedReason({ ...requestFailedReason, openModal: false })
          }
          title={"Request Error"}
          message={requestFailedReason.message}
          buttons={false}
          textColor={"text-red-600"}
          svg={true}
        />
      ) : null}
    </div>
  );
};

export default MatchRate;
