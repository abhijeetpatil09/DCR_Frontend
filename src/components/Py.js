import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

const SnowflakeDataFetcher = () => {
  const state = useSelector((state) => state);

  const user = state && state.user;
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/${user?.name}`, {
      params: {
        query: 'select * from API_TEST.PUBLIC.STUDENTS;'
      }
    })
    .then(response => setData(response.data.data))
    .catch(error => console.log(error));
  }, [user?.name]);

  return (
    <table>
      <thead>
        <tr>
                <th>Agent Code</th>
                <th>Agent Name</th>
                <th>Commision</th>
                <th>Country</th>
                <th>Phone No</th>
                <th>Working Area</th>
        </tr>
      </thead>
      <tbody>
      {data.map((item) =>
                  <tr key={item.AGENT_CODE}>
                    <td>{item.AGENT_CODE}</td>
                    <td>{item.AGENT_NAME}</td>
                    <td>{item.COMMISSION}</td>
                    <td>{item.COUNTRY}</td>
                    <td>{item.PHONE_NO}</td>
                    <td>{item.WORKING_AREA}</td>
                  </tr>
        )}
      </tbody>
    </table>
  );
}

export default SnowflakeDataFetcher;

// function Py() {
//   const [data, setData] = useState({});

//   function fetchData(query) {
//     const url = `http://localhost:5000/data_fetcher?query=select%20*%20from%20API.PUBLIC.agent`;
//     axios.get(url)
//       .then(response => setData(response.data))
//       .catch(error => console.log(error))
//       console.log(data);
//   }
//   function handleFetch(query) {
//     fetchData(query);
//   }

//   return (
//     <div className="container">
//       <div className="col">
//     <div className='mt-4 col-10 offset-1'>
//           <table className="table table-striped">
//             <thead>
//               <tr>
//                 <th className="table-primary">Agent Code</th>
//                 <th className="table-primary">Agent Name</th>
//                 <th className="table-primary">Commision</th>
//                 <th className="table-primary">Country</th>
//                 <th className="table-primary">Phone No</th>
//                 <th className="table-primary">Working Area</th>
//               </tr>
//             </thead>
//             <tbody>
//               {
//                 data.map((item) =>
//                   <tr key={item.AGENT_CODE}>
//                     <td>{item.AGENT_NAME}</td>
//                     <td>{item.COMMISSION}</td>
//                     <td>{item.COUNTRY}</td>
//                     <td>{item.PHONE_NO}</td>
//                     <td>{item.WORKING_AREA}</td>
//                   </tr>
//                 )
//               }
//             </tbody>
//           </table>
//         </div>
//         </div>
//         </div>
//   );
// }

// export default Py;
