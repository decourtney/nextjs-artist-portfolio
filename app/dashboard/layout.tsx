import React, { ReactNode } from "react";
import DashNav from "./_components/DashNav";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background-100">
      <DashNav />
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
};

export default DashboardLayout;
