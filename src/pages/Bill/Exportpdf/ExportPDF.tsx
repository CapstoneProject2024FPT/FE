import { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  pdf,
  Image,
  Font,
} from "@react-pdf/renderer";
import moment from "moment";
import { OrderProps } from "../../../models/order";
import { formatAddress, formatMoney } from "../../../utils/fn";
import loraRegular from "../../../assets/fonts/static/Lora-Regular.ttf";
import logo from "../../../assets/images/logo-SMMMS.png"; // Adjust path as needed

// Define styles
Font.register({
  family: "Lora",
  src: loraRegular,
});

const formatDateFunc = {
  formatDateTime: (date: Date | undefined): string => {
    if (!date || !moment(date, moment.ISO_8601).isValid()) {
      return "Chưa hoàn thành";
    }
    return moment(date, moment.ISO_8601).format("DD/MM/YYYY HH:mm a");
  },
  formatDate: (date: Date | undefined): string => {
    if (!date || !moment(date, moment.ISO_8601).isValid()) {
      return "Chưa hoàn thành";
    }
    return moment(date, moment.ISO_8601).format("DD/MM/YYYY");
  },
  formatTime: (date: Date | undefined): string => {
    if (!date || !moment(date, moment.ISO_8601).isValid()) {
      return "Chưa hoàn thành";
    }
    return moment(date, moment.ISO_8601).format("HH:mm A");
  },
  formatDateVietnamese: (date: Date | undefined): string => {
    if (!date) return "";
    const momentDate = moment(date, moment.ISO_8601);
    const day = momentDate.format("DD");
    const month = momentDate.format("MM");
    const year = momentDate.format("YYYY");
    return `Ký ngày ${day}, tháng ${month}, năm ${year}`;
  },
};

