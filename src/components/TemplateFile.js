import React, { useState } from "react";
import CSVParse from "papaparse";
import axios from "axios";
import { toast } from "react-toastify";

import TemplateExcel from "../Assets/CSVTemplates/template_list.csv";

const CSVFileColumns = [
  "Provider Name",
  "Attributes",
  "Category",
  "Sub Category",
  "Description",
  "Tech Name",
];

const TemplateFile = () => {
  const [parsedData, setParsedData] = useState([]);
  const [fileError, setFileError] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);

  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = TemplateExcel;
    link.download = "template_list.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const handleFileInput = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    CSVParse.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rows = [];
        const values = [];

        // Iterating data to get column name and their values
        results?.data?.map((d) => {
          rows.push(Object.keys(d));
          values.push(Object.values(d));
        });

        // Parsed Data Response in array format
        setParsedData(results?.data);
        setFileUploaded(true);
        handleValidFileValidations(rows);
      },
    });
  };

  const handleSubmit = () => {
    if (!fileUploaded && fileError !== "") {
      console.log("handleSubmit called in if", fileUploaded);
      setFileError("Please upload a file...");
      return;
    } else {
      console.log("Json", parsedData);

      let values = [];

      if (parsedData?.length > 0) {
        values = parsedData?.map((obj) => {
          let xyz = CSVFileColumns?.map((key) => obj[key]);
          return xyz.join("','");
        });
      }

      const joinedValues = `('${values.join("'),('")}')`;
      console.log("joinedValues", joinedValues);

      // axios
      // .get(`http://127.0.0.1:5000/Brandone`, {
      //   params: {
      //     query: `insert into DEMO1.PUBLIC.PROVIDER(PROVIDER_NAME,ATTRIBUTE_NAME,CATEGORY,SUBCATEGORY,subcategory_description,TECHNAME) values ${joinedValues};`,
      //   },
      // }).then((response) => {
      //   if(response) {
      //     toast.success(`Request has been submitted successfully.`);
      //   }
      // })
      // .catch((error) => {
      //   console.log(error);
      //   toast.error(`We are facing some error in your request.`);
      // });

      console.log("handleSubmit called", fileUploaded);
      // insert into DEMO1.PUBLIC.PROVIDER(PROVIDER_NAME,ATTRIBUTE_NAME,CATEGORY,SUBCATEGORY,subcategory_description,TECHNAME) values ('provider4','table1','Demographic','Age','Age Group','age_group');
    }
  };

  return (
    <div className="flex flex-col  ">
      <h3 className="mt-4 text-xl font-bold text-deep-navy">
        Provider Template File
      </h3>
      <div className="flex flex-row  gap-3  w-full">
        <div className="flex flex-col flex-shrink h-auto">
          <div
            className=" border border-gray-400 rounded my-4 px-4 py-2 h-auto  w-80 max-w-xs"
            name="myForm"
          >
            <span className="text-sm mb-4 font-light text-coal">
              Template File
            </span>
            <div>
              <div className="mt-2 pb-21 flex flex-col">
                <label>Download Template File</label>
                <button
                  onClick={() => downloadFile()}
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
                  className="w-full "
                  type="file"
                  id="myFileInput"
                  onChange={handleFileInput}
                  required
                />
              </div>
              {fileError !== "" ? (
                <div className="mt-2 pb-21 flex flex-col text-sm text-[red]">
                  <label>{fileError}</label>
                </div>
              ) : null}

              <div className="flex justify-end">
                <button
                  className="my-2 flex w-full justify-center rounded-md bg-deep-navy px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-electric-green hover:text-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Submit query
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateFile;
