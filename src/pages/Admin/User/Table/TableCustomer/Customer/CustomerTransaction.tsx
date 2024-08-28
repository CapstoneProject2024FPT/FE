/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { ApiTransaction } from "../../../../../../api/services/apiTransaction";
import {
  statusMappingTransaction,
  TransactionProps,
} from "../../../../../../models/transaction";
import { formatDateFunc, formatMoney } from "../../../../../../utils/fn";
import { ApiOrder } from "../../../../../../api/services/apiOrder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModalCustomerTransaction from "./PopupCustomer/CustomerTransactionDetail";
import {
  DatePicker,
  Dropdown,
  MenuProps,
  Space,
  Table,
  type TableProps,
} from "antd";
import { useParams } from "react-router-dom";
import moment from "moment";

type ColumnsType<T> = TableProps<T>["columns"];
const CustomerTransaction: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [userTransaction, setUserTransaction] = useState<TransactionProps[]>(
    []
  );
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const [invoiceCodes, setInvoiceCodes] = useState<Record<string, string>>({});
  const [selectData, setSelectData] = useState<TransactionProps>();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  //paginate
  const pageSize = 20;
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });

  //status color
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PENDING":
        return { backgroundColor: "#FFD700", color: "black" }; // vàng
      case "SUCCESS":
        return { backgroundColor: "#4CAF50", color: "white" }; // xanh lá
      case "FAILED":
        return { backgroundColor: "#F44336", color: "white" }; // đỏ
      default:
        return { backgroundColor: "transparent", color: "black" };
    }
  };

  const handleStatusName = (text: string) => {
    const defaultStatus = "";
    const statusName = text
      ? statusMappingTransaction.find((status) => status.id === text)?.name
      : defaultStatus;

    return statusName;
  };
  //open
  const handleOpen = (transaction: TransactionProps) => {
    setSelectData(transaction);
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  //paginate
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });

    if (pagination.pageSize !== pagination?.pageSize) {
      setUserTransaction([]);
    }
  };

  const customPagination = {
    ...pagination,
    onChange: handleTableChange,
    pageSizeOptions: ["20", "25", "50"], // Custom page size options
    showSizeChanger: false, // Show page size changer
    showQuickJumper: false, // Show quick jumper
  };
  //api
  const { apiUserTransaction, loading } = ApiTransaction();
  const { apiOrderId } = ApiOrder();
  const fetchUserTransaction = async () => {
    try {
      if (id) {
        const params = {
          AccountId: id,
        };
        const response = await apiUserTransaction(params);

        const data = response.data.map(
          (item: TransactionProps, idx: number) => {
            const [paymentMethod, orderType] = item.payType.split("_");
            return {
              ...item,
              paymentMethod,
              orderType,
              key: idx + 1,
            };
          }
        );

        setUserTransaction(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrderDetail = async (id: string[]) => {
    const orderResponse = await Promise.all(
      id.map(async (item) => {
        const response = await apiOrderId(item);
        return { id: item, name: response.data.invoiceCode };
      })
    );

    const orderByTransaction = orderResponse.reduce((acc, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {} as Record<string, string>);
    setInvoiceCodes(orderByTransaction);
  };
  useEffect(() => {
    fetchUserTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userTransaction) {
      const orders = userTransaction.map((item) => item.orderId);
      setOrderIds(orders);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTransaction]);

  useEffect(() => {
    if (orderIds) {
      fetchOrderDetail(orderIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderIds]);

  const handleDateChange = (_date: any, dateString: string | string[]) => {
    setSelectedDate(Array.isArray(dateString) ? dateString[0] : dateString);
  };

  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  const filteredRows = userTransaction?.filter((item) =>
    selectedDate
      ? moment(item.createdAt).format("DD/MM/YYYY") === selectedDate
      : true
  );

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Chi tiết",
    },
  ];
  const columns: ColumnsType<TransactionProps> = [
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Stt
        </div>
      ),
      dataIndex: "key",
      align: "center",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Mã giao dịch
        </div>
      ),
      dataIndex: "invoiceId",
      align: "center",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Mã đơn hàng
        </div>
      ),
      dataIndex: "orderId",
      render: (orderId) => invoiceCodes[orderId],
      align: "center",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Số tiền
        </div>
      ),
      dataIndex: "totalAmount",
      render: (totalAmount) => {
        return formatMoney(totalAmount);
      },
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
            gap: "5px",
          }}
        >
          Ngày tạo giao dịch
          <DatePicker
            onChange={handleDateChange}
            style={{ width: "50%", cursor: "pointer" }}
            format={dateFormatList}
            placeholder="Chọn ngày"
          />
        </div>
      ),
      dataIndex: "createdAt",
      render: (createdAt) => formatDateFunc.formatDateTime(createdAt),
      align: "center",
      width: "20%",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Loại đơn hàng
        </div>
      ),
      dataIndex: "orderType",
      render: (orderType) => (orderType === "Order" ? "Mua hàng" : "Bảo hành"),
      align: "center",
      filters: [
        {
          text: "Mua hàng",
          value: "Order",
        },
        {
          text: "Bảo hành",
          value: "Warranty",
        },
      ],
      onFilter: (value, record) =>
        record?.orderType?.indexOf(value as string) === 0,
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Phương thức thanh toán
        </div>
      ),
      dataIndex: "paymentMethod",
      align: "center",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Trạng thái
        </div>
      ),
      dataIndex: "status",
      render: (status: string) => {
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
            {handleStatusName(status)}
          </div>
        );
      },
      align: "center",
    },
    {
      title: "",
      key: "operation",
      render: (record) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => {
                switch (key) {
                  case "1":
                    handleOpen(record);
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
  return (
    <>
      <Table
        bordered
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={filteredRows}
        pagination={customPagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {open && (
        <ModalCustomerTransaction
          onClose={handleClose}
          recordOrderData={invoiceCodes}
          open={open}
          transactionData={selectData}
        />
      )}
    </>
  );
};

export default CustomerTransaction;
