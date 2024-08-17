import { create } from "zustand";

interface checkout {
  total: number;
  setTotal: (total: number) => void;
  discountRank: number;
  setDiscountRank: (discountRank: number) => void;
}

export const useCheckout = create<checkout>((set) => ({
  total: Number(sessionStorage.getItem("checkoutTotal")) || 0,
  setTotal: (total) => {
    set({ total });
    sessionStorage.setItem("checkoutTotal", total.toString());
  },
  discountRank:
    Number(sessionStorage.getItem("checkoutTotalDiscountRank")) || 0,
  setDiscountRank: (discountRank) => {
    set({ discountRank });
    sessionStorage.setItem(
      "checkoutTotalDiscountRank",
      discountRank.toString()
    );
  },
}));
