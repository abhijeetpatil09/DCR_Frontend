import React from 'react'
import "./styles.css";
import "./pure-react.css";

const  Requestinfo = () => {

    return (

        <div className="flex flex-col">
          <h3 class="my-4 text-xl font-bold text-deep-navy">Reports</h3>
             {/* <h2>Query Request Reports</h2> */}
            <table className='w-full'>
                <thead>
                <tr>    
                    <th>Query Request</th>
                    <th>Download Link</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Previous month</td>
                    <td key='download-link.com'>
                      <a href='download-link.com' className='flex flex-row items-center' target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                        <span className='pl-2'>Link</span>
                      </a>
                    </td>
                </tr>
                <tr>
                    <td>Last 10 Days</td>
                    <td key='download-link.com'>
                      <a href='download-link.com' className='flex flex-row items-center' target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                        <span className='pl-2'>Link</span>
                      </a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Requestinfo