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

const s3 = new AWS.S3({
  accessKeyId: "AKIA57AGVWXYVR36XIEC",
  secretAccessKey: "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",
  // signatureVersion: 'v4',
  region: "ap-south-1",
  // region: 'ap-south-1',
});

const initialState = {
  Query_Name: "",
  Provider_Name: "",
  Column_Names: "",
  Consumer_Name: "",
  File_Name: "",
  Match_Attribute: "",
  Match_Attribute_Value: "",
};

const Publisherform = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const user = state && state.user;
  const TableData =
    state && state.PublisherForm && state.PublisherForm.TableData;
  const requestId =
    state && state.PublisherForm && state.PublisherForm.RequestId;
  const queryName =
    state && state.PublisherForm && state.PublisherForm.QueryName;

  const [formData, setFormData] = useState({
    ...initialState,
    Provider_Name: user?.name,
    Consumer_Name: 'Hoonartek',
  });

  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("age_0_6");

  const [tableHead, setTableHead] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [fetchData, setFetchData] = useState(false);

  let [stopAPICall, setStopAPICall] = useState(1);

  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    console.log("Publisher stopAPICall", stopAPICall);

    if (
      stopAPICall !== 0 &&
      formData?.RunId &&
      formData?.RunId !== "" &&
      queryName &&
      queryName !== "" && submit
    ) {
      setFetchData(true);
      setTimeout(() => {
        fetchcsvTableData();
      }, 10000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, queryName, stopAPICall]);

  // useEffect for set match attribute values..
  useEffect(() => {
    if (formData["Match_Attribute"] === "gender") {
      setFormData({
        ...formData,
        Match_Attribute_Value: gender,
      });
    } else if (formData["Match_Attribute"] === "age") {
      setFormData({
        ...formData,
        Match_Attribute_Value: age,
      });
    } else if (formData["Match_Attribute"] === "overall") {
      setFormData({
        ...formData,
        Match_Attribute_Value: "overall",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [age, formData?.Match_Attribute, gender]);

  useEffect(() => {
    if (TableData) {
      setTableHead(TableData?.head || []);
      setTableRows(TableData?.rows || []);
    }
  }, [TableData]);

  const handleCustomerFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileInput = (event) => {
    event.preventDefault();
    var fileInput = document.getElementById("myFileInput");
    var file = fileInput.files[0];
    setFormData({ ...formData, File_Name: file.name });
  };

  // const isValidInput = (inputString) => {
  //   const regex = /^[0-9][0-9,-]*[0-9]$/; // regex pattern to match only comma, hyphen, and numeric values and start and end with numeric values
  //   return regex.test(inputString); // returns true if inputString matches the regex pattern, false otherwise
  // };

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
    event.preventDefault();
    setStopAPICall(1);

    setSubmit(true);

    formData.RunId = Date.now();

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

    s3.putObject(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`File uploaded successfully. ETag: ${data.ETag}`);
      }
    });

    var inputFile = document.getElementById("myFileInput");

    const params2 = {
      // Bucket: 'dcr-poc/query_request',
      Bucket: "dcr-poc",
      Key: "query_request_data/" + inputFile.files[0].name,
      Body: inputFile.files[0],
      // ACL: 'private',
    };

    s3.putObject(params2, (err, data) => {
      if (err) {
        console.log("err", err);
      } else {
        console.log("data", data);
      }
    });

    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query: `insert into DCR_SAMP_CONSUMER1.PUBLIC.dcr_query_request1(template_name,provider_name,columns,consumer_name,run_id,file_name,attribute_name,attribute_value) values ('${formData.Query_Name}', '${formData.Provider_Name}','${formData.Column_Names}','${formData.Consumer_Name}','${formData.RunId}', '${formData.File_Name}','${formData.Match_Attribute}','${formData.Match_Attribute_Value}');`,
        },
      })
      .then((response) => {
        if (response) {
          toast.success(`Request has been submitted successfully. Request Id: ${formData?.RunId}`);
          dispatch(
            actions.PublisherForm({
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

      setTimeout(() => {
        // Execute the second Axios request after the delay
        axios
          .get(`http://127.0.0.1:5000/${user?.name}`, {
            params: {
              query: `call DCR_SAMP_CONSUMER1.PUBLIC.PROC_BYPASS();`,
            },
          })
          .then((response) => {
            if (response) {
              toast.success(
                `Executing....... Request Id: ${formData?.RunId}`
  
              );
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
            toast.error(
              `We are facing some error in your request. Request Id: ${formData?.RunId}`
            );
          });
      }, 5000);

    const formData2 = new FormData();
    formData2.append("file", inputFile.files[0]);

    // fetch("http://localhost:5000/upload", {
    //   method: "POST",
    //   body: formData2,
    // })
    //   .then((response) => {
    //     console.log("response upload", response);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    const formData3 = new FormData();
    formData3.append("file", file1);

    // try {
    //   fetch("http://localhost:4040/upload2", {
    //     method: "POST",
    //     body: formData3,
    //   })
    //     .then((response) => {
    //       console.log(response);
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // } catch {
    //   console.log("Error in Upload 2")
    // }
  };

  const fetchTable = (data, requestId) => {
    let head = [];
    let row = [];
    if (data?.length > 0) {
      head = data && Object.keys(data[0]);
      data?.map((obj) => {
        return row.push(head?.map((key) => obj[key]));
      });
    }
    dispatch(
      actions.PublisherForm({
        TableData: { head: head, rows: row, reqId: requestId },
      })
    );
  };

  const fetchcsvTableData = async () => {
    axios
      .get(`http://127.0.0.1:5000/${user?.name}`, {
        params: {
          query: `select * from DCR_SAMP_CONSUMER1.PUBLIC.${queryName}_${formData?.RunId} limit 1000;`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          fetchTable(response?.data?.data, requestId);
          setStopAPICall(0);
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
      <h3 className="mt-4 text-xl font-bold text-deep-navy">Publisher query</h3>
      <div className="flex flex-row  gap-3  w-full">
        <div className="flex flex-col flex-shrink h-auto">
          <form
            className=" border border-gray-400 rounded my-4 px-4 py-2 h-auto  w-80 max-w-xs"
            name="myForm"
            onSubmit={handleSubmit}
          >
            <span className="text-sm mb-4 font-light text-coal">
              Advertiser record match
            </span>
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
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="MAID">MAID-WIP</option>
                </select>
              </div>

              <div className="mt-2 pb-21 flex flex-col">
                <label>Match Attribute</label>
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
                    Select Age
                    <label>
                      <input
                        type="radio"
                        value="age_0_6"
                        checked={age === "age_0_6"}
                        onChange={(e) => setAge(e.target.value)}
                      />
                      <span className="pl-2">0-6</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="age_7_16"
                        checked={age === "age_7_16"}
                        onChange={(e) => setAge(e.target.value)}
                      />
                      <span className="pl-2">7-16</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="age_17_25"
                        checked={age === "age_17_25"}
                        onChange={(e) => setAge(e.target.value)}
                      />
                      <span className="pl-2">17-25</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="age_26_40"
                        checked={age === "age_26_40"}
                        onChange={(e) => setAge(e.target.value)}
                      />
                      <span className="pl-2">26-40</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="age_41_above"
                        checked={age === "age_41_above"}
                        onChange={(e) => setAge(e.target.value)}
                      />
                      <span className="pl-2">41-above</span>
                    </label>
                  </div>
                )}
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

export default Publisherform;
