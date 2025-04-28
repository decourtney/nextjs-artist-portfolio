import { createContext, useContext, useState, ReactNode } from "react";

type PreviousPathnameContextType = {
  previousPathname: string;
  setPreviousPathname: (val: string) => void;
};

const PreviousPathnameContext = createContext<
  PreviousPathnameContextType | undefined
>(undefined);

export const PreviousPathnameProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [previousPathname, setPreviousPathname] = useState("");

  return (
    <PreviousPathnameContext.Provider
      value={{ previousPathname, setPreviousPathname }}
    >
      {children}
    </PreviousPathnameContext.Provider>
  );
};

export const usePreviousPathname = () => {
  const context = useContext(PreviousPathnameContext);
  if (!context) {
    throw new Error(
      "usePreviousPathname must be used within a PreviousPathnameProvider"
    );
  }
  return context;
};
