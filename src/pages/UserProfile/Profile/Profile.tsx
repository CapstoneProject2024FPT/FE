/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import { CustomerApi } from "../../../api/services/apiUser";
import { userModel } from "../../../models/UserData";
import PopupUpdateUserProfile from "./PopupUser/PopupUpdateUserProfile";
import { toast } from "react-toastify";
import styles from "./userPropfile.module.scss";
import classNames from "classnames/bind";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ApiRank } from "../../../api/services/apiRank";
import { getRank } from "../../../models/rank";
import StarIcon from "@mui/icons-material/Star";
import { formatMoney } from "../../../utils/fn";

const cx = classNames.bind(styles);

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
  marginBottom: "16px", // Khoảng cách giữa các form grid
}));

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const Profile: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<userModel>();
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  const loginInfoString = localStorage.getItem("loginInfo");
  const auth = loginInfoString ? JSON.parse(loginInfoString) : null;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onUpdateSuccess = (response: string) => {
    handleClose();
    fetchUserProfile();
    toast.success(response);
  };

  const { apiUserProfile } = CustomerApi();

  const fetchUserProfile = async () => {
    const id: string = auth?.data.id;
    try {
      if (id) {
        const response = await apiUserProfile(id);
        setUserProfile(response?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const rankImageMap: { [key: string]: string } = {
    Đồng: "bronze-border",
    Bạc: "silver-border",
    Vàng: "gold-border",
  };

  const classRank = userProfile?.rank?.name
    ? rankImageMap[userProfile.rank.name]
    : "";

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <FormGrid xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className={cx("avatar", "avatar-large", classRank)}>
            <img
              src={
                userProfile?.image
                  ? userProfile.image
                  : "https://firebasestorage.googleapis.com/v0/b/selling-maintainance-machinery.appspot.com/o/images%20(1).jfif?alt=media&token=5d70b7f3-d5c5-4de7-ba5a-767a328f9b82"
              }
              alt="hình cá nhân"
              className={cx("avatar-image")}
            />
          </div>
          <Box sx={{ mt: 2 }}>
            <LabelStyle>
              Hạng: {userProfile?.rank?.name || "Chưa có hạng"} (
              {userProfile?.point})
            </LabelStyle>
          </Box>
        </Box>

        <LabelStyle>Họ và Tên</LabelStyle>
        <TextField
          placeholder="Dũng"
          InputProps={{ readOnly: true }}
          value={userProfile?.fullName || ""}
        />
      </FormGrid>
      <PromotionPolicy />
      <FormGrid xs={12}>
        <LabelStyle>Số Điện Thoại</LabelStyle>
        <TextField
          placeholder="0XX XXX XXXX"
          InputProps={{ readOnly: true }}
          value={userProfile?.phoneNumber || ""}
        />
      </FormGrid>
      <FormGrid xs={12}>
        <LabelStyle>Địa chỉ email</LabelStyle>
        <TextField
          placeholder="email@gmail.com"
          InputProps={{ readOnly: true }}
          value={userProfile?.email || ""}
        />
      </FormGrid>
      <FormGrid xs={12}>
        <LabelStyle>Giới tính</LabelStyle>
        <TextField
          placeholder="Chưa cập nhật"
          InputProps={{ readOnly: true }}
          value={
            userProfile?.gender === "Male"
              ? "Nam"
              : userProfile?.gender === "Female"
              ? "Nữ"
              : "Chưa cập nhật"
          }
        />
      </FormGrid>
      <FormGrid xs={12}>
        <LabelStyle sx={{ fontSize: "16px" }}>Họ và Tên</LabelStyle>
        <TextField
          placeholder="Dũng"
          InputProps={{
            readOnly: true,
            style: { fontSize: "16px" },
          }}
          value={userProfile?.fullName || ""}
        />
      </FormGrid>
      <FormGrid xs={12}>
        <LabelStyle sx={{ fontSize: "16px" }}>Số Điện Thoại</LabelStyle>
        <TextField
          placeholder="0XX XXX XXXX"
          InputProps={{
            readOnly: true,
            style: { fontSize: "16px" },
          }}
          value={userProfile?.phoneNumber || ""}
        />
      </FormGrid>
      <FormGrid xs={12}>
        <LabelStyle sx={{ fontSize: "16px" }}>Địa chỉ email</LabelStyle>
        <TextField
          placeholder="email@gmail.com"
          InputProps={{
            readOnly: true,
            style: { fontSize: "16px" },
          }}
          value={userProfile?.email || ""}
        />
      </FormGrid>
      <FormGrid xs={12}>
        <LabelStyle sx={{ fontSize: "16px" }}>Giới tính</LabelStyle>
        <TextField
          placeholder="Name"
          InputProps={{
            readOnly: true,
            style: { fontSize: "16px" },
          }}
          value={
            userProfile?.gender === "Male"
              ? "Nam"
              : userProfile?.gender === "Female"
              ? "Nữ"
              : "Chưa cập nhật"
          }
        />
      </FormGrid>
      <Button
        sx={{
          backgroundColor: "#3498DB",
          color: "white",
          fontSize: "20px",
          cursor: "pointer",
          margin: "10px",
          "&:hover": {
            backgroundColor: "#2980B9",
          },
        }}
        onClick={handleOpen}
      >
        Cập nhật thông tin
      </Button>

      {open && (
        <PopupUpdateUserProfile
          user={userProfile}
          open={open}
          handleClose={handleClose}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
    </Box>
  );
};

export default Profile;

const PromotionPolicy: React.FC = () => {
  const { apiGetRank } = ApiRank();
  const [rank, setRank] = useState<getRank[]>([]);

  const fetchRank = async () => {
    try {
      const response = await apiGetRank();
      setRank(response.data);
    } catch (error) {
      console.error("Error fetching rank data:", error);
    }
  };

  useEffect(() => {
    fetchRank();
  }, []);

  return (
    <Grid xs={12} sx={{ mt: 2 }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ backgroundColor: "#f5f5f5" }}
        >
          <Typography variant="h6">Chính sách thăng hạng</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 3 }}>
          <Box mb={2}>
            {rank.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <StarIcon
                  sx={{ color: "#FFD700", mr: 1 }} // Gold color for the icon
                />
                <Typography variant="body1">
                  <strong>{item.name}</strong>: Từ {item.range} điểm. Với mức ưu
                  đãi lên tới {item.value}% trên mỗi đơn hàng bạn mua
                </Typography>
              </Box>
            ))}
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="textSecondary">
            Người dùng sẽ được thăng hạng tự động khi đạt đủ số điểm theo yêu
            cầu. Bạn có thể kiểm tra tiến trình thăng hạng của mình trong phần
            thông tin cá nhân.
          </Typography>
          <Typography sx={{ color: "red" }}>
            (*) Một điểm = {formatMoney(100000)}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};
