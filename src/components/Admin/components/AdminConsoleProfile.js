import React, { useEffect, useState } from "react";
import axios from "axios";
import Switch from "@mui/material/Switch";
import { Box, CircularProgress, Modal } from "@mui/material";
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

const baseURL = process.env.REACT_APP_BASE_URL;
const redirectionUser = process.env.REACT_APP_REDIRECTION_URL;

const AdminConsoleProfile = () => {
  const state = useSelector((state) => state);
  const navigate = useNavigate();

  const user = state && state.user;
  const UserRole = state && state.user && state.user.role;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [disableTemplate, setDisableTemplate] = useState(false);
  const handleCloseDisableTemplate = () => {
    setDisableTemplate(!disableTemplate);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    p: 2,
    borderRadius: 5,
  };

  const fetchProfileTable = () => {
    if (UserRole?.includes("Consumer_Admin")) {
      axios
        .get(`${baseURL}/${redirectionUser}`, {
          params: {
            query:
              "select * from DATAEXCHANGEDB.DATACATALOG.CONSUMER_ATTRIBUTES order by admin desc;",
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
    } else {
      axios
        .get(`${baseURL}/${redirectionUser}`, {
          params: {
            query:
              "select * from DATAEXCHANGEDB.DATACATALOG.CONSUMER_ATTRIBUTES order by provider desc;",
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
    }
  };

  useEffect(() => {
    fetchProfileTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, UserRole]);

  const handleRole = (status, userName, role) => {
    setLoading(true);
    setDisableTemplate(!disableTemplate);
    axios
      .get(`${baseURL}/${redirectionUser}`, {
        params: {
          query: `update DATAEXCHANGEDB.DATACATALOG.CONSUMER_ATTRIBUTES set ${role} = '${status}' where user= '${userName}';`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          fetchProfileTable();
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log("In API catch", error);
      });
  };

  return (
    <div className="p-4 w-full">
      <div className="flex flex-row justify-start items-center w-full m-4">
        <div
          className="text-xl font-bold text-deep-navy mr-4 cursor-pointer"
          onClick={() => navigate("/admin-console")}
        >
          <ArrowBackIcon />
        </div>
        <h1 className="text-xl font-bold text-deep-navy mr-2">User Profiles</h1>
      </div>
      <TableContainer className="mt-4">
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
                User
              </TableCell>
              <TableCell key={1} align="center">
                Consumer
              </TableCell>
              <TableCell key={1} align="center">
                Publisher
              </TableCell>
              <TableCell key={1} align="center">
                Provider
              </TableCell>
              <TableCell key={2} align="center">
                Auth role
              </TableCell>
            </TableRow>
          </TableHead>
          {UserRole?.includes("DATAEXADMIN") ? (
            <TableBody>
              {data?.map((row, index) => {
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
                    <TableCell align="center">{row.USER}</TableCell>

                    <TableCell align="center">
                      {row.PROVIDER.toLowerCase() !== "true" ? (
                        <Switch
                          checked={row.CONSUMER.toLowerCase() === "true"}
                          onChange={() =>
                            handleRole(
                              row.CONSUMER.toLowerCase() === "true"
                                ? "FALSE"
                                : "TRUE",
                              row.USER,
                              "CONSUMER"
                            )
                          }
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      ) : (
                        <div className="flex justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M19.5 12h-15"
                            />
                          </svg>
                        </div>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      {row.PROVIDER.toLowerCase() !== "true" ? (
                        <Switch
                          checked={row.PUBLISHER.toLowerCase() === "true"}
                          onChange={() =>
                            handleRole(
                              row.PUBLISHER.toLowerCase() === "true"
                                ? "FALSE"
                                : "TRUE",
                              row.USER,
                              "PUBLISHER"
                            )
                          }
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      ) : (
                        <div className="flex justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M19.5 12h-15"
                            />
                          </svg>
                        </div>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      {row.CONSUMER.toLowerCase() !== "true" ||
                      row.CONSUMER.toLowerCase() !== "true" ? (
                        <Switch
                          checked={row.PROVIDER.toLowerCase() === "true"}
                          onChange={() =>
                            handleRole(
                              row.PROVIDER.toLowerCase() === "true"
                                ? "FALSE"
                                : "TRUE",
                              row.USER,
                              "PROVIDER"
                            )
                          }
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      ) : (
                        <div className="flex justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M19.5 12h-15"
                            />
                          </svg>
                        </div>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={row.ADMIN.toLowerCase() === "true"}
                        onChange={() =>
                          handleRole(
                            row.ADMIN.toLowerCase() === "true"
                              ? "FALSE"
                              : "TRUE",
                            row.USER,
                            "ADMIN"
                          )
                        }
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          ) : (
            <TableBody>
              {data?.map((row, index) => {
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
                    <TableCell align="center">{row.USER}</TableCell>

                    <TableCell align="center">
                      {row.CONSUMER.toLowerCase() === "true" ? (
                        <div className="flex justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      {row.PUBLISHER.toLowerCase() === "true" ? (
                        <div className="flex justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      {row.PROVIDER.toLowerCase() === "true" ? (
                        <div className="flex justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {row.ADMIN.toLowerCase() === "true" ? (
                        <div className="flex justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <Modal
        open={disableTemplate}
        onClose={handleCloseDisableTemplate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {loading ? (
          <Box sx={style}>
            <div className="flex flex-row items-center justify-between sticky z-30 py-2 px-4 top-0 w-full text-amaranth-600">
              <CircularProgress
                style={{
                  width: "24px",
                  height: "24px",
                  color: "amaranth-600",
                }}
              />
              <h3 className="font-bold text-amaranth-600 p-4">
                Wait we are changing the role....
              </h3>
              <button onClick={handleCloseDisableTemplate}>
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
          </Box>
        ) : (
          <Box sx={style}>
            <div className="flex flex-row items-center justify-between sticky z-30 py-2 px-4 top-0 w-full text-deep-navy">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <h3 className="font-bold text-deep-navy p-4">
                Role has been changed.
              </h3>
              <button onClick={handleCloseDisableTemplate}>
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
          </Box>
        )}
      </Modal>
    </div>
  );
};

export default AdminConsoleProfile;
