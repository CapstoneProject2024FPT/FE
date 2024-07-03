// @mui
import { Box } from "@mui/material";
// @type
import { PostGetProps } from "../../models/blog";

import { SkeletonPostItem } from "../../components/skeleton";
import BlogPostCard from "./BlogPostCard";

// ----------------------------------------------------------------------

type Props = {
  posts: PostGetProps[];
  loading: boolean;
};

export default function BlogHomePage({ posts, loading }: Props) {
  const displayedNews: (PostGetProps | undefined)[] = loading
    ? Array(4).fill(undefined)
    : posts?.slice(0, 4);
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
      {displayedNews?.map((post, index) =>
        post ? (
          <BlogPostCard post={post} key={post.id} />
        ) : (
          <SkeletonPostItem key={index} />
        )
      )}
    </Box>
  );
}
