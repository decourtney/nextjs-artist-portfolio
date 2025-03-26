import React, { ReactNode } from "react";
import NavBar from "./_components/Navbar";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <NavBar />
      <main className="flex flex-col text-foreground-900">{children}</main>
    </>
  );
};

export default RootLayout;
