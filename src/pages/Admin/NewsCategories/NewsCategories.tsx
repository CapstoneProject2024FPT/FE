import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import TableNewsCategory from "../../../sections/NewsCategories/TableNewsCategories";

const NewsCategories: React.FC = () => {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Tất cả thể loại tin tức"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Thể loại tin tức" },
          { name: "Tất cả thể loại tin tức" },
        ]}
      />
      <TableNewsCategory />
    </Container>
  );
};

export default NewsCategories;
