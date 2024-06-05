import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Input, Space, Dropdown } from "antd";
import { GetCategoryProps } from "../../models/category";
import { CategoryApi } from "../../api/services/apiCategories";
import ModalCategoryPopup from "./PopupCategory/popupDetailCategory";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

const TableCategory: React.FC = () => {
  const [categories, setCategories] = useState<GetCategoryProps[]>();
  //   const [tableParams, setTableParams] = useState<TableParams>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  const [query, setQuery] = useState<string>("");
  const [selectedData, setSelectedData] = useState<GetCategoryProps | null>(
    null
  );
  const [open, setOpen] = useState<boolean>(false);

  const { getCategory, loading } = CategoryApi();
  // Function to handle action click
  const handleActionClick = (record: GetCategoryProps) => {
    setOpen(!open);
    setSelectedData(record);
  };

  const handleCLose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategory();
        setCategories(data);
      } catch (error) {
        console.log("111");
      }
    };

    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      label: "Delete",
    },
    {
      key: "2",
      label: "Detail",
    },
  ];
  const columns: ColumnsType<GetCategoryProps> = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "20%",
    },
    {
      title: "Cấp",
      dataIndex: "type",
    },
    {
      title: "Status",
      dataIndex: "email",
    },
    {
      title: "Action",
      key: "operation",
      render: (record) => (
        <Space size="middle">
          <Dropdown menu={{ items, onClick: () => handleActionClick(record) }}>
            <a>
              More <DownOutlined />
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
      {open && (
        <ModalCategoryPopup
          CategoryData={selectedData}
          open={open}
          handleClose={handleCLose}
        />
      )}
    </>
  );
};

export default TableCategory;
