import { useState } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as actions from "../../redux/actions/index";

import GroupMLogo from '../../Assets/logo-download-01.png';
import GroupMLogoDark from '../../Assets/logo-download-02.png';

// import "../pure-react.css";
// import "../styles.css";

const Sidebar = ({ children }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const state = useSelector(state => state);
  const user = state && state.user;

  const [isOpened, setIsOpened] = useState(false);

  const handleSignOut = () => {
    dispatch(actions.logoutUser())
    navigate('/');
  };

  const navigateTo = (page) => {
    navigate(page)
  }

  return (
    <div className="  w-screen flex flex-col ">
      <div className=" sticky top-0 z-50 flex flex-row justify-between items-center bg-white drop-shadow-sm">
        <div className={`${isOpened ? "bg-deep-navy" : "bg-white"} flex flex-row items-center  mw-64`}>
          <div className={`${isOpened ? "" : "bg-deep-navy"} h-16 px-6 flex justify-start items-center  text-white focus:text-electric-green cursor-pointer`} onClick={() => setIsOpened(!isOpened)}>
            <div className="w-5 h-5">{isOpened ? <ChevronLeftIcon /> : <MenuIcon />}</div>
          </div>
          {isOpened ? (<img src={GroupMLogoDark} alt='Image_Description' className=" flex flex-grow h-10 pl-0 pr-4" />) : <img src={GroupMLogo} alt='Image_Description' className="flex flex-grow  h-10 pl-0 pr-4" />}
          
        </div>
        {/* <div>
          <h1 class="hoonartek-title">h</h1>
        </div> */}
        {/* <div>
          <img src={GroupMLogo} alt = 'Image_Description' width="100" height="40"/>
        </div> */}
        {/* <div>
          <h1 class="hoonartek-title">nartek</h1>
        </div> */}
        <div className=" flex flex-row items-center  ">
          <span className=" text-deep-navy font-bold  text-2xl" ><span className="text-electric-green text-4xl">D</span>ata<span className="text-electric-green text-4xl">X</span>change</span>
        </div>
        <div className=" ">

          <div className="mt-auto  flex items-center w-full">
            <button
              onClick={handleSignOut}
              className={`${(user?.name) ? "" : "invisible"}  px-6 w-full mx-auto flex  justify-center items-center  text-deep-navy  focus:outline-none`}>
              <svg
                className="h-5 w-5 mr-1 text-deep-navy "
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              {(user?.name) ? "Sign Out" : "Sign In"}
            </button>
          </div>
          {/* <div onClick={handleSignOut} >{(user?.name) ? "Sign Out" : "Sign In"}</div> */}
        </div>
      </div>

      <div className="flex flex-grow w-full  h-[calc(100vh-60px)] overflow-auto">
        <aside className={`${isOpened ? "w-64 drawer" : ""}   flex flex-col items-start bg-deep-navy text-electric-green shadow h-[calc(100vh-60px)] sticky top-0  `} >
          {/* <!-- Side Nav Bar--> */}


          <ul>
            {/* <!-- Items Section --> */}
            <li className="hover:text-white">
              <button
                onClick={() => navigateTo('/home')}
                className="h-16 px-6 flex flex justify-start items-center w-full
            focus:text-electric-green">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 stroke-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>

                <span className={`${isOpened ? "" : "hidden"} pl-5 uppercase font-semibold`}>Dashboard</span>

              </button>
            </li>

            {user['role'] && user['role'].includes("Provider") && <li className="hover:text-white">
              <button
                className="h-16 px-6 flex justify-start items-center w-full
            focus:text-electric-green">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 stroke-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>

                <span className={`${isOpened ? "" : "hidden"} pl-5 uppercase font-semibold`}>Upload  </span>

              </button>
            </li>}
            {user['role'] && user['role'].includes("Consumer") &&
              <li className="hover:text-white">
                <button
                  onClick={() => navigateTo('/queryform')}
                  className="h-16 px-6 flex  justify-start items-center w-full
            focus:text-electric-green">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 stroke-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>


                  <span className={`${isOpened ? "" : "hidden"} pl-5 uppercase font-semibold`}>Consumers</span>
                </button>
              </li>}
            {user['role'] && user['role'].includes("Publisher") &&
              <li className="hover:text-white">
                <button
                  onClick={() => navigateTo('/publisherform')}
                  className="h-16 px-6 flex flex justify-start items-center w-full
            focus:text-electric-green">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 stroke-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
                  </svg>

                  <span className={`${isOpened ? "" : "hidden"} pl-5 uppercase font-semibold`}>Publishers</span>
                </button>
              </li>}

            <li className="hover:text-white">
              <button
                onClick={() => navigateTo('/querystatus')}
                className="h-16 px-6 flex flex justify-start items-center w-full
            focus:text-electric-green">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 stroke-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>

                <span className={`${isOpened ? "" : "hidden"} pl-5 uppercase font-semibold`}>Status</span>
              </button>
            </li>

            <li className="hover:text-white">
              <button
                onClick={() => navigateTo('/requestinfo')}
                className="h-16 px-6 flex flex justify-start items-center w-full
            focus:text-electric-green">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 stroke-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>

                <span className={`${isOpened ? "" : "hidden"} pl-5 uppercase font-semibold`}>Requests</span>
              </button>
            </li>

          </ul>


        </aside>
        <main className="flex flex-col w-full ">
          <div className="flex flex-grow w-full px-5">{children}</div>
          <div className="bg-blue-100  h-10 flex flex-row items-center justify-end text-xs sticky bottom-0 px-10 py-2">&copy; 2023 Hoonar Tekwurks Private Ltd.</div>

        </main>
      </div>
    </div>
  );
};

export default Sidebar;
