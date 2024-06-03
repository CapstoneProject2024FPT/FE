export interface Product {
  id: string;
  image: string;
  price: number;
  salePrice: number;
  name: string;
}

export type ProductProps = Product[];

export interface CreateProductFormSchema {
  specification: Specification[];
  productName: string;
  origin: string;
  model: string;
  brand: string;
  description: string;
  images: string[];
  timeWarranty: number;
  serialNumber: string;
  regularPrice: number;
  salePrice: number;
  category: string;
}

export type Specification = {
  nameSpecification: string;
  valueOfEach: string;
  unit: string;
};
