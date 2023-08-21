import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";

import {
  SwipeableDrawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import {
  handleDate,
  removeDuplicateObjects,
} from "../../../utils/commonFunctions";

import {
  ApprovedStatus,
  CompletedStatus,
  RejectedStatus,
  FailedStatus,
  WaitingStatus,
  OtherStatus,
} from "../../CommonComponent/StatusColumn";

import SelectDropdown from "../../CommonComponent/SelectDropdown";
import Spinner from "../../CommonComponent/Spinner";

import "react-datepicker/dist/react-datepicker.css";

import "../../styles.css";
import "../../pure-react.css";

const baseURL = process.env.REACT_APP_BASE_URL;

const initialFilters = {
  providerName: [],
  templateName: [],
  status: [],
  date: "",
};

const AdminConsoleLogsTable = () => {
  const state = useSelector((state) => state);
  const user = state && state.user;

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedColumn, setSortedColumn] = useState(null);
  const [resetFilter, setResetFilter] = useState(false);
  const [loader, setLoader] = useState(false);

  const [filteredList, setFilteredList] = useState({
    consumersList: [],
    providersList: [],
    templatesList: [],
    statusList: [],
  });

  const [filteredData, setFilteredData] = useState(initialFilters);

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

  const handleSort = (columnKey) => {
    if (sortedColumn === columnKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortedColumn(columnKey);
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortedColumn];
    const bValue = b[sortedColumn];

    if (!aValue || !bValue) return 0;

    if (sortOrder === "asc") {
      return String(aValue).localeCompare(String(bValue));
    } else {
      return String(bValue).localeCompare(String(aValue));
    }
  });

  const fetchMainTable = () => {
    axios
      .get(`${baseURL}/${user?.name}`, {
        params: {
          query:
            "select * from DATAEXCHANGEDB.DATACATALOG.LOG_TABLE order by RUN_ID desc;",
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          setLoader(false);
          let data = response?.data?.data;
          setData(data);

          let consumerList = [{ value: "all", name: "All" }];
          let providerList = [{ value: "all", name: "All" }];
          let templateList = [{ value: "all", name: "All" }];
          let statuses = [{ value: "all", name: "All" }];

          data?.map((value) => {
            consumerList.push({
              value: value.CONSUMER_NAME,
              name: value.CONSUMER_NAME,
            });
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
              name:
                value.STATUS.toLowerCase() === "false"
                  ? "Rejected"
                  : value.STATUS.toLowerCase() === "true"
                  ? "Approved"
                  : value.STATUS,
            });
            return null;
          });
          setFilteredList({
            ...filteredList,
            consumersList: removeDuplicateObjects(consumerList),
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

  const handleFilter = (anchor) => {
    setLoader(true);

    setToggleDrawerPosition({ ...toggleDrawerPosition, [anchor]: false });
    setData([]);
    setPage(0);
    const finalConsumerList =
      filteredData?.consumerName?.length > 0
        ? filteredData?.consumerName
            ?.map((item, index) =>
              item !== "all"
                ? "CONSUMER_NAME = '" +
                  item +
                  (index !== filteredData?.consumerName?.length - 1
                    ? "' or "
                    : "'")
                : ""
            )
            .join("")
        : "";

    const finalProviderList =
      filteredData?.providerName?.length > 0
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
    if (filteredData?.date) {
      const dateObj = new Date(parseInt((filteredData?.date).getTime()));
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate().toString().padStart(2, "0");
      finalDate = "REQUEST_TS = '" + year + "-" + month + "-" + day + "'";
    }
    let finalResult =
      (finalConsumerList !== "" ? "(" + finalConsumerList + ")" : "") +
      (finalProviderList !== ""
        ? (finalConsumerList !== "" ? " and " : "") +
          "(" +
          finalProviderList +
          ")"
        : "") +
      (finalTemplateList !== ""
        ? (finalConsumerList !== "" || finalProviderList !== ""
            ? " and "
            : "") +
          "(" +
          finalTemplateList +
          ")"
        : "") +
      (finalStatus !== ""
        ? (finalConsumerList !== "" ||
          finalProviderList !== "" ||
          finalTemplateList !== ""
            ? " and "
            : "") +
          "(" +
          finalStatus +
          ")"
        : "") +
      (finalDate !== ""
        ? (finalStatus !== "" ||
          finalConsumerList !== "" ||
          finalProviderList !== "" ||
          finalTemplateList !== ""
            ? " and "
            : "") +
          "(" +
          finalDate +
          ")"
        : "");

    axios
      .get(`${baseURL}/${user?.name}`, {
        params: {
          query: `select * from DATAEXCHANGEDB.DATACATALOG.LOG_TABLE ${
            finalResult !== "" ? `where ${finalResult}` : ""
          } order by RUN_ID desc;`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          setLoader(false);
          let data = response?.data?.data;
          setData(data);
          setResetFilter(true);
        }
      })
      .catch((error) => {
        console.log("In API catch", error);
      });
  };

  const handleResetFilter = () => {
    fetchMainTable();
    setLoader(true);
    setResetFilter(false);
    setFilteredData(initialFilters);
  };

  return (
    <div className="flex flex-col w-full px-4">
      <div className="flex flex-row justify-between items-center w-full mt-2 mb-4">
        <div>
          <h3 className="text-xl font-bold text-deep-navy mr-2">Logs</h3>
          <p>
            All your logs in one place. You can filter historic logs anytime.
          </p>
        </div>
        {["right"].map((anchor) => (
          <React.Fragment key={anchor}>
            <div className="flex">
              {resetFilter && (
                <button
                  className="my-2 mr-4 flex items-center justify-center rounded-md bg-deep-navy px-4 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-electric-green hover:text-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"
                  onClick={handleResetFilter}
                >
                  <RotateLeftIcon />
                  Reset Filter
                </button>
              )}
              <button
                className="my-2 flex items-center justify-center rounded-md bg-deep-navy px-4 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-electric-green hover:text-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"
                onClick={toggleDrawer(anchor, true)}
              >
                <FilterAltIcon />
                Filter
              </button>
            </div>
            {toggleDrawerPosition[anchor] && (
              <SwipeableDrawer
                anchor={anchor}
                open={toggleDrawerPosition[anchor]}
                onClose={toggleDrawer(anchor, false)}
                onOpen={toggleDrawer(anchor, true)}
              >
                <div className="flex flex-col flex-shrink w-full h-full px-4 bg-deep-navy text-electric-green">
                  {/* <img
                    className="absolute w-80  bottom-0 opacity-90 z-0 right-0 text-amarant-400"
                    src={Admin_Console_Logs_Image}
                    alt=""
                  /> */}
                  <div
                    className=" border-0 border-gray-400  mt-2 px-4 py-2 h-auto w-96 z-10  bg-deep-navy/50"
                    name="myForm"
                  >
                    <div className="flex flex-row justify-between">
                      <h3 className="text-xl font-semibold">Logs filter</h3>
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
                          title="Select Consumer"
                          mode="multiple"
                          name="consumerName"
                          placeholder="Please select"
                          value={filteredData?.consumerName}
                          data={filteredList.consumersList}
                          setValue={(e, value) => {
                            handleChange(e, value);
                          }}
                        />
                      </div>
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
                          placeholderText="Please select a date"
                          className="rounded-md pl-8 w-full bg-deep-navy ring-1  ring-electric-green placeholder:text-electric-green  focus:ring-2 focus:ring-inset focus:ring-electric-green  sm:text-sm sm:leading-6 text-electric-green"
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
            )}
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
                  <TableCell key={0} align="center">
                    <TableSortLabel
                      active={sortedColumn === "RUN_ID"}
                      direction={sortOrder}
                      onClick={() => handleSort("RUN_ID")}
                    >
                      Request ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key={2} align="center">
                    <TableSortLabel
                      active={sortedColumn === "CONSUMER_NAME"}
                      direction={sortOrder}
                      onClick={() => handleSort("CONSUMER_NAME")}
                    >
                      Consumer Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key={2} align="center">
                    <TableSortLabel
                      active={sortedColumn === "PROVIDER_NAME"}
                      direction={sortOrder}
                      onClick={() => handleSort("PROVIDER_NAME")}
                    >
                      Provider Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key={1} align="center">
                    <TableSortLabel
                      active={sortedColumn === "TEMPLATE_NAME"}
                      direction={sortOrder}
                      onClick={() => handleSort("TEMPLATE_NAME")}
                    >
                      Template Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key={1} align="center">
                    Consumer Record Count
                  </TableCell>
                  <TableCell key={4} align="center">
                    <TableSortLabel
                      active={sortedColumn === "STATUS"}
                      direction={sortOrder}
                      onClick={() => handleSort("STATUS")}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key={5} align="center">
                    <TableSortLabel
                      active={sortedColumn === "RUN_ID"}
                      direction={sortOrder}
                      onClick={() => handleSort("RUN_ID")}
                    >
                      Requested
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              {sortedData && sortedData?.length > 0 ? (
                <TableBody>
                  {sortedData
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
                            {row.CONSUMER_NAME}
                          </TableCell>
                          <TableCell align="center">
                            {row.PROVIDER_NAME}
                          </TableCell>
                          <TableCell align="center">
                            {row.TEMPLATE_NAME}
                          </TableCell>
                          <TableCell align="center">
                            {row.CONSUMER_RECORD_COUNT}
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
                                : row.STATUS.toLowerCase() ===
                                  "waiting for approval"
                                ? WaitingStatus(row.STATUS)
                                : OtherStatus(row.STATUS)}
                            </span>
                          </TableCell>
                          <TableCell align="center">
                            {handleDate(row.RUN_ID)}
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
                    NO DATA FOUND
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
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default AdminConsoleLogsTable;
