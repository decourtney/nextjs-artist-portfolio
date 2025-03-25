import React, { ReactNode } from "react";
import DashNav from "./_components/DashNav";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <DashNav />
      {children}
    </div>
  );
};

export default DashboardLayout;
