/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps, TablePaginationConfig } from "antd";
import { DownOutlined } from "@ant-design/icons";
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
import { formatDateFunc, formatMoney } from "../../utils/fn";
import ModalDetailOrder from "./OrderModal/ModalDetailOrder";
import ModalCancelOrder from "./OrderModal/ModalCancelOrder";
import ModalDeliveryTask from "./OrderModal/ModalDeliveryTask";
import { Box, Card, Divider, Stack, Typography } from "@mui/material";
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
      case "Unpaid":
        return { backgroundColor: "yellow", color: "black" };
      case "Completed":
        return { backgroundColor: "green", color: "white" };
      case "Paid":
        return { backgroundColor: "#2196F3", color: "white" };
      case "Canceled":
        return { backgroundColor: "red", color: "white" };
      case "Delivery":
        return { backgroundColor: "yellow", color: "white" };
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
    CompletedDate = selectedCompletedDate
  ) => {
    try {
      const params = {
        size: pageSize,
        page: page,
        createDate: createDate,
        CompletedDate: CompletedDate,
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
    toast.success(response);
  };

  const handleTaskSuccess = (response: string) => {
    handleCLoseTask();
    fetchOrder(pagination.current, pagination.pageSize);
    toast.success(response);
  };

  const handleTableChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
    fetchOrder(page, pageSize);
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
      selectedCompletedDate
    );
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
      formattedDate
    );
  };
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Chi tiết",
    },
    {
      key: "2",
      label: "Tạo giao hàng",
    },
    {
      key: "3",
      label: "Huỷ đơn hàng",
    },
  ];

  const columns: ColumnsType<OrderProps> = [
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Mã đơn hàng
        </div>
      ),
      dataIndex: "invoiceCode",
      width: "20%",
      align: "center",
    },
    {
      title: (
        <div
          style={{
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Ngày tạo
          <DatePicker
            onChange={handleCreateDateChange}
            style={{ marginLeft: 8, width: "50%" }}
            format={dateFormatList}
            placeholder="Ngày tạo"
          />
        </div>
      ),
      dataIndex: "createDate",
      render: (createDate) => formatDateFunc.formatDate(createDate),
      align: "center",
    },
    {
      title: (
        <div
          style={{
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Ngày hoàn thành
          <DatePicker
            onChange={handleCompletedDateChange}
            style={{ marginLeft: 8, width: "50%" }}
            format={dateFormatList}
            placeholder="Ngày hoàn thành"
          />
        </div>
      ),
      dataIndex: "completedDate",
      render: (completedDate) =>
        completedDate ? formatDateFunc.formatDate(completedDate) : "--------",
      align: "center",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Tổng thành tiền
        </div>
      ),
      dataIndex: "totalAmount",
      render: (totalAmount) => formatMoney(totalAmount),
      align: "center",
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
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Hành Động
        </div>
      ),
      key: "operation",
      render: (record) => (
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
                  } else {
                    return true;
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
              <DownOutlined />
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
    Delivery: "yellow",
  };

  const orderStatusValues: OrderStatus[] = [
    "Paid",
    "UnPaid",
    "Completed",
    "Canceled",
    "Delivery",
  ];

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Card sx={{ p: 3, mb: 2, display: "flex", flexDirection: "row" }}>
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
                  <Box>
                    <Stack display="flex" direction="row" spacing={1}>
                      <SquareIcon
                        sx={{
                          color: statusColor,
                          mr: 1,
                          width: "15px",
                          height: "15px",
                        }}
                      />
                      <Typography key={index}>
                        {statusName}: {count}
                      </Typography>
                      <Divider orientation="vertical" flexItem sx={{ mr: 8 }} />
                    </Stack>
                  </Box>
                );
              }
            )}
        </Card>
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
