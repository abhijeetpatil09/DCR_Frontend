import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { SwipeableDrawer } from "@mui/material";

import QueryTemplate from "./components/QueryTemplate";
import PublisherTemplate from "./components/AllowedColumns";

import ProfileTable from "./components/AdminConsoleProfile";
import ItemisedBills from "./components/ItemisedBills";
import AdminConsoleLogsTable from "./components/LogsTable";

import {
  adminConsumerConsoleTabs,
  adminProviderConsoleTabs,
  adminConsumerPublisherConsoleTabs,
} from "../../utils/data";
import AllowedColumns from "./components/AllowedColumns";

import Query_Template_Image from "../../Assets/admin_console_query_template.svg";
import Allowed_Columns_Image from "../../Assets/admin_console_allowed_columns.svg";
import Admin_Console_Logs_Image from "../../Assets/AdminConsoleLogs.svg";

const AdminConsole = () => {
  const state = useSelector((state) => state);
  const navigate = useNavigate();

  const user = state && state.user;
  const UserRole = state && state.user && state.user.role;

  const [activeTab, setActiveTab] = useState("");

  const [toggleDrawerPosition, setToggleDrawerPosition] = useState({
    right: false,
    tab: "",
  });

  const handleToggleDrawer = (anchor, open, tab) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    // setFormData({ ...initialState, Consumer_Name: user?.Consumer });
    setToggleDrawerPosition({
      ...toggleDrawerPosition,
      [anchor]: open,
      tab: tab,
    });
  };
  return (
    <div className="flex flex-col w-full">
      <div className="flex h-12 sticky top-0 z-30 py-2 text-deep-navy flex-row items-center justify-between w-full">
        <h3 className="px-5 text-xl font-bold">Admin Console</h3>
      </div>

      <div className="tabs pt-8 hidden">
        <ul className="px-8">
          {user?.role &&
          user?.role?.includes("Consumer_Admin") &&
          user?.role?.includes("Consumer")
            ? adminConsumerConsoleTabs?.map((item) => {
                return (
                  <li
                    onClick={() => setActiveTab(item.name)}
                    className={`${
                      activeTab === item.name
                        ? "bg-table-head rounded-t-lg"
                        : "bg-white"
                    } px-8 text-deep-navy font-bold inline-block cursor-pointer p-3`}
                  >
                    {item.tabTitle}
                  </li>
                );
              })
            : user?.role && user?.role?.includes("Consumer_Admin")
            ? adminConsumerPublisherConsoleTabs?.map((item) => {
                return (
                  <li
                    onClick={() => setActiveTab(item.name)}
                    className={`${
                      activeTab === item.name
                        ? "bg-table-head rounded-t-lg"
                        : "bg-white"
                    } px-8 text-deep-navy font-bold inline-block cursor-pointer p-3`}
                  >
                    {item.tabTitle}
                  </li>
                );
              })
            : adminProviderConsoleTabs?.map((item) => {
                return (
                  <li
                    onClick={() => setActiveTab(item.name)}
                    className={`${
                      activeTab === item.name
                        ? "bg-table-head rounded-t-lg"
                        : "bg-white"
                    } px-8 text-deep-navy font-bold inline-block cursor-pointer p-3`}
                  >
                    {item.tabTitle}
                  </li>
                );
              })}
        </ul>
        <div className="bg-table-head p-2">
          {user?.role &&
          user?.role?.includes("Consumer_Admin") &&
          user?.role?.includes("Consumer") ? (
            <>
              {activeTab === "profile" && (
                <ProfileTable user={user} UserRole={UserRole} />
              )}
              {activeTab === "itemised_bills" && <ItemisedBills user={user} />}
            </>
          ) : user?.role && user?.role?.includes("Consumer_Admin") ? (
            <>
              {activeTab === "profile" && (
                <ProfileTable user={user} UserRole={UserRole} />
              )}
            </>
          ) : (
            <>
              {activeTab === "profile" && (
                <ProfileTable user={user} UserRole={UserRole} />
              )}
              {activeTab === "query_template" && <QueryTemplate user={user} />}
              {activeTab === "allowed_columns" && (
                <PublisherTemplate user={user} />
              )}
              {activeTab === "itemised_bills" && <ItemisedBills user={user} />}
            </>
          )}
        </div>
      </div>

      {/* NEW LAYOUT */}
      <React.Fragment>
        <section class=" flex flex-row text-center px-4 w-full h-full">
          <div class=" flex flex-row gap-4">
            <div
              class="bg-white rounded-lg shadow-sm py-8 px-4  border border-gray-100 hover:border-electric-green hover:cursor-pointer hover:bg-electric-green/10"
              onClick={() => navigate("/admin-console-profile")}
            >
              <div class="h-24">
                <img
                  src="https://tailwindcss-templates.netlify.com/fair-rate-mortgage/images/icon-home-2.svg
"
                  alt=""
                  class="mx-auto"
                />
              </div>
              <h4 class="text-md uppercase text-deep-navy font-bold mt-10">
                Profile
              </h4>
              <p class="text-base text-gray-600 mt-2">
                Check user profile details
              </p>
            </div>

            {user?.role && user?.role?.includes("Provider_Admin") && (
              <div
                onClick={handleToggleDrawer("right", true, "query_template")}
                class="bg-white rounded-lg shadow-sm py-8 px-4 border border-gray-100  hover:border-electric-green hover:cursor-pointer hover:bg-electric-green/10"
              >
                <div class="h-24">
                  <img src={Query_Template_Image} alt="" class="mx-auto" />
                </div>
                <h4 class="text-md uppercase text-deep-navy font-bold mt-10">
                  CONFIGURE QUERY TEMPLATES
                </h4>
                <p class="text-base text-gray-600 mt-2">
                  Configure your Query Template
                </p>
              </div>
            )}

            {user?.role && user?.role?.includes("Provider_Admin") && (
              <div
                onClick={handleToggleDrawer("right", true, "allowed_columns")}
                class="bg-white rounded-lg shadow-sm py-8 px-4 border border-gray-100  hover:border-electric-green hover:cursor-pointer hover:bg-electric-green/10"
              >
                <div class="h-24">
                  <img src={Allowed_Columns_Image} alt="" class="mx-auto" />
                </div>
                <h4 class="text-md uppercase text-deep-navy font-bold mt-10">
                  CONFIGURE ALLOWED COLUMNS
                </h4>
                <p class="text-base text-gray-600 mt-2">
                  Configure your Allowed Columns
                </p>
              </div>
            )}

            <div
              onClick={handleToggleDrawer("right", true, "itemised_bills")}
              class="bg-white rounded-lg shadow-sm py-8 px-4 border border-gray-100  hover:border-electric-green hover:cursor-pointer hover:bg-electric-green/10"
            >
              <div class="h-24">
                <img
                  src="https://tailwindcss-templates.netlify.com/fair-rate-mortgage/images/icon-home-3.svg"
                  alt=""
                  class="mx-auto"
                />
              </div>
              <h4 class="text-md uppercase text-deep-navy font-bold mt-10">
                Itemised bills
              </h4>
              <p class="text-base text-gray-600 mt-2">
                Download your monthly bills
              </p>
            </div>

            {/* Tab used for only dataexadmin user */}
            {user?.role && user?.role?.includes("DATAEXADMIN") && (
              <div
                onClick={() => navigate("/admin-console-logs-table")}
                class="bg-white rounded-lg shadow-sm py-8 px-4 border border-gray-100  hover:border-electric-green hover:cursor-pointer hover:bg-electric-green/10"
              >
                <div class="h-24">
                  <img src={Admin_Console_Logs_Image} alt="" class="mx-auto" />
                </div>
                <h4 class="text-md uppercase text-deep-navy font-bold mt-10">
                  Logs
                </h4>
                <p class="text-base text-gray-600 mt-2">
                  Check your Template Logs
                </p>
              </div>
            )}
          </div>
        </section>
      </React.Fragment>
      {toggleDrawerPosition.right && (
        <SwipeableDrawer
          anchor={"right"}
          open={toggleDrawerPosition.right}
          onClose={handleToggleDrawer("right", false, "")}
          onOpen={handleToggleDrawer("right", true, toggleDrawerPosition.tab)}
        >
          <div className="flex flex-col flex-shrink h-full w-full px-5 bg-deep-navy text-electric-green bg-[url('/static/media/Target audience _Two Color.6aa8a9f45675ef6dfbc33c3c3b61aa03.svg')] ">
            {toggleDrawerPosition.tab === "query_template" && (
              <QueryTemplate
                user={user}
                handleToggleDrawer={handleToggleDrawer}
              />
            )}
            {toggleDrawerPosition.tab === "allowed_columns" && (
              <AllowedColumns
                user={user}
                handleToggleDrawer={handleToggleDrawer}
              />
            )}
            {toggleDrawerPosition.tab === "itemised_bills" && (
              <ItemisedBills handleToggleDrawer={handleToggleDrawer} />
            )}
            {toggleDrawerPosition.tab === "logs-table" && (
              <AdminConsoleLogsTable handleToggleDrawer={handleToggleDrawer} />
            )}
          </div>
        </SwipeableDrawer>
      )}
    </div>
  );
};

export default AdminConsole;
