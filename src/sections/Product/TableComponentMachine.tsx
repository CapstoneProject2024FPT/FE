import React, { useEffect, useState } from "react";
import type { TableProps } from "antd";
import { Table, Input, Button, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { MachineryApi } from "../../api/services/apiMachinery";
import { ProductAdmin } from "../../models/products";
import config from "../../configs";
import { ComponentMachine } from "../../models/machineComponent";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

interface TableComponentMachine {
  handleSetName: (text: string) => void;
}
const TableComponentMachine: React.FC<TableComponentMachine> = ({
  handleSetName,
}) => {
  const [componentsMachine, setComponentsMachine] =
    useState<ComponentMachine[]>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  const [machinery, SetMachinery] = useState<ProductAdmin>();
  //url
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  //search
  const [query, setQuery] = useState<string>("");

  //api
  const { apiGetDetailMachine, loading } = MachineryApi();
  //modal popup

  const handleOpenAdd = () => {
    if (id) {
      navigate(config.adminRoutes.AddComponentOfMachine.replace(":id", id));
    }
  };

  //----------------------------------------------------------------------------

  const fetchMachineDetail = async () => {
    if (id) {
      const response = await apiGetDetailMachine(id);
      SetMachinery(response.data);
      setComponentsMachine(response.data.component);
      handleSetName(response.data.name);
    }
  };

  useEffect(() => {
    fetchMachineDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });

    if (pagination.pageSize !== pagination?.pageSize) {
      setComponentsMachine([]);
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

  const filteredRows = componentsMachine?.filter((item) =>
    item.name.toLowerCase().includes(query)
  );

  const columns: ColumnsType<ComponentMachine> = [
    {
      title: "Tên bộ phận",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "20%",
    },
  ];

  return (
    <>
      <Typography.Text>Tên máy: {machinery?.name}</Typography.Text>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        <Search
          placeholder="Nhập từ khoá"
          onChange={handleSearch}
          style={{ width: 200, marginBottom: 16 }}
        />
        <Button onClick={handleOpenAdd} icon={<PlusOutlined />}>
          Thêm máy bộ phận máy
        </Button>
      </div>

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
    </>
  );
};

export default TableComponentMachine;
