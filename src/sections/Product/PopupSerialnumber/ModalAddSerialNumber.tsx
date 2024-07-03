import React from "react";
//model
import { serialProps } from "../../../models/serialNumber";
// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
//api
import { ApiSerial } from "../../../api/services/apiSerialNumber";

interface ModalSerialNumber {
  ProductData: serialProps | null;
  open: boolean;
  handleCLose: () => void;
  onSuccess: (response: string) => void;
}

interface addProps {
  machineryId: string;
}

const ModalAddSerialPopup: React.FC<ModalSerialNumber> = ({
  ProductData,
  open,
  handleCLose,
  onSuccess,
}) => {
  const { loading, apiAddSerialbyMachineId } = ApiSerial();

  console.log(ProductData);

  const onSubmit = async () => {
    try {
      if (ProductData) {
        const params: addProps = {
          machineryId: ProductData.machineryId,
        };
        const response = await apiAddSerialbyMachineId(params);

        if (response.status === 200) {
          if (onSuccess) {
            onSuccess(response.data);
          }
        } else {
          toast.error(response.Error);
        }
      }
    } catch (error) {
      toast.error("Lỗi xoá");
      console.error(error);
    }
  };
  return (
    <Modal
      title="Chi Tiết Loại Máy"
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
      <Typography.Text>
        Bạn có muốn thêm máy tên: {ProductData?.machineryId}
      </Typography.Text>
    </Modal>
  );
};

export default ModalAddSerialPopup;
