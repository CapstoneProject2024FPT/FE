// @mui
import { Box } from "@mui/material";
// @type
import { Post } from "../../models/blog";

import { SkeletonPostItem } from "../../components/skeleton";
import BlogPostCard from "./BlogPostCard";

// ----------------------------------------------------------------------

type Props = {
  posts: Post[];
  loading: boolean;
};

export default function BlogHomePage({ posts, loading }: Props) {
  return (
    <Box
      sx={{
        marginTop: "5px",
        display: "grid",
        gap: 3,
        gridTemplateColumns: {
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
      }}
    >
      {(loading ? [...Array(4)] : posts).map((post, index) =>
        post ? (
          <BlogPostCard post={post} key={post.id} />
        ) : (
          <SkeletonPostItem key={index} />
        )
      )}
    </Box>
  );
}
