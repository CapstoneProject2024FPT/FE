import React from "react";
import "./AboutUs.css";
const AboutUs: React.FC = () => {
    return (
        <div className="about-us-container">
            <h1>Giới thiệu SMMMS</h1>
            <p>
                SMMMS là công ty hàng đầu trong lĩnh vực cung cấp máy móc cơ khí.
                Chúng tôi cam kết cung cấp các dịch vụ chất lượng cao và giải pháp tối ưu
                cho khách hàng. Với đội ngũ nhân viên chuyên nghiệp và giàu kinh nghiệm,
                chúng tôi luôn đặt khách hàng lên hàng đầu và nỗ lực không ngừng để mang
                lại giá trị tốt nhất.
            </p>
            <p>
                Liên hệ với chúng tôi để biết thêm chi tiết:
                <ul>
                    <li>Hotline: 1800-6118 / 091-521-08-69</li>
                    <li>Email: info@smmms.com</li>
                </ul>
            </p>
        </div>
    );
};

export default AboutUs;