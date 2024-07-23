import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Table, Input, Button } from "antd";
import { ApiAccount } from "../../../../../api/services/apiAccount";
import { RoleType, staffProps } from "../../../../../models/UserData";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import config from "../../../../../configs";
import ModaBanned from "../Popup/PopupBanned";
import { Stack } from "@mui/material";
import { PlusOutlined } from "@ant-design/icons";
import ModalAddEmployee from "../Popup/PopupAddEmployee";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

const StaffSale: React.FC = () => {
  const [data, setData] = useState<staffProps[]>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });

  const navigate = useNavigate();
  // const [query, setQuery] = useState<string>("");
  const [selectedData, setSelectedData] = useState<staffProps | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { loading, apiGetUserByRole } = ApiAccount();
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  // Function to handle action click
  const handleActionClick = (record: staffProps) => {
    setOpen(!open);
    setSelectedData(record);
  };

  const handleCLose = () => {
    setOpen(!open);
  };

  const handleOpenAdd = () => {
    setOpenAdd(!openAdd);
  };
  const handleCloseOpenAdd = () => {
    setOpenAdd(!openAdd);
  };

  const onSuccessAdd = () => {
    toast.success("Thêm nhân viên thành công");
    handleCloseOpenAdd();
    fetchAccountUser();
  };
  const handleNavigate = (record: staffProps) => {
    navigate(config.adminRoutes.accountDetail.replace(":id", record.id));
  };
  const fetchAccountUser = async () => {
    const params = {
      Role: RoleType.SALE,
      size: 20,
    };
    const response = await apiGetUserByRole(params);
    if (response.status === 200) {
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

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setQuery(e.target.value);
  // };

  const onSuccess = () => {
    handleCLose();
    toast.success("Cập nhật trạng thái thành công");
    fetchAccountUser();
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Chi tiết",
    },
    {
      key: "2",
      label: "Chỉnh Trạng Thái",
    },
  ];
  const columns: ColumnsType<staffProps> = [
    {
      title: "Tên",
      dataIndex: "fullName",
      sorter: (a, b) => a.fullName.length - b.fullName.length,
      width: "20%",
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      width: "20%",
      render: (role) => {
        if (role === RoleType.SALE) {
          return "Nhân viên bán hàng";
        }
      },
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      width: "20%",
      render: (gender) => {
        return gender === "Male"
          ? "Nam"
          : gender === "Female"
          ? "Nữ"
          : "Chưa cập nhật";
      },
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      width: "20%",
      render: (status) => {
        return status === "Activate"
          ? "Khả Dụng"
          : status === "Banned"
          ? "Tài Khoản bị cấm"
          : "Không khả dụng";
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
                    handleNavigate(record);
                    break;
                  case "2":
                    handleActionClick(record);
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
    },
  ];

  return (
    <>
      <Stack
        display="flex"
        direction="row"
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Search
          placeholder="Nhập Từ khoá"
          onChange={() => {}} // Update search value on change
          style={{ width: 200, marginBottom: 16 }}
        />
        <Button icon={<PlusOutlined />} onClick={handleOpenAdd}>
          Thêm mới nhân viên bán hàng
        </Button>
      </Stack>
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
        <ModaBanned
          UserData={selectedData}
          open={open}
          handleCLose={handleCLose}
          onSuccess={onSuccess}
        />
      )}
      {openAdd && (
        <ModalAddEmployee
          handleClose={handleCloseOpenAdd}
          onUpdateSuccess={onSuccessAdd}
          open={openAdd}
          role={RoleType.SALE}
        />
      )}
    </>
  );
};

export default StaffSale;
