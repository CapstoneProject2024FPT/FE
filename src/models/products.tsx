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
  timeWarranty: number | null;
  serialNumber: string;
  regularPrice: number | null;
  salePrice: number | null;
  category: string;
}

export type Specification = {
  nameSpecification: string;
  valueOfEach: number | null;
  unit: string;
};
