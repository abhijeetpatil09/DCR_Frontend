import React, { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";

const OutputTable = ({ id, head, rows }) => {
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
    <Paper elevation={0}  className="w-full flex flex-col flex-grow">
      <div className="flex flex-row justify-between my-2">
        <h3 className="text-xl font-light text-deep-navy">Query result</h3>
        <span className="text-deep-navy">Output Console: Request Id - <strong>{id}</strong></span>
      </div>
      {/* <h4  >
        <p>Output Console: Request Id - &nbsp;</p>
        <p style={{ color: 'red'}}></p>
      </h4> */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} classes={{root:"w-100"}} aria-label="simple table">
          <TableHead>
            <TableRow>
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
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((item, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      {item &&
                        item.map((row, idx) => {
                          return (
                            <TableCell
                              key={idx}
                              align="center"
                            >
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
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={rows?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
export default OutputTable;
