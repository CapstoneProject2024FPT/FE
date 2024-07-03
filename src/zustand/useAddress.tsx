import { create } from "zustand";
import { addressUser } from "../pages/Cart/Billing/address";

interface addressChoice {
  address: addressUser | null;
  setSelectedAddress: (address: addressUser) => void;
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
