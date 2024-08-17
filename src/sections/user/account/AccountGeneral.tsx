/* eslint-disable react-hooks/exhaustive-deps */
// @mui
import {
  Box,
  Grid,
  Card,
  Stack,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
//models
// components
import { staffProps } from "../../../models/UserData";
import { CustomerApi } from "../../../api/services/apiUser";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserEditForm from "./Modal/UserEditForm";

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { apiUserProfile } = CustomerApi();
  const [profile, setProfile] = useState<staffProps>();
  const [open, setOpen] = useState<boolean>(false);

  const loginInfoString = localStorage.getItem("loginInfo");
  const auth = loginInfoString ? JSON.parse(loginInfoString) : null;

  const fetchProfile = async () => {
    const id = auth?.data.id;
    if (id) {
      const response = await apiUserProfile(id);

      if (response.status === 200) {
        setProfile(response.data);
      } else {
        toast.error(response.Error);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(!open);
  };

  const onUpdateSuccess = (response: string) => {
    handleClose();
    fetchProfile();
    toast.success(response);
  };
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 5, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{ width: 135, height: 135 }}
                src={
                  profile?.image
                    ? profile?.image
                    : "https://firebasestorage.googleapis.com/v0/b/selling-maintainance-machinery.appspot.com/o/images%20(1).jfif?alt=media&token=5d70b7f3-d5c5-4de7-ba5a-767a328f9b82"
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                },
              }}
            >
              <TextField
                name="fullName"
                label="Tên"
                value={profile?.fullName || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                name="address"
                label="Giới tính"
                multiline
                value={
                  profile?.gender === "Male"
                    ? "Nam"
                    : profile?.gender === "Female"
                      ? "Nữ"
                      : "Chưa cập nhật"
                }
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                name="email"
                label="Địa chỉ email"
                value={profile?.email || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                name="phoneNumber"
                label="Số điện thoại"
                value={profile?.phoneNumber || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                name="yearOfExperience"
                label="Kinh Nghiệm"
                value={profile?.yearsOfExperience || 0}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" onClick={handleUpdate}>
                Cập nhật thông tin
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {open && (
        <UserEditForm
          userData={profile}
          open={open}
          handleClose={handleClose}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
    </>
  );
}
