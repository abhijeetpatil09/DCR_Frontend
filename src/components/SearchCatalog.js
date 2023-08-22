import React, { useEffect, useState } from "react";
import CommonTable from "./CommonComponent/Table";
import axios from "axios";
import { useSelector } from "react-redux";

import { CircularProgress, SwipeableDrawer } from "@mui/material";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
} from "@mui/material";

import SelectDropdown from "./CommonComponent/SelectDropdown";
import searchillustration from "../Assets/search_illustration.svg";
import Spinner from "./CommonComponent/Spinner";
import IntegrationImage from "../Assets/integration.png";

const baseURL = process.env.REACT_APP_BASE_URL;
const redirectionUser = process.env.REACT_APP_REDIRECTION_URL;

const SearchCatalog = () => {
  const state = useSelector((state) => state);
  const user = state && state.user;

  const [consumerSorceTable, setConsumerSorceTable] = useState("");

  const [selectedValues, setSelectedValues] = useState({
    category: [],
    subCategory: [],
    provider: [],
  });
  const [loader, setLoader] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);

  const [data, setData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [providerList, setProviderList] = useState([]);
  const [viewTable, setViewTable] = useState({
    head: [],
    rows: [],
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedColumn, setSortedColumn] = useState(null);

  // result model
  const [isResultModalOpen, toggleResultModal] = React.useState(false);
  const handleResultModalClose = () => toggleResultModal(false);

  const [errors, setError] = useState({
    category: null,
    subCategory: null,
    provider: null,
  });

  const [toggleDrawerPosition, setToggleDrawerPosition] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
    search: false,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      .get(`${baseURL}/${redirectionUser}`, {
        params: {
          query: `select distinct * from DATAEXCHANGEDB.DATACATALOG.PROVIDER order by entity_name`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          let data = response?.data?.data;
          setData(data);
          setLoadingTable(false);
        } else {
          setLoadingTable(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoadingTable(false);
      });
  }, []);

  //useEffect for finding the Consumers Source Table...
  useEffect(() => {
    axios
      .get(`${baseURL}/${user?.name}`, {
        params: {
          query: `select SETTING_VALUE from DCR_SAMP_CONSUMER1.LOCAL.USER_SETTINGS where SETTING_NAME='consumer_table';`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          let data = response?.data?.data;
          setConsumerSorceTable(data[0]?.SETTING_VALUE);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (toggleDrawerPosition.right) {
      axios
        .get(`${baseURL}/${redirectionUser}`, {
          params: {
            query: `select distinct * from DATAEXCHANGEDB.DATACATALOG.CATEGORY_LIST`,
          },
        })
        .then((response) => {
          if (response?.data?.data) {
            const cat_list = [{ value: "all", name: "All" }];
            response?.data?.data?.forEach((obj) => {
              cat_list.push({ value: obj.CATEGORY, name: obj.CATEGORY });
            });
            setCategoryList(cat_list);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      axios
        .get(`${baseURL}/${redirectionUser}`, {
          params: {
            query: `SELECT distinct provider_name from DATAEXCHANGEDB.DATACATALOG.PROVIDER_VW;`,
          },
        })
        .then((response) => {
          if (response?.data?.data) {
            const prov_list = [{ value: "all", name: "All" }];
            response?.data?.data?.forEach((obj) => {
              prov_list.push({
                value: obj.PROVIDER_NAME,
                name: obj.PROVIDER_NAME,
              });
            });
            setProviderList(prov_list);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [toggleDrawerPosition.right]);

  useEffect(() => {
    if (selectedValues.category?.length > 0) {
      const finalCategory = selectedValues?.category
        ?.map((item, index) =>
          item !== "all"
            ? "Category = '" +
              item +
              (index !== selectedValues?.category?.length - 1 ? "' or " : "'")
            : ""
        )
        .join("");
      axios
        .get(`${baseURL}/${redirectionUser}`, {
          params: {
            query: `select * from DATAEXCHANGEDB.DATACATALOG.SUB_CATEGORY_LIST ${
              finalCategory !== "" ? `where (${finalCategory})` : ""
            };`,
          },
        })
        .then((response) => {
          if (response?.data?.data) {
            let data = response?.data?.data;
            if (data?.length > 0) {
              const sub_cat_list = [{ value: "all", name: "All" }];
              response?.data?.data?.forEach((obj) => {
                sub_cat_list.push({
                  value: obj.SUB_CATEGORY,
                  name: obj.SUB_CATEGORY,
                });
              });
              setSubCategoryList(sub_cat_list);
            } else {
              setSubCategoryList([]);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedValues.category]);

  const handleChange = (event, name) => {
    if (name === "category") {
      setError({ ...errors, category: null });
    } else if (name === "subCategory") {
      setError({ ...errors, subCategory: null });
    } else if (name === "provider") {
      setError({ ...errors, provider: null });
    }
    if (name === "category") {
      setSelectedValues({
        ...selectedValues,
        [name]: event,
        subCategory: [],
      });
    } else {
      setSelectedValues({
        ...selectedValues,
        [name]: event,
      });
    }
  };

  const handleSubmit = (anchor) => {
    if (selectedValues.category?.length === 0) {
      setError({ ...errors, category: "Please select Category" });
      return;
    } else if (selectedValues.subCategory?.length === 0) {
      setError({ ...errors, subCategory: "Please select Sub Category" });
      return;
    } else if (selectedValues.provider?.length === 0) {
      setError({ ...errors, provider: "Please select Provider" });
      return;
    }

    setLoader(true);
    const finalCategory = selectedValues?.category
      ?.map((item, index) =>
        item !== "all"
          ? "Category = '" +
            item +
            (index !== selectedValues?.category?.length - 1 ? "' or " : "'")
          : ""
      )
      .join("");

    const finalSubCategory = selectedValues?.subCategory
      ?.map((item, index) =>
        item !== "all"
          ? "Sub_Category = '" +
            item +
            (index !== selectedValues?.subCategory?.length - 1 ? "' or " : "'")
          : ""
      )
      .join("");

    const finalProvider = selectedValues?.provider
      ?.map((item, index) =>
        item !== "all"
          ? "Provider_Name = '" +
            item +
            (index !== selectedValues?.provider?.length - 1 ? "' or " : "'")
          : ""
      )
      .join("");

    let finalResult =
      (finalCategory !== "" ? "(" + finalCategory + ")" : "") +
      (finalSubCategory !== ""
        ? (finalCategory !== "" ? " and " : "") + "(" + finalSubCategory + ")"
        : "") +
      (finalProvider !== ""
        ? (finalCategory !== "" || finalSubCategory !== "" ? " and " : "") +
          "(" +
          finalProvider +
          ")"
        : "");

    axios
      .get(`${baseURL}/${redirectionUser}`, {
        params: {
          query: `select distinct * from DATAEXCHANGEDB.DATACATALOG.PROVIDER ${
            finalResult !== "" ? `where ${finalResult}` : ""
          } order by entity_name;`,
        },
      })
      .then((response) => {
        if (response?.data) {
          setData(response?.data?.data);
          setLoader(false);
          setToggleDrawerPosition({ ...toggleDrawerPosition, [anchor]: false });
        } else {
          setLoader(false);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
      });
  };

  const fetchcsvTableData = async (providerName, entity) => {
    setViewTable({ ...viewTable, head: [], rows: [] });
    toggleResultModal(true);
    axios
      .get(`${baseURL}/${redirectionUser}`, {
        params: {
          query: `select provider_name as Provider,
          entity_name as Entity,
          attribute_name as Attribute,
          Category as Category,
          Sub_Category as SubCategory,
          Description as Description,
          Tech_Name as TechName
          from DATAEXCHANGEDB.DATACATALOG.PROVIDER where PROVIDER_NAME='${providerName}' and ENTITY_NAME='${entity}';`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          fetchTable(response?.data?.data);
        }
      })
      .catch((error) => {
        console.log("In API catch", error);
      });
  };

  const fetchTable = (data) => {
    let head = [
      "PROVIDER",
      "ENTITY",
      "ATTRIBUTE",
      "CATEGORY",
      "SUBCATEGORY",
      "DESCRIPTION",
      "TECHNAME",
    ];
    // let head = [];
    let row = [];
    if (data?.length > 0) {
      // head = data && Object.keys(data[0]);
      data?.map((obj) => {
        return row.push(head?.map((key) => obj[key]));
      });
    }
    setViewTable({ ...viewTable, head: head, rows: row });
  };

  const handleIntegration = (provider_name, entity_name) => {
    axios
      .get(`${baseURL}/${redirectionUser}`, {
        params: {
          query: `select party_account from DATAEXCHANGEDB.DATACATALOG.CONSUMER_ATTRIBUTES where user='${provider_name}'`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          let data = response?.data?.data;
          let providerPartyAccount = data[0]?.PARTY_ACCOUNT;
          axios
            .get(`${baseURL}/consumerintegrate`, {
              params: {
                provider: `${provider_name}`,
                consumer: `${user?.Consumer}`,
                provider_id: `${providerPartyAccount}`,
                consumer_id: `${user?.ConsumerPartyAccount}`,
                provider_source_table: `${entity_name}`,
                consumer_source_table: `${consumerSorceTable}`,
              },
            })
            .then((response) => {
              if (response?.data?.data) {
                axios
                  .get(`${baseURL}/${redirectionUser}`, {
                    params: {
                      query: `INSERT INTO DATAEXCHANGEDB.DATACATALOG.CONSUMER_INTEGRATIONS (CONSUMER_ACCOUNT, PROVIDER_ACCOUNT, ENABLED_FLAG, TEMPLATES, PROVIDER_NAME, CONSUMER_NAME) VALUES ('${user?.ConsumerPartyAccount}', '${providerPartyAccount}', 'TRUE', 'customer_enrichment,advertiser_match', '${provider_name}', '${user?.Consumer}')`,
                    },
                  })
                  .then((response) => {
                    if (response?.data?.data) {
                      console.log("response?.data?.data", response?.data?.data);
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  return (
    <div className="flex flex-col w-full px-4">
      <div className="flex flex-row justify-between items-center w-full mt-2 mb-4">
        <div>
          <h3 className="text-xl font-bold text-deep-navy mr-2">
            All Catalogues
          </h3>
          <p>
            Filter the catalog based on provider name, category and
            sub-category.
          </p>
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
            {toggleDrawerPosition[anchor] && (
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
                      <h3 className="text-xl font-semibold">Catalog filter</h3>
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
                          value={selectedValues?.category}
                          placeholder="Please select"
                          data={categoryList}
                          setValue={(e, value) => {
                            handleChange(e, value);
                          }}
                        />
                        {errors.category !== null ? (
                          <span className="text-[#f44336] text-sm">
                            {errors.category}
                          </span>
                        ) : null}
                      </div>
                      <div className="w-full mt-2">
                        <SelectDropdown
                          title="Select Sub category"
                          name="subCategory"
                          mode="multiple"
                          value={selectedValues?.subCategory}
                          placeholder="Please select"
                          data={subCategoryList}
                          setValue={(e, value) => {
                            handleChange(e, value);
                          }}
                        />
                        {errors.subCategory !== null ? (
                          <span className="text-[#f44336] text-sm">
                            {errors.subCategory}
                          </span>
                        ) : null}
                      </div>
                      <div className="w-full mt-2">
                        <SelectDropdown
                          title="Select provider"
                          name="provider"
                          mode="multiple"
                          value={selectedValues?.provider}
                          placeholder="Please select"
                          data={providerList}
                          setValue={(e, value) => {
                            handleChange(e, value);
                          }}
                        />
                        {errors.provider !== null ? (
                          <span className="text-[#f44336] text-sm">
                            {errors.provider}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      {!loader ? (
                        <button
                          className="flex w-full justify-center rounded-md bg-electric-green px-3 py-1.5 text-sm font-semibold leading-6 text-deep-navy shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green mt-4"
                          type="submit"
                          onClick={() => handleSubmit(anchor)}
                        >
                          Filter
                        </button>
                      ) : (
                        <div className="flex w-full justify-center rounded-md bg-electric-green px-3 py-1.5 text-sm font-semibold leading-6 text-deep-navy shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green mt-4">
                          <CircularProgress
                            style={{
                              width: "24px",
                              height: "24px",
                              color: "#FFFFFF",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SwipeableDrawer>
            )}
          </React.Fragment>
        ))}
      </div>

      {!loadingTable ? (
        sortedData?.length > 0 ? (
          <div className="flex flex-col w-full">
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
                        active={sortedColumn === "PROVIDER_NAME"}
                        direction={sortOrder}
                        onClick={() => handleSort("PROVIDER_NAME")}
                      >
                        Provider Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell key={5} align="center">
                      <TableSortLabel
                        active={sortedColumn === "ENTITY_NAME"}
                        direction={sortOrder}
                        onClick={() => handleSort("ENTITY_NAME")}
                      >
                        Entity Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell key={1} align="center">
                      <TableSortLabel
                        active={sortedColumn === "ATTRIBUTE_NAME"}
                        direction={sortOrder}
                        onClick={() => handleSort("ATTRIBUTE_NAME")}
                      >
                        Attribute Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell key={2} align="center">
                      <TableSortLabel
                        active={sortedColumn === "CATEGORY"}
                        direction={sortOrder}
                        onClick={() => handleSort("CATEGORY")}
                      >
                        Category
                      </TableSortLabel>
                    </TableCell>
                    <TableCell key={3} align="center">
                      <TableSortLabel
                        active={sortedColumn === "SUB_CATEGORY"}
                        direction={sortOrder}
                        onClick={() => handleSort("SUB_CATEGORY")}
                      >
                        Sub Category
                      </TableSortLabel>
                    </TableCell>
                    <TableCell key={4} align="center">
                      <TableSortLabel
                        active={sortedColumn === "DESCRIPTION"}
                        direction={sortOrder}
                        onClick={() => handleSort("DESCRIPTION")}
                      >
                        Description
                      </TableSortLabel>
                    </TableCell>
                    <TableCell key={6} align="center">
                      <TableSortLabel
                        active={sortedColumn === "TECH_NAME"}
                        direction={sortOrder}
                        onClick={() => handleSort("TECH_NAME")}
                      >
                        Tech Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell key={7} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
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
                          <TableCell align="center">
                            {row.PROVIDER_NAME}
                          </TableCell>
                          <TableCell align="center">
                            {row.ENTITY_NAME}
                          </TableCell>
                          <TableCell align="center">
                            {row.ATTRIBUTE_NAME}
                          </TableCell>
                          <TableCell align="center">{row.CATEGORY}</TableCell>
                          <TableCell align="center">
                            {row.SUB_CATEGORY}
                          </TableCell>
                          <TableCell align="center">
                            {row.DESCRIPTION}
                          </TableCell>
                          <TableCell align="center">{row.TECH_NAME}</TableCell>

                          <TableCell align="center">
                            <div className="flex justify-between">
                              <button
                                onClick={() =>
                                  fetchcsvTableData(
                                    row.PROVIDER_NAME,
                                    row.ENTITY_NAME
                                  )
                                }
                                className="flex flex-row items-center px-2 justify-center"
                                title="View"
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
                                <span className="pl-1 underline">View</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleIntegration(
                                    row.PROVIDER_NAME,
                                    row.ENTITY_NAME
                                  )
                                }
                                className="flex flex-row items-center px-6 justify-center"
                                title="Integration"
                              >
                                <img
                                  className="w-6 h-6"
                                  src={IntegrationImage}
                                  alt="IntegrationIcon"
                                />
                                <span className="pl-1 underline">
                                  Integrate
                                </span>
                              </button>
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
          <div className="flex flex-col w-full">
            <span className="text-deep-navy font-bold mt-4">
              We currently don't have data to display. Please apply some other
              filter!!.
            </span>
          </div>
        )
      ) : (
        <div className="flex justify-center mt-8">
          <Spinner />
        </div>
      )}

      <CommonTable
        head={viewTable?.head}
        rows={viewTable?.rows}
        open={isResultModalOpen}
        handleClose={handleResultModalClose}
        title={"Search Result"}
      />
    </div>
  );
};

export default SearchCatalog;
