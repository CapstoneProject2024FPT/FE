import React from "react";
import { Container } from "@mui/material";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import NewsDetailAdmin from "../../../sections/Blog/BlogNewDetail";

const BlogPostDetail: React.FC = () => {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Tất cả tin tức"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Tất cả tin tức", href: config.adminRoutes.blogs },
          { name: "Chi tiết tin tức" },
        ]}
      />
      <NewsDetailAdmin />
    </Container>
  );
};

export default BlogPostDetail;
