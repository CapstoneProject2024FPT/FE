import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { Table, Input, Space, Dropdown, Button, DatePicker } from "antd";
import { brandTable } from "../../models/brand";
import { BrandApi } from "../../api/services/apiBrand";
import { toast } from "react-toastify";
import ModalBrandPopupAdd from "./BrandPopup/popupAddBrand";
import { formatDateFunc } from "../../utils/fn";
import ModalBrandPopupDetail from "./BrandPopup/popupBrandDetail";
import ModalBrandPopupDelete from "./BrandPopup/popupDeleteBrand";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import config from "../../configs";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 10;

const TableBrand: React.FC = () => {
  const [brands, setBrands] = useState<brandTable[]>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  //search
  const [query, setQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  //popup
  const [open, setOpen] = useState<boolean>(false);
  const [openAddPopup, setOpenAddPopup] = useState<boolean>(false);
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<brandTable | null>(null);

  //api
  const { loading, getBrand } = BrandApi();

  //modal popup
  const handleActionDetail = (record: brandTable) => {
    setOpen(!open);
    setSelectedData(record);
  };
  const handleActionDelete = (record: brandTable) => {
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
  const fetchBrand = async () => {
    try {
      const param = {};
      const data = await getBrand(param);
      setBrands(data);
    } catch (error) {
      toast.error(config.AdminMessageNotice.ErrorGet);
    }
  };

  useEffect(() => {
    fetchBrand();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddBrandSuccess = () => {
    handleCloseAdd();
    fetchBrand();
    toast.success(config.AdminMessageNotice.AddBrandSuccess);
  };

  const handleDeleteCategorySuccess = (response: string) => {
    handleCLoseDelete();
    fetchBrand();
    toast.success(response);
  };

  const handleUpdateBrandSuccess = (response: string) => {
    handleCLose();
    fetchBrand();
    toast.success(response);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });

    if (pagination.pageSize !== pagination?.pageSize) {
      setBrands([]);
    }
  };

  const customPagination = {
    ...pagination,
    onChange: handleTableChange,
    pageSizeOptions: ["10", "25", "50"], // Custom page size options
    showSizeChanger: false, // Show page size changer
    showQuickJumper: false, // Show quick jumper
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (_date: any, dateString: string | string[]) => {
    setSelectedDate(Array.isArray(dateString) ? dateString[0] : dateString);
  };
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  const filteredRows = brands
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
      label: "Xoá",
    },
  ];
  const columns: ColumnsType<brandTable> = [
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Thương hiệu máy
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "20%",
      align: "center",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Hình ảnh
        </div>
      ),
      dataIndex: "urlImage",
      render: (urlImage) => (
        <img src={urlImage} alt="Product Image" style={{ width: 100 }} />
      ),
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
          Ngày tạo
          <DatePicker
            onChange={handleDateChange}
            style={{ width: "35%", cursor: "pointer" }}
            format={dateFormatList}
            placeholder="Chọn ngày"
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
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Trạng thái
        </div>
      ),
      dataIndex: "status",
      render: (status) => (status === "Active" ? "Hữu hiệu" : "Vô hiệu"),
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
          Thêm thương hiệu
        </Button>
      </div>

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={filteredRows}
        pagination={customPagination}
        loading={loading}
        onChange={handleTableChange}
        bordered
        locale={{
          triggerDesc: "Sắp xếp giảm dần",
          triggerAsc: "Sắp xếp tăng dần",
          cancelSort: "Huỷ sắp xếp",
        }}
      />
      {open && (
        <ModalBrandPopupDetail
          BrandData={selectedData}
          open={open}
          handleClose={handleCLose}
          onUpdateSuccess={handleUpdateBrandSuccess}
        />
      )}

      {openDeletePopup && (
        <ModalBrandPopupDelete
          BrandData={selectedData}
          openDeletePopup={openDeletePopup}
          handleCLoseDelete={handleCLoseDelete}
          onDeleteSuccess={handleDeleteCategorySuccess}
        />
      )}

      {openAddPopup && (
        <ModalBrandPopupAdd
          open={openAddPopup}
          handleClose={handleCloseAdd}
          onAddSuccess={handleAddBrandSuccess}
        />
      )}
    </>
  );
};

export default TableBrand;
