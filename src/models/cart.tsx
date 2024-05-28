interface CartItem {
  id: string;
  name: string;
  price: number;
  description: string;
  brandName: string;
  automatic: boolean;
  image: string;
}

export type cartProps = CartItem[];
