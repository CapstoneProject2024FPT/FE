import { Page, Text, View, Document, StyleSheet, pdf, Image, Font } from "@react-pdf/renderer";
import { OrderProps, ProductProps } from "../../../../models/order";
import { formatAddress, formatDateFunc } from "../../../../utils/fn";
import { useEffect, useState } from "react";
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
  warrantyTermsContainer: {
    marginTop: 20,
    border: '1 solid #ddd',
    padding: 10,
  },
  warrantyTermsSection: {
    marginBottom: 10,
  },
  warrantyTermsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  warrantyTermsContent: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: "left",
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
      <View style={styles.warrantyTermsContainer}>
        <View style={styles.warrantyTermsSection}>
          <Text style={styles.warrantyTermsTitle}>QUY ĐỊNH BẢO HÀNH</Text>
          <Text style={styles.warrantyTermsContent}>
            I. ĐIỀU KHOẢN CHUNG VỀ BẢO HÀNH
          </Text>
          <Text style={styles.warrantyTermsContent}>
            1. Chúng tôi chỉ chịu trách nhiệm bảo hành sau khi đã xác định lỗi thuộc về sản xuất.
          </Text>
          <Text style={styles.warrantyTermsContent}>
            2. Phiếu bảo hành phải được giữ nguyên, không bị tẩy xóa, sửa đổi trong thời gian bảo hành.
          </Text>
          <Text style={styles.warrantyTermsContent}>
            3. Thiết bị được sửa chữa miễn phí tại trung tâm trong suốt thời gian bảo hành của nhà sản xuất.
          </Text>
          <Text style={styles.warrantyTermsContent}>
            4. Những sản phẩm bảo hành ngoài nội thành Thành Phố Hồ Chí Minh, chi phí đi lại khách hàng chịu trách nhiệm.
          </Text>
          <Text style={styles.warrantyTermsContent}>
            5. Đối với những sản phẩm có giá trị dưới 8 triệu bảo hành tại công ty.
          </Text>
        </View>
        <View style={styles.warrantyTermsSection}>
          <Text style={styles.warrantyTermsContent}>
            II. CÁC TRƯỜNG HỢP KHÔNG BẢO HÀNH
          </Text>
          <Text style={styles.warrantyTermsContent}>
            1. Sản phẩm hết thời gian bảo hành ghi trong phiếu bảo hành.
          </Text>
          <Text style={styles.warrantyTermsContent}>
            2. Mất hoặc không còn phiếu bảo hành.
          </Text>
          <Text style={styles.warrantyTermsContent}>
            3. Khách hàng tự tháo mở, sửa chữa, thay đổi lại máy ở cơ sở khác khi chưa được sự đồng ý.
          </Text>
          <Text style={styles.warrantyTermsContent}>
            4. Máy móc hoặc linh kiện bị hỏng hóc, đứt dây, không đầy đủ linh kiện, sử dụng ngôn ngữ điện áp không phù hợp.
          </Text>
          <Text style={styles.warrantyTermsContent}>
            5. Sản phẩm bị hư hỏng do bảo quản không tốt, côn trùng, thiên tai, hoả hoạn.
          </Text>
          <Text style={styles.warrantyTermsContent}>
            Lưu ý: Tiếp nhận yêu cầu bảo hành vào giờ hành chính từ thứ 2 đến thứ 7 hàng tuần (trừ ngày nghỉ lễ)
          </Text>
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
        const blob = await pdf(
          <WarrantyPDFDocument order={order} product={product} warranty={detailedWarrantyItems} />
        ).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
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
