import React from "react";
import { Container } from "@mui/material";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import TableBlogNew from "../../../sections/Blog/BlogNewTable";

const BlogPosts: React.FC = () => {
  return (
    <Container sx={{ width: "100% !important", maxWidth: "none !important" }}>
      <HeaderBreadcrumbs
        heading="Tất cả tin tức"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Tin tức" },
          { name: "Tất cả tin tức" },
        ]}
      />
      <TableBlogNew />
    </Container>
  );
};

export default BlogPosts;
