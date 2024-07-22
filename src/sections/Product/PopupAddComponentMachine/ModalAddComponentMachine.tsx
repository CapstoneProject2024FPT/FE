import React from "react";

import { Button, Modal } from "antd";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { GetMachineComponents } from "../../../models/machineComponent";
import EmptyData from "../../../components/EmptyData";
import { toast } from "react-toastify";
import { MachineryApi } from "../../../api/services/apiMachinery";

interface ModalProduct {
  productData: GetMachineComponents[] | [];
  open: boolean;
  handleClose: () => void;
  onAddSuccess: () => void;
}

const ModalViewBeforeAddComponent: React.FC<ModalProduct> = ({
  productData,
  open,
  handleClose,
  onAddSuccess,
}) => {
  const { id } = useParams<{ id: string }>();

  const { loading, apiPostMachineComponent } = MachineryApi();

  const onSubmit = async () => {
    try {
      if (productData) {
        const params = productData.map((item) => {
          return item.id;
        });
        if (id) {
          const response = await apiPostMachineComponent(params, id);
          console.log(response);

          if (response && response.status === 200) {
            onAddSuccess();
          } else {
            toast.error(response.Error);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      title="Chi tiết"
      open={open}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Huỷ
        </Button>,
        <Button
          key="submit"
          loading={loading}
          onClick={onSubmit}
          disabled={productData?.length <= 0}
        >
          Lưu
        </Button>,
      ]}
      width={800}
    >
      <Box margin={1}>
        <Table size="small" aria-label="products">
          <TableHead>
            <TableRow>
              <TableCell>Thứ tự</TableCell>
              <TableCell>Tên bộ phận</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productData.length > 0 ? (
              <>
                {productData?.map((product, idx) => (
                  <TableRow key={product.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{product.name}</TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={2}>
                  <EmptyData title="Chưa có dữ liệu" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Modal>
  );
};

export default ModalViewBeforeAddComponent;
