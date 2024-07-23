import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import { Box, TextField, Typography } from "@mui/material";
import { CustomerApi } from "../../../../../../api/services/apiUser";
import { userModel } from "../../../../../../models/UserData";
import styles from "./userPropfile.module.scss";
import classNames from "classnames/bind";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import ModalUserAddress from "./PopupCustomer/popupDetailAddress";

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

const CustomerInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [userProfile, setUserProfile] = useState<userModel>();
  const [open, setOpen] = useState<boolean>(false);

  const { apiUserProfile } = CustomerApi();

  const fetchUserProfile = async () => {
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

  //modal
  const handleOpen = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(!open);
  };
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
              src={
                userProfile?.image
                  ? userProfile?.image
                  : "https://firebasestorage.googleapis.com/v0/b/selling-maintainance-machinery.appspot.com/o/images%20(1).jfif?alt=media&token=5d70b7f3-d5c5-4de7-ba5a-767a328f9b82"
              }
              alt="Hình cá nhân"
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
        <LabelStyle>Địa chỉ</LabelStyle>
        <Button style={{ maxWidth: "150px" }} onClick={handleOpen}>
          Địa chỉ
        </Button>
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
      <>
        {open && (
          <ModalUserAddress
            handleClose={handleClose}
            open={open}
            id={userProfile?.id}
          />
        )}
      </>
    </>
  );
};

export default CustomerInfo;
