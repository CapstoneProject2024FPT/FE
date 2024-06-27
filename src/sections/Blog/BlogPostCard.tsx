// @mui
import { Box, Card, Typography, CardContent, Stack } from "@mui/material";
// routes

// utils
import { formatDateFunc, truncate } from "../../utils/fn";
// @types
import { Post } from "../../models/blog";
// components
import Image from "../../components/Image";
import Iconify from "../../components/Iconify";
import TextIconLabel from "../../components/TextIconLabel";

type Props = {
  post: Post;
  index?: number;
};

export default function BlogPostCard({ post }: Props) {
  const { cover, title, view, createAt } = post;

  return (
    <Card>
      <Box sx={{ position: "relative" }}>
        <Image alt="cover" src={cover} ratio="4/3" />
      </Box>

      <PostContent title={title} view={view} createdAt={createAt} />
    </Card>
  );
}

// ----------------------------------------------------------------------

type PostContentProps = {
  title: string;
  view: number;
  createdAt: Date | string;
  index?: number;
};

export function PostContent({
  view,
  createdAt,
  index,
  title,
}: PostContentProps) {
  const latestPostLarge = index === 0;
  const latestPostSmall = index === 1 || index === 2;

  const POST_INFO = [{ number: view, icon: "eva:eye-fill" }];

  return (
    <CardContent
      sx={{
        pt: 4.5,
        width: 1,
        ...((latestPostLarge || latestPostSmall) && {
          pt: 0,
          zIndex: 9,
          bottom: 0,
          position: "absolute",
          color: "common.white",
        }),
      }}
    >
      <Typography
        gutterBottom
        variant="caption"
        component="div"
        sx={{
          color: "text.disabled",
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: "common.white",
          }),
        }}
      >
        {formatDateFunc.formatDate(createdAt)}
      </Typography>
      <Typography
        gutterBottom
        variant="h6"
        component="h3"
        sx={{
          color: "black",
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: "common.white",
          }),
        }}
      >
        {truncate(title)}
      </Typography>
      <Stack
        flexWrap="wrap"
        direction="row"
        justifyContent="flex-end"
        sx={{
          mt: 3,
          color: "text.disabled",
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: "common.white",
          }),
        }}
      >
        {POST_INFO.map((info, index) => (
          <TextIconLabel
            key={index}
            icon={
              <Iconify
                icon={info.icon}
                sx={{ width: 16, height: 16, mr: 0.5 }}
              />
            }
            value={info.number}
            sx={{
              typography: "caption",
              ml: index === 0 ? 0 : 1.5,
              color: "black",
            }}
          />
        ))}
      </Stack>
    </CardContent>
  );
}
