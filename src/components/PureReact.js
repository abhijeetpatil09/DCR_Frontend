import { useState } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import "./pure-react.css";
import "./styles.css";
import HoonartekLogo from '../Assets/HtMediaGroup.png';
import myBackgroundImage from '../Assets/DCR-background.png';
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { selectUser } from "../features/userSlice";

const PureReact = ({ children }) => {
  const [isOpened, setIsOpened] = useState(false);
  const user = useSelector(selectUser)
  const navigate = useNavigate()
  console.log(user);
  console.log(user['role']);
  const navigateTo =(page)=>{
    navigate(page)
  }
  const styles = {
    backgroundImage: `url(${myBackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '300px',
    width: '100%',
  };

  return (
    <div className="App">
      <div className="header">
        <div className="icon" onClick={() => setIsOpened(!isOpened)}>
          {isOpened ? <ChevronLeftIcon /> : <MenuIcon />}
        </div>
        {/* <div>
          <h1 class="hoonartek-title">h</h1>
        </div> */}
        <div>
          <img src={HoonartekLogo} alt = 'Image Description' width="100" height="40"/>
        </div>
        {/* <div>
          <h1 class="hoonartek-title">nartek</h1>
        </div> */}
        <div className="header-title ">Distributed Data Clean Room</div>
        <div className="headerleft">
          <NavLink to = '/' style={{color: "white"}}>Sign In</NavLink>
        </div>
      </div>
      <div className="container">
        <aside className={`${isOpened ? "opened" : ""} drawer`}><h3>Menu</h3>
          <div className="button-container">
            <nav>
              <button className="custom-button" onClick={() => navigateTo('/home')}>Home</button>
              {user['role'] && user['role'].includes("Provider") && <button className="custom-button" >Upload Data into DCR</button>}
              {user['role'] && user['role'].includes("Consumer") && <button className="custom-button" onClick={() => navigateTo('/queryform')}>Consumer Query Form</button>}
              {/* {user['name'] === 'HTmedia' && <button className="custom-button" onClick={() => navigateTo('/queryform')}>Consumer Query Form</button>}{user['name'] === 'HTmedia' && <br></br>}{user['name'] === 'HTmedia' && <br></br>} */}
              {user['role'] && user['role'].includes("Publisher") && <button className="custom-button" onClick={() => navigateTo('/publisherform')}>Publisher Form</button>}
              {/* {user['name'] === 'admin' && <button className="custom-button">Upload Data into DCR</button>}{user['name'] === 'admin' && <br></br>}{user['name'] === 'admin' && <br></br>}
              {user['name'] === 'admin' && <button className="custom-button" onClick={() => navigateTo('/queryform')}>Consumer Query Form</button>}{user['name'] === 'admin' && <br></br>}{user['name'] === 'admin' && <br></br>}
              {user['name'] === 'admin' && <button className="custom-button" onClick={() => navigateTo('/publisherform')}>Publisher Form</button>}{user['name'] === 'admin' && <br></br>}{user['name'] === 'admin' && <br></br>} */}
              <button className="custom-button" onClick={() => navigateTo('/querystatus')}>Query Status</button>
              <button className="custom-button" onClick={() => navigateTo('/requestinfo')}>Request Info</button>
            </nav>
          </div>
        </aside>
        <main className="main">{children}</main> 
      </div>
      <div className="footer">Hoonar Tekwurks Private Ltd.</div>
    </div>
  );
};

export default PureReact;
