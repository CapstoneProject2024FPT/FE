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

import { GetMachineComponents } from "../../../models/machineComponent";
import EmptyData from "../../../components/EmptyData";

interface ModalProduct {
  productData: GetMachineComponents[] | [];
  open: boolean;
  handleClose: () => void;
  onSubmit: (selectedComponents: GetMachineComponents[]) => void;
}

const ModalSubmitComponent: React.FC<ModalProduct> = ({
  productData,
  open,
  handleClose,
  onSubmit,
}) => {
  const handleSave = () => {
    onSubmit(productData);
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
          onClick={handleSave}
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

export default ModalSubmitComponent;
