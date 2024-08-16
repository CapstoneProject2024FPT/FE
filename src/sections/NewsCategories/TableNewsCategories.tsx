import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { Table, Input, Space, Dropdown, Button, DatePicker } from "antd";
import { toast } from "react-toastify";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { PlusOutlined } from "@ant-design/icons";
import { ApiNewsCategories } from "../../api/services/apiNewsCategories";
import ModalNewsCategoryPopupAdd from "./PopupNewsCategories/popupAddNewsCategory";
import ModalNewsCategoryPopup from "./PopupNewsCategories/popupDetailNewsCategory";
import { NewsCategoryProps } from "../../models/newCategories";
import { formatDateFunc } from "../../utils/fn";
import ModalNewsCategoryPopupDelete from "./PopupNewsCategories/popupDeleteNewsCategory";
import moment from "moment";
import config from "../../configs";
type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

const TableNewsCategory: React.FC = () => {
  const [categories, setCategories] = useState<NewsCategoryProps[]>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  //search
  const [query, setQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  //popup
  const [open, setOpen] = useState<boolean>(false);
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [openAddPopup, setOpenAddPopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<NewsCategoryProps | null>(
    null
  );

  //api
  const { getNewsCategories, loading } = ApiNewsCategories();

  //modal popup
  const handleActionDetail = (record: NewsCategoryProps) => {
    setOpen(!open);
    setSelectedData(record);
  };
  const handleActionDelete = (record: NewsCategoryProps) => {
    setOpenDeletePopup(!openDeletePopup);
    setSelectedData(record);
  };
  const handleCLose = () => {
    setOpen(!open);
  };
  const handleCLoseDelete = () => {
    setOpenDeletePopup(!openDeletePopup);
  };
  const handleCloseAdd = () => {
    setOpenAddPopup(!openAddPopup);
  };

  //----------------------------------------------------------------------------
  const fetchCategories = async () => {
    try {
      const data = await getNewsCategories();
      setCategories(data);
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddNewsCategorySuccess = () => {
    handleCloseAdd();
    fetchCategories();
    toast.success(config.AdminMessageNotice.AddCategoryNews);
  };

  const handleDeleteCategorySuccess = (response: string) => {
    handleCLoseDelete();
    fetchCategories();
    toast.success(response);
  };
  const handleUpdateCategorySuccess = (response: string) => {
    handleCLose();
    fetchCategories();
    toast.success(response);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });

    if (pagination.pageSize !== pagination?.pageSize) {
      setCategories([]);
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
  const handleDateChange = (_date: any, dateString: string | string[]) => {
    setSelectedDate(Array.isArray(dateString) ? dateString[0] : dateString);
  };
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  const filteredRows = categories
    ?.filter((item) => item.name.toLowerCase().includes(query))
    ?.filter((item) =>
      selectedDate
        ? moment(item.createDate).format("DD/MM/YYYY") === selectedDate
        : true
    );

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Chi tiết",
    },
    {
      key: "2",
      label: "Điều chỉnh Trạng thái",
    },
  ];
  const columns: ColumnsType<NewsCategoryProps> = [
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Loại tin tức
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "30%",
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
            style={{  width: "35%", cursor: "pointer" }}
            format={dateFormatList}
            placeholder="Chọn ngày"
          />
        </div>
      ),
      dataIndex: "createDate",
      width: "30%", 
      render: (createDate) => formatDateFunc.formatDate(createDate),
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
      width: "20%",
      render: (status) => (status === "Active" ? "Khả dụng" : "Không khả dụng"),
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
                    handleActionDetail(record);
                    break;
                  case "2":
                    handleActionDelete(record);
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
      width: "20%",
    },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Search
          placeholder="Nhập từ khoá"
          onChange={handleSearch}
          style={{ width: 200, marginBottom: 16 }}
        />
        <Button
          onClick={() => setOpenAddPopup(!openAddPopup)}
          icon={<PlusOutlined />}
        >
          Thêm loại tin tức
        </Button>
      </div>

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={filteredRows}
        pagination={customPagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {open && (
        <ModalNewsCategoryPopup
          NewsCategoryData={selectedData}
          open={open}
          handleClose={handleCLose}
          onUpdateSuccess={handleUpdateCategorySuccess}
        />
      )}

      {openDeletePopup && (
        <ModalNewsCategoryPopupDelete
          NewsCategoryData={selectedData}
          openDeletePopup={openDeletePopup}
          handleCLoseDelete={handleCLoseDelete}
          onDeleteSuccess={handleDeleteCategorySuccess}
        />
      )}

      {openAddPopup && (
        <ModalNewsCategoryPopupAdd
          open={openAddPopup}
          handleClose={handleCloseAdd}
          onAddSuccess={handleAddNewsCategorySuccess}
        />
      )}
    </>
  );
};

export default TableNewsCategory;
