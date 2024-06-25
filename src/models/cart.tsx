import { CategoryMachineDetail } from "./category";
import { specificationDetail } from "./products";

export interface CartItem {
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
  currentQuantities: number;
}

export type cartProps = CartItem[];
