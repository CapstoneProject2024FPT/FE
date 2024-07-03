import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import TableBrand from "../../../sections/Brand/TableBrand";

const Brand: React.FC = () => {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Tất cả loại máy"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Thương hiệu máy" },
          { name: "Tất cả thương hiệu máy" },
        ]}
      />
      <TableBrand />
    </Container>
  );
};

export default Brand;
