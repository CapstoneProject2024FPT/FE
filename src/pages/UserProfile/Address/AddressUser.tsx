// @mui
import { Stack, Card, Typography, Box } from "@mui/material";
import { ApiAddress } from "../../../api/services/apiAddress";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalCreateAddress from "./popup/ModalCreateAddress";
import { addressProps } from "../../../models/address";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { formatAddress } from "../../../utils/fn";
import config from "../../../configs";
import ModalUpdateAddress from "./popup/ModalUpdateAddress";

// ----------------------------------------------------------------------

export default function UserAddress() {
  const { apiGetAddress } = ApiAddress();
  const [addresses, setAddresses] = useState<addressProps[]>([]);

  //user info
  const loginInfo = localStorage.getItem("loginInfo");

  const loginInfoString = loginInfo ? JSON.parse(loginInfo) : null;

  const user = loginInfoString?.data;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchListAddress = async () => {
    if (user) {
      const params = {
        AccountId: user.id,
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

  const onCreateSuccess = () => {
    handleClose();
    toast.success(config.MessageNotice.CreateAddressSuccess);
    fetchListAddress();
  };
  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack
          display="flex"
          flexDirection="row"
          sx={{ justifyContent: "flex-end" }}
        >
          <Button icon={<PlusOutlined />} onClick={handleClickOpen}>
            Thêm địa chỉ
          </Button>
        </Stack>
        <Box maxHeight={500} sx={{ overflow: "auto", mt: 2 }}>
          {addresses.map((address, index) => (
            <AddressItem
              key={index}
              address={address}
              fetchApi={fetchListAddress}
            />
          ))}
        </Box>
      </Card>
      {open && (
        <ModalCreateAddress
          onClose={handleClose}
          open={open}
          onSuccess={onCreateSuccess}
        />
      )}
    </>
  );
}

//--------------------------------------
type AddressItemProps = {
  address: addressProps;
  fetchApi: VoidFunction;
};
function AddressItem({ address, fetchApi }: AddressItemProps) {
  const { name, namePersonal, phoneNumber } = address;
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);

  const handleClose = () => {
    setOpenUpdate(!openUpdate);
  };

  const onCreateSuccess = () => {
    handleClose();
    toast.success(config.MessageNotice.UpdateAddressSuccess);
    fetchApi();
  };
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
            Số điện thoại người nhận: {phoneNumber}
          </Typography>
          <Typography variant="subtitle1">Tên địa chỉ: {name}</Typography>
          <Typography variant="body2" gutterBottom>
            Địa chỉ: {formatAddress(address)}
          </Typography>
        </Box>
        <Stack
          display="flex"
          flexDirection="row"
          sx={{ justifyContent: "flex-end" }}
        >
          <Button
            onClick={() => {
              setOpenUpdate(!openUpdate);
            }}
          >
            Sửa tên người nhận
          </Button>
        </Stack>
        {openUpdate && (
          <ModalUpdateAddress
            addressData={address}
            onClose={handleClose}
            onSuccess={onCreateSuccess}
            open={openUpdate}
          />
        )}
      </Card>
    </>
  );
}
