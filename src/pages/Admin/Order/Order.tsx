import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import TableOrder from "../../../sections/Order/TableOrder";

const Order: React.FC = () => {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Tất cả Đơn Hàng"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Đơn hàng" },
        ]}
      />
      <TableOrder />
    </Container>
  );
};

export default Order;
