import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import {
  Button,
  Card,
  Container,
  Grid,
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
import { Link } from "react-router-dom";
import config from "../../../configs";
import { useCheckout } from "../../../zustand/useCheckout";

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

// Retrieve and parse cart items from localStorage, ensuring valid JSON
const getCartItems = (): cartProps => {
  const cartList = localStorage.getItem("cart");
  try {
    return cartList ? JSON.parse(cartList) : [];
  } catch (error) {
    console.error("Error parsing cart data from localStorage", error);
    return [];
  }
};

const Cart: React.FC<CartProp> = ({ handleNext }) => {
  const [CartItems, setCartItems] = useState<cartProps>(getCartItems());

  const { setTotal, total } = useCheckout();
  useEffect(() => {
    // Update localStorage whenever CartItems state changes
    localStorage.setItem("cart", JSON.stringify(CartItems));

    // Update the total price in the store
    setTotal(calculateTotalPrice(CartItems));
  }, [CartItems, setTotal]);

  const calculateTotalPrice = (CartItems: cartProps) => {
    let totalPrice = 0;
    CartItems.forEach((item) => {
      totalPrice += item.sellingPrice * item.currentQuantities;
    });

    return totalPrice;
  };

  const increaseQuantity = (id: string) => {
    const updateCart = CartItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          currentQuantities: item.currentQuantities + 1,
        };
      }
      return item;
    });

    setCartItems(updateCart);
  };

  const decreaseQuantity = (id: string) => {
    const updateCart = CartItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          currentQuantities: item.currentQuantities - 1,
        };
      }
      return item;
    });

    setCartItems(updateCart);
  };

  const deleteProduct = (id: string) => {
    const updateCart = CartItems.filter((item) => item.id != id);
    setCartItems(updateCart);
  };
  return (
    <>
      {CartItems.length > 0 ? (
        <div style={{ backgroundColor: "#ECF0F1" }}>
          <Box sx={{ flexGrow: 1, padding: "20px" }}>
            <Typography
              variant="h4"
              component="div"
              gutterBottom
              sx={{ mb: 3 }}
            >
              Giỏ hàng
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TableContainer sx={{ maxWidth: 820 }}>
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
                              <Link
                                to={config.routes.productDetail.replace(
                                  ":id",
                                  item.id
                                )}
                                style={{
                                  textDecoration: "none",
                                }}
                              >
                                <Typography
                                  noWrap
                                  variant="subtitle2"
                                  sx={{
                                    color: "black",
                                  }}
                                >
                                  {item.name}
                                </Typography>
                              </Link>
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
                                <IconButton
                                  size="small"
                                  color="inherit"
                                  onClick={() => decreaseQuantity(item.id)}
                                  disabled={item.currentQuantities <= 1}
                                >
                                  <Iconify
                                    icon={"eva:minus-fill"}
                                    width={16}
                                    height={16}
                                  />
                                </IconButton>

                                {item.currentQuantities}

                                <IconButton
                                  size="small"
                                  color="inherit"
                                  onClick={() => increaseQuantity(item.id)}
                                >
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
                                số lượng:{" "}
                                {item?.quantity?.Available
                                  ? item?.quantity?.Available
                                  : 2}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell align="right">
                            {formatMoney(
                              item?.sellingPrice * item.currentQuantities
                            )}
                          </TableCell>

                          <TableCell align="right">
                            <IconButton onClick={() => deleteProduct(item.id)}>
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
                <Link to={config.routes.productList} style={{ color: "black" }}>
                  <Button
                    sx={{ mt: 2 }}
                    color="inherit"
                    startIcon={<Iconify icon={"eva:arrow-ios-back-fill"} />}
                  >
                    Tiếp Tục Mua Sắm
                  </Button>
                </Link>
              </Grid>
              <Grid item xs={12} md={4} sx={{ mt: 2 }}>
                <CartSummary total={total} />
                <Button
                  variant="contained"
                  fullWidth
                  disabled={CartItems.length === 0}
                  onClick={handleNext}
                >
                  Thanh Toán
                </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      ) : (
        <Container
          sx={{
            maxWidth: "100%",
            background: "rgb(239,239,240)",
          }}
          maxWidth={false}
        >
          <Typography variant="h4" component="div" gutterBottom sx={{ mb: 3 }}>
            Giỏ hàng
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Card sx={{ width: "100%" }}>
                <EmptyCart title="Hiện tại chưa có sản phẩm" />
              </Card>
              <Link to={config.routes.productList}>
                <Button
                  color="inherit"
                  startIcon={<Iconify icon={"eva:arrow-ios-back-fill"} />}
                >
                  Tiếp Tục Mua Sắm
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} md={4}>
              <CartSummary total={total} />
              <Button
                variant="contained"
                fullWidth
                disabled={CartItems.length === 0}
                onClick={handleNext}
              >
                Thanh Toán
              </Button>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};

export default Cart;
