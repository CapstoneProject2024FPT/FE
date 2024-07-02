import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Table, Input } from "antd";
import ModalUserPopup from "./PopupCustomer/popupDetailUser";
import { ApiAccount } from "../../../../../api/services/apiAccount";
import { RoleType, userModel } from "../../../../../models/UserData";
import { toast } from "react-toastify";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

const CustomerData: React.FC = () => {
  const [data, setData] = useState<userModel[]>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  const [query, setQuery] = useState<string>("");
  const [selectedData, setSelectedData] = useState<userModel | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { loading, apiGetUserByRole } = ApiAccount();

  // Function to handle action click
  const handleActionClick = (record: userModel) => {
    setOpen(!open);
    setSelectedData(record);
  };

  const handleCLose = () => {
    setOpen(!open);
  };

  const fetchAccountUser = async () => {
    const params = {
      Role: RoleType.USER,
    };
    const response = await apiGetUserByRole(params);
    if (response.status === 200) {
      console.log(response);

      setData(response.data.items);
    } else {
      toast.error(response.Error);
    }
  };

  useEffect(() => {
    fetchAccountUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });

    if (pagination.pageSize !== pagination?.pageSize) {
      setData([]);
    }
  };

  const customPagination = {
    ...pagination,
    onChange: handleTableChange,
    pageSizeOptions: ["20", "25", "50"], // Custom page size options
    showSizeChanger: false, // Show page size changer
    showQuickJumper: false, // Show quick jumper
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Delete",
    },
    {
      key: "2",
      label: "Detail",
    },
  ];
  const columns: ColumnsType<userModel> = [
    {
      title: "Tên",
      dataIndex: "fullName",
      sorter: (a, b) => a.fullName.length - b.fullName.length,
      width: "20%",
    },
    {
      title: "Vị trí",
      dataIndex: "role",
      width: "20%",
      render: (role) => {
        if (role === RoleType.USER) {
          return "Người dùng";
        }
      },
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Action",
      key: "operation",
      render: (record) => (
        <Space size="middle">
          <Dropdown menu={{ items, onClick: () => handleActionClick(record) }}>
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
      <Search
        placeholder="Nhập Từ khoá"
        onChange={handleSearch} // Update search value on change
        style={{ width: 200, marginBottom: 16 }}
      />
      <Table
        bordered
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={customPagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {open && (
        <ModalUserPopup
          userData={selectedData}
          handleClose={handleCLose}
          open={open}
        />
      )}
    </>
  );
};

export default CustomerData;
