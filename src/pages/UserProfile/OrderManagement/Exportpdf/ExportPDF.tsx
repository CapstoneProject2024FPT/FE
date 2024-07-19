import { Page, Text, View, Document, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { OrderProps } from '../../../../models/order';
import { formatAddress, formatDateFunc, formatMoney } from '../../../../utils/fn';
import { useEffect, useState } from 'react';
import { Font } from '@react-pdf/renderer';
import loraRegular from '../../../../assets/fonts/static/Lora-Regular.ttf';
import logo from '../../../../assets/images/logo-SMMMS.png'; // Adjust path as needed


// Define styles
Font.register({
  family: 'Lora',
  src: loraRegular,
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Lora',
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    borderCollapse: 'collapse',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    flex: 1,
    textAlign: 'center',
  },
  watermark: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.2, // Adjust opacity to make the logo faded
    width: '80%', // Adjust size as needed
    height: 'auto',
    zIndex: 0,
  },
});

const ExportPDFDocument = ({ row }: { row: OrderProps }) => {
  // Calculate total amount
  const totalAmount = row.productList.reduce((sum, product) => sum + product.totalAmount, 0);

  return (
    <Document>
      <Page style={styles.page}>
        <Image src={logo} style={styles.watermark} />
        <View style={styles.header}>
          <Text>Hóa đơn</Text>
        </View>
        <View style={styles.section}>
          <Text>Mã hóa đơn: {row.invoiceCode || ''}</Text>
          <Text>Khách hàng: {row.userInfo.fullName || ''}</Text>
          <Text>Địa chỉ: {formatAddress(row.address) || ''}</Text>
          <Text>Ngày mua: {formatDateFunc.formatDate(row.createDate) || ''}</Text>
          <Text>Ngày hoàn thành: {formatDateFunc.formatDate(row.completedDate) || ''}</Text>
        </View>
        <View style={styles.section}>
          <Text>Thông tin đơn hàng</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Tên sản phẩm</Text>
              <Text style={styles.tableColHeader}>Số lượng</Text>
              <Text style={styles.tableColHeader}>Thành tiền</Text>
            </View>
            {row.productList.map((product, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCol}>{product.productName || ''}</Text>
                <Text style={styles.tableCol}>{product.quantity || ''}</Text>
                <Text style={styles.tableCol}>{formatMoney(product.totalAmount) || ''}</Text>
              </View>
            ))}
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>Tổng tiền</Text>
              <Text style={styles.tableCol}>{formatMoney(totalAmount) || ''}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const ExportPDF = ({ row }: { row: OrderProps }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const generatePdf = async () => {
      const blob = await pdf(<ExportPDFDocument row={row} />).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    };

    generatePdf();
  }, [row]);

  const handleOpenPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl);
    }
  };

  return (
    <div onClick={handleOpenPdf}>
      Xuất hóa đơn
    </div>
  );
};

export default ExportPDF;
