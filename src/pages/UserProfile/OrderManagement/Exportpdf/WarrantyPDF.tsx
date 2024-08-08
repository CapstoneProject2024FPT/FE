import {
  Page,
  Text,
  View,
  Document,
  pdf,
  Image,
  Font,
} from "@react-pdf/renderer";
import { OrderProps, ProductProps } from "../../../../models/order";
import { formatAddress, formatDateFunc } from "../../../../utils/fn";
import { useEffect, useState } from "react";
import loraRegular from "../../../../assets/fonts/static/Lora-Regular.ttf";
import logo from "../../../../assets/images/logo-SMMMS.png";
import { Button, CircularProgress } from "@mui/material";
import { ApiWarranty } from "../../../../api/services/apiWarranty";

Font.register({
  family: "Lora",
  src: loraRegular,
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
    <Page
      style={{
        width: "100%",
        height: "100%",
        padding: "20px",
        fontFamily: "Lora",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
            <View
         style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {Array.from({ length: 100 }).map((_, index) => (
          <Text
            key={index}
            style={{
              opacity: 0.1,
              fontSize: "20px",
              fontWeight: "bold",
              textAlign: "center",
              color: "black",
              margin: "30px",
              transform: "rotate(45)"
            }}
          >
            SMMMS
          </Text>
        ))}
      </View>

      <View>
        <Text
          style={{
            width: "100%",
            fontSize: "24px",
            textAlign: "center",
            fontWeight: "ultrabold",
            marginBottom: "10px",
          }}> HỆ THÔNG BÁN VÀ BẢO TRÌ MÁY MÓC CƠ KHÍ </Text>
      </View>
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Image src={logo} style={{ width: "20%" }} />
        <View style={{ width: "70%" }}>
          <View style={{ width: "100%", marginBottom: "20px", display: "flex", gap: "2px" }}>
            <View
              style={{
                fontSize: "10px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Text style={{ marginRight: "10px" }}>•</Text>
              <Text style={{ minWidth: "100px" }}>Trụ sở chính: </Text>
              <Text style={{}}>phường Long Thạnh Mỹ, thành phố Thủ Đức</Text>
            </View>
            <View
              style={{
                fontSize: "10px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Text style={{ marginRight: "10px" }}>•</Text>
              <Text style={{ minWidth: "100px" }}>Hotline:</Text>
              <Text style={{ minWidth: "100px" }}>1800-6118 / 091-521-08-69</Text>
            </View>
            <View
              style={{
                fontSize: "10px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Text style={{ marginRight: "10px" }}>•</Text>
              <Text style={{ minWidth: "100px" }}>Email:</Text>
              <Text style={{ minWidth: "100px" }}>ad.smmms.gsu24se44@gmail.com</Text>
            </View>
            <View
              style={{
                fontSize: "10px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Text style={{ marginRight: "10px" }}>•</Text>
              <Text style={{ minWidth: "100px" }}>Website:</Text>
              <Text style={{ minWidth: "100px" }}>https://fe-smmms.vercel.app/</Text>
            </View>
          </View>
        </View>
      </View>
      <View>
        <Text
          style={{
            fontSize: "22px",
            fontWeight: "ultrabold",
            alignSelf: "center",
            marginBottom: "20px"
          }}>PHIẾU BẢO HÀNH</Text>
      </View>
      <View style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "30px"
      }}>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}>
          <Text style={{
            alignSelf: "center",
            fontSize: "18px",
            border: "1px solid #ddd",
            width: "100%",
            textAlign: 'center',
            backgroundColor: "#ddd",
            marginBottom: "15px"
          }}>
            Thông tin khách hàng
          </Text>
          <View style={{ margin: "0 auto", lineHeight: 1.5 }}>
            <View
              style={{
                fontSize: "14px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Text style={{ marginRight: "10px" }}>•</Text>
              <Text style={{ minWidth: "120px" }}>Tên khách hàng: </Text>
              <Text style={{}}>{order.userInfo.fullName || ""}</Text>
            </View>
            <View
              style={{
                fontSize: "14px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Text style={{ marginRight: "10px" }}>•</Text>
              <Text style={{ minWidth: "120px" }}>Địa chỉ: </Text>
              <Text style={{}}>{formatAddress(order.address) || ""}</Text>
            </View>
            <View
              style={{
                fontSize: "14px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Text style={{ marginRight: "10px" }}>•</Text>
              <Text style={{ minWidth: "120px" }}>Sản phẩm: </Text>
              <Text style={{}}>{product.productName || ""}</Text>
            </View>
            <View
              style={{
                fontSize: "14px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Text style={{ marginRight: "10px" }}>•</Text>
              <Text style={{ minWidth: "120px" }}>Ngày mua: </Text>
              <Text style={{}}>
                {formatDateFunc.formatDate(order.createDate) || ""}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            display: "flex",
          }}>
          <Text style={{
            alignSelf: "center",
            fontSize: "20px",
            border: "1px solid #ddd",
            width: "100%",
            textAlign: 'center',
            backgroundColor: "#ddd",
            marginBottom: "15px"
          }}>
            Bảo hành định kì
          </Text>
          <View
            style={{
              width: "100%",
              border: "1px solid #ddd",
              marginBottom: 20,
            }}>
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Text
                style={{
                  border: "1px solid #ddd",
                  padding: "4px",
                  fontWeight: "bold",
                  textAlign: "center",
                  flex: "1",
                  fontSize: "14px"
                }}>
                Lần bảo hành
              </Text>
              <Text
                style={{
                  border: "1px solid #ddd",
                  padding: "4px",
                  fontWeight: "bold",
                  textAlign: "center",
                  flex: "1",
                  fontSize: "14px"
                }}>
                Ngày bảo hành
              </Text>
            </View>
            {warranty.map((warrantyItem: any, index: number) =>
              warrantyItem.warrantyDetails.warrantyDetail.map(
                (e: any, subIndex: number) => (
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      fontSize: "14px"
                    }}
                    key={e.id}>
                    <Text
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "center",
                        flex: "1",
                      }}>
                      {`Lần ${index *
                        warrantyItem.warrantyDetails.warrantyDetail.length +
                        subIndex +
                        1
                        }`}
                    </Text>
                    <Text
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "center",
                        flex: "1",
                      }}>
                      {formatDateFunc.formatDate(e.startDate)}
                    </Text>
                  </View>
                )
              )
            )}
          </View>
          <View style={{ 
            alignSelf: "flex-end",
            display: "flex",
            alignItems: "center"
            }}>
            <Text style={{fontSize: "14px"}}>
              {formatDateFunc.formatDateVietnamese(order.createDate) || ""}
            </Text>
            <Text style={{ margin: "15px 0", fontSize: "14px"}}>
              Đại diện công ty kí tên
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "extrabold",
              }}
            >
              SMMMS
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          width: "100%",
        }}>
        <Text style={{ alignSelf: "center", fontSize: "22px", margin: "15px 0" }}>
          QUY ĐỊNH BẢO HÀNH
        </Text>
        <View style={{ display: "flex" }}>
            <Text
              style={{
                margin: "10px",
                fontSize: "18px",
                fontWeight: "ultrabold",
              }}>
              I. ĐIỀU KHOẢN CHUNG VỀ BẢO HÀNH
            </Text>
            <View
              style={{
                fontSize: "12px",
                marginLeft: "20px",
                lineHeight: 2
              }}>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ marginRight: "5px" }}>1.</Text>
                <Text>Chúng tôi chỉ chịu trách nhiệm bảo hành sau khi đã xác định lỗi thuộc về sản xuất.</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ marginRight: "5px" }}>2.</Text>
                <Text>Phiếu bảo hành phải được giữ nguyên, không bị tẩy xóa, sửa đổi trong thời gian bảo hành.</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ marginRight: "5px" }}>3.</Text>
                <Text>Thiết bị được sửa chữa miễn phí tại trung tâm trong suốt thời gian bảo hành của nhà sản xuất.</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ marginRight: "5px" }}>4.</Text>
                <Text>Những sản phẩm bảo hành ngoài nội thành Thành Phố Hồ Chí Minh, chi phí đi lại khách hàng chịu trách nhiệm.</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ marginRight: "5px" }}>5.</Text>
                <Text>Đối với những sản phẩm có giá trị dưới 8 triệu bảo hành tại công ty.</Text>
              </View>
            </View>
          </View>
          <View style={{ display: "flex" }}>
            <Text
              style={{
                margin: "10px",
                fontSize: "18px",
                fontWeight: "ultrabold",
              }}>
              II. CÁC TRƯỜNG HỢP KHÔNG ĐƯỢC BẢO HÀNH
            </Text>
            <View
              style={{
                fontSize: "12px",
                marginLeft: "20px",
                lineHeight: 2
              }}>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ marginRight: "5px" }}>1.</Text>
                <Text>Sản phẩm hết thời gian bảo hành ghi trong phiếu bảo hành.</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ marginRight: "5px" }}>2.</Text>
                <Text>Mất hoặc không còn phiếu bảo hành.</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ marginRight: "5px" }}>3.</Text>
                <Text>Khách hàng tự tháo mở, sửa chữa, thay đổi lại máy ở cơ sở khác khi chưa được sự đồng ý.</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ marginRight: "5px" }}>4.</Text>
                <Text>Máy móc hoặc linh kiện bị hỏng hóc, đứt dây, không đầy đủ linh kiện, sử dụng ngôn ngữ điện áp không phù hợp.</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ marginRight: "5px" }}>5.</Text>
                <Text>Sản phẩm bị hư hỏng do bảo quản không tốt, côn trùng, thiên tai, hoả hoạn.</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: "10px"}}>
            <Text style={{ marginRight: "5px", fontSize: "14px" }}>Lưu ý: </Text>
            <Text style={{ marginLeft: "20px", fontSize: "12px", lineHeight: 2 }}>Tiếp nhận yêu cầu bảo hành vào giờ hành chính từ thứ 2 đến thứ 7 hàng tuần <br /> trừ ngày nghỉ lễ.</Text>
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
  const [loading, setLoading] = useState<boolean>(true);
  const { apiGetWarranty, apiGetWarrantyById } = ApiWarranty();

  useEffect(() => {
    const fetchWarrantyData = async () => {
      try {
        const response = await apiGetWarranty({
          InventoryId: product.inventoryId,
        });
        const warrantyData = response.data.map(async (warrantyItem: any) => {
          const warrantyDetails = await apiGetWarrantyById(warrantyItem.id);
          return {
            warrantyDetails: warrantyDetails.data,
          };
        });
        const detailedWarrantyItems = await Promise.all(warrantyData);
        const blob = await pdf(
          <WarrantyPDFDocument
            order={order}
            product={product}
            warranty={detailedWarrantyItems}
          />
        ).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching warranty:", error);
        setLoading(false);
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
    <div>
      <Button
        variant="contained"
        onClick={handleOpenPdf}
        disabled={!pdfUrl || loading}
      >
        {loading ? <CircularProgress size={24} /> : "Xem phiếu bảo hành"}
      </Button>
    </div>
  );
};

export default WarrantyPDF;
