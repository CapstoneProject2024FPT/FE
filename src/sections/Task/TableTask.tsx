/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Table, Space, Dropdown, DatePicker } from "antd";
import { toast } from "react-toastify";
import { GetTaskProps, statusTaskMapping } from "../../models/task";
import { ApiTask } from "../../api/services/apiTask";
import { formatDateFunc } from "../../utils/fn";
import ModalDetailTask from "./Popup/ModalTaskDetail";
import ModalChangeStaffTask from "./Popup/ModalChangeStaffTask";
import moment from "moment";
import { MenuItem, TextField } from "@mui/material";
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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedExcutionDate, setExcutionCompletedDate] = useState<
    string | null
  >(null);
  const [selectStatus, setSelectStatus] = useState<string>("");
  const [selectStatusUi, setSelectStatusUi] = useState<string>("");

  const OptionType = [
    { id: "all", name: "Tất cả" },
    {
      id: "Warranty",
      name: "Bảo hành",
    },
    {
      id: "Delivery",
      name: "Giao hàng",
    },
  ];
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
  const fetchTask = async (Type: string = selectStatus) => {
    try {
      const params = {
        Type: Type,
      };
      const response = await apiGetTask(params);
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
  const handleDateChange = (_date: any, dateString: string | string[]) => {
    setSelectedDate(Array.isArray(dateString) ? dateString[0] : dateString);
  };

  const handleExcutionDateChange = (
    _date: any,
    dateString: string | string[]
  ) => {
    setExcutionCompletedDate(
      Array.isArray(dateString) ? dateString[0] : dateString
    );
  };

  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  const filteredRows = tasks
    ?.filter((item) => selectedDate
      ? moment(item.createDate).format("DD/MM/YYYY") === selectedDate
      : true
    )
    ?.filter((item) =>
      selectedExcutionDate
        ? moment(item.excutionDate).format("DD/MM/YYYY") ===
        selectedExcutionDate
        : true
    );

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
    fetchTask(valueStatus);
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Chi tiết",
    },
  ];
  const columns: ColumnsType<GetTaskProps> = [
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Loại công việc
        </div>
      ),
      dataIndex: "type",
      render: (type) => (type === "Delivery" ? "Giao Hàng" : "Bảo Hành"),
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
            gap: "5px"
          }}
        >
          Ngày tạo
          <DatePicker
            onChange={handleDateChange}
            style={{ width: "50%", cursor: "pointer" }}
            format={dateFormatList}
            placeholder="Chọn ngày"
          />
        </div>
      ),
      dataIndex: "createDate",
      render: (createDate) => formatDateFunc.formatDate(createDate),
      align: "center",
      width: "20%"
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
            gap: "5px"
          }}
        >
          Ngày thực thi
          <DatePicker
            onChange={handleExcutionDateChange}
            style={{ width: "50%", cursor: "pointer", textAlign: "center" }}
            format={dateFormatList}
            placeholder="Chọn ngày"
          />
        </div>
      ),
      dataIndex: "excutionDate",
      render: (excutionDate) => formatDateFunc.formatDate(excutionDate),
      align: "center",
      width: "20%"
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Nhân viên
        </div>
      ),
      dataIndex: "staff",
      render: (staff) => staff.fullName,
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
      align: "center",
    },
    {
      title: "",
      key: "operation",
      render: (record) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items: items.filter((item) => {
                if (item && item.key) {
                  if (record.status === "Completed") {
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
                    handleActionChangeStaffPopup(record);
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
      <TextField
        id="status"
        select
        label="Trạng thái nhiệm vụ"
        value={selectStatusUi}
        sx={{ width: "200px" }}
        onChange={(e) => handleSelect(e)}
      >
        {OptionType.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </TextField>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={filteredRows}
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
