export interface Product {
  id: string;
  image: string;
  price: number;
  salePrice: number;
  name: string;
}

export type ProductProps = Product[];

export interface ProductAdmin {
  id: string;
  name: string;
  origin: string;
  model: string;
  description: string;
  status: string;
  image: ProductAdminImage[];
  specifications: Specification[];
  quantity: null;
  serialNumber: string;
  sellingPrice: number;
  priority: null;
  brand: string;
  timeWarranty: number;
  category: ProductAdminCategory;
  createDate: null;
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
