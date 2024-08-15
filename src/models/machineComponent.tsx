export interface machineComponentProps {
  name: string;
  description: string;
  stockPrice: number;
  sellingPrice: number;
  timeWarranty: number;
  categoryId: string;
  brandId: string;
  originId: string;
}

export interface GetMachineComponents {
  id: string;
  name: string;
  description: string;
  createDate: Date;
  status: string;
  stockPrice: number;
  sellingPrice: number;
  timeWarranty: number;
  quantity: number;
  origin: {
    id: string;
    name: string;
    description: string;
  };
  brand: {
    id: string;
    name: string;
    description: string;
  };
  category: {
    id: string;
    name: string;
    type: string;
  };
  image: [];
}

export interface UpdateProductComponent {
  name: string;
  originId: string;
  description: string;
  sellingPrice: number;
  brandId: string;
  timeWarranty: number;
  status: string;
  categoryId: string;
}

export interface ComponentMachine {
  id: string;
  name: string;
  description: string;
  status: string;
  stockPrice: number;
  sellingPrice: number;
}
