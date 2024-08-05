/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Button, Container, Menu, MenuItem } from "@mui/material";
import { ApiWarranty } from "../../../../api/services/apiWarranty";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  StatusType,
  Warranty,
  WarrantyDetailProps,
  WarrantyPropsById,
  warrantyStatusMapping,
} from "../../../../models/warranty";
import CancelWarrantyDialog from "../Modal/ModalCancelWarrantyMachine";
import { toast } from "react-toastify";
import { formatDateFunc } from "../../../../utils/fn";
import EmptyOrder from "../../../../components/EmptyOrder";

import { useNavigate, useParams } from "react-router-dom";
import config from "../../../../configs";
import ModalRequestOrderDetail from "../Modal/ModalRequestWarranty";

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

function Row(props: {
  row: Warranty;
  onCancelWarranty: (warrantyId: string, description?: string) => void;
}) {
  const { row, onCancelWarranty } = props;
  const [open, setOpen] = useState(false);
  const date = new Date(row.warrantyDetails.createDate);
  const [warrantyDetail, setWarrantyDetail] = useState<WarrantyPropsById>();
  const { apiGetWarrantyById } = ApiWarranty();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [openRequestWarranty, setOpenRequestWarranty] =
    useState<boolean>(false);
  const [selectWarranty, setSelectWarranty] = useState<Warranty>();
  const navigate = useNavigate();

  const handleNavigateId = (record: WarrantyDetailProps) => {
    navigate(config.routes.maintenancePeriodic.replace(":id", record.id));
  };
  const fetchWarrantyById = async () => {
    if (row) {
      const response = await apiGetWarrantyById(row.warrantyDetails.id);
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

  const handleOpenWarranty = (record: Warranty) => {
    handleCloseMenu();
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
        <TableCell align="right">
          {row.warrantyDetails.inventory.serialNumber}
        </TableCell>
        <TableCell align="right">
          {row.warrantyDetails.inventory.machinery.name}
        </TableCell>
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
                            onClick={() => onCancelWarranty(detail.id)}
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
        <ModalRequestOrderDetail
          onClose={handleClosetWarranty}
          open={openRequestWarranty}
          warrantyData={selectWarranty}
        />
      )}
    </React.Fragment>
  );
}

const WarrantyManagementMachine: React.FC = () => {
  const [requests, setRequests] = useState<Warranty[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectWarrantyId, setSelectWarrantyId] = useState<string | null>(null);

  const { apiGetWarranty, apiCancelWarrantyDetail } = ApiWarranty();

  const loginInfoString = localStorage.getItem("loginInfo");
  const auth = loginInfoString ? JSON.parse(loginInfoString) : null;

  const { id } = useParams<{ id: string }>();
  const fetchWarranty = async () => {
    if (auth) {
      const params = {
        type: "Periodic",
        AccountId: auth.data.id,
        InventoryId: id,
      };
      const response = await apiGetWarranty(params);

      const DataMap = response.data.map((item: any) => ({
        warrantyDetails: item,
      }));

      setRequests(DataMap);
    }
  };

  const handleOpenDialog = (warrantyId: string) => {
    setSelectWarrantyId(warrantyId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectWarrantyId(null);
  };

  const handleCancelWarranty = async (description: string) => {
    if (selectWarrantyId) {
      try {
        const response = await apiCancelWarrantyDetail({
          warrantyId: selectWarrantyId,
          status: "Completed",
          description,
        });
        if (response.status === 200) {
          fetchWarranty();
          toast.success("Bảo hành định kỳ đã được hủy thành công");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi hủy bảo hành");
        console.log(error);
      } finally {
        handleCloseDialog();
      }
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
              {requests.map((row: Warranty) => (
                <Row
                  key={row.warrantyDetails.id}
                  row={row}
                  onCancelWarranty={handleOpenDialog}
                />
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
      <CancelWarrantyDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleCancelWarranty}
      />
    </Container>
  );
};

export default WarrantyManagementMachine;
