import logo from './logo.svg';
import './App.css';
import ReactDOM from "react-dom";
import Login from "./components/Login";
import Queryform from './components/Queryform';
import Querystatus from './components/Querystatus';
import PureReact from "./components/PureReact";
import Requestinfo from './components/Requestinfo';
import Home from './components/Home';
import S3fileupload from './components/S3fileupload';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import myBackgroundImage from "./Assets/DCR-background.png";
import Publisherform from './components/Publisherform';
import SnowflakeDataFetcher from './components/Py';

function App() {


  return (
    <BrowserRouter>
        <div>
          <PureReact>
            <Routes>
              <Route path='/' element = {<Login/>} />
              <Route path='/home' element = {<Home/>} />
              <Route path='/queryform' element = {<Queryform/>} />
              <Route path='/querystatus' element = {<Querystatus/>} />
              <Route path='/requestinfo' element = {<Requestinfo/>} />
              <Route path='/publisherform' element = {<Publisherform/>} />
              <Route path='/s3fileupload' element = {<S3fileupload/>} />
            </Routes>
          </PureReact>
          {/* <div>
      <h1>Snowflake Data Fetcher</h1>
      <SnowflakeDataFetcher />
    </div> */}
        </div>
    </BrowserRouter>

    // <div>
    //   <h1>Snowflake Data Fetcher</h1>
    //   <SnowflakeDataFetcher />
    // </div>
  );
}

export default App;
