import React, { useEffect, useState } from "react";
import Table from "./CommonComponent/Table";
import axios from "axios";
import { CircularProgress, SwipeableDrawer } from "@mui/material";
import { Box, Modal } from "@mui/material";

import SelectDropdown from "./CommonComponent/SelectDropdown";
import searchillustration from "../Assets/search_illustration.svg";

// Modal style
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

const SearchCatalog = () => {
  const [selectedValues, setSelectedValues] = useState({
    category: [],
    subCategory: [],
    provider: [],
  });
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [providerList, setProviderList] = useState([]);
  const [viewTable, setViewTable] = useState({
    head: [],
    rows: [],
  });
  // result model
  const [isResultModalOpen, toggleResultModal] = React.useState(false);
  const handleResultModalOpen = () => toggleResultModal(true);
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
      .get(`http://127.0.0.1:5000/dataexadmin`, {
        params: {
          query: `select distinct * from DATAEXCHANGEDB.DATACATALOG.PROVIDER order by entity_name limit 10`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          let data = response?.data?.data;
          setData(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/dataexadmin`, {
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
      .get(`http://127.0.0.1:5000/dataexadmin`, {
        params: {
          query: `select * from DATAEXCHANGEDB.DATACATALOG.PROVIDER_NAME;`,
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
  }, []);

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
        .get(`http://127.0.0.1:5000/dataexadmin`, {
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
    setSelectedValues({
      ...selectedValues,
      [name]: event,
    });
  };

  const handleSubmit = (anchor) => {
    setLoader(true);

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

    console.log("appendedString ==>", finalResult);

    axios
      .get(`http://127.0.0.1:5000/dataexadmin`, {
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
          setData(response?.data?.data);
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
    handleResultModalOpen();
    axios
      .get(`http://127.0.0.1:5000/dataexadmin`, {
        params: {
          query: `select * from DATAEXCHANGEDB.DATACATALOG.PROVIDER where PROVIDER_NAME='${providerName}' and ENTITY_NAME='${entity}';`,
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
    let head = [];
    let row = [];
    if (data?.length > 0) {
      head = data && Object.keys(data[0]);
      data?.map((obj) => {
        return row.push(head?.map((key) => obj[key]));
      });
    }
    setViewTable({ ...viewTable, head: head, rows: row });
  };

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
                    <button
                      className="flex w-full justify-center rounded-md bg-electric-green px-3 py-1.5 text-sm font-semibold leading-6 text-deep-navy shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green mt-4"
                      type="submit"
                      onClick={() => handleSubmit(anchor)}
                    >
                      {loader ? (
                        <CircularProgress
                          style={{
                            width: "24px",
                            height: "24px",
                            color: "#FFFFFF",
                          }}
                        />
                      ) : (
                        "Filter"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </SwipeableDrawer>
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-col w-full">
        {/* <h1 className=" mt-4 text-xl font-regular text-deep-navy pb-2 ">
          Search Result
        </h1> */}

        <table className="table-auto w-full text-left text-sm">
          <thead>
            <tr className="bg-blue-50 text-deep-navy uppercase text-sm leading-normal border-t border-l ">
              <th className="px-4 py-2 border-r">Provider Name</th>
              <th className="px-4 py-2 border-r">Attribute Name</th>
              <th className="px-4 py-2 border-r">Category</th>
              <th className="px-4 py-2 border-r">Sub Category</th>
              <th className="px-4 py-2 border-r">Description</th>
              <th className="px-4 py-2 border-r">Entity Name</th>
              <th className="px-4 py-2 border-r">Tech Name</th>
              <th className="px-4 py-2 border-r">Actions</th>
            </tr>
          </thead>
          <tbody className="text-deep-navy text-sm font-light">
            {data &&
              data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-300 hover:bg-blue-50"
                >
                  <td className="border px-4 py-2">{item.PROVIDER_NAME}</td>
                  <td className="border px-4 py-2">{item.ATTRIBUTE_NAME}</td>
                  <td className="border px-4 py-2">{item.CATEGORY}</td>
                  <td className="border px-4 py-2">{item.SUB_CATEGORY}</td>
                  <td className="border px-4 py-2">{item.DESCRIPTION}</td>
                  <td className="border px-4 py-2">{item.ENTITY_NAME}</td>
                  <td className="border px-4 py-2">{item.TECH_NAME}</td>
                  <td className="border px-4 py-2">
                    <div className="flex justify-between">
                      <button
                        onClick={() =>
                          fetchcsvTableData(
                            item.PROVIDER_NAME,
                            item.ENTITY_NAME
                          )
                        }
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
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={isResultModalOpen}
        onClose={handleResultModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={resultstyle}>
          <div className=" flex flex-col flex-grow w-full">
            <div className="flex flex-row items-center justify-between sticky z-30 py-2 px-4 top-0 w-full bg-amaranth-800 text-white">
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
              {viewTable?.head.length > 0 && viewTable?.rows.length > 0 ? (
                <>
                  <Table head={viewTable?.head} rows={viewTable?.rows} />
                </>
              ) : (
                <div className="py-8">
                  <div className="text-center">
                    <CircularProgress
                      style={{
                        width: "48px",
                        height: "48px",
                        color: "#a40d49",
                      }}
                    />
                  </div>
                  <div className="text-center pt-4">
                    <span className="text-amaranth-900">
                      We are fetching the data. Please wait !!!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default SearchCatalog;
