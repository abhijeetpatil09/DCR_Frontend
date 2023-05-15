import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
// import nodemailer from 'nodemailer';
// import JSZip from "jszip";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import * as actions from "../redux/actions/index";
import Table from "./CommonComponent/Table";

import "./styles.css";
import "./pure-react.css";

const timestamp = Date.now();
const dateObj = new Date(timestamp);

const year = dateObj.getFullYear();
const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
const day = dateObj.getDate().toString().padStart(2, "0");
const hours = dateObj.getHours().toString().padStart(2, "0");
const minutes = dateObj.getMinutes().toString().padStart(2, "0");
const seconds = dateObj.getSeconds().toString().padStart(2, "0");

const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

const s3 = new AWS.S3({
  accessKeyId: "AKIA57AGVWXYVR36XIEC",
  secretAccessKey: "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",
  // signatureVersion: 'v4',
  region: "ap-south-1",
  // region: 'ap-south-1',
});

const Publisherform = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const user = state && state.user;
  const TableData = state && state.PublisherForm && state.PublisherForm.TableData;
  const reqId = state && state.PublisherForm && state.PublisherForm.RequestId;

  const initialState = {
    Query_Name: "",
    Provider_Name: user && user["name"],
    Column_Names: "",
    Consumer_Name: user && user["name"],
    RunId: formattedDate,
    File_Name: "",
    Match_Attribute: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [csvData, setCsvData] = useState(["-", "-", "-"]);
  const [disableButton, setDisableButton] = useState(false);
  const [gender, setGender] = useState("male");

  const [requestId, setRequestId] = useState("");
  const [tableHead, setTableHead] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    if (submit) {
      fetchcsvTableData(
        formData["Query_Name"] + "_" + formData["RunId"] + ".csv"
      );
    }
  }, [submit]);

  useEffect(() => {
    setRequestId(reqId);
    if (TableData) {
      setTableHead(TableData?.head || []);
      setTableRows(TableData?.rows || []);
    }
  }, [TableData, reqId]);

  const handleCustomerFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      RunId: Date.now(),
    });
    console.log(formData);
  };

  const handleFileInput = (event) => {
    event.preventDefault();
    var fileInput = document.getElementById("myFileInput");
    var file = fileInput.files[0];
    console.log(file.name);
    setFormData({ ...formData, File_Name: file.name, RunId: Date.now() });
    console.log(formData);
  };

  const handleSelectChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(
      (option) => option.value
    );
    const delimiter = "&";
    const selectedOptionsString = `#${selectedOptions.join(delimiter)}#`;
    setFormData({
      ...formData,
      [event.target.name]: selectedOptionsString,
      RunId: Date.now(),
    });
    console.log(formData);
    // setSelectedColumns(selectedOptions);
  };

  function isValidInput(inputString) {
    const regex = /^[0-9][0-9,-]*[0-9]$/; // regex pattern to match only comma, hyphen, and numeric values and start and end with numeric values
    return regex.test(inputString); // returns true if inputString matches the regex pattern, false otherwise
  }

  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(null);

  function handleInputChange(event) {
    const newValue = event.target.value;
    if (isValidInput(newValue)) {
      console.log("valid Input");
      setInputValue(newValue);
      setInputError(null);
    } else {
      setInputError(
        "Input must contain only comma, hyphen, and numeric values and start and end with a numeric value"
      );
      console.log("invalid Input");
    }
  }

  const sendEmail = () => {
    // create reusable transporter object using the default SMTP transport
    // let transporter = nodemailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     secure: true, // true for 465, false for other ports
    //     auth: {
    //         user: 'atulkhot07@gmail.com', // your email address
    //         pass: '9975334797' // your email password or app password if using 2-factor authentication
    //     }
    // });

    // // setup email data with unicode symbols
    // let mailOptions = {
    //     from: '"Atul Khot" atulkhot07@gmail.com', // sender address
    //     to: 'atulkhot07@example.com', // list of receivers
    //     subject: 'Hello', // Subject line
    //     text: 'Hello world?', // plain text body
    //     // html: '<b>Hello world?</b>' // html body
    // };

    // // send mail with defined transport object
    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     console.log('Message sent: %s', info.messageId);
    // });
    console.log("into send email method");
  };

  const handleSubmit = (event) => {
    setSubmit(true);

    event.preventDefault();

    setDisableButton(true);

    setTimeout(() => {
      setDisableButton(false);
    }, 110000);

    console.log(formData);

    setFormData({ ...formData, RunId: Date.now() });
    console.log(formData);
    const keys = Object.keys(formData);
    let csv = keys.join(",") + "\n";
    for (const obj of [formData]) {
      const values = keys.map((key) => obj[key]);
      csv += values.join(",") + "\n";
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const file1 = new File(
      [blob],
      formData["Query_Name"] + "_" + formData["RunId"] + ".csv",
      { type: "text/csv" }
    );
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = formData['RunId'] +'.csv';
    // document.body.appendChild(link);
    // link.click();

    const params = {
      // Bucket: 'dcr-poc/query_request',
      Bucket: "dcr-poc",
      Key:
        "query_request/" +
        formData["Query_Name"] +
        "_" +
        formData["RunId"] +
        ".csv",
      Body: blob,
      // ACL: 'private',
    };

    // s3.putObject(params, (err, data) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(`File uploaded successfully. ETag: ${data.ETag}`);
    //   }
    // });

    var inputFile = document.getElementById("myFileInput");

    const params2 = {
      // Bucket: 'dcr-poc/query_request',
      Bucket: "dcr-poc",
      Key: "query_request_data/" + inputFile.files[0].name,
      Body: inputFile.files[0],
      // ACL: 'private',
    };

    // s3.putObject(params2, (err, data) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(`File uploaded successfully. ETag: ${data.ETag}`);
    //     setCsvData(["-", "-", "-"]);
    //   }
    // });

    const formData2 = new FormData();
    formData2.append("file", inputFile.files[0]);

    fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData2,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });

    const formData3 = new FormData();
    formData3.append("file", file1);

    fetch("http://localhost:4040/upload2", {
      method: "POST",
      body: formData3,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchTable = (data, runId) => {
    let head = data?.Body.toString("utf-8")?.split("\n")[0]?.split('",');
    head = head?.map((item) => {
      if (item?.includes('"')) {
        return item?.replaceAll('"', "");
      }
      return item;
    });

    let array = [];
    for (let i = 0; i < 999; i++) {
      let row = data?.Body?.toString("utf-8")?.split("\n")[i + 1]?.split(",");
      row = row?.map((item) => {
        if (item?.includes('"')) {
          return item?.replaceAll('"', "");
        }
        return item;
      });
      if (row) {
        array.push(row);
      }
    }
    dispatch(actions.PublisherForm({ RequestId: runId, TableData: { head: head, rows: array } }))
  };

  const fetchcsvTableData = async (key) => {
    // let run_id = '1691891590797';  
    // let run_id = '1691891590796';
    let run_id = "1681891590569";




    // let file_name = 'advertiser_match_1691891590797.csv';
    // let file_name = 'advertiser_match_1691891590796.csv';
    let file_name = "customer_enrichment_1681891590569.csv";
    
    try {
      const data = await s3
        .getObject({
          Bucket: "dcr-poc",
          // Key: "query_result_tables/" + formData["RunId"] + "/" + key,
          Key: `query_result_tables/${run_id}/${file_name}`,
        })
        .promise();
      fetchTable(data, run_id);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="flex flex-col  ">
      <h3 className="mt-4 text-xl font-bold text-deep-navy">Publisher query</h3>
      <div className="flex flex-row  gap-3  w-full">
        <div className="flex flex-col flex-shrink h-auto">
          <form className=" border border-gray-400 rounded my-4 px-4 py-2 h-auto  w-80 max-w-xs" name="myForm" onSubmit={handleSubmit}>
            <span className="text-sm mb-4 font-light text-coal">Advertiser record match</span>
            <div>
              <div className=" mt-2 pb-2 flex flex-col">
                <label>Query Name</label>
                <select
                    name="Query_Name"
                    onChange={handleCustomerFormData}
                    required
                    className="w-full"
                  >
                  <option value="">Please select</option>
                  <option value="advertiser_match">Advertiser Match</option>
                </select>
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

              <div className="mt-2 pb-21 flex flex-col">
                <label>Identifier Type</label>
                <select
                    name="Column_Names"
                    onChange={handleCustomerFormData}
                    required
                    className="w-full"
                  >
                    <option value="">Please select</option>
                    <option value="emailid">Email</option>
                    <option value="phone">Phone</option>
                    <option value="MAID">MAID-WIP</option>
                  </select>
              </div>

              <div className="mt-2 pb-21 flex flex-col">
                <label>
                  Match Attribute
                
                </label>
                <select
                    name="Match_Attribute"
                    onChange={handleCustomerFormData}
                    required
                    className="w-full"
                  >
                    <option value="">Please select</option>
                    <option value="overall">Overall</option>
                    <option value="age">Age</option>
                    <option value="gender">Gender</option>
                    <option value="phone">Phone</option>
                  </select>
                {formData["Match_Attribute"] === "gender" && (
                  <div className="mt-2 pb-21 flex flex-col">
                    Select Gender  
                    <label>
                      <input
                        type="radio"
                        value="male"
                        checked={gender === "male"}
                        onChange={(e) => setGender(e.target.value)}
                      />
                      <span className="pl-2">Male</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="female"
                        checked={gender === "female"}
                        onChange={(e) => setGender(e.target.value)}
                      />
                        <span className="pl-2">Female</span>
                    </label>
                  </div>
                )}
                {formData["Match_Attribute"] === "age" && (
                  <div className="mt-2 pb-21 flex flex-col">
                    <label>Enter Age </label>
                    <input
                        type="text"
                        onChange={handleInputChange}
                        required
                        className="w-full"
                        placeholder="e.g. 25,14,30,28"
                      ></input>
                      {/* <span className="mt-2">
                        * Please enter comma seperated values eg: 25,14,30,28
                      </span> */}
                      {inputError && (
                        <div className="text-red-500">
                          {inputError}
                        </div>
                      )}
                  </div>
                )}
                {formData["Match_Attribute"] === "phone" && (
                  <div className="mt-2 pb-21 flex flex-col">
                    <label>Phone No</label>
                    <input
                        type="text"
                        required
                        className="w-full"
                      />
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  className="my-2 flex w-full justify-center rounded-md bg-deep-navy px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-electric-green hover:text-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"

                  type="submit"
                >Submit query</button>
              </div>
            </div>
          </form>
        </div>
        {/* <div className="homecenter">
        <h4 style={{ marginLeft: "130px" }}>Output Console:</h4>

        <table style={{ marginLeft: "130px", marginBottom: "10px" }}>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Advertiser Records Count</th>
              <th>Record Match</th>
              <th>Percentage Match</th>
              <th>Run Ad. Campaign</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{requestId}</td>
              <td>{csvData[0]}</td>
              <td>{csvData[1]}</td>
              <td>{csvData[2]}</td>
              <td>
                <button onClick={() => sendEmail()}>Push to FB-WIP</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div> */}
        <div className=" flex flex-1 overflow-scroll">
          {tableHead?.length > 0 && tableRows?.length > 0 ? (
            <Table   id={requestId} head={tableHead} rows={tableRows} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Publisherform;
