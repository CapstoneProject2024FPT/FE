import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import TableCategory from "../../../sections/Category/TableCategory";

const Category: React.FC = () => {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Tất cả loại máy"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Loại máy" },
          { name: "Tất cả Loại máy" },
        ]}
      />
      <TableCategory />
    </Container>
  );
};

export default Category;
