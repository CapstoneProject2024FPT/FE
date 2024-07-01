import React from "react";
//model
import { serialProps, statusSerial } from "../../../models/serialNumber";
// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
//api
import { ApiSerial } from "../../../api/services/apiSerialNumber";
import { TypeProduct } from "../../../models/products";

interface ModalSerial {
  ProductData: serialProps | null;
  openDeletePopup: boolean;
  handleCLoseDelete: () => void;
  onDeleteSuccess: (response: string) => void;
}

interface UpdateProps {
  status: string;
  type: string;
}

const ModalSerialNumberDelete: React.FC<ModalSerial> = ({
  ProductData,
  openDeletePopup,
  handleCLoseDelete,
  onDeleteSuccess,
}) => {
  const { loading, apiDeleteSerialbyMachineId } = ApiSerial();

  const onSubmit = async () => {
    try {
      if (ProductData) {
        const params: UpdateProps = {
          status: statusSerial.Discontinued,
          type: TypeProduct.Machinery,
        };
        const response = await apiDeleteSerialbyMachineId(
          ProductData?.id,
          params
        );

        if (response.status === 200) {
          if (onDeleteSuccess) {
            onDeleteSuccess(response.data);
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
      open={openDeletePopup}
      onOk={handleCLoseDelete}
      onCancel={handleCLoseDelete}
      footer={[
        <Button key="back" onClick={handleCLoseDelete}>
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
        Bạn có muốn xoá số seri này: {ProductData?.serialNumber}
      </Typography.Text>
    </Modal>
  );
};

export default ModalSerialNumberDelete;
