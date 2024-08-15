/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps, TablePaginationConfig } from "antd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  OrderCount,
  OrderProps,
  OrderStatus,
  statusMapping,
  StatusType,
} from "../../models/order";
import { Table, Space, Dropdown, DatePicker } from "antd";
import { ApiOrder } from "../../api/services/apiOrder";
import { toast } from "react-toastify";
import { formatAddress, formatDateFunc, formatMoney } from "../../utils/fn";
import ModalDetailOrder from "./OrderModal/ModalDetailOrder";
import ModalCancelOrder from "./OrderModal/ModalCancelOrder";
import ModalDeliveryTask from "./OrderModal/ModalDeliveryTask";
import {
  Box,
  Card,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ApiAdminDashboard } from "../../api/services/apiAdminDashboard";
import SquareIcon from "@mui/icons-material/Square";
import moment from "moment";
type ColumnsType<T> = TableProps<T>["columns"];

const defaultPageSize = 10;

const TableOrder: React.FC = () => {
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: defaultPageSize,
    total: 0,
  });
  const [selectedCreateDate, setSelectedCreateDate] = useState<string | null>(
    null
  );
  const [selectedCompletedDate, setSelectedCompletedDate] = useState<
    string | null
  >(null);

  const [open, setOpen] = useState<boolean>(false);
  const [openCancelPopup, setOpenCancelPopup] = useState<boolean>(false);
  const [openTaskPopup, setOpenTaskPopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<OrderProps | null>(null);
  const [orderCounts, setOrderCounts] = useState<OrderCount>();
  const [selectStatus, setSelectStatus] = useState<string>("");
  const [selectStatusUi, setSelectStatusUi] = useState<string>("");

  const { loading, apiGetOrder } = ApiOrder();
  const { apiGetCountOrders } = ApiAdminDashboard();

  const handleActionDetail = (record: OrderProps) => {
    setOpen(!open);
    setSelectedData(record);
  };

  const handleCLose = () => {
    setOpen(!open);
  };

  const handleActionTask = (record: OrderProps) => {
    setOpenTaskPopup(!openTaskPopup);
    setSelectedData(record);
  };

  const handleCLoseTask = () => {
    setOpenTaskPopup(!openTaskPopup);
  };

  const handleActionCancel = (record: OrderProps) => {
    setOpenCancelPopup(!openCancelPopup);
    setSelectedData(record);
  };

  const handleCLoseCancel = () => {
    setOpenCancelPopup(!openCancelPopup);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "UnPaid":
        return { backgroundColor: "grey", color: "white" };
      case "Completed":
        return { backgroundColor: "green", color: "white" };
      case "Paid":
        return { backgroundColor: "#2196F3", color: "white" };
      case "Canceled":
        return { backgroundColor: "red", color: "white" };
      case "Delivery":
        return { backgroundColor: "#f39c12", color: "white" };
      case "ReDelivery":
        return { backgroundColor: "#704c5e", color: "white" };
      default:
        return { backgroundColor: "transparent", color: "black" };
    }
  };
  const fetchOrderCount = async () => {
    const response = await apiGetCountOrders();
    setOrderCounts(response.data);
  };
  const fetchOrder = async (
    page: number = 1,
    pageSize: number = defaultPageSize,
    createDate = selectedCreateDate,
    CompletedDate = selectedCompletedDate,
    Status = selectStatus
  ) => {
    try {
      const params = {
        size: pageSize,
        page: page,
        createDate: createDate,
        CompletedDate: CompletedDate,
        Status: Status,
      };
      const response = await apiGetOrder(params);

      setOrders(response.data.items);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total,
        current: response.data.page,
        pageSize: response.data.size,
      }));
    } catch (error) {
      toast.error("Error fetching orders");
    }
  };

  useEffect(() => {
    fetchOrder(pagination.current, pagination.pageSize);
    fetchOrderCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancelSuccess = (response: string) => {
    handleCLoseCancel();
    fetchOrder(pagination.current, pagination.pageSize);
    fetchOrderCount();
    toast.success(response);
  };

  const handleTaskSuccess = (response: string) => {
    handleCLoseTask();
    fetchOrder(pagination.current, pagination.pageSize);
    fetchOrderCount();
    toast.success(response);
  };

  const handleTableChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
    fetchOrder(page, pageSize);
    fetchOrderCount();
  };

  const customPagination = {
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    pageSizeOptions: ["20", "25", "50"],
    showSizeChanger: false,
    showQuickJumper: false,
    onChange: handleTableChange,
  };

  const handleCreateDateChange = (
    _date: any,
    dateString: string | string[]
  ) => {
    let formattedDate = Array.isArray(dateString) ? dateString[0] : dateString;
    if (formattedDate) {
      formattedDate = moment(formattedDate, "DD/MM/YYYY").format("YYYY/MM/DD");
    }
    setSelectedCreateDate(formattedDate);
    fetchOrder(
      pagination.current,
      pagination.pageSize,
      formattedDate,
      selectedCompletedDate,
      selectStatus
    );
    fetchOrderCount();
  };

  const handleCompletedDateChange = (
    _date: any,
    dateString: string | string[]
  ) => {
    let formattedDate = Array.isArray(dateString) ? dateString[0] : dateString;
    if (formattedDate) {
      formattedDate = moment(formattedDate, "DD/MM/YYYY").format("YYYY/MM/DD");
    }
    setSelectedCompletedDate(formattedDate);
    fetchOrder(
      pagination.current,
      pagination.pageSize,
      selectedCreateDate,
      formattedDate,
      selectStatus
    );
    fetchOrderCount();
  };
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  const handleSelect = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let valueStatus = e.target.value;
    const valueStatusUi = e.target.value;

    if (valueStatus === "all") {
      valueStatus = "";
    }
    setSelectStatus(valueStatus);
    setSelectStatusUi(valueStatusUi);
    fetchOrder(
      pagination.current,
      pagination.pageSize,
      selectedCreateDate,
      selectedCompletedDate,
      valueStatus
    );
    fetchOrderCount();
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Chi tiết",
    },
    {
      key: "2",
      label: "Tạo giao hàng",
    },
  ];

  const columns: ColumnsType<OrderProps> = [
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Mã đơn
        </div>
      ),
      dataIndex: "invoiceCode",
      align: "center",
      width: "5%"
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Loại đơn
        </div>
      ),
      dataIndex: "type",
      render: (type) => (type === "Order" ? "Mua hàng" : "Bảo hành"),
      align: "center",
      width: "10%"
    },
    {
      title: (
        <div
          style={{
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px"
          }}
        >
          Ngày tạo
          <DatePicker
            onChange={handleCreateDateChange}
            style={{ width: "100%", cursor: "pointer" }}
            format={dateFormatList}
            placeholder="Chọn ngày"
          />
        </div>
      ),
      dataIndex: "createDate",
      render: (createDate) => formatDateFunc.formatDate(createDate),
      align: "center",
      width: "15%"
    },
    {
      title: (
        <div
          style={{
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px"
          }}
        >
          Hoàn thành
          <DatePicker
            onChange={handleCompletedDateChange}
            style={{ width: "100%", cursor: "pointer" }}
            format={dateFormatList}
            placeholder="Chọn ngày"
          />
        </div>
      ),
      dataIndex: "completedDate",
      render: (completedDate) =>
        completedDate ? formatDateFunc.formatDate(completedDate) : "--------",
      align: "center",
      width: "15%"
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Khách hàng
        </div>
      ),
      dataIndex: "userInfo",
      render: (userInfo) => userInfo.fullName,
      width: "10%"
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Người nhận
        </div>
      ),
      dataIndex: "address",
      render: (address) => address.namePersonal,
      width: "15%"
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Tổng tiền
        </div>
      ),
      dataIndex: "finalAmount",
      render: (finalAmount) => (finalAmount ? formatMoney(finalAmount) : ""),
      width: "5%"
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Số điện thoại
        </div>
      ),
      dataIndex: "address",
      render: (address) => address.phoneNumber,
      width: "5%"
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Địa chỉ
        </div>
      ),
      dataIndex: "address",
      render: (address) => (address ? formatAddress(address) : ""),
      width: "30%"
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Trạng Thái
        </div>
      ),
      dataIndex: "status",
      render: (status: string) => {
        const defaultStatus = "Đang chờ xác nhận";

        const StatusName = status
          ? statusMapping?.find((s) => s.id === status)?.name
          : defaultStatus;

        const styles = getStatusStyles(status);
        return (
          <div
            style={{
              ...styles,
              padding: "4px 8px",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            {StatusName}
          </div>
        );
      },
      align: "center",
      width: "5%"
    },
    {
      title: "",
      key: "operation",
      render: (record: OrderProps) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items: items.filter((item) => {
                if (item && item.key) {
                  if (
                    record.status === StatusType.COMPLETED ||
                    record.status === StatusType.CANCELED
                  ) {
                    return !["2", "3"].includes(item.key as string);
                  } else if (record.status === StatusType.DELIVERY) {
                    return item.key !== "2";
                  } else if (String(record.noteStatus.FAILED) === "3") {
                    return !["2"].includes(item.key as string);
                  } else if (record.type !== "Order") {
                    return !["2"].includes(item.key as string);
                  }
                }
                return true;
              }),
              onClick: ({ key }) => {
                switch (key) {
                  case "1":
                    handleActionDetail(record);
                    break;
                  case "2":
                    handleActionTask(record);
                    break;
                  case "3":
                    handleActionCancel(record);
                    break;
                  default:
                    break;
                }
              },
            }}
          >
            <a>
              <MoreVertIcon />
            </a>
          </Dropdown>
        </Space>
      ),
      align: "center",
    },
  ];

  //Color mapping order
  const colorMapping: Record<OrderStatus, string> = {
    Paid: "#2196F3",
    UnPaid: "grey",
    Completed: "green",
    Canceled: "red",
    Delivery: "#f39c12",
    ReDelivery: "#704c5e",
  };

  const orderStatusValues: OrderStatus[] = [
    "Paid",
    "UnPaid",
    "Completed",
    "Canceled",
    "Delivery",
    "ReDelivery",
  ];

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
            minHeight: "50px",
          }}
        >
          {orderCounts?.ordersByStatus &&
            Object.entries(orderCounts?.ordersByStatus).map(
              ([status, count], index) => {
                const statusName = (
                  statusMapping.find((item) => item.id === status) || {}
                ).name;
                const statusColor = orderStatusValues.includes(
                  status as OrderStatus
                )
                  ? colorMapping[status as OrderStatus]
                  : "transparent";

                return (
                  <Box key={index}>
                    <Stack display="flex" direction="row" spacing={1}>
                      <SquareIcon
                        sx={{
                          color: statusColor,
                          mr: 1,
                          width: "15px",
                          height: "15px",
                        }}
                      />
                      <Typography>
                        {statusName}: {count}
                      </Typography>
                      <Divider orientation="vertical" flexItem sx={{ mr: 8 }} />
                    </Stack>
                  </Box>
                );
              }
            )}
        </Card>
        <TextField
          id="status"
          select
          label="Trạng thái đơn"
          value={selectStatusUi}
          sx={{ width: "20%", minHeight: "50px" }}
          onChange={(e) => handleSelect(e)}
        >
          {statusMapping.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Table
        columns={columns}
        rowKey={(record) => record.orderId}
        dataSource={orders}
        pagination={customPagination}
        loading={loading}
        onChange={(pagination) =>
          handleTableChange(pagination.current!, pagination.pageSize!)
        }
      />
      {open && (
        <ModalDetailOrder
          OrderData={selectedData}
          open={open}
          handleClose={handleCLose}
        />
      )}

      {openCancelPopup && (
        <ModalCancelOrder
          OrderData={selectedData}
          handleCloseCancelPopup={handleCLoseCancel}
          onCancelSuccess={handleCancelSuccess}
          openCancelPopup={openCancelPopup}
        />
      )}

      {openTaskPopup && (
        <ModalDeliveryTask
          OrderData={selectedData}
          handleCLose={handleCLoseTask}
          onCreateSuccess={handleTaskSuccess}
          openTaskPopup={openTaskPopup}
        />
      )}
    </React.Fragment>
  );
};

export default TableOrder;
