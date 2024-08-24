import { create } from "zustand";
import { addressProps } from "../models/address";

interface addressChoice {
  address: addressProps | null;
  setSelectedAddress: (address: addressProps | null) => void;
}

export const useAddress = create<addressChoice>((set) => {
  // Retrieve the address from sessionStorage
  const storedAddress = sessionStorage.getItem("address");
  // Parse the address if it's not null
  const initialAddress = storedAddress ? JSON.parse(storedAddress) : null;

  return {
    address: initialAddress,
    setSelectedAddress: (address) => {
      set({ address });
      sessionStorage.setItem("address", JSON.stringify(address));
    },
  };
});
