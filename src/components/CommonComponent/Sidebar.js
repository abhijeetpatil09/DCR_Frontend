import { useState, useEffect } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Menu, MenuItem } from "@mui/material";
import { HelpOutline } from "@material-ui/icons";

import * as actions from "../../redux/actions/index";

import GroupMLogo from "../../Assets/logo-download-01.png";
import GroupMLogoDark from "../../Assets/logo-download-02.png";
import USER_MANUAL_PDF from "../../Assets/PDF/User_Manual.pdf";

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const user = state && state.user;

  const [isOpened, setIsOpened] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const { pathname } = window.location;
    if (pathname?.includes("home")) {
      setTab(1);
    } else if (pathname?.includes("publisherform")) {
      setTab(2);
    } else if (pathname?.includes("queryform")) {
      setTab(3);
    } else if (pathname?.includes("upload-catalog")) {
      setTab(4);
    } else if (pathname?.includes("search-catalog")) {
      setTab(5);
    } else if (pathname?.includes("admin-console")) {
      setTab(6);
    } else if (pathname?.includes("querystatus")) {
      setTab(7);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  const handleSignOut = () => {
    dispatch(actions.logoutUser());
    navigate("/");
  };

  const navigateTo = (page) => {
    navigate(page);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex flex-grow w-full h-[calc(100vh)]">
      <aside
        className={`${
          isOpened ? "w-80 drawer" : ""
        } z-50 flex flex-col items-start bg-deep-navy text-electric-green shadow h-[calc(100vh)] sticky top-0`}
      >
        <div className="flex flex-row items-center h-20">
          <div
            className={`${
              isOpened ? "" : "bg-deep-navy w-[72px]"
            } h-16 px-6 flex justify-start items-center  text-white focus:text-electric-green cursor-pointer`}
            onClick={() => setIsOpened(!isOpened)}
          >
            <div className="w-5 h-5">
              {isOpened ? <ChevronLeftIcon /> : <MenuIcon />}
            </div>
          </div>
          {isOpened && (
            <img
              src={GroupMLogoDark}
              alt="Image_Description"
              className=" flex flex-grow h-10 pl-0 pr-4"
            />
          )}
        </div>
        {/* <!-- Side Nav Bar--> */}

        <ul className="pt-2">
          {/* <!-- Items Section --> */}
          <li
            className={`${
              tab === 1 ? "text-white" : "text-electric-green"
            } hover:text-white transition ease-in-out duration-500`}
          >
            <button
              onClick={() => navigateTo("/home")}
              className="py-4 px-6 flex flex justify-start items-center w-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 stroke-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>

              <span
                className={`${
                  isOpened ? "" : "hidden"
                } pl-5 uppercase font-semibold`}
              >
                Home
              </span>
            </button>
          </li>

          {user?.role && user?.role?.includes("Consumer") && (
            <li
              className={`${
                tab === 5 ? "text-white" : "text-electric-green"
              } hover:text-white transition ease-in-out duration-500`}
            >
              <button
                onClick={() => navigateTo("/search-catalog")}
                className="py-4 px-6 flex flex justify-start items-center w-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 stroke-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>

                <span
                  className={`${
                    isOpened ? "" : "hidden"
                  } pl-5 uppercase font-semibold`}
                >
                  Search Catalog
                </span>
              </button>
            </li>
          )}
          {user?.role && user?.role?.includes("Provider") && (
            <li
              className={`${
                tab === 4 ? "text-white" : "text-electric-green"
              } hover:text-white transition ease-in-out duration-500`}
            >
              <button
                onClick={() => navigateTo("/upload-catalog")}
                className="py-4 px-6 flex flex justify-start items-center w-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>

                <span
                  className={`${
                    isOpened ? "" : "hidden"
                  } pl-5 uppercase font-semibold`}
                >
                  Upload Catalaog
                </span>
              </button>
            </li>
          )}
          {user["role"] && user["role"].includes("Publisher") && (
            <li
              className={`${
                tab === 2 ? "text-white" : "text-electric-green"
              } hover:text-white transition ease-in-out duration-500`}
            >
              <button
                onClick={() => navigateTo("/publisherform")}
                className="py-4 px-6 flex flex justify-start items-center w-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 stroke-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"
                  />
                </svg>

                <span
                  className={`${
                    isOpened ? "" : "hidden"
                  } pl-5 uppercase font-semibold`}
                >
                  Match Rate
                </span>
              </button>
            </li>
          )}

          {user["role"] && user["role"].includes("Consumer") && (
            <li
              className={`${
                tab === 3 ? "text-white" : "text-electric-green"
              } hover:text-white transition ease-in-out duration-500`}
            >
              <button
                onClick={() => navigateTo("/queryform")}
                className="py-4 px-6 flex  justify-start items-center w-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 stroke-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>

                <span
                  className={`${
                    isOpened ? "" : "hidden"
                  } pl-5 uppercase font-semibold`}
                >
                  Enrichment
                </span>
              </button>
            </li>
          )}

          {((user["role"] && user["role"].includes("Consumer_Admin")) ||
            (user["role"] && user["role"].includes("Provider_Admin")) ||
            (user["role"] && user["role"].includes("DATAEXADMIN"))) && (
            <li
              className={`${
                tab === 6 ? "text-white" : "text-electric-green"
              } hover:text-white transition ease-in-out duration-500`}
            >
              <button
                onClick={() => navigateTo("/admin-console")}
                className="py-4 px-6 flex flex justify-start items-center w-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
                </svg>
                <span
                  className={`${
                    isOpened ? "" : "hidden"
                  } pl-5 uppercase font-semibold`}
                >
                  Admin Console
                </span>
              </button>
            </li>
          )}
          {user["role"] &&
            !user["role"].includes("Provider") &&
            !user?.role.includes("DATAEXADMIN") && (
              <li
                className={`${
                  tab === 7 ? "text-white" : "text-electric-green"
                } hover:text-white transition ease-in-out duration-500`}
              >
                <button
                  onClick={() => navigateTo("/querystatus")}
                  className="py-4 px-6 flex flex justify-start items-center w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 stroke-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <span
                    className={`${
                      isOpened ? "" : "hidden"
                    } pl-5 uppercase font-semibold`}
                  >
                    Status
                  </span>
                </button>
              </li>
            )}
        </ul>
      </aside>

      <div className="flex flex-col flex-grow w-full  overflow-hidden">
        {/* HEADER */}
        <div className="sticky top-0 z-30 flex flex-row justify-between items-center bg-white drop-shadow-sm h-20">
          <div>
            {!isOpened && (
              <img
                src={GroupMLogo}
                alt="Image_Description"
                className=" flex flex-grow h-10 pl-0 pr-4"
              />
            )}
          </div>
          <div className=" flex flex-row items-center">
            <span className=" text-deep-navy font-bold  text-2xl">
              <span className="text-electric-green text-4xl">D</span>ata
              <span className="text-electric-green text-4xl">X</span>change
            </span>
          </div>
          <div className="flex flex-row items-center">
            <div>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                startIcon={<HelpOutline />}
                className="text-deep-navy normal-case text-base"
              >
                Help
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    window.open(USER_MANUAL_PDF, "_blank");
                  }}
                >
                  User manual
                </MenuItem>
                <MenuItem onClick={handleClose}>FAQ</MenuItem>
                {/* <MenuItem onClick={handleClose}>Logout</MenuItem> */}
              </Menu>
            </div>
            <div className="flex items-center w-full">
              <button
                onClick={handleSignOut}
                className={`${
                  user?.name ? "" : "invisible"
                }  px-6 w-full mx-auto flex justify-center items-center text-deep-navy  focus:outline-none`}
              >
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
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                {user?.name ? "Sign Out" : "Sign In"}
              </button>
            </div>
            {/* <div onClick={handleSignOut} >{(user?.name) ? "Sign Out" : "Sign In"}</div> */}
          </div>
        </div>
        {/* FOOTER COMMENTED FOR FUTURE USE */}
        {/* <div className="bg-blue-100 w-full right-0 h-10 flex flex-row items-center justify-end text-xs fixed bottom-0 px-10 py-2 z-30 border-l border-gray-100">
          &copy; 2023 Hoonar Tekwurks Private Ltd.
        </div> */}
        {/* CONTAINER */}
        <main className="flex flex-col w-full overflow-auto h-full">
          <div className="flex flex-col w-full h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Sidebar;

// flex flex-grow w-full px-5
