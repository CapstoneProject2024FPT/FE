/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { MenuProps, TablePaginationConfig } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
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
import useDebounce from "../../hooks/useDebounce";
import ModalComponentQuantity from "./Popup/ModalComponentQuantity";
type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const defaultPageSize = 20;

const TableComponent: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<GetMachineComponents[]>();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: defaultPageSize,
    total: 0,
  });

  //search
  const [query, setQuery] = useState<string>("");
  const debounce = useDebounce({ delay: 500, value: query });
  const [selectedCreateDate, setSelectedCreateDate] = useState<string | null>(
    null
  );

  //popup
  const [open, setOpen] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<GetMachineComponents | null>(
    null
  );

  //api
  const { apiGetListComponentPaginate, loading } = MachineryComponentApi();

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
  const fetchProducts = async (
    page: number = 1,
    pageSize: number = defaultPageSize,
    Name: string = debounce,
    createDate = selectedCreateDate
  ) => {
    try {
      const params = {
        page: page,
        size: pageSize,
        Name: Name,
        createDate: createDate,
      };
      const response = await apiGetListComponentPaginate(params);

      if (response && response.status === 200) {
        setProducts(response.data.items);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total,
          current: response.data.page,
          pageSize: response.data.size,
        }));
      } else {
        //lỗi show thông báo lỗi
        toast.error(response.Error);
      }
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    fetchProducts(pagination.current, pagination.pageSize, debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounce, pagination.current, pagination.pageSize]);

  const handleDeleteCategorySuccess = (response: string) => {
    handleCLoseDelete();
    fetchProducts();
    toast.success(response);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
    fetchProducts(page, pageSize);
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
  const handleCreateDateChange = (
    _date: any,
    dateString: string | string[]
  ) => {
    let formattedDate = Array.isArray(dateString) ? dateString[0] : dateString;
    if (formattedDate) {
      formattedDate = moment(formattedDate, "DD/MM/YYYY").format("YYYY/MM/DD");
    }
    setSelectedCreateDate(formattedDate);
    fetchProducts(
      pagination.current,
      pagination.pageSize,
      debounce,
      formattedDate
    );
  };
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  const handleQuantityClick = (record: any) => {
    setSelectedData(record);
    setOpen(true);
  };

  const handleQuantityClose = () => {
    setOpen(false);
  };

  const UpdateSucces = () => {
    toast.success(config.AdminMessageNotice.SuccessAddQuantity);
    handleQuantityClose();
    fetchProducts();
  };

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
      width: "20%",
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
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Số lượng
        </div>
      ),
      sorter: (a, b) => a.quantity - b.quantity,
      dataIndex: "quantity",
      render: (quantity, record) => (
        <div
          onClick={() => handleQuantityClick(record)}
          style={{ cursor: "pointer" }}
        >
          {quantity ? quantity : 0}
        </div>
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
          }}
        >
          Ngày tạo
          <DatePicker
            onChange={handleCreateDateChange}
            style={{ marginLeft: 8, width: "50%" }}
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
          Hành Động
        </div>
      ),
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
              <DownOutlined />
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
        dataSource={products}
        pagination={customPagination}
        bordered
        loading={loading}
        onChange={(pagination) =>
          handleTableChange(pagination.current!, pagination.pageSize!)
        }
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

      {open && (
        <ModalComponentQuantity
          ProductData={selectedData}
          handleCLose={handleQuantityClose}
          onUpdateSuccess={UpdateSucces}
          openPopup={open}
        />
      )}
    </>
  );
};

export default TableComponent;
