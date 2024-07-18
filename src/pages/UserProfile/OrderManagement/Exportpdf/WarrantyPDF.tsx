import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { OrderProps, ProductProps } from "../../../../models/order";
import { formatAddress, formatDateFunc } from "../../../../utils/fn";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
function WarrantyPDF({
  order,
  product,
}: {
  order: OrderProps;
  product: ProductProps;
}) {
  if (!pdfMake || !pdfMake.vfs) {
    console.error("pdfMake or its vfs is not loaded correctly.");
    return;
  }

  // Define the styles with explicit types
  const styles = {
    header: {
      fontSize: 20,
      bold: true,
      alignment: "center" as const,
      margin: [0, 0, 0, 10] as [number, number, number, number],
    },
  };

  // Create the document definition directly
  const docDefinition = {
    content: [
      {
        text: "Phiếu bảo hành",
        style: "header",
      },
      {
        layout: "lightHorizontalLines" as const,
        table: {
          widths: ["*", "*"],
          body: [
            ["Khách hàng:", order.userInfo.fullName || ""],
            ["Địa chỉ:", formatAddress(order.address) || ""],
            ["Sản phẩm:", product.productName || ""],
            ["Ngày mua:", formatDateFunc.formatDate(order.createDate) || ""],
            ["Thời gian bảo hành:", "3 năm"],
          ],
        },
      },
    ],
    styles: styles, // Use the styles object directly
  };

  // Create and open the PDF
  const pdfDoc = pdfMake.createPdf(docDefinition);
  pdfDoc.open();

  return pdfDoc;
}

export default WarrantyPDF;
