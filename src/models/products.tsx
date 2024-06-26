import { CategoryMachineDetail } from "./category";

export interface Product {
  id: string;
  image: [{ imageURL: string; createDate: string }];
  name: string;
  sellingPrice: number;
  model: string;
  origin: string;
}

export type ProductProps = Product[];

//productTable
export interface ProductAdmin {
  category: {
    id: string;
    name: string;
    type: string;
  };
  description: string;
  id: string;
  model: string;
  name: string;
  origin: string;
  priority: number;
  quantity: number;
  sellingPrice: number;
  serialNumber: number;
  createDate: Date;
  image: [{ imageURL: string; createDate: string }];
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
  origin: string;
  model: string;
  description: string;
  imageURL: (string | undefined)[] | undefined;
  stockPrice: number;
  sellingPrice: number;
  categoryId: string;
  brand: string;
  timeWarranty: number;
}

export interface CreateProductFormADDSchema {
  specificationList: Specification[] | undefined;
  name: string;
  origin: string;
  model: string;
  description: string;
  image: { imageURL: string | undefined }[] | undefined;
  stockPrice: number;
  sellingPrice: number;
  categoryId: string;
  brand: string;
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
  quantity?: number;
  sellingPrice: number;
  id: string;
  name: string;
  origin: string;
  model: string;
  description: string;
  brand: string;
  timeWarranty: number;
  serialNumber: number;
};

//update product
export interface UpdateProduct {
  name: string;
  origin: string;
  model: string;
  description: string;
  sellingPrice: number;
  brand: string;
  timeWarranty: number;
  categoryId: string | undefined;
}
