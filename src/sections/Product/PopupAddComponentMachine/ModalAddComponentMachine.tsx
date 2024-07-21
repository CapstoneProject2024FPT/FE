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
import { MachineryComponentApi } from "../../../api/services/apiMachineComponent";
import EmptyData from "../../../components/EmptyData";

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

  const { loading } = MachineryComponentApi();
  console.log(onAddSuccess);

  const onSubmit = async () => {
    try {
      if (productData) {
        const params = productData.map((item) => {
          return item.id;
        });
        console.log(params);

        if (id) {
          //   const response = await ;
          //   if (response && response.status === 200) {
          //     onAddSuccess(response.data);
          //   } else {
          //     toast.error(response.Error);
          //   }
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
        <Button onClick={handleClose}>Huỷ</Button>,
        <Button
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
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Số lượng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productData.length > 0 ? (
              <>
                {productData?.map((product, idx) => (
                  <TableRow key={product.id}>
                    <TableCell>{idx}</TableCell>
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
