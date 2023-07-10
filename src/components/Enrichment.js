import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
import axios from "axios";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";

import * as actions from "../redux/actions/index";
import SelectDropdown from "./CommonComponent/SelectDropdown";

import Table from "./CommonComponent/Table";
import "./styles.css";
import "./pure-react.css";
import { Alert, SwipeableDrawer } from "@mui/material";
import enrichment from "../Assets/Profiling_Isometric.svg"
// import {AccessTimeIcon} from '@mui/icons-material/AccessTime';
import searchillustration from "../Assets/Target audience _Two Color.svg"

const s3 = new AWS.S3({
  accessKeyId: "AKIA57AGVWXYVR36XIEC",
  secretAccessKey: "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",
  // signatureVersion: 'v4',
  region: "ap-south-1",
  // region: 'ap-south-1',
});

const Enrichment = () => {


  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const user = state && state.user;
  const TableData = state && state.ConsumerForm && state.ConsumerForm.TableData;
  const requestId = state && state.ConsumerForm && state.ConsumerForm.RequestId;
  const fetchData = state && state.ConsumerForm && state.ConsumerForm.fetchData;

  const [formData, setFormData] = useState({
    Query_Name: "",
    Provider_Name: "",
    Column_Names: [],
    Consumer_Name: user?.Consumer,
    Attribute_Value: "",
  });

  const [tableHead, setTableHead] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  const [providerList, setProviderList] = useState([]);
  const [templateList, setTemplateList] = useState("");
  const [databaseName, setDatabaseName] = useState("");
  const [columns, setColumns] = useState([]);
  const [byPassAPICalled, setByPassAPICalled] = useState(false);

  const [Dstate, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
    search: false
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...Dstate, [anchor]: open });
  };


  useEffect(() => {
    if (TableData) {
      setTableHead(TableData?.head || []);
      setTableRows(TableData?.rows || []);
    }
  }, [TableData]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
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
  }, [user?.name]);

  useEffect(() => {
    if (databaseName !== "") {
      axios
        .get(`http://127.0.0.1:5000/${user?.name}`, {
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
  }, [databaseName, user?.name]);

  useEffect(() => {
    if (databaseName !== "" && formData["Query_Name"] !== "") {
      axios
        .get(`http://127.0.0.1:5000/${user?.name}`, {
          params: {
            query: `select allowed_columns from ${databaseName}.CLEANROOM.TEMPLATES where template_name='${formData["Query_Name"]}';`,
          },
        })
        .then((response) => {
          if (response?.data) {
            let col_name = response?.data?.data[0]?.ALLOWED_COLUMNS?.split("|");
            col_name = col_name?.map((item) => {
              return item?.split(".")[1];
            });

            let temp = [];
            temp.push({ value: "all", name: "All" });
            col_name?.map((value) => {
              return temp.push({ value: value, name: value });
            });
            setColumns(temp);
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
      .get(`http://127.0.0.1:5000/${user?.name}`, {
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

  const handleChange = (event, name) => {
    const element = "all";
    const index = event?.indexOf(element);

    if (event?.includes("all")) {
      let allSelect = columns?.map((obj) => {
        return obj.value;
      });
      if (index !== -1) {
        allSelect?.splice(index, 1);
      }
      setFormData({
        ...formData,
        [name]: allSelect,
      });
    } else {
      setFormData({
        ...formData,
        [name]: event,
      });
    }
  };

  const callByPassAPI = () => {
    setByPassAPICalled(true);
    setTimeout(() => {
      axios
        .get(`http://127.0.0.1:5000/${user?.name}/procedure`, {
          params: {
            query: `call DCR_SAMP_CONSUMER1.PUBLIC.PROC_BYPASS_1();`,
          },
        })
        .then((response) => {
          if (response) {
            fetchcsvTableData();
            setByPassAPICalled(false);
          } else {
            setByPassAPICalled(false);
            dispatch(
              actions.ConsumerQueryForm({
                fetchData: false,
              })
            );
          }
        })
        .catch((error) => {
          console.log(error);
          setByPassAPICalled(false);
          dispatch(
            actions.ConsumerQueryForm({
              fetchData: false,
            })
          );
        });
    }, 5000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (byPassAPICalled) {
      toast.error(
        "We are fetching the data for current request. Please wait..."
      );
      return;
    }
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
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query: `insert into DCR_SAMP_CONSUMER1.PUBLIC.dcr_query_request1(template_name,provider_name,columns,consumer_name,run_id, attribute_value) values ('${formData.Query_Name}', '${formData.Provider_Name}','${formData.Column_Names}','${formData.Consumer_Name}','${formData.RunId}', '${formData.Attribute_Value}');`,
        },
      })
      .then((response) => {
        if (response) {
          dispatch(
            actions.ConsumerQueryForm({
              RequestId: formData?.RunId,
              fetchData: true,
            })
          );
          callByPassAPI();
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
        TableData: { head: head, rows: row },
        fetchData: false,
      })
    );
  };

  const fetchcsvTableData = async () => {
    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query: `select * from DCR_SAMP_CONSUMER1.PUBLIC.${formData?.Query_Name}_${formData?.RunId} limit 1000;`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          fetchTable(response?.data?.data, formData?.RunId);
          toast.success(
            `Data fetched successfully. Request Id: ${formData?.RunId}`
          );
        }
      })
      .catch((error) => {
        console.log("In API catch", error);
      });
  };

  return (
    <div className="flex flex-col w-full px-4">
      <div className="flex flex-row justify-between items-center w-full mt-2 mb-4">
        <div>
          <h3 className="text-xl font-bold text-deep-navy mr-2">Consumer query</h3>
          <p>Choose your provider to run a consumer query based on your parameters.</p>
        </div>
        {['right'].map((anchor) => (
          <React.Fragment key={anchor}>
            <button
              className="my-2 pr-4 flex items-center justify-center rounded-md bg-deep-navy px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-electric-green hover:text-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"
              onClick={toggleDrawer(anchor, true)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>


              Create new</button>
            <SwipeableDrawer
              anchor={anchor}
              open={Dstate[anchor]}
              onClose={toggleDrawer(anchor, false)}
              onOpen={toggleDrawer(anchor, true)}
            >
              <div className="flex flex-col flex-shrink h-full w-full px-5    bg-deep-navy text-electric-green">
                <img
                  className="absolute  w-96  bottom-1 opacity-90 z-10 right-0 text-amarant-400"
                  src={searchillustration}
                  alt=""
                />  
                <form
                  className=" z-20  my-4 px-4 py-2 h-full w-96  bg-deep-navy"
                  name="myForm"
                  onSubmit={handleSubmit}
                >
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-semibold">New consumer query</h3>
                    <button onClick={toggleDrawer('right', false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div clas>
                    <div className="mt-2 pb-2 flex flex-col">
                      <label>Provider name</label>
                      <select
                        id="provider"
                        name="Provider_Name"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
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
                        className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
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

                    <div className="mt-2 pb-2 flex flex-col">
                      <SelectDropdown
                        title="Columns"
                        mode="multiple"
                        name="Column_Names"
                        value={formData?.Column_Names}
                        placeholder="Select columns"
                        data={columns}
                        setValue={(e, value) => {
                          handleChange(e, value);
                        }}
                      />
                    </div>

                    <div className="mt-2 pb-21 flex flex-col">
                      <label>Identifier type</label>
                      <select
                        name="Attribute_Value"
                        onChange={handleCustomerFormData}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-electric-green bg-blend-darken bg-deep-navy shadow-sm ring-1 ring-inset ring-true-teal placeholder:text-true-teal focus:ring-2 focus:ring-inset focus:ring-electric-green sm:text-sm sm:leading-6"
                      >
                        <option value="">Please select</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="MAID">MAID</option>
                      </select>
                    </div>

                    <div className="flex justify-end">
                      <button
                        className="flex w-full justify-center rounded-md bg-electric-green px-3 py-1.5 text-sm font-semibold leading-6 text-deep-navy shadow-sm hover:bg-true-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green mt-4"
                        type="submit"
                      >
                        Submit query
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </SwipeableDrawer>
          </React.Fragment>
        ))}
      </div>

      <img
        className="absolute  w-2/5 -z-50 bottom-1 opacity-20 -right-20  text-amarant-400"
        src={enrichment}
        alt=""
      />
      <div className="flex flex-row  gap-3  w-full">

        {!fetchData ? (
          <div className=" flex flex-grow">
            {tableHead?.length > 0 && tableRows?.length > 0 ? (
              <Table id={requestId} head={tableHead} rows={tableRows} />
            ) : null}
          </div>
        ) : (

          <Alert 
            // icon={<AccessTimeIcon fontSize="inherit" />} 
            severity="info"
          >
            We are fetching the data you requested: Request Id - <strong> {requestId}</strong>
          </Alert>

        )}
      </div>
    </div>
  );
};

export default Enrichment;
