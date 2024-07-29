import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
  Image,
} from "@react-pdf/renderer";
import { OrderProps, ProductProps } from "../../../../models/order";
import { formatAddress, formatDateFunc } from "../../../../utils/fn";
import { useEffect, useState } from "react";
import { Font } from "@react-pdf/renderer";
import loraRegular from "../../../../assets/fonts/static/Lora-Regular.ttf";
import logo from "../../../../assets/images/logo-SMMMS.png"; // Adjust path as needed
import { Button } from "@mui/material";
import { ApiWarranty } from "../../../../api/services/apiWarranty";

Font.register({
  family: "Lora",
  src: loraRegular,
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Lora",
  },
  section: {
    marginBottom: 10,
  },
  header: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 20,
  },
  watermark: {
    position: "absolute",
    top: "25%",
    left: "25%",
    transform: "translate(-50%, -50%)",
    opacity: 0.2, // Adjust opacity to make the logo faded
    width: "80%", // Adjust size as needed
    height: "auto",
    zIndex: 0,
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    borderCollapse: "collapse",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    flex: 1,
    textAlign: "center",
  },
});

const translateStatus = (status: any) => {
  switch (status) {
    case 'AwaitingAssignment':
      return 'Đang thực thi';
    default:
      return status;
  }
};

const WarrantyPDFDocument = ({
  order,
  product,
  warranty,
}: {
  order: OrderProps;
  product: ProductProps;
  warranty: any;
}

) => (

  <Document>
    <Page style={styles.page}>
      <Image src={logo} style={styles.watermark} />
      <View style={styles.header}>
        <Text>Phiếu bảo hành</Text>
      </View>
      <View style={styles.section}>
        <Text>Khách hàng: {order.userInfo.fullName || ""}</Text>
        <Text>Địa chỉ: {formatAddress(order.address) || ""}</Text>
        <Text>Sản phẩm: {product.productName || ""}</Text>
        <Text>
          Ngày mua: {formatDateFunc.formatDate(order.createDate) || ""}
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Bảo trì định kì</Text>
            <Text style={styles.tableColHeader}>Ngày bắt đầu</Text>
            <Text style={styles.tableColHeader}>Trạng thái</Text>
          </View>
          {warranty.map((warrantyItem: any) => (
            warrantyItem.warrantyDetails.warrantyDetail.map((e: any) => (
              <View style={styles.tableRow} key={e.id}>
                <Text style={styles.tableCol}>{e.description || "Bảo trì định kì"}</Text>
                <Text style={styles.tableCol}>{formatDateFunc.formatDate(e.startDate)}</Text>
                <Text style={styles.tableCol}>{translateStatus(e.status)}</Text>
              </View>
            ))
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

const WarrantyPDF = ({
  order,
  product,
}: {
  order: OrderProps;
  product: ProductProps;
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { apiGetWarranty, apiGetWarrantyById } = ApiWarranty();
  const [warrantyDetails, setWarrantyDetails] = useState<any>([]);

  // const fetchWarranty = async () => {
  //   if (auth) {
  //     const params = {
  //       type: "Periodic",
  //       AccountId: auth.data.id,
  //     };
  //     const response = await apiGetWarranty(params);
  //     setRequests(response.data);
  //   }
  // };

  useEffect(() => {
    const fetchWarrantyData = async () => {
      try {
        const response = await apiGetWarranty({ InventoryId: product.inventoryId });
        console.log('Warranty Data:', response.data);
        const warrantyData = response.data.map(
          async (warrantyItem: any) => {
            const warrantyDetails = await apiGetWarrantyById(
              warrantyItem.id
            );
            return {
              warrantyDetails: warrantyDetails.data,
            };
          }
        );
        const detailedWarrantyItems = await Promise.all(
          warrantyData
        );
        console.log('Warranty Data11:', detailedWarrantyItems);
        setWarrantyDetails(detailedWarrantyItems);
        // You can use warrantyData here
      } catch (error) {
        console.error('Error fetching warranty:', error);
      }
    };

    fetchWarrantyData();

    const generatePdf = async () => {
      const blob = await pdf(
        <WarrantyPDFDocument order={order} product={product} warranty={warrantyDetails} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    };

    generatePdf();
  }, [order, product]);

  const handleOpenPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl);
    }
  };

  return (
    <Button variant="contained" onClick={handleOpenPdf}>
      Xem phiếu bảo hành
    </Button>
  );
};

export default WarrantyPDF;
