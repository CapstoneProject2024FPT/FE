/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useContext } from "react";

interface FilterContext {
  data: any;
  setData: (newData: any) => void;
}

const FilterContext = createContext<FilterContext | null>(null);

export const FitlerProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState();

  return (
    <FilterContext.Provider value={{ data, setData }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterContext must be used within a MyDataProvider");
  }
  return context;
};
