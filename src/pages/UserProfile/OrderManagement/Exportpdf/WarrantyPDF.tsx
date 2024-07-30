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
            <Text style={styles.tableColHeader}>Bảo hành định kì</Text>
            <Text style={styles.tableColHeader}>Ngày bắt đầu</Text>
          </View>
          {warranty.map((warrantyItem: any, index: number) => (
            warrantyItem.warrantyDetails.warrantyDetail.map((e: any, subIndex: number) => (
              <View style={styles.tableRow} key={e.id}>
                <Text style={styles.tableCol}>
                  {`Lần ${index * warrantyItem.warrantyDetails.warrantyDetail.length + subIndex + 1}`}
                </Text>
                <Text style={styles.tableCol}>{formatDateFunc.formatDate(e.startDate)}</Text>
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

  useEffect(() => {
    const fetchWarrantyData = async () => {
      try {
        const response = await apiGetWarranty({ InventoryId: product.inventoryId });
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
        // You can use warrantyData here
        const blob = await pdf(
          <WarrantyPDFDocument order={order} product={product} warranty={detailedWarrantyItems} />
        ).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        console.log('Warranty Details:', detailedWarrantyItems);
      } catch (error) {
        console.error('Error fetching warranty:', error);
      }
    };

    fetchWarrantyData();
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
