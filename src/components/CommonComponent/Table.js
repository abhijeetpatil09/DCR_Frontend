import React, { useState } from "react";

import {
  Box,
  CircularProgress,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from "@mui/material";

const resultstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxHeight: "90%",
  bgcolor: "background.paper",
};

const OutputTable = ({
  id,
  head,
  rows,
  pagination,
  open,
  handleClose,
  title,
  overflow,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={resultstyle}
        className={`${overflow ? "overflow-hidden" : "overflow-scroll"}`}
      >
        <div className=" flex flex-col flex-grow w-full">
          <div className="flex flex-row items-center justify-between sticky z-30 py-2 px-4 top-0 w-full bg-deep-navy text-white">
            <h3 className="font-bold text-white">{title}</h3>
            <button onClick={handleClose}>
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
            {head.length > 0 && rows.length > 0 ? (
              <Paper elevation={0} className="w-full flex flex-col flex-grow">
                {id && id !== "" ? (
                  <div className="flex flex-row justify-between px-1 py-3">
                    <span className="text-deep-navy">
                      Output Console: Request Id - <strong>{id}</strong>
                    </span>
                  </div>
                ) : (
                  <span className="text-deep-navy px-1 py-3"></span>
                )}

                <TableContainer className={`${overflow ? "pb-4" : ""}`}>
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
                        {head?.map((column, index) => {
                          return (
                            <TableCell key={index} align="center">
                              {column}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows &&
                        rows
                          ?.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          ?.map((item, index) => {
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
                                {item &&
                                  item.map((row, idx) => {
                                    return (
                                      <TableCell key={idx} align="center">
                                        {row}
                                      </TableCell>
                                    );
                                  })}
                              </TableRow>
                            );
                          })}
                    </TableBody>
                  </Table>
                </TableContainer>
                {pagination !== "none" ? (
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={rows?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                ) : null}
              </Paper>
            ) : (
              <div className="py-8">
                <div className="text-center">
                  <CircularProgress
                    style={{
                      width: "48px",
                      height: "48px",
                      color: "#0A2756",
                    }}
                    thickness={5}
                  />
                </div>
                <div className="text-center pt-4">
                  <span className="text-red-600 text-sm font-bold">
                    We are fetching the data. Please wait !!!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};
export default OutputTable;
