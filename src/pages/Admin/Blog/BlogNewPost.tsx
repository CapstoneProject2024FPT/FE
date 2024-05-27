// @mui
import { Container } from "@mui/material";
// routes
// hooks
// components

import HeaderBreadcrumbs from "../../../components/Breadcrumbs";
// sections
import { BlogNewPostForm } from "../../../sections/@dashboard/blog";

// ----------------------------------------------------------------------

export default function BlogNewPost() {
  return (
    <Container>
      <HeaderBreadcrumbs
        links={[{ name: "Dashboard" }, { name: "Blog" }, { name: "New Post" }]}
      />

      <BlogNewPostForm />
    </Container>
  );
}
