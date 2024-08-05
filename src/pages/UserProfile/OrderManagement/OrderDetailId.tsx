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
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";

// @types
import config from "../../../configs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { OrderProps } from "../../../models/order";
import { ApiOrder } from "../../../api/services/apiOrder";
import { formatAddress, formatDateFunc, formatMoney } from "../../../utils/fn";
import { ApiWarranty } from "../../../api/services/apiWarranty";
import { Warranty, WarrantyResponse } from "../../../models/warranty";
import PopupDetailOrder from "./Modal/PopupDetailOrder";
import ModalRequestOrderDetail from "./Modal/ModalRequestWarranty";

// ----------------------------------------------------------------------

const OrderDetailBill: React.FC = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderProps>();
  const [warranty, setWarranty] = useState<WarrantyResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>();
  const [openWarranty, setOpenWarranty] = useState<boolean>();
  const [selectData, setSelectData] = useState<Warranty>();
  //api
  const { apiGetOrderId } = ApiOrder();
  const { apiGetWarranty, apiGetWarrantyById } = ApiWarranty();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  //api
  const fetchOrderId = useCallback(async () => {
    setLoading(true);
    if (id) {
      try {
        const response = await apiGetOrderId(id);
        setOrderData(response.data);

        if (response.status === 200) {
          const response2 = await Promise.all(
            response.data.productList.map(async (item: any) => {
              const params = {
                InventoryId: item.inventoryId,
                type: "Periodic",
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
  }, [apiGetOrderId, apiGetWarranty, apiGetWarrantyById, id, navigate]);

  useEffect(() => {
    fetchOrderId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = () => {
    navigate(config.routes.orderManagement);
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleOpenWarranty = (record: Warranty) => {
    setSelectData(record);
    setOpenWarranty(!openWarranty);
  };

  const handleCloseWarranty = () => {
    setOpenWarranty(!openWarranty);
  };

  const handleNavigate = (record: string) => {
    sessionStorage.setItem("orderPath", location.pathname);
    navigate(config.routes.orderManagementIdWarranty.replace(":id", record));
  };
  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
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
            <>
              <Stack
                display="flex"
                direction="row"
                justifyContent="space-between"
              >
                <Button
                  onClick={() => {
                    handleBack();
                  }}
                  variant="outlined"
                >
                  Quay lại
                </Button>

                <Button
                  onClick={() => {
                    handleOpen();
                  }}
                  variant="outlined"
                >
                  Lịch sử giao hàng
                </Button>
              </Stack>
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
                      <Typography>
                        {formatAddress(orderData?.address)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
                <Divider sx={{ mt: 2 }} />
                <Typography variant="h5" sx={{ mt: 4 }}>
                  Chi tiết sản phẩm
                </Typography>
                {orderData?.status !== "Canceled" &&
                orderData?.status !== "UnPaid" ? (
                  <>
                    {warranty?.map((product, idx) => (
                      <Table size="small" aria-label="products" key={idx}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Mã số máy</TableCell>
                            <TableCell>Giá sản phẩm</TableCell>
                            <TableCell>Bảo hành</TableCell>
                            <TableCell>Tạo bảo hành</TableCell>
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
                                  {
                                    detail.warrantyDetails.inventory
                                      .serialNumber
                                  }
                                </TableCell>
                                <TableCell>
                                  {formatMoney(
                                    detail.warrantyDetails.inventory.machinery
                                      .sellingPrice
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="contained"
                                    onClick={() =>
                                      handleNavigate(
                                        detail.warrantyDetails.inventory.id
                                      )
                                    }
                                  >
                                    Chi tiết
                                  </Button>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="contained"
                                    onClick={() => handleOpenWarranty(detail)}
                                  >
                                    Tạo yêu cầu bảo hành
                                  </Button>
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
                    </TableBody>
                  </Table>
                )}
              </Card>
              {/* lịch sủ giao hàng */}
              {open && (
                <PopupDetailOrder
                  OrderData={orderData}
                  handleClose={handleClose}
                  open={open}
                />
              )}
              {/* tạo  bảo hành */}
              {openWarranty && (
                <ModalRequestOrderDetail
                  open={openWarranty}
                  onClose={handleCloseWarranty}
                  warrantyData={selectData}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default OrderDetailBill;
