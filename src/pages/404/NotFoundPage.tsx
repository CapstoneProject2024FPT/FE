import { m } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
import { Button, Typography, Container } from "@mui/material";
// components
import { MotionContainer, varBounce } from "../../components/animate";
// assets
import { PageNotFoundIllustration } from "../../assets";
import config from "../../configs";

// ----------------------------------------------------------------------

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 600,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(4, 0),
}));

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <Container component={MotionContainer}>
      <ContentStyle sx={{ textAlign: "center", alignItems: "center" }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Không Tìm Thấy Trang
          </Typography>
        </m.div>
        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration
            sx={{ height: 260, my: { xs: 5, sm: 10 } }}
          />
        </m.div>

        <Button
          to={config.routes.home}
          size="large"
          variant="contained"
          component={RouterLink}
        >
          Quay về trang Chủ
        </Button>
      </ContentStyle>
    </Container>
  );
}
