import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";

import {
  CircularProgress,
  SwipeableDrawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";

import searchillustration from "../Assets/search_illustration.svg";
import {
  jsonToCsv,
  handleDate,
  downloadFileInCSV,
  removeDuplicateObjects,
} from "../utils/commonFunctions";
import CustomTable from "./CommonComponent/Table";
import CommonModal from "./CommonComponent/Modal";

import {
  ApprovedStatus,
  CompletedStatus,
  RejectedStatus,
  FailedStatus,
  WaitingStatus,
  OtherStatus,
} from "./CommonComponent/StatusColumn";

import SelectDropdown from "./CommonComponent/SelectDropdown";
import "react-datepicker/dist/react-datepicker.css";

import "./styles.css";
import "./pure-react.css";

const QueryStatus = () => {
  const state = useSelector((state) => state);
  const user = state && state.user;

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loader, setLoader] = useState(false);

  const [viewTable, setViewTable] = useState({
    head: [],
    rows: [],
    runId: "",
  });

  const [filteredList, setFilteredList] = useState({
    providersList: [],
    templatesList: [],
    statusList: [],
  });

  const [filteredData, setFilteredData] = useState({
    providerName: [],
    templateName: [],
    status: [],
    date: "",
  });

  const [viewTemplate, setViewTemplate] = React.useState({
    openModal: false,
    queryName: "",
  });

  const handleResultModalClose = () =>
    setViewTemplate({
      ...viewTemplate,
      openModal: false,
      queryName: "",
    });

  const [requestFailedReason, setRequestFailedReason] = React.useState({
    openModal: false,
    message: "",
  });

  const [toggleDrawerPosition, setToggleDrawerPosition] = React.useState({
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
    setLoader(true);
    fetchMainTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMainTable = () => {
    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query:
            "select * from DCR_SAMP_CONSUMER1.PUBLIC.DASHBOARD_TABLE order by RUN_ID desc;",
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          setLoader(false);
          let data = response?.data?.data;
          setData(data);

          let providerList = [{ value: "all", name: "All" }];
          let templateList = [{ value: "all", name: "All" }];
          let statuses = [{ value: "all", name: "All" }];

          data?.map((value) => {
            providerList.push({
              value: value.PROVIDER_NAME,
              name: value.PROVIDER_NAME,
            });
            templateList.push({
              value: value.TEMPLATE_NAME,
              name: value.TEMPLATE_NAME,
            });
            statuses.push({
              value: value.STATUS,
              name: value.STATUS,
            });
            return null;
          });
          setFilteredList({
            ...filteredList,
            providersList: removeDuplicateObjects(providerList),
            templatesList: removeDuplicateObjects(templateList),
            statusList: removeDuplicateObjects(statuses),
          });
        }
      })
      .catch((error) => console.log(error));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (event, name) => {
    if (event?.includes("all")) {
      setFilteredData({
        ...filteredData,
        [name]: ["all"],
      });
    } else {
      setFilteredData({
        ...filteredData,
        [name]: event,
      });
    }
  };

  const downloadFile = (TEMPLATE_NAME, RUN_ID) => {
    TEMPLATE_NAME = TEMPLATE_NAME.replace(/\s/g, "_");
    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
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
          console.log("File cannnot be downloaded...");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fetchcsvTableData = async (templateName, runId) => {
    templateName = templateName.replace(/\s/g, "_");
    setViewTemplate({
      ...viewTemplate,
      openModal: true,
      queryName: templateName,
    });
    setViewTable({ head: [], rows: [], runId: "" });
    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
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
          setViewTable({ head: head, rows: row, runId: runId });
        }
      })
      .catch((error) => {
        console.log("In API catch", error);
      });
  };

  const handleFilter = (anchor) => {
    setLoader(true);

    setToggleDrawerPosition({ ...toggleDrawerPosition, [anchor]: false });
    setData([]);
    setPage(0);
    const finalProviderList =
      filteredData?.providerNam?.length > 0
        ? filteredData?.providerName
            ?.map((item, index) =>
              item !== "all"
                ? "PROVIDER_NAME = '" +
                  item +
                  (index !== filteredData?.providerName?.length - 1
                    ? "' or "
                    : "'")
                : ""
            )
            .join("")
        : "";

    const finalTemplateList =
      filteredData?.templateName?.length > 0
        ? filteredData?.templateName
            ?.map((item, index) =>
              item !== "all"
                ? "TEMPLATE_NAME = '" +
                  item +
                  (index !== filteredData?.templateName?.length - 1
                    ? "' or "
                    : "'")
                : ""
            )
            .join("")
        : "";

    const finalStatus =
      filteredData?.status?.length > 0
        ? filteredData?.status
            ?.map((item, index) =>
              item !== "all"
                ? "STATUS = '" +
                  item +
                  (index !== filteredData?.status?.length - 1 ? "' or " : "'")
                : ""
            )
            .join("")
        : "";

    let finalDate = "";
    console.log("filteredData?.date", filteredData?.date);
    if (filteredData?.date) {
      const dateObj = new Date(parseInt((filteredData?.date).getTime()));
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate().toString().padStart(2, "0");
      finalDate = "REQUEST_TS = '" + year + "-" + month + "-" + day + "'";
    }
    console.log("finalDate", finalDate);

    let finalResult =
      (finalProviderList !== "" ? "(" + finalProviderList + ")" : "") +
      (finalTemplateList !== ""
        ? (finalProviderList !== "" ? " and " : "") +
          "(" +
          finalTemplateList +
          ")"
        : "") +
      (finalStatus !== ""
        ? (finalProviderList !== "" || finalTemplateList !== ""
            ? " and "
            : "") +
          "(" +
          finalStatus +
          ")"
        : "") +
      (finalDate !== ""
        ? (finalStatus !== "" ||
          finalProviderList !== "" ||
          finalTemplateList !== ""
            ? " and "
            : "") +
          "(" +
          finalDate +
          ")"
        : "");

    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query: `select * from DCR_SAMP_CONSUMER1.PUBLIC.DASHBOARD_TABLE ${
            finalResult !== "" ? `where ${finalResult}` : ""
          } order by RUN_ID desc;`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          setLoader(false);
          let data = response?.data?.data;
          setData(data);
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
            Query status
          </h3>
          <p>All your queries in one place. You can filter historic queries.</p>
        </div>
        {["right"].map((anchor) => (
          <React.Fragment key={anchor}>
            <button
              className="my-2 flex items-center justify-center rounded-md bg-deep-navy px-4 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-electric-green hover:text-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"
              onClick={toggleDrawer(anchor, true)}
            >
              <svg
                className="w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                />
              </svg>
              Filter
            </button>
            <SwipeableDrawer
              anchor={anchor}
              open={toggleDrawerPosition[anchor]}
              onClose={toggleDrawer(anchor, false)}
              onOpen={toggleDrawer(anchor, true)}
            >
              <div className="flex flex-col flex-shrink w-full h-full px-4 bg-deep-navy text-electric-green">
                <img
                  className="absolute w-80  bottom-0 opacity-90 z-0 right-0 text-amarant-400"
                  src={searchillustration}
                  alt=""
                />
                <div
                  className=" border-0 border-gray-400  mt-2 px-4 py-2 h-auto w-96 z-10  bg-deep-navy/50"
                  name="myForm"
                >
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-semibold">Query filter</h3>
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
                  <div className="mt-4 pb-2 flex flex-col gap-3">
                    <div className="w-full">
                      <SelectDropdown
                        title="Select Provider"
                        mode="multiple"
                        name="providerName"
                        placeholder="Please select"
                        value={filteredData?.providerName}
                        data={filteredList.providersList}
                        setValue={(e, value) => {
                          handleChange(e, value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 pb-2 flex flex-col gap-3">
                    <div className="w-full">
                      <SelectDropdown
                        title="Select Template"
                        mode="multiple"
                        name="templateName"
                        placeholder="Please select"
                        value={filteredData?.templateName}
                        data={filteredList.templatesList}
                        setValue={(e, value) => {
                          handleChange(e, value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 pb-2 flex flex-col gap-3">
                    <div className="w-full">
                      <SelectDropdown
                        title="Select Status"
                        mode="multiple"
                        name="status"
                        placeholder="Please select"
                        value={filteredData?.status}
                        data={filteredList.statusList}
                        setValue={(e, value) => {
                          handleChange(e, value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 pb-2 flex flex-col gap-1">
                    <label className="ml-1 montserrat">Select Date</label>
                    <div className="w-full">
                      <DatePicker
                        showIcon
                        selected={filteredData?.date}
                        onChange={(date) =>
                          setFilteredData({ ...filteredData, date: date })
                        }
                        isClearable
                        className="rounded-md pl-8 bg-transparent border border-electric-green"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="flex w-full justify-center rounded-md bg-electric-green px-3 py-1.5 text-sm font-semibold leading-6 text-deep-navy shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green mt-4"
                      type="submit"
                      onClick={() => handleFilter(anchor)}
                    >
                      Filter
                    </button>
                  </div>
                </div>
              </div>
            </SwipeableDrawer>
          </React.Fragment>
        ))}
      </div>
      {!loader ? (
        <div>
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
                  <TableCell key={0} align="center">
                    Request ID
                  </TableCell>
                  <TableCell key={1} align="center">
                    Template Name
                  </TableCell>
                  <TableCell key={2} align="center">
                    Provider Name
                  </TableCell>
                  <TableCell key={3} align="center">
                    Column Names
                  </TableCell>
                  <TableCell key={4} align="center">
                    Status
                  </TableCell>
                  <TableCell key={5} align="center">
                    Requested
                  </TableCell>
                  <TableCell key={6} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              {data && data?.length > 0 ? (
                <TableBody>
                  {data
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    ?.map((row, index) => {
                      return (
                        <TableRow
                          key={index}
                          sx={{
                            "& td": {
                              borderLeft: 1,
                              borderColor: "#d6d3d1",
                              color: "#0A2756",
                            },
                            "& td:last-child": {
                              borderRight: 1,
                              borderColor: "#d6d3d1",
                            },
                          }}
                        >
                          <TableCell align="center">{row.RUN_ID}</TableCell>
                          <TableCell align="center">
                            {row.TEMPLATE_NAME}
                          </TableCell>
                          <TableCell align="center">
                            {row.PROVIDER_NAME}
                          </TableCell>
                          <TableCell align="center">{row.COLOUMNS}</TableCell>
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
                                    className="w-5 h-5 text-red-600"
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
                              <div
                                className={`flex ${
                                  row.TEMPLATE_NAME === "CUSTOMER ENRICHMENT" ||
                                  row.TEMPLATE_NAME === "customer_enrichment"
                                    ? "justify-between"
                                    : "justify-center"
                                } `}
                              >
                                <button
                                  onClick={() =>
                                    fetchcsvTableData(
                                      row.TEMPLATE_NAME,
                                      row.RUN_ID
                                    )
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
                                {(row.TEMPLATE_NAME === "CUSTOMER ENRICHMENT" ||
                                  row.TEMPLATE_NAME ===
                                    "customer_enrichment") && (
                                  <button
                                    onClick={() =>
                                      downloadFile(
                                        row.TEMPLATE_NAME,
                                        row.RUN_ID
                                      )
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
                                    <span className="pl-2 underline">
                                      Download
                                    </span>
                                  </button>
                                )}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              ) : (
                <TableRow className="text-deep-navy">
                  <TableCell
                    className="text-center border border-downriver-200"
                    colSpan={7}
                  >
                    Currently We don't have data display!!
                  </TableCell>
                </TableRow>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={data?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      ) : (
        <div className="flex justify-center mt-8">
          <CircularProgress
            style={{
              width: "60px",
              height: "60px",
              color: "#0A2756",
            }}
            thickness={5}
          />
        </div>
      )}

      <CustomTable
        id={viewTable.runId}
        head={viewTable.head}
        rows={viewTable.rows}
        pagination={
          viewTemplate.queryName === "ADVERTISER_MATCH" ? "none" : true
        }
        open={viewTemplate.openModal}
        handleClose={handleResultModalClose}
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

export default QueryStatus;
