export interface Product {
  id: string;
  image: string;
  price: number;
  salePrice: number;
  name: string;
}

export type ProductProps = Product[];

export interface ProductAdmin {
  categoryId: string;
  description: string;
  id: string;
  model: string;
  name: string;
  origin: string;
  priority: number;
  quantity: number;
  sellingPrice: number;
  serialNumber: number;
  image: [{ imageURL: string; createDate: string }];
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
  controlSystem: string;
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
  controlSystem: string;
}

export type Specification = {
  name: string;
  value: number;
  unit: string;
};
