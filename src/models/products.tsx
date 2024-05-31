export interface Product {
  id: string;
  image: string;
  price: number;
  salePrice: number;
  name: string;
}

export type ProductProps = Product[];
