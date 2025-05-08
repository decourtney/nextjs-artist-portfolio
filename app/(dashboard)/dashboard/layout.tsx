import React, { ReactNode } from "react";
import DashNav from "@/app/(dashboard)/dashboard/_components/DashNav";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background-100">
      <DashNav />
      <div className="container mx-auto px-4">{children}</div>
    </div>
  );
};

export default DashboardLayout;
