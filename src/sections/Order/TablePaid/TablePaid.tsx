/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps, TablePaginationConfig } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { OrderProps, statusMapping, StatusType } from "../../../models/order";
import { Table, Space, Dropdown, DatePicker } from "antd";
import { ApiOrder } from "../../../api/services/apiOrder";
import { toast } from "react-toastify";
import { formatAddress, formatDateFunc, formatMoney } from "../../../utils/fn";
import ModalDetailOrder from "../OrderModal/ModalDetailOrder";
import ModalCancelOrder from "../OrderModal/ModalCancelOrder";
import ModalDeliveryTask from "../OrderModal/ModalDeliveryTask";
import moment from "moment";
import ExportPDF from "../Exportpdf/ExportPDF";
import { MenuItem, Stack, TextField } from "@mui/material";
type ColumnsType<T> = TableProps<T>["columns"];

const defaultPageSize = 10;
const options = [
  { label: "Mua hàng", value: "Order" },
  { label: "Bảo hành", value: "Warranty" },
];
const TablePaid: React.FC = () => {
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: defaultPageSize,
    total: 0,
  });
  const [selectedCreateDate, setSelectedCreateDate] = useState<string | null>(
    null
  );
  const [selectedOrderType, setSelectedOrderType] = useState<string>(
    options[0].value
  );
  const [selectedCompletedDate, setSelectedCompletedDate] = useState<
    string | null
  >(null);

  const [open, setOpen] = useState<boolean>(false);
  const [openCancelPopup, setOpenCancelPopup] = useState<boolean>(false);
  const [openTaskPopup, setOpenTaskPopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<OrderProps | null>(null);

  const { loading, apiGetOrder } = ApiOrder();

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
  const fetchOrder = async (
    page: number = 1,
    pageSize: number = defaultPageSize,
    createDate = selectedCreateDate,
    CompletedDate = selectedCompletedDate,
    orderType = selectedOrderType
  ) => {
    try {
      const params = {
        size: pageSize,
        page: page,
        createDate: createDate,
        CompletedDate: CompletedDate,
        Status: StatusType.PAID,
        type: orderType,
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
      align: "center",
    },
    {
      title: "Loại đơn hàng",
      dataIndex: "type",
      render: (type) => (type === "Order" ? "Mua hàng" : "Bảo hành"),
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
          Ngày hoàn thành dự kiến
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
      title: "Tổng tiền",
      dataIndex: "finalAmount",
      render: (finalAmount) => (finalAmount ? formatMoney(finalAmount) : ""),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "userInfo",
      render: (userInfo) => userInfo.fullName,
    },
    {
      title: "Người nhận hàng",
      dataIndex: "address",
      render: (address) => address.namePersonal,
    },
    {
      title: "Số điện thoại",
      dataIndex: "address",
      render: (address) => address.phoneNumber,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      render: (address) => (address ? formatAddress(address) : ""),
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
      render: (record: OrderProps) => {
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
            key: "4",
            label: <ExportPDF row={record} />,
          },
        ].filter((item) => {
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
        });

        return (
          <Space size="middle">
            <Dropdown
              menu={{
                items,
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
        );
      },
      align: "center",
    },
  ];

  const handleSelect = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let valueStatus = e.target.value;
    setSelectedOrderType(valueStatus);

    if (valueStatus === "all") {
      valueStatus = "";
    }
    fetchOrder(
      pagination.current,
      pagination.pageSize,
      selectedCreateDate,
      selectedCompletedDate,
      valueStatus
    );
  };
  return (
    <React.Fragment>
      <Stack display="flex" justifyContent="flex-end" direction="row">
        <TextField
          id="status"
          select
          label="Loại đơn hàng"
          value={selectedOrderType}
          sx={{ width: "200px", minHeight: "50px", mb: 2 }}
          onChange={(e) => handleSelect(e)}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
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

export default TablePaid;
