import Link from "next/link";
import React from "react";

const GetInTouchSection = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-[#1e293b] font-charm">
          Get in Touch
        </h2>
        <p className="text-[#475569] mb-8 max-w-2xl mx-auto">
          Interested in commissioning a piece or learning more about my work?
          I'd love to hear from you.
        </p>
        <Link
          href="/contact"
          className="group relative inline-block px-8 py-4 text-lg font-medium text-[#1e293b] hover:text-white transition-colors duration-300"
        >
          <span className="relative z-10">Contact Me</span>
          <span className="absolute inset-0 w-full h-full bg-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="absolute inset-0 w-full h-full border-2 border-[#1e293b] group-hover:border-[#3b82f6] transition-colors duration-300" />
        </Link>
      </div>
    </section>
  );
};

export default GetInTouchSection;
