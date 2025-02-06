"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

interface RefetchContextType {
  refetchFlag: boolean;
  setRefetchFlag: (flag: boolean) => void;
}

const RefetchContext = createContext<RefetchContextType | undefined>(undefined);

export const useRefetch = () => {
  const context = useContext(RefetchContext);
  if (!context) {
    throw new Error("useRefetch must be used within a RefetchProvider");
  }
  return context;
};

export const RefetchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [refetchFlag, setRefetchFlag] = useState<boolean>(false);

  const toggleRefetchFlag = useCallback((flag: boolean) => {
    setRefetchFlag(flag);
  }, []);

  return (
    <RefetchContext.Provider
      value={{ refetchFlag, setRefetchFlag: toggleRefetchFlag }}
    >
      {children}
    </RefetchContext.Provider>
  );
};
