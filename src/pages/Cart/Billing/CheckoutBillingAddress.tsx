import { useEffect, useState } from "react";
// @mui
import { Box, Grid, Card, Button, Typography, Container } from "@mui/material";

// _mock_

// components

import Iconify from "../../../components/Iconify";
//
import CartSummary from "../CartSection/CartSummary";
import { useCheckout } from "../../../zustand/useCheckout";
import { useAddress } from "../../../zustand/useAddress";
import CheckoutNewAddressForm from "./CheckoutNewAddressForm";
import { ApiAddress } from "../../../api/services/apiAddress";
import { addressProps } from "../../../models/address";
import { toast } from "react-toastify";
import { formatAddress } from "../../../utils/fn";
import config from "../../../configs";

// ----------------------------------------------------------------------

interface checkoutBillingAndAddress {
  handleBack: () => void;
  handleNextStep: () => void;
}
const CheckoutBillingAddress: React.FC<checkoutBillingAndAddress> = ({
  handleBack,
  handleNextStep,
}) => {
  const { total } = useCheckout();
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
      <Container sx={{ background: "#ECF0F1" }} maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box maxHeight={500} sx={{ overflow: "auto" }}>
              {addresses.map((address, index) => (
                <AddressItem
                  key={index}
                  onNextStep={handleNextStep}
                  address={address}
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                size="small"
                color="inherit"
                onClick={handleBack}
                startIcon={<Iconify icon={"eva:arrow-ios-back-fill"} />}
              >
                Về Giỏ Hàng
              </Button>
              <Button
                size="small"
                onClick={handleClickOpen}
                startIcon={<Iconify icon={"eva:plus-fill"} />}
                variant="contained"
              >
                Thêm Mới Địa Chỉ
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <CartSummary total={total} />
          </Grid>
        </Grid>
      </Container>
      {open && (
        <CheckoutNewAddressForm
          onClose={handleClose}
          open={open}
          onSuccess={onCreateSuccess}
        />
      )}
    </>
  );
};

export default CheckoutBillingAddress;
// ----------------------------------------------------------------------

type AddressItemProps = {
  address: addressProps;
  onNextStep: VoidFunction;
};

function AddressItem({ onNextStep, address }: AddressItemProps) {
  const { account, name } = address;

  const { setSelectedAddress } = useAddress();

  const handleCreateBilling = () => {
    setSelectedAddress(address);
    onNextStep();
  };
  return (
    <>
      <Card sx={{ p: 3, mb: 3, position: "relative" }}>
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

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Box sx={{ mx: 0.5 }} />
          <Button variant="outlined" size="small" onClick={handleCreateBilling}>
            Giao hàng tại Địa Chỉ này
          </Button>
        </Box>
      </Card>
    </>
  );
}
