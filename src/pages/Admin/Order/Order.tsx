import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import {
  Box,
  Card,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import { TabValue } from "../../../sections/Order/TableOrder";
import SquareIcon from "@mui/icons-material/Square";
import { OrderCount, OrderStatus, statusMapping } from "../../../models/order";
import { ApiAdminDashboard } from "../../../api/services/apiAdminDashboard";

interface TabItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactElement;
}

const getItemTab = (
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: React.ReactElement
): TabItem => {
  return {
    key,
    label,
    icon,
    children,
  };
};

const Order: React.FC = () => {
  const tabItems = TabValue.map((item) => {
    return getItemTab(item.label, item.key, item.icon, item.children);
  });
  const { apiGetCountOrders } = ApiAdminDashboard();
  const [orderCounts, setOrderCounts] = useState<OrderCount>();

  const fetchOrderCount = async () => {
    const response = await apiGetCountOrders();
    setOrderCounts(response.data);
  };

  useEffect(() => {
    fetchOrderCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Color mapping order
  const colorMapping: Record<OrderStatus, string> = {
    Paid: "#2196F3",
    UnPaid: "grey",
    Completed: "green",
    Canceled: "red",
    Delivery: "#f39c12",
    ReDelivery: "#704c5e",
  };

  const orderStatusValues: OrderStatus[] = [
    "Paid",
    "UnPaid",
    "Completed",
    "Canceled",
    "Delivery",
    "ReDelivery",
  ];

  return (
    <Container sx={{ width: "100% !important", maxWidth: "none !important" }}>
      <HeaderBreadcrumbs
        heading="Tài Khoản"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Tài khoản" },
        ]}
      />
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          justifyItems: "center",
          minHeight: "50px",
          mb: 2,
        }}
      >
        {orderCounts?.ordersByStatus &&
          Object.entries(orderCounts?.ordersByStatus).map(
            ([status, count], index) => {
              const statusName = (
                statusMapping.find((item) => item.id === status) || {}
              ).name;
              const statusColor = orderStatusValues.includes(
                status as OrderStatus
              )
                ? colorMapping[status as OrderStatus]
                : "transparent";

              return (
                <Box key={index}>
                  <Stack display="flex" direction="row" spacing={1}>
                    <SquareIcon
                      sx={{
                        color: statusColor,
                        mr: 1,
                        width: "15px",
                        height: "15px",
                      }}
                    />
                    <Typography>
                      {statusName}: {count}
                    </Typography>
                    <Divider orientation="vertical" flexItem sx={{ mr: 8 }} />
                  </Stack>
                </Box>
              );
            }
          )}
      </Card>
      <Tabs type="card" defaultActiveKey="1" items={tabItems} />
    </Container>
  );
};

export default Order;
