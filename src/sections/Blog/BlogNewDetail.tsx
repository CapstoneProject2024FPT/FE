import {
  Box,
  Card,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Image from "../../components/Image";
import React, { useEffect, useState } from "react";
import { formatDateFunc } from "../../utils/fn";
import { useParams } from "react-router-dom";
import { PostGetProps } from "../../models/blog";
import { ApiNews } from "../../api/services/apiNews";
import { toast } from "react-toastify";
import { Button } from "antd";
import BlogNewUpdateForm from "./PopupBLog/BlogEditForm";
import Fancybox from "../../components/fancy-box-slide/FancyBox";
import config from "../../configs";

const NewsDetailAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<PostGetProps>();
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);

  const { apiGetNewsDetail } = ApiNews();

  const fetchNewsDetail = async () => {
    if (id) {
      const response = await apiGetNewsDetail(id);

      if (response.status === 200) {
        setNews(response.data);
      } else {
        toast.error(config.AdminMessageNotice.GetBlogFailed);
      }
    }
  };

  useEffect(() => {
    fetchNewsDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = () => {
    setOpenUpdate(!openUpdate);
  };

  const handleClose = () => {
    setOpenUpdate(!openUpdate);
  };

  const onUpdateSuccess = () => {
    handleClose();
    fetchNewsDetail();
    toast.success(config.AdminMessageNotice.UpdateSuccess);
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleUpdate}>Sửa tin tức</Button>
      </div>
      <div>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 2 }}>
                <Paper elevation={0}>
                  <Header title={news?.title || ""} cover={news?.cover} />
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
                            <a
                              data-fancybox="gallery"
                              href={img.imgUrl}
                              key={idx}
                            >
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
                        dangerouslySetInnerHTML={{ __html: news.newsContent }}
                      />
                    )}
                  </Container>
                </Paper>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <TextField
                    label="Ngày Viết"
                    value={
                      news?.createDate
                        ? formatDateFunc.formatDate(news.createDate)
                        : ""
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    label="Người Viết"
                    value={news?.account.fullName || ""}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    label="Loại tin tức"
                    value={news?.newsCategory?.name || ""}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    label="Độ hot"
                    value={
                      news?.type === "Normal" ? "Bình Thường" : "Tin Nóng" || ""
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    label="Trạng Thái"
                    value={
                      news?.status === "Active" ? "Đang hiển thị" : "Đang ẩn"
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </div>
      {openUpdate && (
        <BlogNewUpdateForm
          openUpdate={openUpdate}
          blogDetail={news}
          handleClose={handleClose}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
    </>
  );
};

export default NewsDetailAdmin;

// ----------------------
type HeaderProps = {
  title: string;
  cover: string | undefined;
};

function Header({ title, cover }: HeaderProps) {
  return (
    <Box>
      <Box></Box>

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
