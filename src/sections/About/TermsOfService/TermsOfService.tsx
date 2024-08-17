import React from "react";
import "./TermsOfService.scss";

const TermsOfService: React.FC = () => {
  return (
    <div className="terms-of-service-container">
      <div className="terms-of-service">
        <h1>ĐIỀU KHOẢN SỬ DỤNG</h1>
        <p>
          Chào mừng bạn đến với SMMMS. Bằng cách sử dụng dịch vụ của chúng tôi,
          bạn đồng ý tuân thủ các điều khoản sau đây. Vui lòng đọc kỹ các điều
          khoản trước khi sử dụng dịch vụ của chúng tôi.
        </p>
        <h2>1. Chấp nhận các điều khoản</h2>
        <p>
          Khi bạn sử dụng dịch vụ của chúng tôi, bạn đồng ý với tất cả các điều
          khoản được quy định ở đây. Nếu bạn không đồng ý với bất kỳ điều khoản
          nào, vui lòng không sử dụng dịch vụ của chúng tôi.
        </p>
        <h2>2. Thay đổi điều khoản</h2>
        <p>
          Chúng tôi có quyền thay đổi các điều khoản này vào bất kỳ lúc nào mà
          không cần thông báo trước. Việc tiếp tục sử dụng dịch vụ sau khi có thay
          đổi nghĩa là bạn chấp nhận các điều khoản mới.
        </p>
        <h2>3. Trách nhiệm của người dùng</h2>
        <p>
          Bạn chịu trách nhiệm về việc sử dụng dịch vụ và mọi thông tin bạn cung
          cấp. Bạn cam kết không sử dụng dịch vụ cho các mục đích bất hợp pháp
          hoặc vi phạm quyền của bên thứ ba.
        </p>
        <h2>4. Quyền sở hữu trí tuệ</h2>
        <p>
          Tất cả nội dung, thương hiệu và các tài sản trí tuệ khác được hiển thị
          trên dịch vụ của chúng tôi đều thuộc sở hữu của SMMMS hoặc các bên cấp
          phép cho chúng tôi. Bạn không được phép sử dụng các tài sản này mà không
          có sự cho phép của chúng tôi.
        </p>
        <h2>5. Liên hệ</h2>
        <p>
          Nếu bạn có bất kỳ câu hỏi nào về điều khoản sử dụng, vui lòng liên hệ
          với chúng tôi qua <br /> email: ad.smmms.gsu24se44@gmail.com
        </p>
      </div>
      <div className="terms-of-service-warranty">
        <h1>QUY ĐỊNH BẢO HÀNH</h1>
        <h2>1. Điều khoản chung về bảo hành</h2>
        <p>
          - Chúng tôi chỉ chịu trách nhiệm bảo hành sau khi đã xác định lỗi thuộc về sản xuất.
        </p>
        <p>
          - Phiếu bảo hành phải được giữ nguyên, không bị tẩy xóa, sửa đổi trong thời gian bảo hành.
        </p>
        <p>
          - Thiết bị được sửa chữa miễn phí tại trung tâm trong suốt thời gian bảo hành của nhà sản xuất.
        </p>
        <p>
          - Những sản phẩm bảo hành ngoài nội thành Thành Phố Hồ Chí Minh, chi phí đi lại khách hàng chịu trách nhiệm.
        </p>
        <p>
          - Đối với những sản phẩm có giá trị dưới 8 triệu bảo hành tại công ty.
        </p>

        <h2>2. Cách trường hợp không được bảo hành</h2>
        <p>
          - Sản phẩm hết thời gian bảo hành ghi trong phiếu bảo hành.
        </p>
        <p>
          - Mất hoặc không còn phiếu bảo hành.
        </p>
        <p>
          - Khách hàng tự tháo mở, sửa chữa, thay đổi lại máy ở cơ sở khác khi chưa được sự đồng ý.
        </p>
        <p>
          - Máy móc hoặc linh kiện bị hỏng hóc, đứt dây, không đầy đủ linh kiện, sử dụng ngôn ngữ điện áp không phù hợp.
        </p>
        <p>
          - Sản phẩm bị hư hỏng do bảo quản không tốt, côn trùng, thiên tai, hoả hoạn.
        </p>
        <p>
          - Chỉ hỗ trợ mua và bảo hành trong khu vực TP.HCM. Nếu máy móc được di chuyển hoặc dời đến địa điểm ngoài TP.HCM, sẽ không hỗ trợ bảo hành.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
