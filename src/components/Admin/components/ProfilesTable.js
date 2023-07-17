import React, { useEffect, useState } from "react";
import axios from "axios";
import Switch from "@mui/material/Switch";
import { Box, CircularProgress, Modal } from "@mui/material";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const ProfileTable = ({ user, UserRole }) => {
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
    } else {
      axios
        .get(`http://127.0.0.1:5000/${user?.name}`, {
          params: {
            query:
              "select * from DCR_SAMP_PROVIDER_DB.DATAEX.CONSUMER_ATTRIBUTES_VW order by provider desc;",
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

  const handleConsumerRole = (status, userName) => {
    setLoading(true);
    setDisableTemplate(!disableTemplate);
    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query: `update DCR_SAMP_PROVIDER_DB.SHARED_SCHEMA.CONSUMER_ATTRIBUTES set CONSUMER = '${status}' where user= '${userName}';`,
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

  const handlePublisherRole = (status, userName) => {
    setLoading(true);
    setDisableTemplate(!disableTemplate);
    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query: `update DCR_SAMP_PROVIDER_DB.SHARED_SCHEMA.CONSUMER_ATTRIBUTES set PUBLISHER = '${status}' where user= '${userName}';`,
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

  const handleAdminRole = (status, userName) => {
    setLoading(true);
    setDisableTemplate(!disableTemplate);
    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query: `update DCR_SAMP_PROVIDER_DB.SHARED_SCHEMA.CONSUMER_ATTRIBUTES set ADMIN = '${status}' where user= '${userName}';`,
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
    <div className="p-4 w-11/12">
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
              <TableCell
                className="bg-table-head text-deep-navy"
                key={0}
                align="center"
              >
                User
              </TableCell>
              <TableCell
                className="bg-table-head text-deep-navy"
                key={1}
                align="center"
              >
                Consumer
              </TableCell>
              <TableCell
                className="bg-table-head text-deep-navy"
                key={1}
                align="center"
              >
                Publisher
              </TableCell>
              <TableCell
                className="bg-table-head text-deep-navy"
                key={1}
                align="center"
              >
                Provider
              </TableCell>
              <TableCell
                className="bg-table-head text-deep-navy"
                key={2}
                align="center"
              >
                Auth role
              </TableCell>
            </TableRow>
          </TableHead>
          {UserRole?.includes("Provider_Admin") ? (
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
                    <TableCell className="text-deep-navy" align="center">
                      {row.USER}
                    </TableCell>

                    <TableCell className="text-deep-navy " align="center">
                      {row.PROVIDER.toLowerCase() !== "true" ? (
                        <Switch
                          checked={row.CONSUMER.toLowerCase() === "true"}
                          onChange={() =>
                            handleConsumerRole(
                              row.CONSUMER.toLowerCase() === "true"
                                ? "FALSE"
                                : "TRUE",
                              row.USER
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

                    <TableCell className="text-deep-navy " align="center">
                      {row.PROVIDER.toLowerCase() !== "true" ? (
                        <Switch
                          checked={row.PUBLISHER.toLowerCase() === "true"}
                          onChange={() =>
                            handlePublisherRole(
                              row.PUBLISHER.toLowerCase() === "true"
                                ? "FALSE"
                                : "TRUE",
                              row.USER
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

                    <TableCell className="text-deep-navy" align="center">
                      {row.PROVIDER.toLowerCase() === "true" ? (
                        "PROVIDER"
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
                    <TableCell className="text-deep-navy" align="center">
                      {row.PROVIDER.toLowerCase() !== "true" ? (
                        <Switch
                          checked={row.ADMIN.toLowerCase() === "true"}
                          onChange={() =>
                            handleAdminRole(
                              row.ADMIN.toLowerCase() === "true"
                                ? "FALSE"
                                : "TRUE",
                              row.USER
                            )
                          }
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      ) : row.PROVIDER.toLowerCase() === "true" &&
                        row.ADMIN.toLowerCase() === "true" ? (
                        "ADMIN"
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
                      {/* {row.ADMIN.toLowerCase() === "true" ? "ADMIN"
                      : row.CONSUMER.toLowerCase() === "true" && row.ADMIN.toLowerCase() === "false" ? "CONSUMER" : "PROVIDER"} */}
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
                    <TableCell className="text-deep-navy" align="center">
                      {row.USER}
                    </TableCell>

                    <TableCell className="text-deep-navy " align="center">
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

                    <TableCell className="text-deep-navy " align="center">
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

                    <TableCell className="text-deep-navy" align="center">
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
                    <TableCell className="text-deep-navy" align="center">
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

export default ProfileTable;
