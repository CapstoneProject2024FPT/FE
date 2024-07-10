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
    toast.success("Tạo địa chỉ mới thành công");
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
            <AddressItem key={index} address={address} />
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
};
function AddressItem({ address }: AddressItemProps) {
  const { account, name } = address;
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
          <Typography variant="subtitle1">Tên: {account.fullName}</Typography>
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
          <Button>Chi Tiết</Button>
        </Stack>
      </Card>
    </>
  );
}
