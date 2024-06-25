import { PostDetailProps } from "../../models/blog";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Image from "../../components/Image";
import React from "react";
import post from "../News/newDetail.json";
import { formatDateFunc } from "../../utils/fn";
import TextIconLabel from "../../components/TextIconLabel";
import Iconify from "../../components/Iconify";
import FacebookIcon from "@mui/icons-material/Facebook";
import { blue } from "@mui/material/colors";

const NewsDetail: React.FC = () => {
  const news: PostDetailProps = post;
  return (
    <div>
      <Box maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <Paper elevation={0}>
              <Header
                title={news?.title || ""}
                cover={news?.cover}
                createAt={news?.createAt}
                view={news?.view}
              />
              <Container>
                <Box
                  sx={{
                    mt: 5,
                    mb: 10,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 5, fontSize: "1rem" }}>
                    {news?.description}
                  </Typography>
                  <Box
                    component="img"
                    display="flex"
                    alignItems="center"
                    sx={{
                      objectFit: "cover",
                      width: "80%",
                      height: "400px",
                      margin: "0 auto",
                    }}
                    alt="The house from the offer."
                    src={news?.image}
                  />
                </Box>
                <div dangerouslySetInnerHTML={{ __html: news.content }} />
              </Container>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={0}>
              <Box>Tin tức liên quan</Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default NewsDetail;

// ----------------------
type HeaderProps = {
  title: string;
  cover: string;
  createAt: string | Date;
  view?: number;
};

function Header({ title, cover, createAt, view }: HeaderProps) {
  return (
    <Box>
      <Box>
        <Stack
          direction="column"
          display="flex"
          sx={{ alignItems: "flex-end" }}
        >
          <Typography
            gutterBottom
            variant="caption"
            component="div"
            sx={{
              color: "rgba(0,0,0,0.9)",
            }}
          >
            {createAt}
          </Typography>
          <TextIconLabel
            icon={
              <Iconify
                icon="eva:eye-fill"
                sx={{ width: 16, height: 16, mr: 0.5 }}
              />
            }
            value={view}
          />
          <IconButton>
            <FacebookIcon sx={{ color: blue[500] }} />
          </IconButton>
        </Stack>
      </Box>

      <Typography
        variant="h3"
        component="h3"
        sx={{
          color: "black",
          fontSize: "30px",
          maxWidth: "100%",
          overflow: "hidden",
          wordBreak: "break-word",
          fontWeight: "bold",
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Image alt="cover" src={cover} ratio="16/9" />
    </Box>
  );
}
