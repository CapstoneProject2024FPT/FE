// @mui
import { Container } from "@mui/material";
// routes
// hooks
// components
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
// sections
import TableSerialComponent from "../../../sections/MachineComponent/TableSerialComponent";
//router
import config from "../../../configs";
import { useParams } from "react-router-dom";
import { useCallback, useState } from "react";

// ----------------------------------------------------------------------

export default function SerialNumberComponent() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState<string>("");

  const handleSetName = useCallback((text: string) => {
    setName(text);
  }, []);

  if (!id) {
    return <div>Lỗi sai id sản phẩm</div>;
  }

  return (
    <Container style={{ width: "100%", maxWidth: "none" }}>
      <HeaderBreadcrumbs
        heading="Số seri bộ phận máy"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Sản phẩm", href: config.adminRoutes.viewMachineComponent },
          {
            name: name ? `Chi tiết sản phẩm ${name}` : "Chi tiết sản phẩm",
            href: config.adminRoutes.viewDetailMachineComponent.replace(
              ":id",
              id
            ),
          },
          { name: "Số lượng bộ phận máy" },
        ]}
      />
      <TableSerialComponent handleSetName={handleSetName} />
    </Container>
  );
}
