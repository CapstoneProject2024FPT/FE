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
  const { cover, title, createDate, id } = post;
  return (
    <Link
      to={config.routes.newsDetail.replace(":id", id)}
      style={{ textDecoration: "none" }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          gap: "20px",
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
          }}
        >
          <Image
            alt="cover"
            src={cover}
            sx={{
              width: "100% !important",
              height: "250px",
              objectFit: "contain",
              padding: "20px",
            }}
          />
        </Box>
        <Box
          sx={{
            flex: "2",
          }}
        >
          <PostContent title={title} createdAt={createDate} />
        </Box>
      </Card>
    </Link>
  );
}

type PostContentProps = {
  title: string;
  createdAt: Date;
  index?: number;
};

export function PostContent({ createdAt, index, title }: PostContentProps) {
  const latestPostLarge = index === 0;
  const latestPostSmall = index === 1 || index === 2;
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