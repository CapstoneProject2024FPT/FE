/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { TableProps } from "antd";
import { Table, Input, Button, Typography, Checkbox } from "antd";
import { formatDateFunc } from "../../utils/fn";
import { useParams } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { MachineryApi } from "../../api/services/apiMachinery";
import { ProductAdmin } from "../../models/products";
import { MachineryComponentApi } from "../../api/services/apiMachineComponent";
import { GetMachineComponents } from "../../models/machineComponent";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import ModalViewBeforeAddComponent from "./PopupAddComponentMachine/ModalAddComponentMachine";
import { toast } from "react-toastify";
import useDebounce from "../../hooks/useDebounce";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

interface AddComponentOfMachineTable {
  handleSetName: (text: string) => void;
}
const AddComponentOfMachineTable: React.FC<AddComponentOfMachineTable> = ({
  handleSetName,
}) => {
  const [components, setComponents] = useState<GetMachineComponents[]>([]);
  const [chooseComponents, setChooseComponents] = useState<
    GetMachineComponents[]
  >([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  const [machinery, SetMachinery] = useState<ProductAdmin>();
  //url
  const { id } = useParams<{ id: string }>();
  //search
  const [query, setQuery] = useState<string>("");
  const debounceQuery = useDebounce({ value: query, delay: 300 });
  //popup
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  //api
  const { apiGetListComponent, loading } = MachineryComponentApi();
  const { apiGetDetailMachine } = MachineryApi();

  const handleOpen = () => {
    setOpenAdd(!openAdd);
  };

  const handleClose = () => {
    setOpenAdd(!openAdd);
  };

  const fetchMachineDetail = async () => {
    if (id) {
      const response = await apiGetDetailMachine(id);
      if (response && response.data) {
        SetMachinery(response.data);
        setChooseComponents(response.data.component);
        handleSetName(response.data.name);
      }
    }
  };

  const fetchComponent = async () => {
    const response = await apiGetListComponent();
    if (response.status === 200 && response.data) {
      setComponents(response.data || []);
    }
  };

  useEffect(() => {
    fetchComponent();
    fetchMachineDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //checkbox
  const handleCheck =
    (record: GetMachineComponents) => (e: CheckboxChangeEvent) => {
      if (e.target.checked) {
        setChooseComponents((prev) => [...prev, record]);
      } else {
        setChooseComponents((prev) =>
          prev?.filter((item) => item.id !== record.id)
        );
      }
    };

  //add success
  const handleAddSuccess = () => {
    toast("Thêm thành công");
  };
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });

    if (pagination.pageSize !== pagination?.pageSize) {
      setComponents([]);
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

  const filteredRows = components?.filter((item) =>
    item.name.toLowerCase().includes(debounceQuery.toLowerCase())
  );

  const columns: ColumnsType<GetMachineComponents> = [
    {
      title: "",
      width: "5%",
      key: "operation",
      render: (record) => (
        <Checkbox
          onChange={handleCheck(record)}
          checked={chooseComponents?.some((item) => item.id === record.id)}
        />
      ),
    },
    {
      title: "Tên bộ phận",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "40%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      render: (createDate) => {
        return formatDateFunc.formatDate(createDate);
      },
    },
  ];

  return (
    <>
      <Typography.Text>Tên máy: {machinery?.name}</Typography.Text>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Search
          placeholder="Nhập từ khoá"
          onChange={handleSearch}
          style={{ width: 200, marginBottom: 16 }}
        />
        <Button onClick={handleOpen} icon={<PlusOutlined />}>
          Lưu bộ phận
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
        bordered
      />

      {openAdd && (
        <ModalViewBeforeAddComponent
          handleClose={handleClose}
          onAddSuccess={handleAddSuccess}
          open={openAdd}
          productData={chooseComponents}
        />
      )}
    </>
  );
};

export default AddComponentOfMachineTable;
