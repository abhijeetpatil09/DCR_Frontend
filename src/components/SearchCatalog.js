import React, { useEffect, useState } from "react";
import Table from "./CommonComponent/Table";
import axios from "axios";
import { CircularProgress } from "@mui/material";

import SelectDropdown from "./CommonComponent/SelectDropdown";

const SearchCatalog = () => {
  const [selectedValues, setSelectedValues] = useState({
    category: [],
    subCategory: [],
    provider: [],
  });
  const [loader, setLoader] = useState(false);

  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [providerList, setProviderList] = useState([]);

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
            if(data?.length > 0) {
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
          query: `select distinct * from DATAEXCHANGEDB.DATACATALOG.PROVIDER ${
            finalResult !== "" ? `where ${finalResult}` : ""
          } order by entity_name;`,
        },
      })
      .then((response) => {
        if (response?.data) {
          let data = response?.data?.data;
          let head = [
            "PROVIDER_NAME",
            "ATTRIBUTE_NAME",
            "CATEGORY",
            "SUB_CATEGORY",
            "DESCRIPTION",
            "ENTITY_NAME",
            "TECH_NAME",
          ];
          let row = [];
          data?.length > 0 &&
            data?.map((obj) => {
              return row.push(head?.map((key) => obj[key]));
            });
          setTableData({ ...tableData, row: row });
          setLoader(false);
        } else {
          setTableData({ ...tableData, row: [] });
          setLoader(false);
        }
      })
      .catch((error) => {
        setTableData({ ...tableData, row: [] });
        setLoader(false);
        console.log(error);
      });
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
        {tableData?.head?.length > 0 && tableData?.row?.length > 0 ? (
          <Table head={tableData?.head} rows={tableData?.row} />
        ) : null}
      </div>
    </div>
  );
};

export default SearchCatalog;
