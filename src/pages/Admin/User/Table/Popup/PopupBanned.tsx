import React from "react";
//model
import { staffProps, userModel } from "../../../../../models/UserData";
// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
import { ApiAccount } from "../../../../../api/services/apiAccount";
import config from "../../../../../configs";

//api

interface ModalUser {
  UserData: staffProps | null | userModel;
  open: boolean;
  handleCLose: () => void;
  onSuccess: () => void;
}

const ModaBanned: React.FC<ModalUser> = ({
  UserData,
  open,
  handleCLose,
  onSuccess,
}) => {
  const { loading, apiBanned, apiUnbanned } = ApiAccount();

  const onSubmit = async () => {
    try {
      if (UserData) {
        if (UserData.status === "Activate") {
          const response = await apiBanned(UserData?.id);
          if (response.status === 200) {
            if (onSuccess) {
              onSuccess();
            }
          } else {
            handleCLose();
            toast.error(response.Error);
          }
        } else {
          const params = {
            role: UserData.role,
            gender: UserData.gender,
            status: "Activate",
          };
          const response = await apiUnbanned(UserData?.id, params);
          if (response.status === 200) {
            if (onSuccess) {
              onSuccess();
            }
          } else {
            handleCLose();
            toast.error(config.AdminMessageNotice.UnBanFailed);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal
      title="Trạng Thái"
      open={open}
      onOk={handleCLose}
      onCancel={handleCLose}
      footer={[
        <Button key="back" onClick={handleCLose}>
          Huỷ
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={onSubmit}
        >
          Đồng Ý
        </Button>,
      ]}
    >
      {UserData?.status === "Activate" ? (
        <Typography.Text>
          Bạn có muốn chặn người dùng tên: {UserData?.fullName}
        </Typography.Text>
      ) : (
        <Typography.Text>
          Bạn có muốn mở chặn người dùng tên: {UserData?.fullName}
        </Typography.Text>
      )}
    </Modal>
  );
};

export default ModaBanned;
