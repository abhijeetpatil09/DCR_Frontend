import React, { useState } from 'react'
import AWS from 'aws-sdk';
import myBackgroundImage from '../Assets/DCR-background.png';
// import * as snowflake from 'snowflake-sdk';
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

import "./styles.css";
import "./pure-react.css";

const timestamp = Date.now();
const dateObj = new Date(timestamp);


const year = dateObj.getFullYear();
const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
const day = dateObj.getDate().toString().padStart(2, '0');
const hours = dateObj.getHours().toString().padStart(2, '0');
const minutes = dateObj.getMinutes().toString().padStart(2, '0');
const seconds = dateObj.getSeconds().toString().padStart(2, '0');

const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
console.log(formattedDate); 


const initialState = {
    Query_Names: '',
    Provider_Name: '',
    Column_Names: '',
    Consumer_Name: '',
    RunId: formattedDate,
}

const options = [
    { value: 'hoonartek', label: 'Hoonartek' },
    { value: 'htmedia', label: 'HT Media' },
];

const dependentOptions = {
    hoonartek: [
        { value: 'age_band', label: 'Age Band' },
        { value: 'status', label: 'Status' },
    ],
    htmedia: [
        { value: 'cohort_name', label: 'COHORT NAME' },
        { value: 'cdp_sh_fname', label: 'CDP SH FNAME' },
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



const Queryform = () => {
    const [formData, setFormData] = useState(initialState)
    const [selectedColumns, setSelectedColumns] = useState([]);
    const user = useSelector(selectUser)
    const handleCustomerFormData = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value, RunId : Date.now() })
        console.log(formData)   
    }

    const [selectedFruit, setSelectedFruit] = useState('');
  
    const handleFruitChange = (e) => {
        setSelectedFruit(e.target.value);
        setFormData({ ...formData, [e.target.name]: e.target.value, RunId : Date.now() })
        console.log(formData)
    };

    const handleSelectChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions).map((option) => option.value);
        const delimiter = '&';
        const selectedOptionsString = `#${selectedOptions.join(delimiter)}#`;
        setFormData({ ...formData, [event.target.name]: selectedOptionsString, RunId : Date.now() })
        console.log(formData)
        // setSelectedColumns(selectedOptions);
    };

    const handleSubmit = (event) => {
        
        
        event.preventDefault();

        console.log(formData)
        console.log(document.getElementsByName('Query_Names')[0])

        // formData.Query_Names = document.getElementsByName('Query_Names')[0].selectedOptions[0].value
        // formData.Provider_Name = document.getElementsByName('Provider_Name')[0].selectedOptions[0].value
        // // formData.Column_Names = document.getElementsByName('Column_Names')[0].selectedOptions[0].value
        // formData.Consumer_Name = document.getElementsByName('Consumer_Name')[0].selectedOptions[0].value
        setFormData({ ...formData, RunId : Date.now() })
        console.log(formData)
        const keys = Object.keys(formData);
        let csv = keys.join(',') + '\n';
        for (const obj of [formData]) {
            const values = keys.map(key => obj[key]);
            csv += values.join(',') + '\n';
        }


        console.log(csv)
        const blob = new Blob([csv], { type: 'text/csv' });
        // const url = URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // link.href = url;
        // link.download = formData['RunId'] +'.csv';
        // document.body.appendChild(link);
        // link.click();

        const s3 = new AWS.S3({
        accessKeyId: 'AKIA57AGVWXYVR36XIEC',
        secretAccessKey: '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',
        // signatureVersion: 'v4',
        region: 'ap-south-1',
        // region: 'ap-south-1',
        });
    
        const params = {
        // Bucket: 'dcr-poc/query_request',
        Bucket: 'dcr-poc',
        Key: 'query_request/' + formData['Query_Names'] +'_' + formData['RunId'] +".csv",
        Body: blob,
        // ACL: 'private',
        };

        // s3.listBuckets(function(err, data) {
        //     if (err) console.log(err, err.stack);
        //     else console.log(data);
        // });

        s3.putObject(params, (err, data) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`File uploaded successfully. ETag: ${data.ETag}`);
              alert('Request has been submitted successfully')
            }
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

    } 
    
    return (
        <div className="home">
            <form name = 'myForm' onSubmit={handleSubmit}>
                <br></br>
                <div style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', padding: '10px', width: '600px', height: '450px', margin: 'auto', backgroundColor: '#f0f9ff' }}>
                    <h2 style={{textAlign: 'center'}}>Submit your Query Request</h2>
                    <br></br>
                    <div className="input-container">
                        <label>
                        Query Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;
                            <select name = "Query_Names" onChange={handleCustomerFormData} required className='my-select'>
                                <option value="">--Select--</option>
                                <option value="customer_overlap">Customer Overlap</option>
                                <option value="customer_overlap_multiparty">Customer Overlap Multiparty</option>
                                <option value="customer_enrichment">Customer Enrichment</option>
                                <option value="customer_overlap_waterfall">Customer Overlap Waterfall</option>
                                <option value="customer_overlap_multiparty_subscribers">Customer Overlap Multiparty Subscribers</option>
                            </select>
                        </label>
                    </div>
                                    
                    <div className="input-container">
                        <label>
                            Provider Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp;
                            <select name = "Provider_Name" onChange={handleFruitChange} required className='my-select'>
                                <option value="">--Select--</option>
                                <option value="htmedia">HT Media</option>
                                <option value="hoonartek">Hoonartek</option>
                            </select>
                        </label>
                    </div>

                    <div className="input-container">    
                        <label>
                            Column Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp;
                            <select className='my-select' multiple name = "Column_Names" required onChange={handleSelectChange}>
                                {selectedFruit &&
                                dependentOptions[selectedFruit].map((option) => (
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
                            <select name = "Consumer_Name" onChange={handleCustomerFormData} required className='my-select'>
                                <option value="">--Select--</option>
                                {user['name'] === 'HTmedia' && <option value="htmedia">HT Media</option>}
                                {user['name'] === 'Hoonartek' && <option value="hoonartek">Hoonartek</option>}
                                {user['name'] === 'admin' && <option value="htmedia">HT Media</option>}
                                {user['name'] === 'admin' && <option value="hoonartek">Hoonartek</option>}
                            </select>
                        </label>
                    </div>
                    <div>
                    <input style={{marginLeft: '200px', alignItems: 'center'}} type="submit" value="Submit Query Request" />                
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Queryform