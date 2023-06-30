import React, { useEffect, useState } from "react";
import Table from "./CommonComponent/Table";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Box, Modal } from "@mui/material";

import * as actions from "../redux/actions/index";
import SelectDropdown from "./CommonComponent/SelectDropdown";

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
  const [data, setData] = useState([])
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [providerList, setProviderList] = useState([]);
  const [viweTbale, setViewTable] = useState({
    head: [],
    rows: []
  })
  // result model
  const [isResultModalOpen, toggleResultModal] = React.useState(false);
  const handleResultModalOpen = () => toggleResultModal(true);
  const handleResultModalClose = () => toggleResultModal(false);

  let [tableData, setTableData] = useState({
    head: [
      "Provider Name",
      "Attribute Name",
      "Category",
      "Sub Category",
      "Description",
      "Entity Name",
      "Tech Name",
    ],
    row: [],
  });
  const [errors, setError] = useState({
    category: null,
    subCategory: null,
    provider: null,
  });

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
            query: `select * from DATAEXCHANGEDB.DATACATALOG.SUB_CATEGORY_LIST where (${finalCategory});`,
          },
        })
        .then((response) => {
          if (response?.data?.data) {
            let data = response?.data?.data
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

  const handleSubmit = () => {
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
          query: `select distinct * from DATAEXCHANGEDB.DATACATALOG.PROVIDER ${finalResult !== "" ? `where ${finalResult}` : ""
            } order by entity_name;`,
        },
      })
      .then((response) => {
        if (response?.data) {
          setData(response?.data?.data)
          // let data = response?.data?.data;
          // let head = [
          //   "PROVIDER_NAME",
          //   "ATTRIBUTE_NAME",
          //   "CATEGORY",
          //   "SUB_CATEGORY",
          //   "DESCRIPTION",
          //   "ENTITY_NAME",
          //   "TECH_NAME",
          // ];
          // let row = [];
          // data?.length > 0 &&
          //   data?.map((obj) => {
          //     return row.push(head?.map((key) => obj[key]));
          //   });
          // setTableData({ ...tableData, row: row });
          setLoader(false);
        } else {
          setData(response?.data?.data)
          // setTableData({ ...tableData, row: [] });
          setLoader(false);
        }
      })
      .catch((error) => {
        // setTableData({ ...tableData, row: [] });
        setLoader(false);
        console.log(error);
      });
  };

  const fetchcsvTableData = async (providerName, entity) => {
    setViewTable({ ...viweTbale, head: [], rows: [] });
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
    setViewTable({ ...viweTbale, head: head, rows: row })
  };


  return (
    <div className="flex flex-col">
      <h3 className="mt-4 text-xl font-bold text-deep-navy">Search Catalog</h3>

      <div className="flex flex-row  gap-3  w-full">
        <div className="flex flex-col flex-shrink h-auto">
          <div
            className=" border border-gray-400 rounded my-4 px-4 py-2 h-auto  w-80 max-w-xs"
            name="myForm"
          >
            <span className="text-sm mb-4 font-light text-coal">
              Search Catalog
            </span>
            <div className="mt-4 pb-2 flex flex-col">
              <div className="w-full mt-2">
                <SelectDropdown
                  title="Select Category"
                  mode="multiple"
                  name="category"
                  value={selectedValues?.category}
                  placeholder="Select Category"
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
                  title="Select Sub Category"
                  name="subCategory"
                  mode="multiple"
                  value={selectedValues?.subCategory}
                  placeholder="Select Sub Category"
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
                  title="Select Provider"
                  name="provider"
                  mode="multiple"
                  value={selectedValues?.provider}
                  placeholder="Select Provider"
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
                className="my-2 flex w-full justify-center rounded-md bg-deep-navy px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-electric-green hover:text-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"
                type="submit"
                onClick={handleSubmit}
              >
                {loader ? (
                  <CircularProgress
                    style={{ width: "24px", height: "24px", color: "#FFFFFF" }}
                  />
                ) : (
                  "Search Request"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full px-5">
          <h1 className=" mt-4 text-xl font-regular text-amaranth-600 pb-2 ">
            Search Result
          </h1>

          <table className="table-auto w-full text-left text-sm">
            <thead>
              <tr className="bg-amaranth-50 text-amaranth-900 uppercase text-sm leading-normal border-t border-l ">
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
            <tbody className="text-gray-600 text-sm font-light">
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-amaranth-50"
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
                          fetchcsvTableData(item.PROVIDER_NAME, item.ENTITY_NAME)
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
              {viweTbale?.head.length > 0 && viweTbale?.rows.length > 0 ? (
                <>
                  <Table
                    head={viweTbale?.head}
                    rows={viweTbale?.rows}
                  />
                </>
              ) :
                <div className = "py-8" >
                  <div className="text-center">

                    <CircularProgress
                      style={{ width: "48px", height: "48px", color: "#a40d49" }}
                    />

                  </div>
                  <div className="text-center pt-4">
                    <span className="text-amaranth-900">
                      We are fetching the data. Please wait !!!
                    </span>
                  </div>
                </div>
              }
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default SearchCatalog;
