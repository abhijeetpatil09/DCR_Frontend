import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, CircularProgress, Modal, SwipeableDrawer } from "@mui/material";
import searchillustration from "../Assets/search_illustration.svg";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";

import {
  jsonToCsv,
  handleDate,
  downloadFileInCSV,
} from "../utils/commonFunctions";
import CustomTable from "./CommonComponent/Table";

import {
  ApprovedStatus,
  CompletedStatus,
  RejectedStatus,
  FailedStatus,
  WaitingStatus,
  OtherStatus,
} from "./CommonComponent/StatusColumn";

import SelectDropdown from "./CommonComponent/SelectDropdown";
import "./styles.css";
import "./pure-react.css";

const resultstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxHeight: "90%",
  bgcolor: "background.paper",
  overflow: "scroll",
};

const QueryStatus = () => {
  const state = useSelector((state) => state);
  const user = state && state.user;

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [viewTable, setViewTable] = useState({
    head: [],
    rows: [],
    runId: "",
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
    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query:
            "select * from DCR_SAMP_CONSUMER1.PUBLIC.DASHBOARD_TABLE order by RUN_ID desc;",
        },
      })
      .then((response) => setData(response.data.data))
      .catch((error) => console.log(error));
  }, [user?.name]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          setViewTemplate({
            ...viewTemplate,
            openModal: true,
            queryName: templateName,
          });
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
              className="my-2 flex items-center justify-center rounded-md bg-deep-navy px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-electric-green hover:text-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"
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
                  className="absolute  w-96  bottom-1 opacity-90 z-0 right-0 text-amarant-400"
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
                    <div className="w-full mt-2">
                      <SelectDropdown
                        title="Select category"
                        mode="multiple"
                        name="category"
                        placeholder="Please select"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="flex w-full justify-center rounded-md bg-electric-green px-3 py-1.5 text-sm font-semibold leading-6 text-deep-navy shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green mt-4"
                      type="submit"
                      // onClick={() => handleSubmit(anchor)}
                    >
                      Filter
                      {/* {loader ? (
                        <CircularProgress
                          style={{
                            width: "24px",
                            height: "24px",
                            color: "#FFFFFF",
                          }}
                        />
                      ) : (
                        "Filter"
                      )} */}
                    </button>
                  </div>
                </div>
              </div>
            </SwipeableDrawer>
          </React.Fragment>
        ))}
      </div>
      {data.length > 0 ? (
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
              <TableBody>
                {data &&
                  data
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    ?.map((row, index) => {
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
                            <div className="flex justify-center">
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
                                    downloadFile(row.TEMPLATE_NAME, row.RUN_ID)
                                  }
                                  className={`${
                                    row.STATUS.toLowerCase() === "completed"
                                      ? "text-deep-navy"
                                      : "text-downriver-400"
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
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
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

      <Modal
        open={viewTemplate.openModal}
        onClose={handleResultModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={resultstyle}>
          <div className=" flex flex-col flex-grow w-full">
            <div className="flex flex-row items-center justify-between sticky z-30 py-2 px-4 top-0 w-full bg-deep-navy text-white">
              <h3 className="font-bold text-white">Query result</h3>
              <button onClick={handleResultModalClose}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
            <div className="px-4">
              {viewTable.head?.length > 0 && viewTable.rows?.length > 0 ? (
                <CustomTable
                  id={viewTable.runId}
                  head={viewTable.head}
                  rows={viewTable.rows}
                  pagination={
                    viewTemplate.queryName === "ADVERTISER_MATCH"
                      ? "none"
                      : true
                  }
                />
              ) : null}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default QueryStatus;
