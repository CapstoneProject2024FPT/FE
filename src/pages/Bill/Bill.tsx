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
} from "@mui/material";

// @types

import config from "../../configs";
import { useNavigate } from "react-router-dom";
import { OrderProps } from "../../models/order";
import { ApiOrder } from "../../api/services/apiOrder";
import { formatAddress, formatDateFunc, formatMoney } from "../../utils/fn";
import { ApiWarranty } from "../../api/services/apiWarranty";
import { WarrantyResponse } from "../../models/warranty";

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
        navigate("/notFound");
      } finally {
        setLoading(false);
      }
    } else {
      navigate("/notFound");
    }
  }, [apiGetOrderId, apiGetWarranty, apiGetWarrantyById, orderID, navigate]);

  useEffect(() => {
    fetchOrderId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <Typography> Mã đơn hàng :{orderData?.invoiceCode}</Typography>
                <Typography>
                  Tên chủ đơn :{orderData?.userInfo?.fullName}
                </Typography>
                <Typography>
                  Ngày tạo đơn :
                  {formatDateFunc.formatDateTime(orderData?.createDate)}
                </Typography>
                <Typography>
                  Tổng thành tiền :{formatMoney(orderData?.finalAmount)}
                </Typography>
                <Typography>
                  Địa chỉ :{formatAddress(orderData?.address)}
                </Typography>
              </Stack>
              <Divider sx={{ mt: 2 }} />
              <Typography variant="h5" sx={{ mt: 4 }}>
                Chi tiết sản phẩm
              </Typography>
              {warranty?.map((product, idx) => (
                <Table size="small" aria-label="products" key={idx}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell>Mã số máy</TableCell>
                      <TableCell>Giá sản phẩm</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {product.warranty.map((detail) => (
                      <TableRow key={detail.warrantyDetails.id}>
                        <>
                          <TableCell width="40%">
                            {detail.warrantyDetails.inventory.machinery.name}
                          </TableCell>
                          <TableCell>
                            {detail.warrantyDetails.inventory.serialNumber}
                          </TableCell>
                          <TableCell>
                            {formatMoney(
                              detail.warrantyDetails.inventory.machinery
                                .sellingPrice
                            )}
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
                                Bảo trì định kì lần {idx + 1} :{" "}
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
              <Stack
                sx={{ mt: 2, justifyContent: "flex-end" }}
                display="flex"
                direction="row"
              >
                <Box>
                  <Button
                    variant="contained"
                    onClick={() => {
                      sessionStorage.removeItem("OrderId");
                      navigate(config.routes.home);
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
