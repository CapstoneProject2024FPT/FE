// @mui
import { Container } from "@mui/material";
// routes
// hooks
// components

import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
// sections
import { BlogNewPostForm } from "../../../sections/Blog";

// ----------------------------------------------------------------------

export default function BlogNewPost() {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Thêm mới tin tức"
        links={[
          { name: "Thống kê" },
          { name: "Tin tức" },
          { name: "Thêm mới tin tức" },
        ]}
      />

      <BlogNewPostForm />
    </Container>
  );
}
