import axios from 'axios';
import React, { useState, useEffect } from 'react';
import "./styles.css";
// import AWS from 'aws-sdk';
import "./pure-react.css";



const Querystatus = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/data_fetcher', {
      params: {
        query: 'select * from DCR_SAMP_CONSUMER1.PUBLIC.DASHBOARD_TABLE;'
      }
    })
    .then(response => setData(response.data.data))
    .catch(error => console.log(error));
  }, []);

  const downloadFile = (TEMPLATE_NAME, RUN_ID)  =>{
    axios.get('http://127.0.0.1:5000/data_fetcher', {
      responseType: 'arraybuffer',
      params: {
        query: `select * from DCR_SAMP_CONSUMER1.PUBLIC.${TEMPLATE_NAME}_${RUN_ID};`
      }
    }).then(response => {
      // Convert the response data to a CSV format
      const csvData = new Blob([response.data], {type: 'text/csv;charset=utf-8;'});
      const csvUrl = URL.createObjectURL(csvData);

      const link = document.createElement('a');
      link.setAttribute('href', csvUrl);
      link.setAttribute('download', `${TEMPLATE_NAME}_${RUN_ID}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
     });
  };
  
  return (
    <div className=' '>
       <h3 class="my-4 text-xl font-bold bg-white text-deep-navy">Query status</h3>
         <table className='w-full' >
         <thead>
            <tr>
                <th>Request ID</th>
                <th>Template name</th>
                <th>Provider name</th>
                <th>Column names</th>
                <th>Status</th>
                <th>Last modified Date & Time</th>
                <th>Download O/P file</th>
            </tr>
         </thead>
      <tbody>
      {data.map((item) =>
                  <tr key={item.RUN_IDE} className='bg-white px-2 py-1 border-b border-gray-200 hover:bg-gray-500'>
                    <td>{item.RUN_ID}</td>
                    <td>{item.TEMPLATE_NAME}</td>
                    <td>{item.PROVIDER_NAME}</td>
                    <td>{item.COLOUMNS}</td>
                    <td>{item.STATUS}</td>
                    <td>{new Date().toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => downloadFile(item.TEMPLATE_NAME, item.RUN_ID)}
                        className='flex flex-row items-center justify-center'
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        <span className='pl-2 underline'>Download</span>
                      </button>
                    </td>
                  </tr>
           )}
      </tbody>
    </table>
    </div>
  );
  
  

}

export default Querystatus


// const s3 = new AWS.S3();

//   AWS.config.update({
//     accessKeyId: 'AKIA57AGVWXYVR36XIEC',
//     secretAccessKey: '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',
//     region: 'ap-south-1'
//   });

//   const [files, setFiles] = useState([]);
//   const [allfiles, setAllFiles] = useState([]);
//   const BUCKET_NAME = 'dcr-poc';

//   const prefix1 = "query_request/";
//   const prefix2 = "triggers/rejected/";
//   const prefix3 = "triggers/approved/";
//   const prefix4 = 'query_result_tables/1678094783921/'

//   const sendEmail = () => {

//   }
//   useEffect(() => {
    
//     const params = {
//       Bucket: BUCKET_NAME
//     };

//     s3.listObjectsV2(params, (err, data) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       console.log(data)
//       setAllFiles(data.Contents.map((file)=> file.Key))
//       const sortedFiles = data.Contents.sort((a, b) => b.LastModified - a.LastModified).filter(file => file.Key.startsWith(prefix1)).filter(file => file.Key !== prefix1);
//       setFiles(sortedFiles)
//       // setFiles(data.Contents.filter(file => file.Key.startsWith(prefix)).filter(file => file.Key !== prefix));
//     });
//   }, []);

//   const downloadFile = (key) => {
//     const params = {
//       Bucket: BUCKET_NAME,
//       Key: key
//     };

//     s3.getObject(params, (err, data) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       console.log(data.Body.toString('utf-8'))
//       const url = URL.createObjectURL(new Blob([data.Body]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = key.slice(prefix4.length);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     });
//   };


//   return (
//     <div className='homecenter'>
//       <br></br>
//       <h2>Your Query Request Status</h2>
//       <br></br>
//       <table style={{margin : 'auto'}}>
//         <thead>
//           <tr>
//             <th>RunID</th>
//             <th>Name</th>
//             <th>Requested Time</th>
//             <th>Download Request Info</th>
//             <th>Query Request Progress</th>
//             <th>O/P Download Link</th>
//             <th>Run Ad. Campaign</th>
//           </tr>
//         </thead>
//         <tbody>
//           {files.map((file) => (
//             <tr key={file.Key}>
//               <td>{file.Key.slice( file.Key.lastIndexOf("_")+1, file.Key.indexOf("."))}</td>
//               {allfiles.indexOf('triggers/approved/'+ file.Key.slice(file.Key.lastIndexOf("_")+1, file.Key.indexOf("."))+'/'+ file.Key.slice(prefix1.length, file.Key.indexOf("."))+ '.csv') !== -1 
//               && <td>{file.Key.slice(prefix1.length)}</td>}
//               {allfiles.indexOf('triggers/approved/'+ file.Key.slice(file.Key.lastIndexOf("_")+1, file.Key.indexOf("."))+'/'+ file.Key.slice(prefix1.length, file.Key.indexOf("."))+ '.csv') === -1 
//               && <td>-</td>}
//               <td>{file.LastModified.toString().slice(0,24)}</td>
//               <td><button onClick={() => downloadFile(file.Key)}>Download File</button></td>
//               {allfiles.indexOf('triggers/rejected/'+ file.Key.slice(file.Key.lastIndexOf("_")+1, file.Key.indexOf("."))+'/'+ file.Key.slice(prefix1.length, file.Key.indexOf("."))+ '.csv') !== -1 
//               && <td>Rejected</td>}
//               {allfiles.indexOf('triggers/approved/'+ file.Key.slice(file.Key.lastIndexOf("_")+1, file.Key.indexOf("."))+'/'+ file.Key.slice(prefix1.length, file.Key.indexOf("."))+ '.csv') !== -1 
//               && <td>Approved</td>}
//               {allfiles.indexOf('triggers/approved/'+ file.Key.slice(file.Key.lastIndexOf("_")+1, file.Key.indexOf("."))+'/'+ file.Key.slice(prefix1.length, file.Key.indexOf("."))+ '.csv') === -1
//               && allfiles.indexOf('triggers/rejected/'+ file.Key.slice(file.Key.lastIndexOf("_")+1, file.Key.indexOf("."))+'/'+ file.Key.slice(prefix1.length, file.Key.indexOf("."))+ '.csv') === -1  
//               && <td>In Progress</td>}
//               {allfiles.indexOf('triggers/approved/'+ file.Key.slice(file.Key.lastIndexOf("_")+1, file.Key.indexOf("."))+'/'+ file.Key.slice(prefix1.length, file.Key.indexOf("."))+ '.csv') !== -1 
//               && <td><button onClick={() => downloadFile('query_result_tables/'+file.Key.slice(file.Key.lastIndexOf("_")+1, file.Key.indexOf("."))+'/'+ file.Key.slice(prefix1.length, file.Key.indexOf("."))+ '.csv')}>Download File</button></td>}
//               {allfiles.indexOf('triggers/approved/'+ file.Key.slice(file.Key.lastIndexOf("_")+1, file.Key.indexOf("."))+'/'+ file.Key.slice(prefix1.length, file.Key.indexOf("."))+ '.csv') === -1 
//               && <td>NA</td>}
//               {allfiles.indexOf('triggers/approved/'+ file.Key.slice(file.Key.lastIndexOf("_")+1, file.Key.indexOf("."))+'/'+ file.Key.slice(prefix1.length, file.Key.indexOf("."))+ '.csv') !== -1
//               && <td><button onClick={() => sendEmail()}>Click to Start</button></td>}
//               {allfiles.indexOf('triggers/approved/'+ file.Key.slice(file.Key.lastIndexOf("_")+1, file.Key.indexOf("."))+'/'+ file.Key.slice(prefix1.length, file.Key.indexOf("."))+ '.csv') === -1
//               && <td>NA</td>}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>

//   );