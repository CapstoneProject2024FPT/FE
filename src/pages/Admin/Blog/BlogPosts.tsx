import orderBy from "lodash/orderBy";
// import { Link as RouterLink } from "react-router-dom";
import { useEffect, useCallback, useState } from "react";
// @mui
import { Grid, Container, Stack } from "@mui/material";
// utils
// routes
// @types
import { Post } from "../../../models/blog";
// components
// import Iconify from "../../../components/Iconify";
import { SkeletonPostItem } from "../../../components/skeleton";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
// sections
import { BlogPostCard, BlogPostsSort } from "../../../sections/Blog";

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "oldest", label: "Oldest" },
];

// ----------------------------------------------------------------------

const applySort = (posts: Post[], sortBy: string) => {
  if (sortBy === "latest") {
    return orderBy(posts, ["createdAt"], ["desc"]);
  }
  if (sortBy === "oldest") {
    return orderBy(posts, ["createdAt"], ["asc"]);
  }
  if (sortBy === "popular") {
    return orderBy(posts, ["view"], ["desc"]);
  }
  return posts;
};

export default function BlogPosts() {
  const [posts, setPosts] = useState([]);
  console.log(setPosts);

  const [filters, setFilters] = useState("latest");

  const sortedPosts = applySort(posts, filters);

  const getAllPosts = useCallback(async () => {
    try {
      // const response = await axios.get('/api/blog/posts/all');
      // if (isMountedRef.current) {
      //   setPosts(response.data.posts);
      // }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const handleChangeSort = (value: string) => {
    if (value) {
      setFilters(value);
    }
  };

  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Blog"
        links={[{ name: "Dashboard" }, { name: "Blog" }, { name: "Posts" }]}
      />

      <Stack
        mb={5}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        {/* <BlogPostsSearch /> */}
        <BlogPostsSort
          query={filters}
          options={SORT_OPTIONS}
          onSort={handleChangeSort}
        />
      </Stack>

      <Grid container spacing={3}>
        {(!posts.length ? [...Array(12)] : sortedPosts).map((post, index) =>
          post ? (
            <Grid
              key={post.id}
              item
              xs={12}
              sm={6}
              md={(index === 0 && 6) || 3}
            >
              <BlogPostCard post={post} index={index} />
            </Grid>
          ) : (
            <SkeletonPostItem key={index} />
          )
        )}
      </Grid>
    </Container>
  );
}
