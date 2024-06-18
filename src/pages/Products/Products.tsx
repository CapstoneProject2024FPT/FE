import React from "react";
import TopBar from "../../layouts/CustomerLayout/Header/TopBar/TopBar";
import ProductList from "./ProductList/ProductList";
import Footer from "../../layouts/CustomerLayout/Footer/Footer";
const Products: React.FC = () => {
  return (
    <>
      <TopBar />
      <ProductList />
      <Footer />
    </>
  );
};

export default Products;