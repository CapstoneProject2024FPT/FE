import { Box, Card, Stack, Typography } from "@mui/material";
import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { addressProps } from "../../../../../../../models/address";
import { ApiAddress } from "../../../../../../../api/services/apiAddress";

interface ModalUser {
  id: string | undefined;
  open: boolean;
  handleClose: () => void;
}

const ModalUserAddress: React.FC<ModalUser> = ({ id, open, handleClose }) => {
  const { apiGetAddress } = ApiAddress();
  const [addresses, setAddresses] = useState<addressProps[]>([]);
  const fetchListAddress = async () => {
    if (id) {
      const params = {
        AccountId: id,
      };
      const response = await apiGetAddress(params);
      if (response.status === 200) {
        setAddresses(response.data);
      }
    }
  };

  useEffect(() => {
    fetchListAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Modal
      title="Địa chỉ"
      open={open}
      onOk={handleClose}
      onCancel={handleClose}
      footer={[]}
      width={600}
    >
      <Card sx={{ p: 3 }}>
        <Stack
          display="flex"
          flexDirection="row"
          sx={{ justifyContent: "flex-end" }}
        ></Stack>
        <Box maxHeight={500} sx={{ overflow: "auto", mt: 2 }}>
          {addresses.map((address, index) => (
            <AddressItem key={index} address={address} />
          ))}
        </Box>
      </Card>
    </Modal>
  );
};

export default ModalUserAddress;

//------------
type AddressItemProps = {
  address: addressProps;
};
function AddressItem({ address }: AddressItemProps) {
  const { city, district, name, note, ward, namePersonal, phoneNumber } =
    address;
  return (
    <>
      <Card
        sx={{ p: 3, mb: 3, position: "relative", boxShadow: 2 }}
        variant="outlined"
      >
        <Box
          sx={{
            mb: 1,
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <Typography variant="subtitle1">
            Tên người nhận: {namePersonal}
          </Typography>
          <Typography variant="subtitle1">
            Số điện thoại: {phoneNumber}
          </Typography>
          <Typography variant="subtitle1">Tên địa chỉ: {name}</Typography>
          <Typography variant="body2" gutterBottom>
            Địa chỉ: {note}, {ward.name}, {district.name}, {city.name}
          </Typography>
        </Box>
      </Card>
    </>
  );
}
