import React, { useEffect, useState } from "react";
import { Table } from "antd";
import type { GetProp, TableProps } from "antd";
import qs from "qs";

type ColumnsType<T> = TableProps<T>["columns"];

interface DataType {
  name: {
    first: string;
    last: string;
  };
  gender: string;
  email: string;
  login: {
    uuid: string;
  };
}

interface TableParams {
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const columns: ColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.first.length - b.name.first.length,
    render: (name) => `${name.first} ${name.last}`,
    width: "20%",
  },
  {
    title: "Gender",
    dataIndex: "gender",
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

const App: React.FC = () => {
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20, // Default page size
    total: 200,
  });

  const getRandomuserParams = (pageSize: number, current: number) => ({
    results: pageSize,
    page: current,
  });

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      fetch(
        `https://randomuser.me/api?${qs.stringify(
          getRandomuserParams(pagination.pageSize, pagination.current)
        )}`
      )
        .then((res) => res.json())
        .then(({ results }) => {
          setData(results);
          setLoading(false);
          setTableParams({
            ...tableParams,
          });
        });
    };
    fetchData();
  }, [pagination?.current, pagination?.pageSize]);

  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== pagination?.pageSize) {
      setData([]);
    }
  };

  const customPagination = {
    ...pagination,
    onChange: handleTableChange,
    pageSizeOptions: ["20", "25", "50"], // Custom page size options
    showSizeChanger: true, // Show page size changer
    showQuickJumper: false, // Show quick jumper
  };

  return (
    <Table
      columns={columns}
      rowKey={(record) => record.login.uuid}
      dataSource={data}
      pagination={customPagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default App;
