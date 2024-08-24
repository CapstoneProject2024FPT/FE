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
    console.log("Setting total rank:", total);
    set({ total });
    sessionStorage.setItem("checkoutTotal", total.toString());
  },
  discountRank:
    Number(sessionStorage.getItem("checkoutTotalDiscountRank")) || 0,
  setDiscountRank: (discountRank) => {
    console.log("Setting discount rank:", discountRank); // Debugging line
    set({ discountRank });
    sessionStorage.setItem(
      "checkoutTotalDiscountRank",
      discountRank.toString()
    );
  },
}));
