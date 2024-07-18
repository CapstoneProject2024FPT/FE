import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import TableProduct from "../../../sections/Product/TableProduct";

const Product: React.FC = () => {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Tất cả máy"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Sản phẩm" },
          { name: "Tất cả máy" },
        ]}
      />
      <TableProduct />
    </Container>
  );
};

export default Product;
