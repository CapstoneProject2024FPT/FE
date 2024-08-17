import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import TableDiscount from "../../../sections/Discount/TableDiscount";

const Discount: React.FC = () => {
  return (
    <Container sx={{ width: "100% !important", maxWidth: "none !important" }}>
      <HeaderBreadcrumbs
        heading="Tất cả giảm giá"
        links={[
          { name: "Thống kê", href: config.adminRoutes.discount },
          { name: "Giảm giá" },
        ]}
      />
      <TableDiscount />
    </Container>
  );
};

export default Discount;
