import React, { useEffect, useState } from "react";
import type { MenuProps, TablePaginationConfig } from "antd";
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
import useDebounce from "../../../../../hooks/useDebounce";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const defaultPageSize = 10;

const ManagerData: React.FC = () => {
  const [data, setData] = useState<staffProps[]>();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: defaultPageSize,
    total: 0,
  });

  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");
  const [selectedData, setSelectedData] = useState<staffProps | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { loading, apiGetUserByRole } = ApiAccount();
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const debounce = useDebounce({ delay: 500, value: query });
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
    toast.success(config.AdminMessageNotice.AddEmployeeSuccess);
    handleCloseOpenAdd();
    fetchAccountUser();
  };
  const handleNavigate = (record: staffProps) => {
    navigate(config.adminRoutes.accountDetail.replace(":id", record.id));
  };
  const fetchAccountUser = async (
    page: number = 1,
    pageSize: number = defaultPageSize,
    fullname: string = debounce
  ) => {
    const params = {
      Role: RoleType.MANAGER,
      size: pageSize,
      page: page,
      FullName: fullname,
    };
    const response = await apiGetUserByRole(params);
    if (response.status === 200) {
      setData(response.data.items);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total,
        current: response.data.page,
        pageSize: response.data.size,
      }));
    } else {
      toast.error(response.Error);
    }
  };

  useEffect(() => {
    fetchAccountUser(pagination.current, pagination.pageSize, debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, debounce]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
    fetchAccountUser(page, pageSize);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const onSuccess = () => {
    handleCLose();
    toast.success(config.AdminMessageNotice.BanOrUnbanSuccess);
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
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Tên
        </div>
      ),
      dataIndex: "fullName",
      sorter: (a, b) => a.fullName.length - b.fullName.length,
      width: "20%",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Chức vụ
        </div>
      ),
      dataIndex: "role",
      width: "20%",
      render: (role) => {
        if (role === RoleType.MANAGER) {
          return "Quản lý";
        }
      },
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Giới tính
        </div>
      ),
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
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Email
        </div>
      ),
      dataIndex: "email",
      width: "20%",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Tình trạng
        </div>
      ),
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
          onChange={(e) => handleSearch(e)} // Update search value on change
          style={{ width: 200, marginBottom: 16 }}
        />
        <Button icon={<PlusOutlined />} onClick={handleOpenAdd}>
          Thêm mới Quản lý
        </Button>
      </Stack>
      <Table
        bordered
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={customPagination}
        loading={loading}
        onChange={(pagination) =>
          handleTableChange(pagination.current!, pagination.pageSize!)
        }
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
          role={RoleType.MANAGER}
        />
      )}
    </>
  );
};

export default ManagerData;
