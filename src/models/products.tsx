import { CategoryMachineDetail } from "./category";

type originProduct = {
  id: string;
  name: string;
};
export interface Product {
  id: string;
  image: [{ imageURL: string; createDate: string }];
  name: string;
  sellingPrice: number;
  model: string;
  origin: originProduct;
}

interface QuantityProps {
  Available: number;
  Sold: number;
  Discontinued: number;
}
export type ProductProps = Product[];

//productTable
export interface ProductAdmin {
  category: {
    id: string;
    name: string;
    type: string;
  };
  id: string;
  origin: originProduct;
  model: string;
  description: string;
  brand: {
    id: string;
    name: string;
  };
  name: string;
  priority: number;
  quantity: QuantityProps;
  sellingPrice: number;
  serialNumber: number;
  createDate: Date;
  image: [{ imageURL: string; createDate: string }];
  status: string;
}

export interface ProductAdminCategory {
  id: string;
  name: string;
  type: string;
}

export interface ProductAdminImage {
  imageURL: string;
  createDate: Date;
}

export interface ProductAdminSpecification {
  specificationId: string;
  machineryId: string;
  name: string;
  value: string;
}

//add product
export interface CreateProductFormSchema {
  specificationList: Specification[] | undefined;
  name: string;
  originId: string;
  model: string;
  description: string;
  imageURL: (string | undefined)[] | undefined;
  stockPrice: number;
  sellingPrice: number;
  categoryId: string;
  brandId: string;
  timeWarranty: number;
}

export interface CreateProductFormADDSchema {
  specificationList: Specification[] | undefined;
  name: string;
  originId: string;
  model: string;
  description: string;
  image: { imageURL: string | undefined }[] | undefined;
  stockPrice: number;
  sellingPrice: number;
  categoryId: string;
  brandId: string;
  timeWarranty: number;
}

export type Specification = {
  name: string;
  value: string;
};

//ProductDetail
export interface specificationDetail {
  specificationId: string;
  machineryId: string;
  name: string;
  value: string;
}

export type ProductDetailProps = {
  specifications: [specificationDetail];
  image: [{ imageURL: string; createDate: string }];
  category: CategoryMachineDetail;
  quantity?: QuantityProps;
  sellingPrice: number;
  id: string;
  name: string;
  origin: originProduct;
  model: string;
  description: string;
  brand: {
    id: string;
    name: string;
  };
  timeWarranty: number;
  serialNumber: number;
  status: string;
};

//update product
export interface UpdateProduct {
  name: string;
  originId: string;
  model: string;
  description: string;
  sellingPrice: number;
  brandId: string;
  timeWarranty: number;
  categoryId: string | undefined;
  status: string;
}

//enum

export enum TypeProduct {
  Material = "Material",
  Machinery = "Machinery",
}
