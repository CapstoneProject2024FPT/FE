import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import PersonIcon from "@mui/icons-material/Person";
import CachedIcon from "@mui/icons-material/Cached";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EngineeringIcon from "@mui/icons-material/Engineering";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/system";
import {
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const UserProfile: React.FC = () => {
  const [state, setState] = React.useState({
    men: true,
    women: false,
    other: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { men, women, other } = state;

  return (
    <>
      <Typography variant="h3" component="h2">
        Trang cá nhân
      </Typography>
      <div
        style={{
          backgroundColor: "#ECF0F1",
          borderRadius: "20px",
          width: "65%",
          height: "100%",
        }}
      >
        <Box sx={{ flexGrow: 1, margin: "2%", padding: "20px" }}>
          <Grid container spacing={2}>
            <Grid xs={12} md={3}>
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                  borderRadius: "10px",
                  border: "1px solid ",
                }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader
                    component="div"
                    id="nested-list-subheader"
                    style={{ borderRadius: "10px" }}
                  >
                    Tên người dùng
                  </ListSubheader>
                }
              >
                <div style={{ width: "auto" }}>
                  <ListItemButton component={Link} to="/user">
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Thông tin tài khoản" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/order-management">
                    <ListItemIcon>
                      <CachedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Quản lý đơn hàng" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/favorite-product">
                    <ListItemIcon>
                      <FavoriteBorderIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sản phẩm yêu thích" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/maintenance">
                    <ListItemIcon>
                      <EngineeringIcon />
                    </ListItemIcon>
                    <ListItemText primary="Bảo trì" />
                  </ListItemButton>
                </div>
              </List>
            </Grid>
            <Grid xs={12} md={9}>
              <Box sx={{ marginLeft: "5%" }}>
                <Paper
                  sx={{
                    borderStyle: "none",
                    padding: "20px",
                    border: "1px solid ",
                  }}
                >
                  <Grid container spacing={2}>
                    <FormGrid xs={12}>
                      <FormLabel htmlFor="first-name">Họ</FormLabel>
                      <OutlinedInput
                        id="first-name"
                        name="first-name"
                        type="name"
                        placeholder="John"
                        autoComplete="first name"
                      />
                    </FormGrid>
                    <FormGrid xs={12}>
                      <FormLabel htmlFor="last-name">Tên</FormLabel>
                      <OutlinedInput
                        id="last-name"
                        name="last-name"
                        type="last-name"
                        placeholder="Dũng"
                        autoComplete="last name"
                      />
                    </FormGrid>

                    <FormGrid xs={12}>
                      <FormLabel htmlFor="phone-number" required>
                        Số điện thoại
                      </FormLabel>
                      <OutlinedInput
                        id="phone-number"
                        name="phone-number"
                        type="phone-number"
                        placeholder="0963697057"
                        required
                      />
                    </FormGrid>
                    <FormGrid xs={12}>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <OutlinedInput
                        id="email"
                        name="email"
                        type="email"
                        placeholder="hominhdung@gmail.com"
                      />
                    </FormGrid>
                    <FormGrid xs={12}>
                      <FormControl component="fieldset" variant="standard">
                        <FormLabel component="legend">Giới tính</FormLabel>
                        <FormGroup>
                          <div>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={men}
                                  onChange={handleChange}
                                  name="men"
                                />
                              }
                              label="Nam"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={women}
                                  onChange={handleChange}
                                  name="women"
                                />
                              }
                              label="Nữ"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={other}
                                  onChange={handleChange}
                                  name="other"
                                />
                              }
                              label="Khác"
                            />
                          </div>
                        </FormGroup>
                      </FormControl>
                    </FormGrid>

                    <FormGrid xs={12}>
                      <FormLabel htmlFor="birthday">Ngày sinh</FormLabel>
                      <OutlinedInput
                        id="birthday"
                        name="birthday"
                        type="birthday"
                        placeholder="21/04/2002"
                      />
                    </FormGrid>
                    <Button
                      style={{
                        backgroundColor: "#3498DB",
                        color: "white",
                        fontSize: "20px",
                        cursor: "pointer",
                        width: "200px",
                        margin: "10px",
                      }}
                    >
                      Cập nhật
                    </Button>
                  </Grid>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default UserProfile;
