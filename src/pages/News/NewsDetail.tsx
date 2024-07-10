import { PostGetProps } from "../../models/blog";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "../../components/Image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { formatDateFunc } from "../../utils/fn";
import Iconify from "../../components/Iconify";
import FacebookIcon from "@mui/icons-material/Facebook";
import { blue } from "@mui/material/colors";
import LinkIcon from "@mui/icons-material/Link";
import { FacebookShareButton } from "react-share";
import ProgressBar from "../../components/progressBar/ProgressBar";
import { useParams } from "react-router-dom";
import { ApiNews } from "../../api/services/apiNews";
import Fancybox from "../../components/fancy-box-slide/FancyBox";
import MetaTags from "../../components/MetaTags";

const NewsDetail: React.FC = () => {
  const [news, setNews] = useState<PostGetProps>();
  const { id } = useParams<{ id: string }>();

  const { apiGetNewsDetail } = ApiNews();

  const fetchNewsDetail = async () => {
    if (id) {
      const response = await apiGetNewsDetail(id);
      setNews(response.data);
    }
  };

  useEffect(() => {
    fetchNewsDetail();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <Box maxWidth="lg" sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <Paper elevation={0}>
              <Header
                title={news?.title || ""}
                cover={news?.cover}
                createAt={news?.createDate}
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
                  <Fancybox
                    options={{
                      Carousel: {
                        infinite: true,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 1,
                      }}
                    >
                      {news?.imgList?.map((img, idx) => (
                        <a data-fancybox="gallery" href={img.imgUrl} key={idx}>
                          <Box
                            key={idx}
                            component="img"
                            sx={{
                              objectFit: "cover",
                              width: "80%",
                              height: "200px",
                              margin: "0 auto",
                            }}
                            alt="hình ảnh"
                            src={img.imgUrl}
                          />
                        </a>
                      ))}
                    </Box>
                  </Fancybox>
                </Box>
                {news?.newsContent && (
                  <div
                    dangerouslySetInnerHTML={{ __html: news?.newsContent }}
                  />
                )}
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
  title: string | undefined;
  cover: string | undefined;
  createAt: Date | undefined;
};

function Header({ title, cover, createAt }: HeaderProps) {
  const [copy, setCopy] = useState<boolean>(false);
  const linkToCopy = window.location.href;
  const shareUrl = window.location.href;
  //make to to return type of setTimeout
  const timeOutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timeout = useCallback(() => {
    timeOutId.current = setTimeout(() => {
      setCopy(!copy);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    setCopy(!copy);
    navigator.clipboard.writeText(linkToCopy);
    timeout();
  };

  useEffect(() => {
    return () => {
      if (timeOutId.current) {
        clearTimeout(timeOutId.current);
      }
    };
  }, []);
  return (
    <Box>
      <MetaTags
        title={title}
        description={title}
        // image={cover}
        url={shareUrl}
      />
      <ProgressBar />
      <Box>
        <Stack
          direction="column"
          display="flex"
          sx={{ alignItems: "flex-end" }}
        >
          <Stack display="flex" direction="row">
            <Iconify icon="uil:calender" sx={{}} />
            <Typography
              gutterBottom
              variant="caption"
              component="div"
              sx={{
                color: "rgba(0,0,0,0.9)",
              }}
            >
              {formatDateFunc.formatDate(createAt)}
            </Typography>
          </Stack>

          <Stack component="div" display="flex" direction="row">
            <Tooltip title="Chia sẽ lên FaceBook">
              <FacebookShareButton url={shareUrl}>
                <FacebookIcon sx={{ color: blue[500] }} />
              </FacebookShareButton>
            </Tooltip>
            <Tooltip
              title={copy ? "Đã sao chép liên kết" : "Sao chép liên kết"}
            >
              <IconButton onClick={handleCopy}>
                <LinkIcon sx={{ color: blue[500] }} />
              </IconButton>
            </Tooltip>
          </Stack>
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