const ExportPDFDocument = ({ row }: { row: OrderProps | undefined }) => {
  // Calculate total amount
  const totalAmount = row?.productList.reduce(
    (sum, product) => sum + product.totalAmount,
    0
  );

  return (
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
                transform: "rotate(45)",
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
            }}
          >
            {" "}
            HỆ THỐNG BÁN VÀ BẢO TRÌ MÁY MÓC CƠ KHÍ{" "}
          </Text>
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
            <View
              style={{
                width: "100%",
                marginBottom: "20px",
                display: "flex",
                gap: "2px",
              }}
            >
              <View
                style={{
                  fontSize: "10px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
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
                }}
              >
                <Text style={{ marginRight: "10px" }}>•</Text>
                <Text style={{ minWidth: "100px" }}>Hotline:</Text>
                <Text style={{ minWidth: "100px" }}>
                  1800-6118 / 091-521-08-69
                </Text>
              </View>
              <View
                style={{
                  fontSize: "10px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ marginRight: "10px" }}>•</Text>
                <Text style={{ minWidth: "100px" }}>Email:</Text>
                <Text style={{ minWidth: "100px" }}>
                  ad.smmms.gsu24se44@gmail.com
                </Text>
              </View>
              <View
                style={{
                  fontSize: "10px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ marginRight: "10px" }}>•</Text>
                <Text style={{ minWidth: "100px" }}>Website:</Text>
                <Text style={{ minWidth: "100px" }}>
                  https://fe-smmms.vercel.app/
                </Text>
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
              marginBottom: "20px",
            }}
          >
            HÓA ĐƠN MUA HÀNG
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontSize: "18px",
                border: "1px solid #ddd",
                width: "100%",
                textAlign: "center",
                backgroundColor: "#ddd",
                marginBottom: "15px",
              }}
            >
              Thông tin khách hàng
            </Text>
            <View style={{ margin: "0 auto", lineHeight: 1.5 }}>
              <View
                style={{
                  fontSize: "14px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ marginRight: "10px" }}>•</Text>
                <Text style={{ minWidth: "120px" }}>Tên khách hàng: </Text>
                <Text style={{}}>{row?.userInfo.fullName || ""}</Text>
              </View>
              <View
                style={{
                  fontSize: "14px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ marginRight: "10px" }}>•</Text>
                <Text style={{ minWidth: "120px" }}>Địa chỉ: </Text>
                <Text style={{}}>{formatAddress(row?.address) || ""}</Text>
              </View>
              <View
                style={{
                  fontSize: "14px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ marginRight: "10px" }}>•</Text>
                <Text style={{ minWidth: "120px" }}>Mã hóa đơn: </Text>
                <Text style={{}}>{row?.invoiceCode || ""}</Text>
              </View>
              <View
                style={{
                  fontSize: "14px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ marginRight: "10px" }}>•</Text>
                <Text style={{ minWidth: "120px" }}>Ngày mua: </Text>
                <Text style={{}}>
                  {formatDateFunc.formatDate(row?.createDate) || ""}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              display: "flex",
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontSize: "20px",
                border: "1px solid #ddd",
                width: "100%",
                textAlign: "center",
                backgroundColor: "#ddd",
                marginBottom: "15px",
              }}
            >
              Thông tin đơn hàng
            </Text>
            <View
              style={{
                width: "100%",
                border: "1px solid #ddd",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    fontWeight: "bold",
                    textAlign: "center",
                    flex: "1",
                    fontSize: "14px",
                  }}
                >
                  Tên sản phẩm
                </Text>
                <Text
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    fontWeight: "bold",
                    textAlign: "center",
                    flex: "1",
                    fontSize: "14px",
                  }}
                >
                  Số lượng
                </Text>
                <Text
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    fontWeight: "bold",
                    textAlign: "center",
                    flex: "1",
                    fontSize: "14px",
                  }}
                >
                  Thành tiền
                </Text>
              </View>
              {row?.type === "Order" ? (
                <>
                  {row?.productList.map((product, index) => (
                    <View
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        fontSize: "14px",
                      }}
                      key={index}
                    >
                      <Text
                        style={{
                          border: "1px solid #ddd",
                          padding: "4px",
                          textAlign: "center",
                          flex: "1",
                        }}
                      >
                        {product.productName || ""}
                      </Text>
                      <Text
                        style={{
                          border: "1px solid #ddd",
                          padding: "4px",
                          textAlign: "center",
                          flex: "1",
                        }}
                      >
                        {product.quantity || ""}
                      </Text>
                      <Text
                        style={{
                          border: "1px solid #ddd",
                          padding: "4px",
                          textAlign: "center",
                          flex: "1",
                        }}
                      >
                        {formatMoney(product.totalAmount) || ""}
                      </Text>
                    </View>
                  ))}
                </>
              ) : (
                <>
                  {row?.productList.map((product, index) => (
                    <View
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        fontSize: "14px",
                      }}
                      key={index}
                    >
                      <Text
                        style={{
                          border: "1px solid #ddd",
                          padding: "4px",
                          textAlign: "center",
                          flex: "1",
                        }}
                      >
                        {product.machineComponentName || ""}
                      </Text>
                      <Text
                        style={{
                          border: "1px solid #ddd",
                          padding: "4px",
                          textAlign: "center",
                          flex: "1",
                        }}
                      >
                        {product.quantity || ""}
                      </Text>
                      <Text
                        style={{
                          border: "1px solid #ddd",
                          padding: "4px",
                          textAlign: "center",
                          flex: "1",
                        }}
                      >
                        {formatMoney(product.totalAmount) || ""}
                      </Text>
                    </View>
                  ))}
                </>
              )}
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  fontSize: "14px",
                }}
              >
                <Text
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                    flex: "1",
                  }}
                >
                  Tổng tiền
                </Text>
                <Text
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                    flex: "1",
                  }}
                >
                  {formatMoney(totalAmount) || ""}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: 50,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: "45%",
              textAlign: "center",
            }}
          >
            <Text style={{ fontSize: "14px" }}>
              {formatDateFunc.formatDateVietnamese(row?.createDate) || ""}
            </Text>
            <Text
              style={{
                margin: "15px 0",
                fontSize: "14px",
              }}
            >
              Đại diện khách hàng ký tên
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "extrabold",
                borderBottom: "1px solid #000",
                minHeight: "50px",
              }}
            >
              {row?.userInfo.fullName || ""}
            </Text>
          </View>
          <View
            style={{
              width: "45%",
              textAlign: "center",
            }}
          >
            <Text style={{ fontSize: "14px" }}>
              {formatDateFunc.formatDateVietnamese(row?.createDate) || ""}
            </Text>
            <Text style={{ margin: "15px 0", fontSize: "14px" }}>
              Đại diện công ty kí tên
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "extrabold",
                borderBottom: "1px solid #000",
                minHeight: "50px",
              }}
            >
              SMMMS
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const ExportPDF = ({ row }: { row: OrderProps | undefined }) => {
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

  return <div onClick={handleOpenPdf}>Xuất hóa đơn</div>;
};

export default ExportPDF;
