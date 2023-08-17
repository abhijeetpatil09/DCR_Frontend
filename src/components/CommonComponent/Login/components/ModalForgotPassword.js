import React from "react";
import { Box, Modal } from "@mui/material";

// Modal style
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  p: 4,
  borderRadius: 2,
};

const ModalForgotPassword = ({ open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="bg-table-head backdrop-blur-lg ">
        <div>
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-200 text-green-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <h3
              class="text-lg leading-6 text-deep-navy font-bold"
              id="modal-headline"
            >
              Forgot Password
            </h3>
            <div class="mt-2">
              <p class="text-sm">
                <span className={"text-deep-navy text-base"}>
                  Mail Sent to your registered Email. Please check!
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="justify-center flex">
          <div class="mt-5 sm:mt-6 max-w-xs flex justify-center">
            <button
              class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-40 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:text-sm"
              onClick={handleClose}
            >
              OK
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalForgotPassword;
