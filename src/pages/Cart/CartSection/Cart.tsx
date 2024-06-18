import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import {
  Button,
  Card,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { cartProps } from "../../../models/cart";
import EmptyCart from "../../../components/EmptyCart";
import { formatMoney } from "../../../utils/fn";
import Image from "../../../components/Image";
import Iconify from "../../../components/Iconify";
import CartSummary from "./CartSummary";

const IncrementerStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px rgba(145, 158, 171, 0.32)`,
}));

interface CartProp {
  handleNext: () => void;
}
const Cart: React.FC<CartProp> = ({ handleNext }) => {
  //   const cartList: cartProps = cart as cartProps;
  const cartList = localStorage.getItem("cart") || "";

  const CartItems: cartProps = JSON.parse(cartList);

  console.log(CartItems.length);

  const calculateTotalPrice = (CartItems: cartProps) => {
    let totalPrice = 0;
    CartItems.forEach((item) => {
      totalPrice += item.sellingPrice;
    });
    return totalPrice;
  };
  return (
    <>
      {CartItems.length > 0 ? (
        <div style={{ backgroundColor: "#ECF0F1" }}>
          <Box sx={{ flexGrow: 1, padding: "20px" }}>
            <Typography variant="h4" component="div" gutterBottom>
              Giỏ hàng
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={12} md={8}>
                <TableContainer sx={{ minWidth: 720 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: "white" }}>
                        <TableCell>Tên sản phẩm</TableCell>
                        <TableCell>Giá bán</TableCell>
                        <TableCell>Số lượng</TableCell>
                        <TableCell>Tổng giá</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {CartItems.map((item, index) => (
                        <TableRow
                          sx={{ height: "130px", background: "white" }}
                          key={index}
                        >
                          <TableCell
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Image
                              alt={item.name}
                              src={item.image[0].imageURL}
                              sx={{
                                width: 100,
                                height: 100,
                                borderRadius: 1.5,
                                mr: 2,
                              }}
                            />

                            <Stack spacing={0.5}>
                              <Typography
                                noWrap
                                variant="subtitle2"
                                sx={{ maxWidth: 240 }}
                              >
                                {item.name}
                              </Typography>

                              <Stack direction="row" alignItems="center">
                                <Typography variant="body2">
                                  <Box
                                    component="span"
                                    sx={{ color: "text.secondary" }}
                                  >
                                    {item.model}
                                  </Box>
                                </Typography>
                              </Stack>
                            </Stack>
                          </TableCell>

                          <TableCell>
                            {formatMoney(item.sellingPrice)}
                          </TableCell>

                          <TableCell>
                            <Box sx={{ width: 96, textAlign: "right" }}>
                              <IncrementerStyle>
                                <IconButton size="small" color="inherit">
                                  <Iconify
                                    icon={"eva:minus-fill"}
                                    width={16}
                                    height={16}
                                  />
                                </IconButton>

                                {item.currentQuantities}

                                <IconButton size="small" color="inherit">
                                  <Iconify
                                    icon={"eva:plus-fill"}
                                    width={16}
                                    height={16}
                                  />
                                </IconButton>
                              </IncrementerStyle>

                              <Typography
                                variant="caption"
                                sx={{ color: "text.secondary" }}
                              >
                                số lượng: {item?.quantity ? item?.quantity : 2}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell align="right">
                            {formatMoney(
                              item?.sellingPrice * item.currentQuantities
                            )}
                          </TableCell>

                          <TableCell align="right">
                            <IconButton>
                              <Iconify
                                icon={"eva:trash-2-outline"}
                                width={20}
                                height={20}
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid xs={12} md={4}>
                <CartSummary total={calculateTotalPrice(CartItems)} />
                <Button
                  variant="contained"
                  fullWidth
                  disabled={CartItems.length === 0}
                  onClick={handleNext}
                >
                  Checkout
                </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card sx={{ width: "80%" }}>
            <EmptyCart title="Hiện tại chưa có sản phẩm" />
          </Card>
        </Box>
      )}
    </>
  );
};

export default Cart;
