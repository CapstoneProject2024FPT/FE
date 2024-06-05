import React, { ReactNode } from "react";
import "./GlobalStyles.scss";
import { ConfigProvider } from "antd";

type GlobalStyledProps = {
  children: ReactNode;
};
const GlobalStyled: React.FC<GlobalStyledProps> = ({ children }) => {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Lora",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </>
  );
};

export default GlobalStyled;
