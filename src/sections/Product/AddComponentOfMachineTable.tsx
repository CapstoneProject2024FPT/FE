/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { TableProps } from "antd";
import { Table, Input, Button, Typography, Checkbox, DatePicker } from "antd";
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
import config from "../../configs";
import moment from "moment";

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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleOpen = () => {
    setOpenAdd(!openAdd);
  };

  const handleDateChange = (_date: any, dateString: string | string[]) => {
    setSelectedDate(Array.isArray(dateString) ? dateString[0] : dateString);
  };
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

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
    toast(config.AdminMessageNotice.AddSucces);
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

  const filteredRows = components
    ?.filter((item) => item.name.toLowerCase().includes(debounceQuery.toLowerCase()))
    ?.filter((item) =>
      selectedDate
        ? moment(item.createDate).format("DD/MM/YYYY") === selectedDate
        : true
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
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Tên bộ phận
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "40%",
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
      render: (createDate) => {
        return formatDateFunc.formatDate(createDate);
      },
      align: "center",
      width: "30%"
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
