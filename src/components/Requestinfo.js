import React from 'react'
import "./styles.css";
import "./pure-react.css";

const  Requestinfo = () => {

    return (

        <div className="homecenter">
          <br></br>
            <h2>Query Request Reports</h2>
            <table style={{marginLeft : '130px'}}>
                <thead>
                <tr>    
                    <th>Query Request</th>
                    <th>Download Link</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Privious month</td>
                    <td key='download-link.com'>
                      <a href='download-link.com' target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </td>
                </tr>
                <tr>
                    <td>Last 10 Days</td>
                    <td key='download-link.com'>
                      <a href='download-link.com' target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Requestinfo