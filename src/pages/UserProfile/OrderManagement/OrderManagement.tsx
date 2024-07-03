import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ModalOrderPopup from "./Modal/PopupDetailOrder";
import { useState } from "react";

const Order = [
  {
    ID: 1,
    orderID: "123456",
    orderDate: "2021-10-10",
    orderStatus: "Đang chờ",
    orderTotal: 1000000,
    orderDetail: [
      {
        productID: "1",
        productName: "Máy tiện",
        productPrice: 1000000,
        productQuantity: 1,
      },
      {
        productID: "1",
        productName: "Máy tiện",
        productPrice: 1000000,
        productQuantity: 1,
      },
      {
        productID: "1",
        productName: "Máy tiện",
        productPrice: 1000000,
        productQuantity: 1,
      },
    ],
  },
  {
    ID: 2,
    orderID: "123457",
    orderDate: "2021-10-11",
    orderStatus: "Đã giao",
    orderTotal: 2000000,
    orderDetail: [
      {
        productID: "2",
        productName: "Máy khoan",
        productPrice: 2000000,
        productQuantity: 1,
      },
    ],
  },
  {
    ID: 3,
    orderID: "123458",
    orderDate: "2021-10-12",
    orderStatus: "Đã hủy",
    orderTotal: 3000000,
    orderDetail: [
      {
        productID: "3",
        productName: "Máy xung điện",
        productPrice: 3000000,
        productQuantity: 1,
      },
    ],
  },
];

const OrderManagement: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedData, setSelectedData] = useState<any>({});
  const [open, setOpen] = useState<boolean>(false);
  const handleCLose = () => {
    setOpen(!open);
  };
  const columns: GridColDef[] = [
    { field: "ID", headerName: "SI", width: 70 },
    {
      field: "orderID",
      headerName: "Mã đơn hàng",
      width: 130,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
    },
    { field: "orderDate", headerName: "Ngày đặt hàng", width: 130 },
    {
      field: "orderStatus",
      headerName: "Trạng thái",
      width: 130,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "orderTotal",
      headerName: "Tổng tiền",
      width: 130,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "orderDetail",
      headerName: "Chi tiết đơn hàng",
      width: 130,
      renderCell: (data) => {
        return (
          <div>
            <button
              style={{
                backgroundColor: "#2ECC71",
                color: "white",
                padding: "5px 10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => {
                setOpen(!open);
                setSelectedData(data.row);
              }}
            >
              Xem chi tiết
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={Order}
          getRowId={(row) => row.ID}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
        />
      </div>

      {open && (
        <ModalOrderPopup
          orderData={selectedData}
          handleClose={handleCLose}
          open={open}
        />
      )}
    </>
  );
};

export default OrderManagement;
