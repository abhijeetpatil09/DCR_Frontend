import React, { useState } from "react";
import { useSelector } from "react-redux";

import QueryTemplate from "./components/QueryTemplate";
import PublisherTemplate from "./components/AllowedColumns";

import ProfileTable from "./components/ProfilesTable";
import ItemisedBills from "./components/ItemisedBills";

import {
  adminConsumerConsoleTabs,
  adminProviderConsoleTabs,
  adminConsumerPublisherConsoleTabs,
} from "../../utils/data";

const AdminConsole = () => {
  const state = useSelector((state) => state);
  const user = state && state.user;
  const UserRole = state && state.user && state.user.role;

  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="flex flex-col w-full">
      <div className="flex h-12 sticky top-0 z-30 py-2 text-deep-navy flex-row items-center justify-between w-full">
        <h3 className="px-5 text-xl font-bold">Admin Console</h3>
      </div>

      <div className="tabs pt-8 hidden">
        <ul className="px-8">
          {user?.role && user?.role?.includes("Consumer_Admin") && user?.role?.includes("Consumer")
            ? (adminConsumerConsoleTabs?.map((item) => {
              return (
                <li
                  onClick={() => setActiveTab(item.name)}
                  className={`${activeTab === item.name
                    ? "bg-table-head rounded-t-lg"
                    : "bg-white"
                    } px-8 text-deep-navy font-bold inline-block cursor-pointer p-3`}
                >
                  {item.tabTitle}
                </li>
              );
            }))
            : user?.role && user?.role?.includes("Consumer_Admin")
              ? (adminConsumerPublisherConsoleTabs?.map((item) => {
                return (
                  <li
                    onClick={() => setActiveTab(item.name)}
                    className={`${activeTab === item.name
                      ? "bg-table-head rounded-t-lg"
                      : "bg-white"
                      } px-8 text-deep-navy font-bold inline-block cursor-pointer p-3`}
                  >
                    {item.tabTitle}
                  </li>
                );
              }))
              :
              adminProviderConsoleTabs?.map((item) => {
                return (
                  <li
                    onClick={() => setActiveTab(item.name)}
                    className={`${activeTab === item.name
                      ? "bg-table-head rounded-t-lg"
                      : "bg-white"
                      } px-8 text-deep-navy font-bold inline-block cursor-pointer p-3`}
                  >
                    {item.tabTitle}
                  </li>
                );
              })
          }
        </ul>
        <div className="bg-table-head p-2">
          {user?.role && user?.role?.includes("Consumer_Admin") && user?.role?.includes("Consumer") ? (
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
              {/* {activeTab === "itemised_bills" && <ItemisedBills user={user} />} */}
            </>
          ) :
            (
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
      <section class=" flex flex-row text-center   px-4 w-full h-full">
        <div class=" flex flex-row gap-4">
          <div class="w-1/3 bg-white rounded-lg shadow-sm py-8 px-4  border border-gray-100 hover:border-electric-green hover:cursor-pointer hover:bg-electric-green/10">
            <div class="h-24">
              <img src="https://tailwindcss-templates.netlify.com/fair-rate-mortgage/images/icon-home-2.svg
" alt="" class="mx-auto" />
            </div>
            <h4 class="text-md uppercase text-deep-navy font-bold mt-10">Profile</h4>
            <p class="text-base text-gray-600 mt-2">Check user profile details</p>
          </div>

          <div class="w-1/3 bg-white rounded-lg shadow-sm py-8 px-4 border border-gray-100  hover:border-electric-green hover:cursor-pointer hover:bg-electric-green/10">
            <div class="h-24">
              <img src="https://tailwindcss-templates.netlify.com/fair-rate-mortgage/images/icon-home-1.svg
" alt="" class="mx-auto" />
            </div>
            <h4 class="text-md uppercase text-deep-navy font-bold mt-10">Templates</h4>
            <p class="text-base text-gray-600 mt-2">Configure your publisher templates</p>
          </div>

          <div class="w-1/3 bg-white rounded-lg shadow-sm py-8 px-4 border border-gray-100  hover:border-electric-green hover:cursor-pointer hover:bg-electric-green/10">
            <div class="h-24">
              <img src="https://tailwindcss-templates.netlify.com/fair-rate-mortgage/images/icon-home-3.svg
" alt="" class="mx-auto" />
            </div>
            <h4 class="text-md uppercase text-deep-navy font-bold mt-10">Itemised bills</h4>
            <p class="text-base text-gray-600 mt-2">Download your monthly bills</p>
          </div>
        </div>






      </section>

    </div>
  );
};

export default AdminConsole;
