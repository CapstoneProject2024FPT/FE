// @mui
import { Container } from "@mui/material";
// routes
// hooks
// components

import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
// sections
import AddComponentOfMachineTable from "../../../sections/Product/AddComponentOfMachineTable";

//router
import config from "../../../configs";
import { useParams } from "react-router-dom";
import { useCallback, useState } from "react";

// ----------------------------------------------------------------------

export default function AddComponentOfMachine() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState<string>("");

  const handleSetName = useCallback((text: string) => {
    setName(text);
  }, []);

  if (!id) {
    return <div>Lỗi sai id sản phẩm</div>;
  }

  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Số seri sản phẩm"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Sản phẩm", href: config.adminRoutes.product },
          {
            name: name ? `Chi tiết sản phẩm ${name}` : "Chi tiết sản phẩm",
            href: config.adminRoutes.viewDetailProduct.replace(":id", id),
          },
          {
            name: "Bộ phận máy",
            href: config.adminRoutes.viewDetailMachineOfComponent.replace(
              ":id",
              id
            ),
          },
          {
            name: "Thêm bộ phận cho máy",
          },
        ]}
      />
      <AddComponentOfMachineTable handleSetName={handleSetName} />
    </Container>
  );
}
