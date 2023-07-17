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

const CommonModal = ({
  open,
  handleClose,
  handleClickYes,
  title,
  message,
  buttons,
  textColor,
  svg,
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="bg-table-head backdrop-blur-lg ">
        <div>
          {svg && (
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600">
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
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
          )}
          <div class="mt-3 text-center sm:mt-5">
            {title && (
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="modal-headline"
              >
                {title}
              </h3>
            )}
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                <strong
                  className={`${textColor ? textColor : "text-deep-navy"}`}
                >
                  {message}
                </strong>
              </p>
            </div>
          </div>
        </div>
        {buttons ? (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleClickYes}
              className="bg-deep-navy opacity-1 flex items-center ml-4 px-8 py-2 text-sm text-white rounded-md"
            >
              Yes
            </button>
            <button
              onClick={handleClose}
              className="ml-4 bg-gray-500 px-8 opacity-1 flex items-center py-2 text-sm text-white rounded-md"
            >
              No
            </button>
          </div>
        ) : (
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
        )}
      </Box>
    </Modal>
  );
};

export default CommonModal;
