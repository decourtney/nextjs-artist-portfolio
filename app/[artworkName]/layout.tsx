import React from "react";
import Footer from "../footer";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-[calc(100dvh-112px)] h-[calc(100dvh-112px)]">
      {children}
      <div className="fixed bottom-0 w-full bg-background-300">
        <div className="absolute bottom-full left-0 w-full h-full pointer-events-none bg-gradient-to-t from-background-300 to-transparent" />
        <Footer />
      </div>
    </div>
  );
};

export default layout;
