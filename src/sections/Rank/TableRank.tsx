import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Input, Space, Dropdown } from "antd";
import { GetCategoryProps } from "../../models/category";
import { CategoryApi } from "../../api/services/apiCategories";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

const TableRank: React.FC = () => {
  const [categories, setCategories] = useState<GetCategoryProps[]>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  //search
  const [query, setQuery] = useState<string>("");

  //popup
  const [open, setOpen] = useState<boolean>(false);
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<GetCategoryProps | null>(
    null
  );

  console.log(selectedData);

  //api
  const { loading } = CategoryApi();

  //modal popup
  const handleActionDetail = (record: GetCategoryProps) => {
    setOpen(!open);
    setSelectedData(record);
  };
  const handleActionDelete = (record: GetCategoryProps) => {
    setOpenDeletePopup(!openDeletePopup);
    setSelectedData(record);
  };
  //   const handleCLose = () => {
  //     setOpen(!open);
  //   };
  //   const handleCLoseDelete = () => {
  //     setOpenDeletePopup(!openDeletePopup);
  //   };
  //   const handleCloseAdd = () => {
  //     setOpenAddPopup(!openAddPopup);
  //   };

  //----------------------------------------------------------------------------
  //   const fetchOrder = async () => {
  //     try {
  //       const data = await getCategory();
  //       setCategories(data);
  //     } catch (error) {
  //       toast.error("lỗi");
  //     }
  //   };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   const handleAddCategorySuccess = () => {
  //     handleCloseAdd();
  //     fetchCategories();
  //     toast.success("Thêm loại máy thành công");
  //   };

  //   const handleDeleteCategorySuccess = (response: string) => {
  //     handleCLoseDelete();
  //     fetchCategories();
  //     toast.success(response);
  //   };
  //   const handleUpdateCategorySuccess = (response: string) => {
  //     handleCLose();
  //     fetchCategories();
  //     toast.success(response);
  //   };
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

  const filteredRows = categories?.filter((item) =>
    item.name.toLowerCase().includes(query)
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
  const columns: ColumnsType<GetCategoryProps> = [
    {
      title: "Loại máy",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "20%",
    },
    {
      title: "Cấp",
      dataIndex: "type",
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
                    handleActionDelete(record);
                    break;
                  default:
                    break;
                }
              },
            }}
          >
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
        placeholder="Search"
        onChange={handleSearch}
        style={{ width: 200, marginBottom: 16 }}
      />

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={filteredRows}
        pagination={customPagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {/* {open && (
        <ModalCategoryPopup
          CategoryData={selectedData}
          open={open}
          handleClose={handleCLose}
          onUpdateSuccess={handleUpdateCategorySuccess}
        />
      )} */}

      {/* {openDeletePopup && (
        <ModalCategoryPopupDelete
          CategoryData={selectedData}
          openDeletePopup={openDeletePopup}
          handleCLoseDelete={handleCLoseDelete}
          onDeleteSuccess={handleDeleteCategorySuccess}
        />
      )} */}

      {/* {openAddPopup && (
        <ModalCategoryPopupAdd
          open={openAddPopup}
          handleClose={handleCloseAdd}
          onAddSuccess={handleAddCategorySuccess}
        />
      )} */}
    </>
  );
};

export default TableRank;
