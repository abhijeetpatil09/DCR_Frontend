import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const ConsumerAdmin = () => {
  const state = useSelector((state) => state);
  const user = state && state.user;
  const UserRole = state && state.user && state.user.role;

  const [data, setData] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    const element = "Consumer_Admin";
    const index = UserRole?.indexOf(element);

    if (index !== -1) {
      const newArray = [
        ...UserRole.slice(0, index),
        ...UserRole.slice(index + 1),
      ];
      setRole(newArray?.join(", "));
    } else {
      setRole(UserRole?.join(", "));
    }

    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query: "select * from CONSUMER_ATTRIBUTES_VW order by admin desc;",
        },
      })
      .then((response) => {
        if (response?.data) {
          setData(response?.data?.data);
        } else {
          setData([]);
        }
      })
      .catch((error) => console.log(error));
  }, [user, UserRole]);

  console.log("data", data);
  return (
    <div className="flex flex-col w-full">
      <div className="flex h-12 sticky top-0 z-30 py-2 bg-amaranth-800 flex-row items-center justify-between w-full">
        <h3 className="px-5 text-lg font-light text-white">Consumer List</h3>
      </div>
      <TableContainer className="mt-6">
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
                  color: "#8c0f45",
                  backgroundColor: "#fff1f4",
                  borderRadius: 0,
                  borderTop: 1,
                  borderLeft: 1,
                  borderColor: "#d6d3d1",
                },
                "& th:first-of-type": { borderLeft: 1, borderColor: "#d6d3d1" },
              }}
            >
              <TableCell
                className="bg-amaranth-50 text-amaranth-900"
                key={0}
                align="center"
              >
                User
              </TableCell>
              <TableCell
                className="bg-amaranth-50 text-amaranth-900"
                key={1}
                align="center"
              >
                Role
              </TableCell>
              <TableCell
                className="bg-amaranth-50 text-amaranth-900"
                key={2}
                align="center"
              >
                Auth role
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, index) => {
              return (
                <TableRow
                  className="border-gray-200 hover:bg-amaranth-50"
                  key={index}
                  sx={{
                    "& td:last-child": {
                      borderRight: 1,
                      borderColor: "#d6d3d1",
                    },
                    "& td": { borderLeft: 1, borderColor: "#d6d3d1" },
                  }}
                >
                  <TableCell className="text-amaranth-900" align="center">
                    {row.USER}
                  </TableCell>
                  <TableCell className="text-amaranth-900" align="center">
                    {role}
                  </TableCell>
                  <TableCell className="text-amaranth-900" align="center">
                    {row.CONSUMER_ADMIN === "TRUE" ? "ADMIN" : "CONSUMER"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ConsumerAdmin;
