import React from "react";
import { Box, Card, Typography, CardContent, Stack } from "@mui/material";
import { formatDateFunc } from "../../../utils/fn";
import { PostGetProps } from "../../../models/blog";
import Image from "../../../components/Image";
import Iconify from "../../../components/Iconify";
import TextIconLabel from "../../../components/TextIconLabel";
import { Link } from "react-router-dom";
import config from "../../../configs";

type Props = {
  post: PostGetProps;
  index?: number;
};

export default function NewsCard({ post }: Props) {
  const { cover, title, createDate, id, description } = post;
  return (
    <Link
      to={config.routes.newsDetail.replace(":id", id)}
      style={{ textDecoration: "none" }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Flex direction for smaller screens
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "5px",
          color: "black",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          cursor: "pointer",
        }}
      >
        <Box
          sx={{
            flex: "1",
            position: "relative",
            width: { xs: "100%"}, // Full width on smaller screens
          }}
        >
          <Image
            alt="cover"
            src={cover}
            sx={{
              width: { xs: "100%", sm: "250px !important" }, // Responsive width
              height: "auto", // Maintain aspect ratio
              objectFit: "contain",
              padding: "20px",
            margin: "auto"
            }}
          />
        </Box>
        <Box
          sx={{
            flex: "2",
          }}
        >
          <PostContent title={title} createdAt={createDate} description={description} />
        </Box>
      </Card>
    </Link>
  );
}

type PostContentProps = {
  title: string;
  createdAt: Date;
  index?: number;
  description?: string;
};

export function PostContent({ createdAt, index, title, description }: PostContentProps) {
  const latestPostLarge = index === 0;
  const latestPostSmall = index === 1 || index === 2;
  return (
    <CardContent
      sx={{
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
      <TextIconLabel
        icon={
          <Iconify
            icon="uil:calender"
            // sx={{ width: 30, height: 18 }}
          />
        }
        value={
          <Typography
            gutterBottom
            variant="caption"
            component="div"
            sx={{
              fontWeight: "600",
              ...((latestPostLarge || latestPostSmall) && {
                opacity: 0.8,
                color: "common.white",
              }),
            }}
          >
            {formatDateFunc.formatDate(createdAt)}
          </Typography>
        }
      />
      <Typography
        gutterBottom
        variant="h6"
        component="h6"
        sx={{
          color: "black",
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: "common.white",
          }),
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: "black",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          WebkitLineClamp: 4, // Change this value to the number of lines you want to show
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: "common.white",
          }),
        }}
      >
        {description}
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
      ></Stack>
    </CardContent>
  );
}