import React, { useState } from "react";
import SelectDropdown from "./CommonComponent/SelectDropdown";

const categoryList = [
  { value: "all", name: "All" },
  { value: "category1", name: "Category 1" },
  { value: "category2", name: "Category 2" },
  { value: "category3", name: "Category 3" },
];
const subCategoryList = [
  { value: "all", name: "All" },
  { value: "sub_category1", name: "Sub Category 1" },
  { value: "sub_category2", name: "Sub Category 2" },
  { value: "sub_category3", name: "Sub Category 3" },
];
const providerList = [
  { value: "all", name: "All" },
  { value: "provider1", name: "Provider 1" },
  { value: "provider2", name: "Provider 2" },
  { value: "provider3", name: "Provider 3" },
];

const SearchCatalog = () => {
  const [selectedValues, setSelectedValues] = useState({
    category: [],
    subCategory: [],
    provider: [],
  });

  const [errors, setError] = useState({
    category: null,
    subCategory: null,
    provider: null,
  });

  const handleChange = (event, name) => {
    console.log("event", event, name);

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

  // console.log("id", document.getElementById('catInput'))
  const handleSubmit = () => {
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
    console.log("selectedValues ==>", selectedValues);
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
            <div className=" mt-2 pb-2 flex flex-col">
              <div className="w-full">
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
              <div className="w-full">
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
              <div className="w-full">
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
                Search Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCatalog;
