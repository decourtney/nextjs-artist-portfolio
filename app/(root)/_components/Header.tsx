"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./Navbar";
import SectionSeparator from "./SectionSeparator";
import { useEffect } from "react";
import { usePreviousPathname } from "@/app/context/PreviousPathnameContext";

const Header = () => {
  const pathname = usePathname();
  // const previousRoute =
  //   typeof window !== "undefined"
  //     ? sessionStorage.getItem("previousRoute")
  //     : null;
  const isSmallHeader = pathname.startsWith("/gallery");
  const { previousPathname, setPreviousPathname } = usePreviousPathname();

  // Check if the previous route is "/gallery/* to determine if motions initial value needs to be set to the same value as the animate value
  // This is to prevent the header from animating when navigating gallery/pages and reversing the animation when navigating between /gallery and other pages"
  // const isInitialSame = previousRoute?.startsWith("/gallery");
  const isInitialSame = previousPathname?.startsWith("/gallery");

  useEffect(() => {
    if (pathname !== previousPathname) {
      // sessionStorage.setItem("previousRoute", pathname);
      setPreviousPathname(pathname);
    }
  }, [pathname]);

  const headerVariants = {
    large: {
      height: "350px",
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    small: {
      height: "64px",
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.header
      initial={isInitialSame ? "small" : "large"}
      variants={headerVariants}
      animate={isSmallHeader ? "small" : "large"}
      className="relative flex flex-col items-center justify-end"
    >
      <div className="max-w-4xl w-full px-4">
        <motion.div
          initial={isInitialSame ? { opacity: 0 } : { opacity: 1 }}
          animate={{
            opacity: isSmallHeader ? 0 : 1,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-[#1e293b] font-charm mb-6 text-center">
            BOLD NAME
          </h1>
          <div className="relative flex justify-center items-center mb-8">
            <p className="text-md bg-inherit text-[#64748b]">Artist</p>
          </div>
        </motion.div>

        <Navbar />

        <SectionSeparator />
      </div>
    </motion.header>
  );
};

export default Header;
