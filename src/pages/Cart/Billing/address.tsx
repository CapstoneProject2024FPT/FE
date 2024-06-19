export interface addressUser {
  receiver: string;
  fullAddress: string;
  addressType: string;
  phone: string;
  isDefault: boolean;
}

export const addresses: addressUser[] = [
  {
    receiver: "Hồ Minh Dũng",
    fullAddress: "186 Quận 1 Hồ Chí Minh",
    addressType: "Home",
    phone: "0963697057",
    isDefault: false,
  },
  {
    receiver: "Hồ Minh Dũng",
    fullAddress: "186 Quận 1 Hồ Chí Minh",
    addressType: "Home",
    phone: "0963697057",
    isDefault: true,
  },
];
