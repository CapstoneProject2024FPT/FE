import { create } from "zustand";

interface checkout {
  total: number;
  setTotal: (total: number) => void;
}

export const useCheckout = create<checkout>((set) => ({
  total: Number(sessionStorage.getItem("checkoutTotal")) || 0,
  setTotal: (total) => {
    set({ total });
    sessionStorage.setItem("checkoutTotal", total.toString());
  },
}));
