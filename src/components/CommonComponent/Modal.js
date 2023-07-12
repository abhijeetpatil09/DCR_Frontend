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
  borderRadius: 5,
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
      <Box
        sx={style}
        className="bg-white bg-opacity-75 backdrop-filter backdrop-blur-lg "
      >
        {title && (
          <div className="flex mb-4 justify-between p-2 text-deep-navy">
            <span className="font-bold">{title}</span>
            <button onClick={handleClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex flex-row justify-center items-start">
          <strong className={`${textColor ? textColor : "text-amaranth-900"}`}>
            {message}
          </strong>
        </div>
        {buttons ? (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleClickYes}
              className="bg-amaranth-600 opacity-1 flex items-center ml-4 px-8 py-2 text-sm text-white rounded-md"
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
        ) : null}
      </Box>
    </Modal>
  );
};

export default CommonModal;
