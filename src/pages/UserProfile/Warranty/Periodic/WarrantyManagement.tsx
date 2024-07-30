import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Button,
  Container,
  Menu,
  MenuItem,
  TablePagination,
} from "@mui/material";
import { ApiWarranty } from "../../../../api/services/apiWarranty";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  StatusType,
  WarrantyDetailProps,
  WarrantyProps,
  WarrantyPropsById,
  warrantyStatusMapping,
} from "../../../../models/warranty";
import { formatDateFunc } from "../../../../utils/fn";
import EmptyOrder from "../../../../components/EmptyOrder";
import ModalTransactionDetail from "../Modal/ModalRequestWarranty";
import { useNavigate } from "react-router-dom";
import config from "../../../../configs";

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Process":
      return { backgroundColor: "#FFD700", color: "black" }; // vàng
    case "Completed":
      return { backgroundColor: "#4CAF50", color: "white" }; // xanh lá
    case "AwaitingAssignment":
      return { backgroundColor: "#FFD700", color: "black" }; // vàng
    case "Cancele":
      return { backgroundColor: "#F44336", color: "white" }; // đỏ
    default:
      return { backgroundColor: "transparent", color: "black" };
  }
};

function Row(props: { row: WarrantyProps }) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const date = new Date(row.createDate);
  const [warrantyDetail, setWarrantyDetail] = useState<WarrantyPropsById>();
  const { apiGetWarrantyById } = ApiWarranty();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [openRequestWarranty, setOpenRequestWarranty] =
    useState<boolean>(false);
  const [selectWarranty, setSelectWarranty] = useState<WarrantyProps>();
  const navigate = useNavigate();

  const handleNavigateId = (record: WarrantyDetailProps) => {
    navigate(config.routes.maintenancePeriodic.replace(":id", record.id));
  };
  const fetchWarrantyById = async () => {
    if (row) {
      const response = await apiGetWarrantyById(row.id);
      setWarrantyDetail(response.data);
    }
  };

  const handleClick = () => {
    if (!open) {
      fetchWarrantyById();
    }
    setOpen(!open);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenWarranty = (record: WarrantyProps) => {
    setSelectWarranty(record);
    setOpenRequestWarranty(!openRequestWarranty);
  };

  const handleClosetWarranty = () => {
    setOpenRequestWarranty(!openRequestWarranty);
  };
  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleClick}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="right">{row.inventory.serialNumber}</TableCell>
        <TableCell align="right">{row.inventory.machinery.name}</TableCell>
        <TableCell align="right">{`${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`}</TableCell>
        <TableCell align="center">
          <IconButton
            aria-label="more actions"
            size="small"
            onClick={handleOpenMenu}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
            <MenuItem
              onClick={() => {
                handleOpenWarranty(row);
              }}
            >
              Yêu cầu bảo hành
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Chi tiết yêu cầu
              </Typography>
              <Table size="medium" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Ngày bắt đầu</TableCell>
                    <TableCell align="right">Mô tả</TableCell>
                    <TableCell align="right">Trạng thái</TableCell>
                    <TableCell align="right">Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {warrantyDetail?.warrantyDetail.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell component="th" scope="row">
                        {formatDateFunc.formatDate(detail.startDate)}
                      </TableCell>
                      <TableCell align="right">{detail.description}</TableCell>

                      <TableCell align="right">
                        {detail.status !== StatusType.AWAITINGASSIGNMENT && (
                          <Box
                            sx={{
                              ...getStatusStyles(detail.status),
                              padding: "8px 16px",
                              borderRadius: "8px",
                              display: "inline-block",
                            }}
                          >
                            {
                              warrantyStatusMapping.find(
                                (status) => status.id === detail.status
                              )?.name
                            }
                          </Box>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {detail.status === StatusType.PROCESS && (
                          <Button
                            variant="contained"
                            color="primary"
                            style={{ marginRight: "10px" }}
                          >
                            Hủy
                          </Button>
                        )}
                        <Button onClick={() => handleNavigateId(detail)}>
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      {openRequestWarranty && (
        <ModalTransactionDetail
          onClose={handleClosetWarranty}
          open={openRequestWarranty}
          warrantyData={selectWarranty}
        />
      )}
    </React.Fragment>
  );
}

const WarrantyManagement: React.FC = () => {
  const [requests, setRequests] = useState<WarrantyProps[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const routePage = [15, 20, 25, 30];

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { apiGetWarranty } = ApiWarranty();

  const loginInfoString = localStorage.getItem("loginInfo");
  const auth = loginInfoString ? JSON.parse(loginInfoString) : null;

  const fetchWarranty = async () => {
    if (auth) {
      const params = {
        type: "Periodic",
        AccountId: auth.data.id,
      };
      const response = await apiGetWarranty(params);
      setRequests(response.data);
    }
  };

  useEffect(() => {
    fetchWarranty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="right">Số serial</TableCell>
              <TableCell align="right">Tên sản phẩm</TableCell>
              <TableCell align="right">Ngày tạo phiếu</TableCell>
              <TableCell align="right">Tạo yêu cầu bảo hành</TableCell>
            </TableRow>
          </TableHead>
          {requests.length > 0 ? (
            <TableBody>
              {requests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: WarrantyProps) => (
                  <Row key={row.id} row={row} />
                ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyOrder title="Không có dữ liệu" />
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={routePage}
        component="div"
        count={requests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số hàng mỗi trang"
      />
    </Container>
  );
};

export default WarrantyManagement;
