import React from "react";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";

function createData(
  id: number,
  status: string,
  productName: string,
  serialNumber: string,
  expiry: string,
) {
  return { id, status, productName, serialNumber, expiry };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  // Format expiry date
  const date = new Date(row.expiry);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell align="right">{row.status}</TableCell>
        <TableCell align="right">{row.productName}</TableCell>
        <TableCell align="right">{row.serialNumber}</TableCell>

        <TableCell align="right">{date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Phiếu bảo hành
              </Typography>
              <Table size="medium" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Số Serial</TableCell>

                    <TableCell align="right">Tên sản phẩm</TableCell>
                    <TableCell align="right">Ngày lập phiếu</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {row.serialNumber}
                    </TableCell>

                    <TableCell align="right">{row.productName}</TableCell>
                    <TableCell align="right">{date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}</TableCell>
                  </TableRow>
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginRight: "10px" }}
                    >
                      Yêu cầu bảo hành
                    </Button>
                  </div>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function WarrantyManagement() {
  const [warranty, setWarranty] = useState([]);

  useEffect(() => {
    axios.get("https://6687c05c0bc7155dc018f48e.mockapi.io/warranty").then((response) => {
      setWarranty(response.data);
    });
  }, []);

  return (
    <TableContainer component={Paper} >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="right">Trạng thái</TableCell>
            <TableCell align="right">Tên sản phẩm</TableCell>
            <TableCell align="right">Số serial</TableCell>

            <TableCell align="right">Ngày hết hạn</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {warranty.map((row: any) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
