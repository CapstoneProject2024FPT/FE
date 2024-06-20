import { create } from "zustand";
import { addressUser } from "../pages/Cart/Billing/address";

interface addressChoice {
  address: addressUser | null;
  selectedAddress: (address: addressUser) => void;
}

export const useAddress = create<addressChoice>((set) => ({
  address: null,
  selectedAddress: (address) => set({ address }),
}));
