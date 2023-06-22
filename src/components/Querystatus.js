import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";

import { handleDate } from "../utils/commonFunctions";
import "./styles.css";
import "./pure-react.css";

const QueryStatus = () => {
  const state = useSelector((state) => state);
  const user = state && state.user;

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query: "select * from DCR_SAMP_CONSUMER1.PUBLIC.DASHBOARD_TABLE order by RUN_ID desc;",
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
    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        responseType: "arraybuffer",
        params: {
          query: `select * from DCR_SAMP_CONSUMER1.PUBLIC.${TEMPLATE_NAME}_${RUN_ID};`,
        },
      })
      .then((response) => {
        // Convert the response data to a CSV format
        const csvData = new Blob([response.data], {
          type: "text/csv;charset=utf-8;",
        });
        const csvUrl = URL.createObjectURL(csvData);

        const link = document.createElement("a");
        link.setAttribute("href", csvUrl);
        link.setAttribute("download", `${TEMPLATE_NAME}_${RUN_ID}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  return (
    <div className="w-full">
      <h3 className="my-4 text-xl font-bold bg-white text-deep-navy">
        Query Status
      </h3>

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
                "& th:first-child": { borderLeft: 1, borderColor: "#d6d3d1" },
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
                Last modified Date & Time
              </TableCell>
              <TableCell key={6} align="center">
                Download O/P file
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "& td:last-child": {
                          borderRight: 1,
                          borderColor: "#d6d3d1",
                        },
                        "& td": { borderLeft: 1, borderColor: "#d6d3d1", color: "#0A2756", },
                      }}
                    >
                      <TableCell align="center">{row.RUN_ID}</TableCell>
                      <TableCell align="center">{row.TEMPLATE_NAME}</TableCell>
                      <TableCell align="center">{row.PROVIDER_NAME}</TableCell>
                      <TableCell align="center">{row.COLOUMNS}</TableCell>
                      <TableCell align="center">
                        <span
                          className={`${
                            row.STATUS === "true"
                              ? "bg-green-300 text-deep-navy"
                              : "bg-amaranth-300 text-deep-navy"
                          }   py-1 px-3 rounded-full text-xs`}
                        >
                          {row.STATUS === "true"
                            ? "Approved"
                            : row.STATUS === "false"
                            ? "Rejected"
                            : "In Progress"}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        {handleDate(row.RUN_ID)}
                      </TableCell>
                      <TableCell align="center">
                        <button
                          onClick={() =>
                            downloadFile(row.TEMPLATE_NAME, row.RUN_ID)
                          }
                          className={`flex flex-row items-center justify-center ${
                            row.STATUS === "true" ? "text-deep-navy" : 'text-amaranth-300'
                          }`}
                          disabled={row.STATUS === "false"}
                        >
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
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                            />
                          </svg>
                          <span className="pl-2 underline">Download</span>
                        </button>
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
  );
};

export default QueryStatus;
