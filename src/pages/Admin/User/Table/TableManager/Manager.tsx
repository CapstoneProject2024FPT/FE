import React, { useEffect, useState } from "react";
import { Table, Input } from "antd";
import type { GetProp, TableProps } from "antd";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

interface DataType {
  name: string;
  username: string;
  email: string;
  id: string;
}

interface TableParams {
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const pageSize = 20;
const columns: ColumnsType<DataType> = [
  {
    title: "Nameaaaaa",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
    width: "20%",
  },
  {
    title: "username",
    dataIndex: "username",
    sorter: (a, b) => a.name.length - b.name.length,
    filters: [
      { text: "Male", value: "male" },
      { text: "Female", value: "female" },
    ],
    width: "20%",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];

const ManagerData: React.FC = () => {
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      fetch(`https://jsonplaceholder.typicode.com/users`)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);

          setData(res);
          setLoading(false);
          setTableParams({
            ...tableParams,
          });
        });
    };
    fetchData();
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const keys = ["name", "email", "username"];
  const filteredRows = data?.filter((item) =>
    keys.some((key) =>
      item[key as keyof DataType].toLowerCase().includes(query)
    )
  );

  return (
    <>
      <Search
        placeholder="Search"
        onChange={handleSearch} // Update search value on change
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
    </>
  );
};

export default ManagerData;
