import React from "react";
// form
import { Modal, Typography } from "antd";

//api

import { Card, Stack } from "@mui/material";

interface ModalOrder {
  openPopup: boolean;
  handleClosePopup: () => void;
  onConfirm: () => void;
}

const ModalAcceptDate: React.FC<ModalOrder> = ({
  openPopup,
  handleClosePopup,
  onConfirm,
}) => {
  return (
    <Modal
      title="Xác nhận ngày thực hiện nhiệm vụ"
      open={openPopup}
      onOk={onConfirm}
      onCancel={handleClosePopup}
    >
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography.Text>
            Ngày thực hiện nhiệm vụ cách xa hơn 2 ngày sô với ngày tạo đơn bạn
            có đồng ý?
          </Typography.Text>
        </Stack>
      </Card>
    </Modal>
  );
};

export default ModalAcceptDate;
