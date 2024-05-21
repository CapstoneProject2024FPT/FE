import { Modal } from "antd";
import React from "react";
import { DataType } from "../Customer";

interface ModalUser {
  userData: DataType | null;
  open: boolean;
  handleClose: () => void;
}

const ModalUserPopup: React.FC<ModalUser> = ({
  userData,
  open,
  handleClose,
}) => {
  return (
    <Modal
      title="Basic Modal"
      open={open}
      onOk={handleClose}
      onCancel={handleClose}
    >
      <p>{userData?.email}</p>
      <p>{userData?.email}</p>
      <p>{userData?.email}</p>
    </Modal>
  );
};

export default ModalUserPopup;
