import React, { ReactNode } from "react";
import DashNav from "./_components/DashNav";
import { Slide, ToastContainer } from "react-toastify";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background-100">
      <DashNav />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      <div className="container mx-auto px-4">{children}</div>
    </div>
  );
};

export default DashboardLayout;
