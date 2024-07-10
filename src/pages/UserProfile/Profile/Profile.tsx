import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import { Box, Button, TextField, Typography } from "@mui/material";
import { CustomerApi } from "../../../api/services/apiUser";
import { userModel } from "../../../models/UserData";
import PopupUpdateUserProfile from "./PopupUser/PopupUpdateUserProfile";
import { toast } from "react-toastify";
import styles from "./userPropfile.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const Profile: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<userModel>();

  const loginInfoString = localStorage.getItem("loginInfo");
  const auth = loginInfoString ? JSON.parse(loginInfoString) : null;

  //open
  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
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
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rankImageMap: { [key: string]: string } = {
    Đồng: "bonze-border",
    Bạc: "silver-border",
    Vàng: "gold-border",
  };

  const defaultclassRank = "";

  const classRank = userProfile?.rank?.name
    ? rankImageMap[userProfile.rank.name]
    : defaultclassRank;

  return (
    <>
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
              src={userProfile?.image}
              alt="Usuário"
              className={cx("avatar-image")}
            />
          </div>
          <Box sx={{ mt: 2 }}>
            <LabelStyle>
              Hạng:
              {userProfile?.rank?.name
                ? userProfile?.rank?.name
                : "Chưa có hạng"}
            </LabelStyle>
          </Box>
        </Box>

        <LabelStyle>Họ và Tên</LabelStyle>
        <TextField
          placeholder="Dũng"
          InputProps={{
            readOnly: true,
          }}
          value={userProfile?.fullName || ""}
        />
      </FormGrid>

      <FormGrid xs={12}>
        <LabelStyle>Số Điện Thoại</LabelStyle>
        <TextField
          placeholder="0XX XXX XXXX"
          InputProps={{
            readOnly: true,
          }}
          value={userProfile?.phoneNumber || ""}
        />
      </FormGrid>
      <FormGrid xs={12}>
        <LabelStyle>Địa chỉ email</LabelStyle>
        <TextField
          placeholder="email@gmail.com"
          InputProps={{
            readOnly: true,
          }}
          value={userProfile?.email || ""}
        />
      </FormGrid>
      <FormGrid xs={12}>
        <LabelStyle>Giới tính</LabelStyle>
        <TextField
          placeholder="Name"
          InputProps={{
            readOnly: true,
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
        style={{
          backgroundColor: "#3498DB",
          color: "white",
          fontSize: "20px",
          cursor: "pointer",
          margin: "10px",
        }}
        onClick={handleOpen}
      >
        Cập nhật Thông Tin
      </Button>

      {open && (
        <PopupUpdateUserProfile
          user={userProfile}
          open={open}
          handleClose={handleClose}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
    </>
  );
};

export default Profile;
