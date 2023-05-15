import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
import axios from "axios";

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
console.log(formattedDate);

const initialState = {
  Query_Names: "",
  Provider_Name: "",
  Column_Names: "",
  Consumer_Name: "",
  RunId: formattedDate,
};

const dependentOptions = {
  hoonartek: [
    { value: "age_band", label: "Age Band" },
    { value: "status", label: "Status" },
  ],
  htmedia: [
    { value: "cohort_name", label: "COHORT NAME" },
    { value: "cdp_sh_fname", label: "CDP SH FNAME" },
  ],
};

// var snowflake = require('snowflake-sdk');
// const connection = snowflake.createConnection({
//   account: 'iw79253.ap-southeast-1',
//   username: 'onkar97',
//   password: 'Onkar@97',
//   database: 'DCR_SAMP_CONSUMER',
//   schema: 'public',
//   warehouse: 'APP_WH'
// });

const s3 = new AWS.S3({
  accessKeyId: "AKIA57AGVWXYVR36XIEC",
  secretAccessKey: "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",
  // signatureVersion: 'v4',
  region: "ap-south-1",
  // region: 'ap-south-1',
});

const Queryform = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const user = state && state.user;
  const TableData = state && state.ConsumerForm && state.ConsumerForm.TableData;
  const reqId = state && state.ConsumerForm && state.ConsumerForm.RequestId;

  const [selectedProvider, setSelectedProvider] = useState("");

  const [formData, setFormData] = useState(initialState);
  const [requestId, setRequestId] = useState("");
  const [tableHead, setTableHead] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  const [providerList, setProviderList] = useState([]);
  const [templateList, setTemplateList] = useState("");
  const [databaseName, setDatabaseName] = useState("");

  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    if (submit) {
      fetchcsvTableData(
        formData["Query_Names"] + "_" + formData["RunId"] + ".csv"
      );
    }
  }, [submit]);

  useEffect(() => {
    // setInterval(() => {
    //   if (submit) {
    //     fetchcsvTableData(
    //       formData["Query_Names"] + "_" + formData["RunId"] + ".csv"
    //     );
    //   }
    // }, 100);
  }, [submit]);

  useEffect(() => {
    setRequestId(reqId);
    if (TableData) {
      setTableHead(TableData?.head || []);
      setTableRows(TableData?.rows || []);
    }
  }, [TableData, reqId]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/data_fetcher", {
        params: {
          query: "select provider from DCR_SAMP_CONSUMER1.PUBLIC.PROV_DETAILS;",
        },
      })
      .then((response) => {
        if (response?.data) {
          setProviderList(response?.data?.data);
        } else {
          setProviderList([]);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (databaseName !== "") {
      axios
        .get("http://127.0.0.1:5000/data_fetcher", {
          params: {
            query: `select template_name from ${databaseName}.CLEANROOM.TEMPLATES where template_name <> 'advertiser_match';`,
          },
        })
        .then((response) => {
          if (response?.data) {
            console.log("response?.data", response?.data);
            setTemplateList(response.data.data);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [databaseName]);

  const handleSelectProvider = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
      RunId: Date.now(),
    });
    setTemplateList([]);
    getDatabaseName(event.target.value);
  };

  const handleSelectedTemp = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
      RunId: Date.now(),
    });
  };

  const getDatabaseName = (selectedProvider) => {
    axios
      .get("http://127.0.0.1:5000/data_fetcher", {
        params: {
          query: `select database from DCR_SAMP_CONSUMER1.PUBLIC.PROV_DETAILS where provider = '${selectedProvider}';`,
        },
      })
      .then((response) => {
        if (response?.data) {
          let db_name = response?.data?.data;
          setDatabaseName(db_name[0]?.DATABASE);
        } else {
          setDatabaseName("");
        }
      })
      .catch((error) => console.log(error));
  };

  const handleCustomerFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      RunId: Date.now(),
    });
    console.log(formData);
  };

  const handleProviderChange = (e) => {
    setSelectedProvider(e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      RunId: Date.now(),
    });
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

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(formData);
    console.log(document.getElementsByName("Query_Names")[0]);

    // formData.Query_Names = document.getElementsByName('Query_Names')[0].selectedOptions[0].value
    // formData.Provider_Name = document.getElementsByName('Provider_Name')[0].selectedOptions[0].value
    // // formData.Column_Names = document.getElementsByName('Column_Names')[0].selectedOptions[0].value
    // formData.Consumer_Name = document.getElementsByName('Consumer_Name')[0].selectedOptions[0].value
    setFormData({ ...formData, RunId: Date.now() });
    console.log(formData);
    const keys = Object.keys(formData);
    let csv = keys.join(",") + "\n";
    for (const obj of [formData]) {
      const values = keys.map((key) => obj[key]);
      csv += values.join(",") + "\n";
    }

    console.log(csv);
    const blob = new Blob([csv], { type: "text/csv" });
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
        formData["Query_Names"] +
        "_" +
        formData["RunId"] +
        ".csv",
      Body: blob,
      // ACL: 'private',
    };

    // s3.listBuckets(function(err, data) {
    //     if (err) console.log(err, err.stack);
    //     else console.log(data);
    // });

    // s3.putObject(params, (err, data) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(`File uploaded successfully. ETag: ${data.ETag}`);
    //     alert("Request has been submitted successfully");
    //     setTableRows([]);
    //     setTableHead([]);
    //   }
    // });

    // connection.execute({
    //     sqlText: `CREATE OR REPLACE STAGE my_stage;`
    // });

    // connection.connect((err, conn) => {
    //     if (err) {
    //       console.error('Error connecting to Snowflake:', err);
    //     } else {
    //       conn.put({
    //         localPath: blob,
    //         remotePath: 'my_stage/',
    //         sourceCompression: 'none'
    //       }, (err, result) => {
    //         if (err) {
    //           console.error('Error uploading CSV file to Snowflake:', err);
    //         } else {
    //           console.log('CSV file uploaded successfully to Snowflake!');
    //         }
    //       });
    //     }
    //   });
    setSubmit(true);
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
    dispatch(
      actions.ConsumerQueryForm({
        RequestId: runId,
        TableData: { head: head, rows: array },
      })
    );
  };

  const fetchcsvTableData = async (key) => {
    let run_id = "1691891590798";
    // let run_id =  '1681891590569';

    let file_name = "customer_enrichment_1691891590798.csv";
    // let file_name = 'customer_enrichment_1681891590569.csv';

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

  // select * from $db_name.public.$templaet_name_$runid limit 1000;

  return (
    <div className="home">
      <form name="myForm" onSubmit={handleSubmit}>
        <br></br>
        <div
          style={{
            boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            padding: "10px",
            width: "500px",
            height: "375px",
            margin: "auto",
            backgroundColor: "#f0f9ff",
          }}
        >
          <h2 style={{ textAlign: "center" }}>Submit your Query Request</h2>
          <br></br>
          <div className="input-container">
            <label>
              Provider Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp;
              <select
                id="provider"
                name="Provider_Name"
                required
                className="my-select"
                value={formData["Provider_Name"]}
                onChange={handleSelectProvider}
              >
                <option value="">Select a provider</option>
                {providerList?.length > 0 ? (
                  providerList.map((item, index) => (
                    <option key={index} value={item.PROVIDER}>
                      {item.PROVIDER}
                    </option>
                  ))
                ) : (
                  <option value="">Loading...</option>
                )}
              </select>
            </label>
          </div>

          <div className="input-container">
            <label>
              Query
              Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;
              <select
                id="selectedTemp"
                required
                name="Query_Names"
                value={formData["Query_Names"]}
                className="my-select"
                onChange={handleSelectedTemp}
              >
                <option value="">Select a Template</option>
                {templateList?.length > 0 ? (
                  templateList.map((item, index) => (
                    <option key={index} value={item.TEMPLATE_NAME}>
                      {item.TEMPLATE_NAME}
                    </option>
                  ))
                ) : (
                  <option value="">Loading...</option>
                )}
              </select>
            </label>
          </div>

          {/* <div className="input-container">
            <label>
              Query
              Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;
              <select
                name="Query_Names"
                onChange={handleCustomerFormData}
                required
                className="my-select"
              >
                <option value="">--Select--</option>
                <option value="customer_overlap">Customer Overlap</option>
                <option value="customer_overlap_multiparty">
                  Customer Overlap Multiparty
                </option>
                <option value="customer_enrichment">Customer Enrichment</option>
                <option value="customer_overlap_waterfall">
                  Customer Overlap Waterfall
                </option>
                <option value="customer_overlap_multiparty_subscribers">
                  Customer Overlap Multiparty Subscribers
                </option>
              </select>
            </label>
          </div> */}

          {/* <div className="input-container">
            <label>
              Provider Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp;
              <select
                name="Provider_Name"
                onChange={handleProviderChange}
                required
                className="my-select"
              >
                <option value="">--Select--</option>
                <option value="htmedia">HT Media</option>
                <option value="hoonartek">Hoonartek</option>
              </select>
            </label>
          </div> */}

          <div className="input-container">
            <label>
              Column Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp;
              <select
                className="my-select"
                multiple
                name="Column_Names"
                required
                onChange={handleSelectChange}
              >
                {selectedProvider &&
                  dependentOptions[selectedProvider].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </label>
          </div>

          <div className="input-container">
            <label>
              Consumer Name&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp;
              <select
                name="Consumer_Name"
                onChange={handleCustomerFormData}
                required
                className="my-select"
              >
                <option value="">--Select--</option>
                {user["name"] === "HTmedia" && (
                  <option value="htmedia">HT Media</option>
                )}
                {user["name"] === "Hoonartek" && (
                  <option value="hoonartek">Hoonartek</option>
                )}
                {user["name"] === "admin" && (
                  <option value="htmedia">HT Media</option>
                )}
                {user["name"] === "admin" && (
                  <option value="hoonartek">Hoonartek</option>
                )}
              </select>
            </label>
          </div>
          <div>
            <input
              style={{ marginLeft: "200px", alignItems: "center" }}
              type="submit"
              value="Submit Query Request"
            />
          </div>
        </div>
      </form>

      {tableHead?.length > 0 && tableRows?.length > 0 ? (
        <Table id={requestId} head={tableHead} rows={tableRows} />
      ) : null}
    </div>
  );
};

export default Queryform;
