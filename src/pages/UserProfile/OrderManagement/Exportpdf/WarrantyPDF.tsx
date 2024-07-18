import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { OrderProps, ProductProps } from '../../../../models/order';
import { formatAddress, formatDateFunc } from '../../../../utils/fn';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function WarrantyPDF({ order, product }: { order: OrderProps, product: ProductProps }) {
  // Tạo HTML template cho phiếu bảo hành
  const warrantyHTMLTemplate = `
  <div>
    <div style="text-align: center">
      <h1>Phiếu bảo hành</h1>
    </div>
    <div>
      <p>Khách hàng: <span id="customerName">${order.userInfo.fullName || ''}</span></p>
      <p>Địa chỉ: <span id="address">${formatAddress(order.address) || ''}</span></p>
      <p>Sản phẩm: <span id="productName">${product.productName || ''}</span></p>
      <p>Ngày mua: <span id="createDate">${formatDateFunc.formatDate(order.createDate) || ''}</span></p>
      <p>Thời gian bảo hành: <span>3 năm</span></p>
    </div>
  </div>
  `;

  // Chuyển đổi HTML template sang định dạng pdfmake
  const pdfmakeContent = htmlToPdfmake(warrantyHTMLTemplate);

  // Định nghĩa document definition
  const docDefinition = {
    content: pdfmakeContent
  };

  // Tạo và mở PDF
  return pdfMake.createPdf(docDefinition).open();
}

export default WarrantyPDF;
