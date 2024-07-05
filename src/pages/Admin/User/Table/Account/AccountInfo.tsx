import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import { Box, TextField, Typography } from "@mui/material";
import { CutomerApi } from "../../../../../api/services/apiUser";
import { staffProps } from "../../../../../models/UserData";
import styles from "./userProfile.module.scss";
import classNames from "classnames/bind";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import ModalChangeRole from "../Popup/PopupChangeRole";
import { toast } from "react-toastify";
import { RoleData } from "../../RoleData";

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

const AccountInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [openModalRole, setOpenModalRole] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<staffProps>();

  const { apiUserProfile } = CutomerApi();

  const handleOpenChangeRole = () => {
    setOpenModalRole(!openModalRole);
  };
  const handleClose = () => {
    setOpenModalRole(!openModalRole);
  };
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

  const onSuccess = () => {
    toast.success("Cập nhật chức vụ thành công");
    handleClose();
    fetchUserProfile();
  };

  const defaultRole = "";

  const RoleName = userProfile?.role
    ? RoleData?.find((role) => role.id === userProfile?.role)?.name
    : defaultRole;

  return (
    <>
      <Button onClick={handleOpenChangeRole}>Cập nhật chức vụ</Button>
      <FormGrid xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className={cx("avatar", "avatar-large")}>
            <img
              src="https://static.gamersclub.com.br/players/avatar/737335/737335_full.jpg"
              alt="Usuário"
              className={cx("avatar-image")}
            />
          </div>
          <Box sx={{ mt: 2 }}>
            <LabelStyle>Chức vụ: {RoleName}</LabelStyle>
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

      <FormGrid xs={12}>
        <LabelStyle>Địa chỉ</LabelStyle>
        <TextField
          placeholder="168 Phan Đình Phùng ..."
          InputProps={{
            readOnly: true,
          }}
          value={userProfile?.address || ""}
        />
      </FormGrid>
      <FormGrid xs={12}>
        <LabelStyle>Số năm kinh nghiệm</LabelStyle>
        <TextField
          placeholder="168 Phan Đình Phùng ..."
          InputProps={{
            readOnly: true,
          }}
          value={userProfile?.yearsOfExperience || 0}
        />
      </FormGrid>

      {openModalRole && (
        <ModalChangeRole
          UserData={userProfile}
          handleClose={handleClose}
          open={openModalRole}
          onUpdateSuccess={onSuccess}
        />
      )}
    </>
  );
};

export default AccountInfo;
