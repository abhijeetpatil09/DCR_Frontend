import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Spinner from "../../CommonComponent/Spinner";

const baseURL = process.env.REACT_APP_BASE_URL;
const redirectionUser = process.env.REACT_APP_REDIRECTION_URL;

const AdminConsoleIntegration = () => {
  const state = useSelector((state) => state);
  const navigate = useNavigate();

  const user = state && state.user;
  const UserRole = state && state.user && state.user.role;

  const [data, setData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);

  const fetchProfileTable = () => {
    axios
      .get(`${baseURL}/${redirectionUser}`, {
        params: {
          query: `select PROVIDER_NAME,CONSUMER_NAME,TEMPLATES from DATAEXCHANGEDB.DATACATALOG.CONSUMER_INTEGRATIONS;`,
        },
      })
      .then((response) => {
        if (response?.data) {
          setLoadingTable(false);
          setData(response?.data?.data);
        }
      })
      .catch((error) => {
        setLoadingTable(false);
        console.log(error);
      });
  };

  useEffect(() => {
    setLoadingTable(true);
    fetchProfileTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, UserRole]);

  return (
    <div className="p-4 w-11/12">
      <div className="flex flex-row justify-start items-center w-full m-4">
        <div
          className="text-xl font-bold text-deep-navy mr-4 cursor-pointer"
          onClick={() => navigate("/admin-console")}
        >
          <ArrowBackIcon />
        </div>
        <h1 className="text-xl font-bold text-deep-navy mr-2">Integrations</h1>
      </div>
      {!loadingTable ? <TableContainer className="mt-4">
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
              <TableCell
                className="bg-table-head text-deep-navy"
                key={1}
                align="center"
              >
                Provider Name
              </TableCell>
              <TableCell
                className="bg-table-head text-deep-navy"
                key={2}
                align="center"
              >
                Consumer Name
              </TableCell>
              <TableCell
                className="bg-table-head text-deep-navy"
                key={3}
                align="center"
              >
                Templates
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((row, index) => {
              return (
                <TableRow
                  className="border-gray-200 hover:bg-table-head"
                  key={index}
                  sx={{
                    "& td:last-child": {
                      borderRight: 1,
                      borderColor: "#d6d3d1",
                    },
                    "& td": { borderLeft: 1, borderColor: "#d6d3d1" },
                  }}
                >
                  <TableCell className="text-deep-navy " align="center">
                    {row.PROVIDER_NAME}
                  </TableCell>
                  <TableCell className="text-deep-navy " align="center">
                    {row.CONSUMER_NAME}
                  </TableCell>
                  <TableCell className="text-deep-navy " align="center">
                    {row.TEMPLATES}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer> :
       (
        <div className="flex justify-center mt-8">
          <Spinner />
        </div>
      )
}
    </div>
  );
};

export default AdminConsoleIntegration;
