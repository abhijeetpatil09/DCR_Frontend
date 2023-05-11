import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';


import "./styles.css";


const S3fileupload = () => {

  
  const s3 = new AWS.S3();

  AWS.config.update({
    accessKeyId: 'AKIA57AGVWXYVR36XIEC',
    secretAccessKey: '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',
    region: 'ap-south-1'
  });

  const [files, setFiles] = useState([]);

  const BUCKET_NAME = 'dcr-poc';

  const prefix = "query_request/";

  useEffect(() => {
    
    const params = {
      Bucket: BUCKET_NAME
    };

    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      setFiles(data.Contents.filter(file => file.Key.startsWith(prefix)).filter(file => file.Key !== prefix).sort((a, b) => b - a));
    });
  }, []);

  const downloadFile = (key) => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    s3.getObject(params, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const url = URL.createObjectURL(new Blob([data.Body]));
      const link = document.createElement('a');
      link.href = url;
      link.download = key;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };


  return (
    <div className='app'>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            {/* <th>Size</th> */}
            <th>Last Modified</th>
            <th>Query Request Progress</th>
            <th>Download Link</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.Key}>
              <td>{file.Key.slice(prefix.length)}</td>
              {/* <td>{file.Size}</td> */}
              <td>{file.LastModified.toString()}</td>
              <td>In Progress</td>
              {/* <td>
                <a id='download-link.com' href='#' onClick={downloadFileFromS3(file.Key)} target="_blank" rel="noopener noreferrer">
                  Link
                </a>
              </td> */}
              <td>
                <button onClick={() => downloadFile(file.Key)}>Download File</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default S3fileupload