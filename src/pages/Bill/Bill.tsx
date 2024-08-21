/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
// @mui
import {
  CardHeader,
  Card,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Box,
  Container,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";

// @types
import config from "../../configs";
import { useNavigate } from "react-router-dom";
import { OrderProps } from "../../models/order";
import { ApiOrder } from "../../api/services/apiOrder";
import { formatAddress, formatDateFunc, formatMoney } from "../../utils/fn";
import { ApiWarranty } from "../../api/services/apiWarranty";
import { WarrantyResponse } from "../../models/warranty";
import ExportPDF from "./Exportpdf/ExportPDF";
import WarrantyPDF from "./Exportpdf/WarrantyPDF";

// ----------------------------------------------------------------------

const Bill: React.FC = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderProps>();
  const [warranty, setWarranty] = useState<WarrantyResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  //api
  const { apiGetOrderId } = ApiOrder();
  const { apiGetWarranty, apiGetWarrantyById } = ApiWarranty();

  const orderID = sessionStorage.getItem("OrderId");

  //api
  const fetchOrderId = useCallback(async () => {
    setLoading(true);
    if (orderID) {
      try {
        const response = await apiGetOrderId(orderID);
        setOrderData(response.data);

        if (response.data.type !== "Order") {
          setLoading(false);
          return;
        }
        if (response.status === 200) {
          const response2 = await Promise.all(
            response.data.productList.map(async (item: any) => {
              const params = {
                InventoryId: item.inventoryId,
              };
              const warranty = await apiGetWarranty(params);
              const warrantyDetailsPromises = warranty.data.map(
                async (warrantyItem: any) => {
                  const warrantyDetails = await apiGetWarrantyById(
                    warrantyItem.id
                  );
                  return {
                    warrantyDetails: warrantyDetails.data,
                  };
                }
              );

              const detailedWarrantyItems = await Promise.all(
                warrantyDetailsPromises
              );

              return {
                warranty: detailedWarrantyItems,
              };
            })
          );

          setWarranty(response2);
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
        clearOrderIdAndNavigate("/notFound");
      } finally {
        setLoading(false);
      }
    } else {
      clearOrderIdAndNavigate("/notFound");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiGetOrderId, apiGetWarranty, apiGetWarrantyById, orderID, navigate]);

  useEffect(() => {
    fetchOrderId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearOrderIdAndNavigate = useCallback(
    (path: string) => {
      sessionStorage.removeItem("OrderId");
      navigate(path);
    },
    [navigate]
  );

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <Container maxWidth="xl" sx={{ backgroundColor: "#ECF0F1" }}>
          {loading ? (
            <Stack
              sx={{
                height: "100vh",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Stack>
          ) : (
            <Card sx={{ p: 2 }}>
              <CardHeader title="Thông tin đơn hàng" />
              <Stack display="flex" direction="column" spacing={2}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <Typography>Mã đơn hàng:</Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography>{orderData?.invoiceCode}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>Tên chủ đơn:</Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography>{orderData?.userInfo?.fullName}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>Ngày tạo đơn:</Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography>
                      {formatDateFunc.formatDateTime(orderData?.createDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>Tổng thành tiền:</Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography>
                      {formatMoney(orderData?.finalAmount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>Địa chỉ:</Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography>{formatAddress(orderData?.address)}</Typography>
                  </Grid>
                </Grid>
              </Stack>
              <Divider sx={{ mt: 2 }} />
              <Typography variant="h5" sx={{ mt: 4 }}>
                Chi tiết sản phẩm
              </Typography>
              {orderData?.status !== "Canceled" &&
              orderData?.status !== "UnPaid" &&
              orderData?.type !== "Warranty" ? (
                <>
                  {warranty?.map((product, idx) => (
                    <Table size="small" aria-label="products" key={idx}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Tên sản phẩm</TableCell>
                          <TableCell>Mã số máy</TableCell>
                          <TableCell>Giá sản phẩm</TableCell>
                          <TableCell>Phiếu bảo hành</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {product.warranty.map((detail) => (
                          <TableRow key={detail.warrantyDetails.id}>
                            <>
                              <TableCell width="40%">
                                {
                                  detail.warrantyDetails.inventory.machinery
                                    .name
                                }
                              </TableCell>
                              <TableCell>
                                {detail.warrantyDetails.inventory.serialNumber}
                              </TableCell>
                              <TableCell>
                                {formatMoney(
                                  orderData?.productList.find(
                                    (item) =>
                                      item.productId ===
                                      detail.warrantyDetails.inventory.machinery
                                        .id
                                  )?.totalAmount
                                )}
                              </TableCell>

                              <TableCell>
                                <WarrantyPDF
                                  order={orderData}
                                  product={detail}
                                />
                              </TableCell>
                            </>
                          </TableRow>
                        ))}

                        {product.warranty.map((detail, detailIdx) => (
                          <React.Fragment key={detailIdx}>
                            {detail.warrantyDetails.warrantyDetail.map(
                              (warrantyItem, idx) => (
                                <TableRow key={warrantyItem.id}>
                                  <TableCell>
                                    Bảo hành định kỳ lần {idx + 1} :{" "}
                                    {formatDateFunc.formatDate(
                                      warrantyItem.startDate
                                    )}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  ))}
                </>
              ) : (
                <Table size="small" aria-label="order-data">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell>Số lượng</TableCell>
                      <TableCell>Giá sản phẩm</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderData?.type === "Order" ? (
                      <>
                        {orderData?.productList?.map((machine, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{machine.productName}</TableCell>
                            <TableCell>{machine.quantity}</TableCell>
                            <TableCell>
                              {formatMoney(machine.totalAmount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    ) : (
                      <>
                        {orderData?.productList?.map((machine, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {machine.machineComponentName}
                            </TableCell>
                            <TableCell>{machine.quantity}</TableCell>
                            <TableCell>
                              {formatMoney(machine.totalAmount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              )}
              <Stack
                sx={{ mt: 2, justifyContent: "flex-end" }}
                display="flex"
                direction="row"
              >
                <Box>
                  <Button sx={{ mr: 2 }} variant="contained">
                    <ExportPDF row={orderData} />
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      clearOrderIdAndNavigate(config.routes.home);
                    }}
                  >
                    Về trang chủ
                  </Button>
                </Box>
              </Stack>
            </Card>
          )}
        </Container>
      )}
    </>
  );
};

export default Bill;
