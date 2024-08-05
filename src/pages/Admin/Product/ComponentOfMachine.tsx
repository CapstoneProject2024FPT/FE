// @mui
import { Container } from "@mui/material";
// routes
// hooks
// components

import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
// sections
import TableComponentMachine from "../../../sections/Product/TableComponentMachine";

//router
import config from "../../../configs";
import { useParams } from "react-router-dom";
import { useCallback, useState } from "react";

// ----------------------------------------------------------------------

export default function ComponentOfMachine() {
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
        heading="Bộ phận máy"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Sản phẩm", href: config.adminRoutes.product },
          {
            name: name ? `Chi tiết sản phẩm ${name}` : "Chi tiết sản phẩm",
            href: config.adminRoutes.viewDetailProduct.replace(":id", id),
          },
          { name: "Bộ phận máy" },
        ]}
      />
      <TableComponentMachine handleSetName={handleSetName} />
    </Container>
  );
}
