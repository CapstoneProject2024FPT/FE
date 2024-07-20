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
});

const WarrantyPDFDocument = ({
  order,
  product,
}: {
  order: OrderProps;
  product: ProductProps;
}) => (
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
        <Text>Thời gian bảo hành: 3 năm</Text>
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

  useEffect(() => {
    const generatePdf = async () => {
      const blob = await pdf(
        <WarrantyPDFDocument order={order} product={product} />
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
