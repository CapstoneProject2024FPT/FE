import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Space, Dropdown } from "antd";
import { OrderProps, statusMapping, StatusType } from "../../models/order";
import { ApiOrder } from "../../api/services/apiOrder";
import { toast } from "react-toastify";
import { formatDateFunc, formatMoney } from "../../utils/fn";
import ModalDetailOrder from "./OrderModal/ModalDetailOrder";
import ModalAcceptOrder from "./OrderModal/ModalAcceptOrder";
import ModalCompleteOrder from "./OrderModal/ModalCompleteOrder";
import ModalCancelOrder from "./OrderModal/ModalCancelOrder";

type ColumnsType<T> = TableProps<T>["columns"];

const pageSize = 20;

const TableOrder: React.FC = () => {
  const [orders, setOrders] = useState<OrderProps[]>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });

  //popup
  const [open, setOpen] = useState<boolean>(false);
  const [openAcceptPopup, setOpenAcceptPopup] = useState<boolean>(false);
  const [openCompletePopup, setOpenCompletePopup] = useState<boolean>(false);
  const [openCancelPopup, setOpenCancelPopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<OrderProps | null>(null);

  //api
  const { loading, apiGetOrder } = ApiOrder();

  //modal popup
  const handleActionDetail = (record: OrderProps) => {
    setOpen(!open);
    setSelectedData(record);
  };

  const handleCLose = () => {
    setOpen(!open);
  };

  const handleActionAccept = (record: OrderProps) => {
    setOpenAcceptPopup(!openAcceptPopup);
    setSelectedData(record);
  };

  const handleCLoseAccept = () => {
    setOpenAcceptPopup(!openAcceptPopup);
  };

  const handleActionComplete = (record: OrderProps) => {
    setOpenCompletePopup(!openCompletePopup);
    setSelectedData(record);
  };
  const handleCLoseComplete = () => {
    setOpenCompletePopup(!openCompletePopup);
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
      case "Pending":
        return { backgroundColor: "yellow", color: "black" };
      case "Completed":
        return { backgroundColor: "green", color: "white" };
      case "Confirmed":
        return { backgroundColor: "green", color: "white" };
      case "Canceled":
        return { backgroundColor: "red", color: "white" };
      default:
        return { backgroundColor: "transparent", color: "black" };
    }
  };
  //----------------------------------------------------------------------------
  const fetchOrder = async () => {
    try {
      const response = await apiGetOrder();

      setOrders(response.data.items);
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancelSuccess = (response: string) => {
    handleCLoseCancel();
    fetchOrder();
    toast.success(response);
  };

  const handleCompleteSuccess = (response: string) => {
    handleCLoseComplete();
    fetchOrder();
    toast.success(response);
  };
  const handleAcceptSuccess = (response: string) => {
    handleCLoseAccept();
    fetchOrder();
    toast.success(response);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });

    if (pagination.pageSize !== pagination?.pageSize) {
      setOrders([]);
    }
  };

  const customPagination = {
    ...pagination,
    onChange: handleTableChange,
    pageSizeOptions: ["20", "25", "50"], // Custom page size options
    showSizeChanger: false, // Show page size changer
    showQuickJumper: false, // Show quick jumper
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Chi tiết",
    },
    {
      key: "2",
      label: "Chấp nhận đơn hàng",
    },
    {
      key: "3",
      label: "Hoàn thành đơn hàng",
    },
    {
      key: "4",
      label: "Huỷ đơn hàng",
    },
  ];
  const columns: ColumnsType<OrderProps> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "invoiceCode",
      width: "20%",
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createDate",
      render: (createDate) => formatDateFunc.formatDate(createDate),
    },
    {
      title: "Ngày hoàn thành",
      dataIndex: "completedDate",
      render: (completedDate) =>
        completedDate
          ? formatDateFunc.formatDate(completedDate)
          : "Chưa hoàn thành",
    },
    {
      title: "Tổng thành tiền",
      dataIndex: "totalAmount",
      render: (totalAmount) => formatMoney(totalAmount),
    },
    {
      title: "Trạng Thái",
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
    },
    {
      title: "Hành Động",
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
                    return !["2", "3", "4"].includes(item.key as string);
                  } else if (record.status === StatusType.CONFIRMED) {
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
                    handleActionAccept(record);
                    break;
                  case "3":
                    handleActionComplete(record);
                    break;
                  case "4":
                    handleActionCancel(record);
                    break;
                  default:
                    break;
                }
              },
            }}
          >
            <a>
              Thêm <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        rowKey={(record) => record.orderId}
        dataSource={orders}
        pagination={customPagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {open && (
        <ModalDetailOrder
          OrderData={selectedData}
          open={open}
          handleClose={handleCLose}
        />
      )}

      {openAcceptPopup && (
        <ModalAcceptOrder
          OrderData={selectedData}
          openAcceptPopup={openAcceptPopup}
          handleCLoseAccept={handleCLoseAccept}
          onUpdateSuccess={handleAcceptSuccess}
        />
      )}

      {openCompletePopup && (
        <ModalCompleteOrder
          openCompletePopup={openCompletePopup}
          handleCLoseComplete={handleCLoseComplete}
          onCompleteSuccess={handleCompleteSuccess}
          OrderData={selectedData}
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
    </>
  );
};

export default TableOrder;
