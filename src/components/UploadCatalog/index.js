import React, { useState } from "react";
import { useSelector } from "react-redux";

import NewCatalogUpload from "./components/NewCatalogUpload";
import UpdateCatalog from "./components/UpdateCatalog";

const UploadCatalog = () => {
  const state = useSelector((state) => state);
  const user = state && state.user;
  const [entryType, setEntryType] = useState("");

  const handleChangeSelect = (e) => {
    setEntryType(e.target.value);
  };

  return (
    <div className="flex flex-col  ">
      <h3 className="mt-4 text-xl font-bold text-deep-navy">Upload Catalog</h3>

      <div className="flex flex-row  gap-3 w-full">
        <div className="flex flex-col flex-shrink h-auto">
          <div
            className=" border border-gray-400 rounded mt-4 px-4 py-2 h-auto w-80 max-w-sm"
            name="myForm"
          >
            <span className="text-sm mb-4 font-light text-coal">
              Upload Catalog
            </span>
            <div className=" mt-2 pb-2 flex flex-col">
              <label>Entry Type</label>
              <select
                name="entry_type"
                onChange={handleChangeSelect}
                required
                className="w-full"
              >
                <option value="">Please select</option>
                <option value="insert">New Catalog Entry</option>
                <option value="update">Update Catalog</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div>
        {entryType === "insert" && <NewCatalogUpload entryType={entryType} user={user} />}
        {entryType === "update" && <UpdateCatalog user={user} />}
      </div>
    </div>
  );
};

export default UploadCatalog;
