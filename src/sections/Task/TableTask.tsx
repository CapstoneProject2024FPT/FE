import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Space, Dropdown } from "antd";
import { toast } from "react-toastify";
import { GetTaskProps, statusTaskMapping } from "../../models/task";
import { ApiTask } from "../../api/services/apiTask";
import { formatDateFunc } from "../../utils/fn";
import ModalDetailTask from "./Popup/ModalTaskDetail";
import ModalChangeStaffTask from "./Popup/ModalChangeStaffTask";

type ColumnsType<T> = TableProps<T>["columns"];

const pageSize = 20;

const TableTask: React.FC = () => {
  const [tasks, setTasks] = useState<GetTaskProps[]>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });

  //popup
  const [open, setOpen] = useState<boolean>(false);
  const [openChangeStaff, setOpenChangeStaff] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<GetTaskProps | null>(null);

  //api
  const { loading, apiGetTask } = ApiTask();

  //modal popup
  const handleActionDetail = (record: GetTaskProps) => {
    setOpen(!open);
    setSelectedData(record);
  };
  const handleCLose = () => {
    setOpen(!open);
  };

  const handleActionChangeStaffPopup = (record: GetTaskProps) => {
    setOpenChangeStaff(!openChangeStaff);
    setSelectedData(record);
  };
  const handleCLoseChangeStaffPopup = () => {
    setOpenChangeStaff(!openChangeStaff);
  };
  //----------------------------------------------------------------------------
  const fetchTask = async () => {
    try {
      const response = await apiGetTask();
      if (response.status === 200) {
        setTasks(response.data);
      } else {
        toast.error(response.Error);
      }
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeStaffSuccess = (response: string) => {
    handleCLoseChangeStaffPopup();
    fetchTask();
    toast.success(response);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });

    if (pagination.pageSize !== pagination?.pageSize) {
      setTasks([]);
    }
  };

  const customPagination = {
    ...pagination,
    onChange: handleTableChange,
    pageSizeOptions: ["20", "25", "50"], // Custom page size options
    showSizeChanger: false, // Show page size changer
    showQuickJumper: false, // Show quick jumper
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Process":
        return { backgroundColor: "yellow", color: "black" };
      case "Completed":
        return { backgroundColor: "green", color: "white" };

      default:
        return { backgroundColor: "transparent", color: "black" };
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Chi tiết",
    },
    {
      key: "2",
      label: "Đổi nhân viên",
    },
  ];
  const columns: ColumnsType<GetTaskProps> = [
    {
      title: "Loại công việc ",
      dataIndex: "type",
      render: (type) => (type === "Delivery" ? "Giao Hàng" : "Bảo Trì"),
    },
    {
      title: "Ngày tạo ",
      dataIndex: "createDate",
      render: (createDate) => formatDateFunc.formatDateTime(createDate),
    },
    {
      title: "Nhân viên ",
      dataIndex: "staff",
      render: (staff) => staff.fullName,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => {
        const defaultStatus = "Đang Tiến Hành";

        const StatusName = status
          ? statusTaskMapping?.find((s) => s.id === status)?.name
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
              items,
              onClick: ({ key }) => {
                switch (key) {
                  case "1":
                    handleActionDetail(record);
                    break;
                  case "2":
                    handleActionChangeStaffPopup(record);
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
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={tasks}
        pagination={customPagination}
        loading={loading}
        onChange={handleTableChange}
        locale={{
          triggerDesc: "Sắp xếp giảm dần",
          triggerAsc: "Sắp xếp tăng dần",
          cancelSort: "Huỷ sắp xếp",
        }}
      />
      {open && (
        <ModalDetailTask
          TaskData={selectedData}
          handleClose={handleCLose}
          open={open}
        />
      )}

      {openChangeStaff && (
        <ModalChangeStaffTask
          TaskData={selectedData}
          handleClose={handleCLoseChangeStaffPopup}
          open={openChangeStaff}
          onChangeSuccess={handleChangeStaffSuccess}
        />
      )}
    </>
  );
};

export default TableTask;
