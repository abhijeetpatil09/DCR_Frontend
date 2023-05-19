import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
import axios from "axios";
import { toast } from "react-toastify";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import * as actions from "../redux/actions/index";

import Table from "./CommonComponent/Table";
import "./styles.css";
import "./pure-react.css";

const initialState = {
  Query_Name: "",
  Provider_Name: "",
  Column_Names: "",
  Consumer_Name: "",
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
  const requestId = state && state.ConsumerForm && state.ConsumerForm.RequestId;
  const queryName =
    state && state.PublisherForm && state.ConsumerForm.QueryName;

  const [formData, setFormData] = useState(initialState);
  const [tableHead, setTableHead] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  const [providerList, setProviderList] = useState([]);
  const [templateList, setTemplateList] = useState("");
  const [databaseName, setDatabaseName] = useState("");
  const [colunms, setColumns] = useState([]);
  const [fetchData, setFetchData] = useState(false);
  let [stopAPICall, setStopAPICall] = useState(1);

  useEffect(() => {
    console.log("Consumer stopAPICall", stopAPICall);

    if (
      stopAPICall !== 0 &&
      requestId &&
      requestId !== "" &&
      queryName &&
      queryName !== ""
    ) {
      setFetchData(true);
      setTimeout(() => {
        fetchcsvTableData();
      }, 30000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, queryName, stopAPICall]);

  useEffect(() => {
    if (TableData) {
      setTableHead(TableData?.head || []);
      setTableRows(TableData?.rows || []);
    }
  }, [TableData]);

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
            console.log("Template list", response?.data);
            setTemplateList(response.data.data);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [databaseName]);

  useEffect(() => {
    if (databaseName !== "" && formData["Query_Name"] !== "") {
      axios
        .get("http://127.0.0.1:5000/data_fetcher", {
          params: {
            query: `select dimensions from ${databaseName}.CLEANROOM.TEMPLATES where template_name='${formData["Query_Name"]}';`,
          },
        })
        .then((response) => {
          if (response?.data) {
            console.log("response?.data", response?.data);
            let col_name = response?.data?.data[0]?.DIMENSIONS?.split("|");
            col_name = col_name?.map((item) => {
              return item?.split(".")[1];
            });
            console.log("col_name", col_name);

            setColumns(col_name);
          }
        })
        .catch((error) => console.log(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [databaseName, formData["Query_Name"]]);

  const handleSelectProvider = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setTemplateList([]);
    getDatabaseName(event.target.value);
  };

  const handleSelectedTemp = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
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
    });
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
    });
    // setSelectedColumns(selectedOptions);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStopAPICall(1);

    formData.RunId = Date.now();

    const keys = Object.keys(formData);
    let csv = keys.join(",") + "\n";
    for (const obj of [formData]) {
      const values = keys.map((key) => obj[key]);
      csv += values.join(",") + "\n";
    }

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
        formData["Query_Name"] +
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

    s3.putObject(params, (err, data) => {
      if (err) {
        console.log("err", err);
      } else {
        console.log("data", data);
      }
    });

    axios
      .get("http://127.0.0.1:5000/data_fetcher", {
        params: {
          query: `insert into DCR_SAMP_CONSUMER1.PUBLIC.dcr_query_request1(template_name,provider_name,columns,consumer_name,run_id) values ('${formData.Query_Name}', '${formData.Provider_Name}','${formData.Column_Names}','${formData.Consumer_Name}','${formData.RunId}');`,
        },
      }).then((response) => {
        if(response) {
          toast.success(`Request has been submitted successfully. Request Id: ${formData?.RunId}`);
          dispatch(
            actions.ConsumerQueryForm({
              QueryName: formData?.Query_Name,
              RequestId: formData?.RunId,
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(`We are facing some error in your request. Request Id: ${formData?.RunId}`);
      });

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
  };

  const fetchTable = (data, runId) => {
    let head = [];
    let row = [];
    if (data?.length > 0) {
      head = data && Object.keys(data[0]);
      data?.map((obj) => {
        return row.push(head?.map((key) => obj[key]));
      });
    }
    dispatch(
      actions.ConsumerQueryForm({
        RequestId: runId,
        TableData: { head: head, rows: row, reqId: requestId },
      })
    );
  };

  const fetchcsvTableData = async () => {
    axios
      .get("http://127.0.0.1:5000/data_fetcher", {
        params: {
          query: `select * from DCR_SAMP_CONSUMER1.PUBLIC.${queryName}_${requestId} limit 1000;`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          setStopAPICall(0);
          fetchTable(response?.data?.data, requestId);
          setFetchData(false);
          toast.success(`Data fetched successfully. Request Id: ${requestId}`);
        }
      })
      .catch((error) => {
        setStopAPICall(++stopAPICall);
        console.log("In API catch", error);
      });
  };

  return (
    <div className="flex flex-col  ">
      <h3 className="mt-4 text-xl font-bold text-deep-navy">Consumer query</h3>
      <div className="flex flex-row  gap-3  w-full">
        <div className="flex flex-col flex-shrink h-auto">
          <form
            className="border border-gray-400 rounded my-4 px-4 py-2   w-80 max-w-xs"
            name="myForm"
            onSubmit={handleSubmit}
          >
            <span className="text-sm mb-4 font-light text-coal">
              Query request
            </span>
            <div>
              <div className="mt-2 pb-2 flex flex-col">
                <label>Provider Name</label>
                <select
                  id="provider"
                  name="Provider_Name"
                  required
                  className="w-full"
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
              </div>

              <div className="mt-2 pb-2 flex flex-col">
                <label>Query name </label>
                <select
                  id="selectedTemp"
                  required
                  name="Query_Name"
                  value={formData["Query_Name"]}
                  className="w-full"
                  onChange={handleSelectedTemp}
                >
                  <option value="">Select a template</option>
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
              </div>

              {/* <div className="input-container">
              <label>
                Query
                Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;
                <select
                  name="Query_Name"
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

              <div className="mt-2 pb-2 flex flex-col">
                <label>Column name</label>
                <select
                  className="w-full"
                  multiple
                  name="Column_Names"
                  required
                  onChange={handleSelectChange}
                >
                  {colunms &&
                    colunms.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mt-2 pb-2 flex flex-col">
                <label>Consumer name</label>
                <select
                  name="Consumer_Name"
                  onChange={handleCustomerFormData}
                  required
                  className="w-full"
                >
                  <option value="">--Select--</option>
                  {user["name"] === "HTmedia" && (
                    <option value="htmedia">HT Media</option>
                  )}
                  {user["name"] === "Hoonartek" && (
                    <option value="Hoonartek">Hoonartek</option>
                  )}
                  {user["name"] === "admin" && (
                    <option value="htmedia">HT Media</option>
                  )}
                  {user["name"] === "admin" && (
                    <option value="hoonartek">Hoonartek</option>
                  )}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  className="my-2 flex w-full justify-center rounded-md bg-deep-navy px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-electric-green hover:text-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"
                  type="submit"
                >
                  Submit query
                </button>
              </div>
            </div>
          </form>
        </div>
        {!fetchData ? (
          <div className=" flex flex-grow">
            {tableHead?.length > 0 && tableRows?.length > 0 ? (
              <Table id={requestId} head={tableHead} rows={tableRows} />
            ) : null}
          </div>
        ) : (
          <span className="text-deep-navy flex flex-grow mt-4">
            We are fetching the data you requested: Request Id -{" "}
            <strong>{requestId}</strong>
          </span>
        )}
      </div>
    </div>
  );
};

export default Queryform;
