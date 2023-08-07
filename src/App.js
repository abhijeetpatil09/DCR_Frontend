import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import AccessDenined from "./components/CommonComponent/AccessDenied";
import LandingPage from "./components/CommonComponent/LandingPage";
import Login from "./components/CommonComponent/Login";
import Register from "./components/CommonComponent/Register";

import Enrichment from "./components/Enrichment";
import QueryStatus from "./components/QueryStatus";
import Sidebar from "./components/CommonComponent/Sidebar";
import Home from "./components/Home";
import MatchRate from "./components/MatchRate";
import UploadCatalog from "./components/UploadCatalog/index";
import SearchCatalog from "./components/SearchCatalog";
import AdminConsole from "./components/Admin";
import PrivacyPolicy from "./components/CommonComponent/CommonPages/PrivacyPolicy";
import TermsAndConditions from "./components/CommonComponent/CommonPages/TermsAndConditions";
import HowToVideos from "./components/CommonComponent/howToVideos";
import AdminConsoleProfile from "./components/Admin/components/AdminConsoleProfile";

import "react-toastify/dist/ReactToastify.css";
import AdminConsoleLogsTable from "./components/Admin/components/LogsTable";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        <Route element={<PrivateRouter />}>
          <Route
            path="*"
            element={
              <Sidebar>
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/queryform" element={<Enrichment />} />
                  <Route path="/querystatus" element={<QueryStatus />} />
                  <Route path="/publisherform" element={<MatchRate />} />
                  <Route path="/search-catalog" element={<SearchCatalog />} />
                  <Route path="/upload-catalog" element={<UploadCatalog />} />
                  <Route path="/admin-console" element={<AdminConsole />} />
                  <Route path="/how-to-videos" element={<HowToVideos />} />
                  <Route
                    path="/admin-console-profile"
                    element={<AdminConsoleProfile />}
                  />
                  <Route
                    path="/admin-console-logs-table"
                    element={<AdminConsoleLogsTable />}
                  />
                </Routes>
              </Sidebar>
            }
          />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;

const PrivateRouter = () => {
  const isLoggedIn = useSelector((state) => state.user?.isLoggedIn);

  return (
    <div id="container" className="flex min-h-screen">
      {isLoggedIn ? <Outlet /> : <AccessDenined />}
    </div>
  );
};
