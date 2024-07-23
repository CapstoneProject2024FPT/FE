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
import { Dropdown, MenuProps, Space, Table, type TableProps } from "antd";

type ColumnsType<T> = TableProps<T>["columns"];
const CustomerTransaction: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [userTransaction, setUserTransaction] = useState<TransactionProps[]>(
    []
  );
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const [invoiceCodes, setInvoiceCodes] = useState<Record<string, string>>({});
  const [selectData, setSelectData] = useState<TransactionProps>();

  //paginate
  const pageSize = 20;
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });

  const loginInfoString = localStorage.getItem("loginInfo");
  const auth = loginInfoString ? JSON.parse(loginInfoString) : null;

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
    const id: string = auth?.data.id;
    try {
      if (id) {
        const params = {
          AccountId: id,
        };
        const response = await apiUserTransaction(params);

        const data = response.data.map((item: any, idx: any) => {
          return { ...item, key: idx + 1 };
        });

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

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Chi tiết",
    },
  ];
  const columns: ColumnsType<TransactionProps> = [
    {
      title: "",
      dataIndex: "key",
    },
    {
      title: "Mã giao dịch",
      dataIndex: "invoiceId",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      render: (orderId) => invoiceCodes[orderId],
    },
    {
      title: "Số tiền",
      dataIndex: "totalAmount",
      render: (totalAmount) => {
        return formatMoney(totalAmount);
      },
    },
    {
      title: "Ngày tạo đơn",
      dataIndex: "createdAt",
      render: (createdAt) => {
        return formatDateFunc.formatDateTime(createdAt);
      },
    },
    {
      title: "Trạng thái",
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
    },
    {
      title: "Action",
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
    },
  ];
  return (
    <>
      <Table
        bordered
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={userTransaction}
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
