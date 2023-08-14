import React, { useEffect, useState } from "react";
import axios from "axios";

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
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../redux/actions/index";
import SelectDropdown from "./CommonComponent/SelectDropdown";

import CommonModal from "./CommonComponent/Modal";
import CustomTable from "./CommonComponent/Table";

import {
  ApprovedStatus,
  CompletedStatus,
  RejectedStatus,
  FailedStatus,
  WaitingStatus,
  OtherStatus,
} from "./CommonComponent/StatusColumn";

import enrichment from "../Assets/Profiling_Isometric.svg";
import searchillustration from "../Assets/Target audience _Two Color.svg";

import {
  jsonToCsv,
  handleDate,
  downloadFileInCSV,
} from "../utils/commonFunctions";

import Spinner from "./CommonComponent/Spinner";
import "./styles.css";
import "./pure-react.css";

const baseURL = process.env.REACT_APP_BASE_URL;
const redirectionUser = process.env.REACT_APP_REDIRECTION_URL;

const initialState = {
  Query_Name: "",
  Provider_Name: "",
  Column_Names: [],
  Consumer_Name: "",
  Attribute_Value: "",
};
const Enrichment = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const user = state && state.user;
  const TableData = state && state.ConsumerForm && state.ConsumerForm.TableData;
  const requestId = state && state.ConsumerForm && state.ConsumerForm.RequestId;
  const loadingTable =
    state && state.ConsumerForm && state.ConsumerForm.loadingTable;

  const [formData, setFormData] = useState({
    ...initialState,
    Consumer_Name: user?.Consumer,
  });

  const [tableHead, setTableHead] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  const [providerList, setProviderList] = useState([]);
  const [templateList, setTemplateList] = useState("");
  const [databaseName, setDatabaseName] = useState("");
  const [columns, setColumns] = useState([]);
  const [byPassAPICalled, setByPassAPICalled] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [viewActionModal, setViewActionModal] = useState(false);
  const [requestFailedReason, setRequestFailedReason] = React.useState({
    openModal: false,
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [columnError, setColumnError] = useState("");

  const [toggleDrawerPosition, setToggleDrawerPosition] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
    search: false,
  });

  useEffect(() => {
    if (TableData) {
      setTableHead(TableData?.head || []);
      setTableRows(TableData?.rows || []);
    }
  }, [TableData]);

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

  useEffect(() => {
    dispatch(
      actions.ConsumerQueryForm({
        loadingTable: true,
      })
    );
    fetchMainTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMainTable = () => {
    axios
      .get(`${baseURL}/${user?.name}`, {
        params: {
          query:
            `select * from DCR_SAMP_CONSUMER1.PUBLIC.DASHBOARD_TABLE where TEMPLATE_NAME = 'CUSTOMER ENRICHMENT' order by RUN_ID desc limit 5;`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          let res = response?.data?.data;
          setTableData(res);
          dispatch(
            actions.ConsumerQueryForm({
              loadingTable: false,
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(
          actions.ConsumerQueryForm({
            loadingTable: false,
          })
        );
      });
  };

  useEffect(() => {
    axios
      .get(`${baseURL}/${user?.name}`, {
        params: {
          query: `select provider from DCR_SAMP_CONSUMER1.PUBLIC.PROV_DETAILS;`,
        },
      })
      .then((response) => {
        if (response?.data) {
          setProviderList(response?.data?.data);
        } else {
          setProviderList([]);
        }
      })
      .catch((error) => console.log(error));
  }, [user?.name]);

  useEffect(() => {
    if (databaseName !== "" && formData["Query_Name"] !== "") {
      axios
        .get(`${baseURL}/${user?.name}`, {
          params: {
            query: `select allowed_columns from ${databaseName}.CLEANROOM.TEMPLATES where template_name='${formData["Query_Name"]}';`,
          },
        })
        .then((response) => {
          if (response?.data) {
            let col_name = response?.data?.data[0]?.ALLOWED_COLUMNS?.split("|");
            col_name = col_name?.map((item) => {
              return item?.split(".")[1];
            });
            if (col_name && col_name?.length > 0) {
              let temp = [];
              temp.push({ value: "all", name: "All" });
              col_name?.map((value) => {
                return temp.push({ value: value, name: value });
              });
              setColumns(temp);
            } else {
              setColumns([]);
              setFormData({
                ...formData,
                Column_Names: [],
              });
            }
          }
        })
        .catch((error) => console.log(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [databaseName, formData["Query_Name"]]);

  const handleSelectProvider = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setTemplateList([]);
    getDatabaseName(event.target.value);
  };

  const handleSelectedTemp = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const getDatabaseName = (selectedProvider) => {
    axios
      .get(`${baseURL}/${user?.name}`, {
        params: {
          query: `select database from DCR_SAMP_CONSUMER1.PUBLIC.PROV_DETAILS where provider = '${selectedProvider}';`,
        },
      })
      .then((response) => {
        if (response?.data) {
          let db_name = response?.data?.data[0]?.DATABASE;
          setDatabaseName(db_name);
          axios
            .get(`${baseURL}/${user?.name}`, {
              params: {
                query: `select template_name from ${db_name}.CLEANROOM.TEMPLATES where template_name NOT LIKE '%advertiser_match%';`,
              },
            })
            .then((response) => {
              if (response?.data) {
                setTemplateList(response.data.data);
              }
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  };

  const handleCustomerFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (event, name) => {
    const element = "all";
    const index = event?.indexOf(element);

    if (event?.includes("all")) {
      let allSelect = columns?.map((obj) => {
        return obj.value;
      });
      if (index !== -1) {
        allSelect?.splice(index, 1);
      }
      setFormData({
        ...formData,
        [name]: allSelect,
      });
    } else {
      setFormData({
        ...formData,
        [name]: event,
      });
    }
  };

  const downloadFile = (TEMPLATE_NAME, RUN_ID) => {
    TEMPLATE_NAME = TEMPLATE_NAME.replace(/\s/g, "_");
    axios
      .get(`${baseURL}/${user?.name}`, {
        responseType: "json",
        params: {
          query: `select * from DCR_SAMP_CONSUMER1.PUBLIC.${TEMPLATE_NAME}_${RUN_ID};`,
        },
      })
      .then((response) => {
        if (response?.data) {
          const csvData = jsonToCsv(response?.data); // Create a Blob from the CSV data
          downloadFileInCSV(csvData, TEMPLATE_NAME, RUN_ID);
        } else {
          console.log("File cannot be downloaded...");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const callByPassAPI = (newReqId) => {
    setByPassAPICalled(true);
    axios
      .get(`${baseURL}/${user?.name}/procedure`, {
        params: {
          query: `call DCR_SAMP_CONSUMER1.PUBLIC.PROC_BYPASS_1();`,
        },
      })
      .then((response) => {
        if (parseInt(response?.status) === 200) {
          fetchMainTable();
          setByPassAPICalled(false);
          axios
            .get(`${baseURL}/${user?.name}`, {
              params: {
                query: `select * from DCR_SAMP_CONSUMER1.PUBLIC.DASHBOARD_TABLE where TEMPLATE_NAME = 'CUSTOMER ENRICHMENT' and RUN_ID='${newReqId}'`,
              },
            })
            .then((response) => {
              if (response?.data?.data) {
                let result = response?.data?.data[0];
                axios
                  .get(`${baseURL}/${redirectionUser}`, {
                    params: {
                      query: `INSERT INTO DATAEXCHANGEDB.DATACATALOG.LOG_TABLE(RUN_ID, TEMPLATE_NAME, CONSUMER_RECORD_COUNT, PROVIDER_NAME, CONSUMER_NAME, REQUEST_TS, STATUS) VALUES ('${result.RUN_ID}', '${result.TEMPLATE_NAME}', '${result.CONSUMER_RECORD_COUNT}', '${result.PROVIDER_NAME}', '${result.CONSUMER_NAME}', '${result.REQUEST_TS}', '${result.STATUS}');`,
                    },
                  })
                  .then((response) => {
                    fetchMainTable();
                    setByPassAPICalled(false);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          fetchMainTable(false);
          setByPassAPICalled(false);
        }
      })
      .catch(() => {
        setByPassAPICalled(false);
        fetchMainTable(false);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    formData.RunId = Date.now();

    if (!formData.Column_Names || formData.Column_Names.length <= 0) {
      setColumnError("Please select the columns");
      return;
    }

    setLoading(true);
    const delimiter = "&";
    const selectedColumns = `#${formData.Column_Names?.join(delimiter)}#`;

    axios
      .get(`${baseURL}/${user?.name}`, {
        params: {
          query: `insert into DCR_SAMP_CONSUMER1.PUBLIC.dcr_query_request1(template_name,provider_name,columns,consumer_name,run_id, attribute_value) values ('${formData.Query_Name}', '${formData.Provider_Name}','${selectedColumns}','${formData.Consumer_Name}','${formData.RunId}', '${formData.Attribute_Value}');`,
        },
      })
      .then((response) => {
        if (response) {
          axios
            .get(`${baseURL}/${formData?.Provider_Name}`, {
              params: {
                query: `insert into DCR_SAMP_PROVIDER_DB.ADMIN.RUNID_TABLE(run_id) values('${formData.RunId}');`,
              },
            })
            .then((response) => {
              if (response) {
                fetchMainTable();
                setLoading(false);
                setFormData({ ...initialState, Consumer_Name: user?.Consumer });
                setToggleDrawerPosition({
                  ...toggleDrawerPosition,
                  right: false,
                });
                callByPassAPI(formData?.RunId);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchcsvTableData = async (templateName, runId) => {
    templateName = templateName.replace(/\s/g, "_");

    setViewActionModal(true);
    axios
      .get(`${baseURL}/${user?.name}`, {
        params: {
          query: `select * from DCR_SAMP_CONSUMER1.PUBLIC.${templateName}_${runId}_sample;`,
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
            actions.ConsumerQueryForm({
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

  const toggleDrawer = (anchor, open) => (event) => {
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
    <div className="flex flex-col w-full px-4 ">
      <div className="flex flex-row justify-between items-center w-full mt-2 mb-4">
        <div>
          <h3 className="text-xl font-bold text-deep-navy mr-2">
            Consumer query
          </h3>
          <p>
            Choose your provider to run a consumer query based on your
            parameters.
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
            {toggleDrawerPosition[anchor] && (
              <SwipeableDrawer
                anchor={anchor}
                open={toggleDrawerPosition[anchor]}
                onClose={toggleDrawer(anchor, false)}
                onOpen={toggleDrawer(anchor, true)}
              >
                <div className="flex flex-col flex-shrink h-full w-full px-5    bg-deep-navy text-electric-green">
                  <img
                    className="absolute  w-96  bottom-1 opacity-90 z-10 right-0 text-amarant-400"
                    src={searchillustration}
                    alt=""
                  />
                  <form
                    className=" z-20  my-4 px-4 py-2 w-96  bg-deep-navy/50"
                    name="myForm"
                    onSubmit={handleSubmit}
                  >
                    <div className="flex flex-row justify-between">
                      <h3 className="text-xl font-semibold">
                        New consumer query
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
                      <div className="mt-2 pb-2 flex flex-col">
                        <label>Provider name</label>
                        <select
                          id="provider"
                          name="Provider_Name"
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-electric-green  bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                          value={formData["Provider_Name"]}
                          onChange={handleSelectProvider}
                        >
                          <option value="">Select a provider</option>
                          {providerList?.length > 0 ? (
                            providerList.map((item, index) => (
                              <option key={index} value={item.PROVIDER}>
                                {item.PROVIDER}
                              </option>
                            ))
                          ) : (
                            <option value="">Loading...</option>
                          )}
                        </select>
                      </div>

                      <div className="mt-2 pb-2 flex flex-col">
                        <label>Query name </label>
                        <select
                          id="selectedTemp"
                          required
                          name="Query_Name"
                          value={formData["Query_Name"]}
                          className="block w-full rounded-md border-0 py-1.5 text-electric-green  bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                          onChange={handleSelectedTemp}
                        >
                          <option value="">Select a template</option>
                          {templateList?.length > 0 ? (
                            templateList.map((item, index) => (
                              <option key={index} value={item.TEMPLATE_NAME}>
                                {item.TEMPLATE_NAME}
                              </option>
                            ))
                          ) : (
                            <option value="">Loading...</option>
                          )}
                        </select>
                      </div>

                      <div className="mt-2 pb-2 flex flex-col">
                        <SelectDropdown
                          title="Columns"
                          mode="multiple"
                          name="Column_Names"
                          value={formData?.Column_Names}
                          placeholder="Select columns"
                          data={columns}
                          setValue={(e, value) => {
                            handleChange(e, value);
                          }}
                        />
                      </div>

                      <div className="my-2">
                        {columnError !== "" && (
                          <Alert className="text-red-600" severity="error">
                            {columnError}
                          </Alert>
                        )}
                      </div>
                      <div className="mt-2 pb-21 flex flex-col">
                        <label>Identifier type</label>
                        <select
                          name="Attribute_Value"
                          onChange={handleCustomerFormData}
                          required
                          value={formData["Attribute_Value"]}
                          className="block w-full rounded-md border-0 py-1.5 text-electric-green  bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                        >
                          <option value="">Please select</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="MAID">MAID</option>
                        </select>
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
                    </div>
                  </form>
                </div>
              </SwipeableDrawer>
            )}
          </React.Fragment>
        ))}
      </div>

      <img
        className="absolute  w-1/4 -z-50 bottom-0 opacity-40 right-0 text-amarant-400 "
        src={enrichment}
        alt=""
      />

      {!loadingTable ? (
        <div className="flex flex-col w-full">
          <h2 className="text-lg font-medium mb-2 text-deep-navy">
            Recent queries
          </h2>
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
                      borderLeft: 1,
                      borderColor: "#d6d3d1",
                    },
                    "& th:first-of-type": {
                      borderLeft: 1,
                      borderColor: "#d6d3d1",
                    },
                    "& th:last-child": {
                      borderRight: 1,
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
                    Provider Name
                  </TableCell>
                  <TableCell key={4} align="center">
                    Column names
                  </TableCell>
                  <TableCell key={5} align="center">
                    Identifier Type
                  </TableCell>
                  <TableCell key={6} align="center">
                    Match count
                  </TableCell>
                  <TableCell key={7} align="center">
                    Actions
                  </TableCell>
                  <TableCell key={8} align="center">
                    Requested
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
                      <TableCell align="center">{row.PROVIDER_NAME}</TableCell>
                      <TableCell align="center">{row.COLOUMNS}</TableCell>
                      <TableCell align="center">
                        {row.IDENTIFIER_TYPE}
                      </TableCell>
                      <TableCell align="center">{row.MATCH_COUNT}</TableCell>
                      <TableCell align="center">
                        {row.STATUS.toLowerCase() === "failed" ||
                        row.STATUS.toLowerCase() === "false" ? (
                          <div className="flex justify-center">
                            <button
                              onClick={() =>
                                setRequestFailedReason({
                                  ...requestFailedReason,
                                  openModal: true,
                                  message: row.ERROR,
                                })
                              }
                              className="flex flex-row items-center px-2 justify-center text-red-600"
                              title="Request Error"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5 text-red-600"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                />
                              </svg>
                              <span className="pl-2 underline">Error</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between">
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
                            <button
                              onClick={() =>
                                downloadFile(row.TEMPLATE_NAME, row.RUN_ID)
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
                                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                />
                              </svg>
                              <span className="pl-2 underline">Download</span>
                            </button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {handleDate(row.RUN_ID)}
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
        pagination={true}
        open={viewActionModal}
        handleClose={() => {
          setViewActionModal(false);
          dispatch(
            actions.ConsumerQueryForm({
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

export default Enrichment;
