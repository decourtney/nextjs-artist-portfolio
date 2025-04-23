"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import SectionSeparator from "./SectionSeparator";

const Header = () => {
  const pathname = usePathname();
  const isSmallHeader = pathname.startsWith("/gallery");

  const headerVariants = {
    large: {
      height: "350px",
    },
    small: {
      height: "64px",
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  console.log();
  return (
    <motion.header
      variants={headerVariants}
      animate={isSmallHeader ? "small" : "large"}
      className="relative flex flex-col items-center justify-end h-[350px]"
    >
      <motion.div className="max-w-4xl w-full px-4">
        <div>
          <h1 className="text-6xl md:text-8xl font-bold text-[#1e293b] font-charm mb-6 text-center">
            Gena Courtney
          </h1>
          <div className="relative flex justify-center items-center mb-8">
            <p className="text-md bg-inherit text-[#64748b]">Artist</p>
          </div>
        </div>

        <Navbar />

        <SectionSeparator />
      </motion.div>
    </motion.header>
  );
};

export default Header;
