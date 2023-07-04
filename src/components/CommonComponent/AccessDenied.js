import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsLockFill } from "react-icons/bs";

const AccessDenined = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  });

  return (
    <div className="w-full">
      <div className="flex justify-center items-center h-full flex-col">
        <div className="w-24 h-24 rounded-full border border-gray-500 flex justify-center items-center">
          <BsLockFill size={"2.4rem"} />
        </div>
        <p className="teOutletxt-3xl mt-2 raleway-bold">Access Denied</p>
        <div className="w-1/3 text-center pt-2">
          <p>You don't have permissions to access this page.</p>
        </div>
        <div className="w-1/3 text-center pt-2">
          <p>Redirecting to the login page.</p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenined;
