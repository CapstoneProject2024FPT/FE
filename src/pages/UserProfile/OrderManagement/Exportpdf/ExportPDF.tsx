import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { OrderProps } from '../../../../models/order';
import { formatAddress, formatDateFunc, formatMoney } from '../../../../utils/fn';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function ExportPDF({ row }: { row: OrderProps }) {
  // Tính tổng tiền của 3 sản phẩm
  const totalAmount = row.productList.reduce((sum, product) => sum + product.totalAmount, 0);

  const billHTMLTemplate = `
  <div>
    <div style="text-align: center">
      <h1>Hóa đơn</h1>
    </div>
    <div>
      <p>Mã hóa đơn: <span id="warrantyId">${row.invoiceCode || ''}</span></p>
      <p>Khách hàng: <span id="customerName">${row.userInfo.fullName || ''}</span></p>
      <p>Địa chỉ: <span id="address">${formatAddress(row.address) || ''}</span></p>
      <p>Ngày mua: <span id="createDate">${formatDateFunc.formatDate(row.createDate) || ''}</span></p>
      <p>Ngày hoàn thành: <span id="completeDate">${formatDateFunc.formatDate(row.completedDate) || ''}</span></p>
    </div>
  
    <div>
      <h2>Thông tin đơn hàng</h2>
      <table class="table" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Tên sản phẩm</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Số lượng</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Thành tiền</th>
          </tr>
        </thead>
        <tbody id="productList">
          ${row.productList.map(product => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${product.productName || ''}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${product.quantity || ''}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${formatMoney(product.totalAmount) || ''}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;" colspan="2">Tổng tiền</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${formatMoney(totalAmount) || ''}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
  `;

  const pdfmakeContent = htmlToPdfmake(billHTMLTemplate);
  const docDefinition = {
    content: pdfmakeContent
  };

  return pdfMake.createPdf(docDefinition).open();
}

export default ExportPDF;
