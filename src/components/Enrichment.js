import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
import axios from "axios";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";

import * as actions from "../redux/actions/index";
import SelectDropdown from "./CommonComponent/SelectDropdown";

import {
  Alert,
  SwipeableDrawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import CommonTable from "./CommonComponent/Table";

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

import { handleDate } from "../utils/commonFunctions";

import "./styles.css";
import "./pure-react.css";

const s3 = new AWS.S3({
  accessKeyId: "AKIA57AGVWXYVR36XIEC",
  secretAccessKey: "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",
  // signatureVersion: 'v4',
  region: "ap-south-1",
  // region: 'ap-south-1',
});

const Enrichment = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const user = state && state.user;
  const TableData = state && state.ConsumerForm && state.ConsumerForm.TableData;
  const requestId = state && state.ConsumerForm && state.ConsumerForm.RequestId;
  const fetchData = state && state.ConsumerForm && state.ConsumerForm.fetchData;

  const [formData, setFormData] = useState({
    Query_Name: "",
    Provider_Name: "",
    Column_Names: [],
    Consumer_Name: user?.Consumer,
    Attribute_Value: "",
  });

  const [tableHead, setTableHead] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  const [providerList, setProviderList] = useState([]);
  const [templateList, setTemplateList] = useState("");
  const [databaseName, setDatabaseName] = useState("");
  const [columns, setColumns] = useState([]);
  const [byPassAPICalled, setByPassAPICalled] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [toggleDrawerPosition, setToggleDrawerPosition] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
    search: false,
  });

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

  useEffect(() => {
    if (TableData) {
      setTableHead(TableData?.head || []);
      setTableRows(TableData?.rows || []);
    }
  }, [TableData]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query:
            "select * from DCR_SAMP_CONSUMER1.PUBLIC.DASHBOARD_TABLE where TEMPLATE_NAME = 'CUSTOMER ENRICHMENT' order by RUN_ID desc limit 5;",
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          let res = response?.data?.data;
          setTableData(res);
        } else {
          setTableData([]);
        }
      })
      .catch((error) => console.log(error));
  }, [user?.name]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query: "select provider from DCR_SAMP_CONSUMER1.PUBLIC.PROV_DETAILS;",
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
    if (databaseName !== "") {
      axios
        .get(`http://127.0.0.1:5000/${user?.name}`, {
          params: {
            query: `select template_name from ${databaseName}.CLEANROOM.TEMPLATES where template_name <> 'advertiser_match';`,
          },
        })
        .then((response) => {
          if (response?.data) {
            console.log("Template list", response?.data);
            setTemplateList(response.data.data);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [databaseName, user?.name]);

  useEffect(() => {
    if (databaseName !== "" && formData["Query_Name"] !== "") {
      axios
        .get(`http://127.0.0.1:5000/${user?.name}`, {
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

            let temp = [];
            temp.push({ value: "all", name: "All" });
            col_name?.map((value) => {
              return temp.push({ value: value, name: value });
            });
            setColumns(temp);
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
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query: `select database from DCR_SAMP_CONSUMER1.PUBLIC.PROV_DETAILS where provider = '${selectedProvider}';`,
        },
      })
      .then((response) => {
        if (response?.data) {
          let db_name = response?.data?.data;
          setDatabaseName(db_name[0]?.DATABASE);
        } else {
          setDatabaseName("");
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
              actions.ConsumerQueryForm({
                fetchData: false,
              })
            );
          }
        })
        .catch((error) => {
          console.log(error);
          setByPassAPICalled(false);
          dispatch(
            actions.ConsumerQueryForm({
              fetchData: false,
            })
          );
        });
    }, 5000);
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
        console.log("err", err);
      } else {
        console.log("data", data);
      }
    });

    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query: `insert into DCR_SAMP_CONSUMER1.PUBLIC.dcr_query_request1(template_name,provider_name,columns,consumer_name,run_id, attribute_value) values ('${formData.Query_Name}', '${formData.Provider_Name}','${formData.Column_Names}','${formData.Consumer_Name}','${formData.RunId}', '${formData.Attribute_Value}');`,
        },
      })
      .then((response) => {
        if (response) {
          dispatch(
            actions.ConsumerQueryForm({
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
      actions.ConsumerQueryForm({
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
          fetchTable(response?.data?.data, formData?.RunId);
          toast.success(
            `Data fetched successfully. Request Id: ${formData?.RunId}`
          );
        }
      })
      .catch((error) => {
        console.log("In API catch", error);
      });
  };

  return (
    <div className="flex flex-col w-full px-4">
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
                        className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
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
                        className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
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

                    <div className="mt-2 pb-21 flex flex-col">
                      <label>Identifier type</label>
                      <select
                        name="Attribute_Value"
                        onChange={handleCustomerFormData}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                      >
                        <option value="">Please select</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="MAID">MAID</option>
                      </select>
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
        className="absolute  w-2/5 -z-50 bottom-1 opacity-20 -right-20  text-amarant-400"
        src={enrichment}
        alt=""
      />

      <div className="flex flex-col w-full px-5">
        <h1 className=" mt-4 text-xl font-regular text-deep-navy pb-2 ">
          Recent Requests
        </h1>
        <TableContainer>
          <Table
            sx={{ minWidth: 650, borderRadius: 0 }}
            stickyHeader
            size="small"
            classes={{ root: "w-100" }}
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
                <TableCell key={0} align="center"></TableCell>
                <TableCell key={1} align="center">
                  Status
                </TableCell>
                <TableCell key={2} align="center">
                  Request ID
                </TableCell>
                <TableCell key={3} align="center">
                  Column names
                </TableCell>
                <TableCell key={4} align="center">
                  Identifier Type
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
                      <span className="relative flex h-3 w-3 mr-2">
                        {row.STATUS.toLowerCase() === "completed" ||
                        row.STATUS.toLowerCase() === "true" ? (
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                        ) : row.STATUS.toLowerCase() === "false" ||
                          row.STATUS.toLowerCase() === "failed" ? (
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-400"></span>
                        ) : (
                          <>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-downriver-400"></span>
                          </>
                        )}
                      </span>
                    </TableCell>
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
                          : row.STATUS.toLowerCase() === "waiting for approval"
                          ? WaitingStatus(row.STATUS)
                          : OtherStatus(row.STATUS)}
                      </span>
                    </TableCell>
                    <TableCell align="center">{row.RUN_ID}</TableCell>
                    <TableCell align="center">{row.COLOUMNS}</TableCell>
                    <TableCell align="center">{row.IDENTIFIER_TYPE}</TableCell>
                    <TableCell align="center">{row.MATCH_COUNT}</TableCell>
                    <TableCell align="center">
                      {handleDate(row.RUN_ID)}
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex justify-between">
                        {row.STATUS.toLowerCase() === "failed" ||
                        row.STATUS.toLowerCase() === "false" ? (
                          <button
                            // onClick={() =>
                            //   setRequestFailedReason({
                            //     ...requestFailedReason,
                            //     openModal: true,
                            //     message: item.ERROR,
                            //   })
                            // }
                            className="opacity-1 px-2 hover:text-inherit"
                            title="Request Error"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-5 h-5 text-red-600"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                              />
                            </svg>
                          </button>
                        ) : (
                          <button
                            // onClick={() =>
                            //   fetchcsvTableData(row.TEMPLATE_NAME, row.RUN_ID)
                            // }
                            disabled={row.STATUS.toLowerCase() !== "completed"}
                            className={`${
                              row.STATUS.toLowerCase() === "completed"
                                ? "opacity-1 hover:text-inherit"
                                : "disabled opacity-10 hover:text-inherit"
                            }  px-2 hover:text-amaranth-600`}
                            title="View"
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
                          </button>
                        )}
                        <button
                          // onClick={() =>
                          //   downloadFile(row.TEMPLATE_NAME, row.RUN_ID)
                          // }
                          disabled={row.STATUS.toLowerCase() !== "completed"}
                          className={`${
                            row.STATUS.toLowerCase() === "completed"
                              ? "opacity-1 hover:text-inherit"
                              : "disabled opacity-10 hover:text-inherit"
                          }  px-2 hover:text-amaranth-600`}
                          title="Download file"
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
                              d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="flex flex-row  gap-3  w-full">
        {!fetchData ? (
          <div className=" flex flex-grow">
            {tableHead?.length > 0 && tableRows?.length > 0 ? (
              <CommonTable id={requestId} head={tableHead} rows={tableRows} />
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

export default Enrichment;
