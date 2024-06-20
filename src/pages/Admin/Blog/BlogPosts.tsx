import React from "react";
import { Container } from "@mui/material";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import TableBlogNew from "../../../sections/Blog/BlogNewTable";

const BlogPosts: React.FC = () => {
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
      <TableBlogNew />
    </Container>
  );
};

export default BlogPosts;
