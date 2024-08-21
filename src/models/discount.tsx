export interface DiscountProps {
  id: string;
  name: string;
  type: string;
  status: string;
  value: number;
  createDate: Date;
}

export interface DiscountAdd {
  name: string;
  type: string;
  value: number;
}

export enum DiscountType {
  Event = "Event",
  Promotional = "Promotional",
  Seasonal = "Seasonal",
}

export const typeMapping = [
  {
    id: DiscountType.Event,
    name: "Sự kiện",
  },
  {
    id: DiscountType.Promotional,
    name: "Giảm giá",
  },
  {
    id: DiscountType.Seasonal,
    name: "Mùa",
  },
];

export interface categoriesProps {
  id: string;
  name: string;
}

export interface DiscountDetailProps extends DiscountProps {
  categories: categoriesProps[];
}
