import React from "react";
import { Box, Modal } from "@mui/material";

// Modal style
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 4,
  borderRadius: 5,
};

const CommonModal = ({ open, handleClose, handleClickYes, message }) => {
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
        <div className="flex flex-row justify-center items-start">
          <strong className="mb-8 text-amaranth-900">{message}</strong>
        </div>
        <div className="flex justify-center">
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
      </Box>
    </Modal>
  );
};

export default CommonModal;
