import { CategoryMachineDetail } from "./category";
import { ComponentMachine } from "./machineComponent";

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

export interface GetProductProps {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: ProductAdmin[];
}

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
  component: ComponentMachine[];
  monthWarrantyNumber: number;
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
export type SpecificationList = {
  name: string;
  value: string;
  unit: string;
};
export interface CreateProductFormSchema {
  specificationList: SpecificationList[] | undefined;
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
  monthWarrantyNumber: number;
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
  monthWarrantyNumber: number;
  machineComponentsId: string[];
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
  monthWarrantyNumber: number;
  component: ComponentDetail[];
};

interface ComponentDetail {
  id: string;
  name: string;
  description: string;
  status: string;
  stockPrice: number;
  sellingPrice: number;
}
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
  monthWarrantyNumber: number;
}

//enum

export enum TypeProduct {
  Material = "Material",
  Machinery = "Machinery",
}
