/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Table, Input, Space, Dropdown, Button, DatePicker } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import config from "../../configs";
import { formatDateFunc } from "../../utils/fn";
import { PlusOutlined } from "@ant-design/icons";
import { GetMachineComponents } from "../../models/machineComponent";
import { MachineryComponentApi } from "../../api/services/apiMachineComponent";
import ModalDeleteComponent from "./Popup/ModalDeleteComponent";
import moment from "moment";
type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

const TableComponent: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<GetMachineComponents[]>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  //search
  const [query, setQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  //popup
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<GetMachineComponents | null>(
    null
  );

  //api
  const { apiGetListComponent, loading } = MachineryComponentApi();

  //modal popup
  const handleActionDetail = (record: GetMachineComponents) => {
    navigate(
      config.adminRoutes.viewDetailMachineComponent.replace(":id", record.id)
    );
  };

  //delete
  const handleActionDelete = (record: GetMachineComponents) => {
    setOpenDeletePopup(!openDeletePopup);
    setSelectedData(record);
  };

  const handleCLoseDelete = () => {
    setOpenDeletePopup(!openDeletePopup);
  };

  //----------------------------------------------------------------------------
  const fetchProducts = async () => {
    try {
      const response = await apiGetListComponent();

      if (response && response.status === 200) {
        setProducts(response.data);
      } else {
        //lỗi show thông báo lỗi
        toast.error(response.Error);
      }
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteCategorySuccess = (response: string) => {
    handleCLoseDelete();
    fetchProducts();
    toast.success(response);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });

    if (pagination.pageSize !== pagination?.pageSize) {
      setProducts([]);
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

  const filteredRows = products
    ?.filter((item) => item.name?.toLowerCase().includes(query))
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
  ];
  const columns: ColumnsType<GetMachineComponents> = [
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Tên máy
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "30%",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Thương hiệu
        </div>
      ),
      dataIndex: "brand",
      render: (brand) => {
        return brand.name;
      },
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
      width: "30%"
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
      width: "20%"
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
          icon={<PlusOutlined />}
          onClick={() => {
            navigate(config.adminRoutes.createMachineComponent);
          }}
        >
          Thêm máy chi tiết máy
        </Button>
      </div>

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={filteredRows}
        pagination={customPagination}
        bordered
        loading={loading}
        onChange={handleTableChange}
        locale={{
          triggerDesc: "Sắp xếp giảm dần",
          triggerAsc: "Sắp xếp tăng dần",
          cancelSort: "Huỷ sắp xếp",
        }}
      />

      {openDeletePopup && (
        <ModalDeleteComponent
          ProductData={selectedData}
          handleCLoseDelete={handleCLoseDelete}
          onDeleteSuccess={handleDeleteCategorySuccess}
          openDeletePopup={openDeletePopup}
        />
      )}
    </>
  );
};

export default TableComponent;
