import { create } from "zustand";
import { userModel } from "../models/UserData";

interface checkout {
  total: number;
  setTotal: (total: number) => void;
  discountRank: number;
  setDiscountRank: (discountRank: number) => void;
  profile: userModel | null;
  setProfile: (profile: userModel | null) => void;
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
  profile: sessionStorage.getItem("profile")
    ? JSON.parse(sessionStorage.getItem("profile") as string)
    : null,
  setProfile: (profile: userModel | null) => {
    set({ profile });
    sessionStorage.setItem("profile", JSON.stringify(profile));
  },
}));
