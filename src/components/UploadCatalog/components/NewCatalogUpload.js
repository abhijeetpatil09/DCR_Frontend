import React, { useState } from "react";
import CSVParse from "papaparse";
import { toast } from "react-toastify";
import axios from "axios";

import DummyCatalog from "../../../Assets/CSVTemplates/Dummy_Catalog.csv";

const CSVFileColumns = [
  "Entity",
  "Attributes",
  "Category",
  "Sub Category",
  "Description",
  "Tech Name",
];

const NewCatalogUpload = ({ entryType, user }) => {
  let [parsedData, setParsedData] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileError, setFileError] = useState("");

  const downloadNewFile = () => {
    const link = document.createElement("a");
    link.href = DummyCatalog;
    link.download = "Dummy Catalog.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Template List.csv has been downloaded...`);
  };

  const handleValidFileValidations = (rows) => {
    if (rows[0]?.length > CSVFileColumns?.length) {
      setFileError("You have added more columns than the specified one");
    } else if (rows[0]?.length < CSVFileColumns?.length) {
      setFileError("You have added less columns than the specified one");
    } else if (rows[0]?.length > 0) {
      const equalColumns =
        JSON.stringify(CSVFileColumns) === JSON.stringify(rows[0]);
      equalColumns
        ? setFileError("")
        : setFileError("Please add proper template file");
    } else {
      setFileError("Please Upload correct CSV File");
    }
  };

  const uploadFile = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    CSVParse.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setParsedData(results?.data);

        const rows = [];
        // Iterating data to get column name and their values
        results?.data?.map((d) => {
          return rows.push(Object.keys(d));
          // values.push(Object.values(d));
        });

        // Parsed Data Response in array format
        setFileUploaded(true);
        handleValidFileValidations(rows);
      },
    });
  };

  const handleSubmit = () => {
    if (!fileUploaded) {
      setFileError("Please upload a file...");
      return;
    } else if (fileError !== "") {
      return;
    } else {
      let EntityArray = [];
      let finalObject = {};

      parsedData = parsedData?.map((item) => {
        return { ...item, tag: entryType };
      });

      let entities = parsedData?.map((item) => {
        return item.Entity;
      });

      entities = [...new Set(entities)];

      entities.map((item, index) => {
        let attributes_temp = [];
        let obj = {};
        parsedData.filter((obj1) => {
          if (item === obj1.Entity) {
            attributes_temp.push(obj1);
          }
          return null;
        });
        attributes_temp?.map((obj) => {
          return delete obj.Entity;
        });
        obj.attributes = attributes_temp;
        obj.name = item;
        EntityArray.push(obj);
        return null;
      });

      finalObject.entity = EntityArray;
      finalObject.name = user?.name;
      console.log("finalArray ==>", finalObject);

      let result = JSON.stringify(finalObject);
      console.log("result", result);

      axios
        .get(`http://127.0.0.1:5000/dataexadmin`, {
          params: {
            // query: `insert into DEMO1.PUBLIC.PROVIDER(PROVIDER_NAME,ATTRIBUTE_NAME,CATEGORY,SUBCATEGORY,subcategory_description,TECHNAME) values ${joinedValues};`,
            query: `insert into DATAEXCHANGEDB.DATACATALOG.JSON_TABLE select parse_json('${result}');`,
          },
        })
        .then((response) => {
          if (response) {
            callProcedure();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const callProcedure = () => {
    axios
      .get(`http://127.0.0.1:5000/dataexadmin`, {
        params: {
          query: `call INSERTCATALOG();`,
        },
      })
      .then((response) => {
        if (response) {
          toast.success("File Uploaded successfully");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-row  gap-3  w-full">
      <div className="flex flex-col flex-shrink h-auto">
        <div
          className=" border border-gray-400 rounded my-4 px-4 py-2 h-auto w-[32rem] max-w-3xl"
          name="myForm"
        >
          <div className="mt-2 pb-21 flex flex-col">
            <label>Download New Template File</label>
            <button
              onClick={downloadNewFile}
              className="flex flex-row text-[#0000FF]"
            >
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
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              <span className="pl-2 underline">Download</span>
            </button>
          </div>

          <div className="mt-2 pb-21 flex flex-col">
            <label>Upload File</label>
            <input
              className="w-3/5 "
              type="file"
              id="myFileInput"
              onChange={uploadFile}
              required
            />
          </div>
          {fileError !== "" ? (
            <div className="mt-2 pb-21 flex flex-col text-sm text-[red]">
              <label>{fileError}</label>
            </div>
          ) : null}
          <div className="flex justify-center">
            <button
              className="my-2 flex w-3/5 justify-center rounded-md bg-deep-navy px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-electric-green hover:text-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"
              type="submit"
              onClick={handleSubmit}
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCatalogUpload;
