"use client";

import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import React from "react";

const SocialMediaButtons = () => {
  return (
    <div className="flex gap-4">
      <Link
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-medium hover:bg-background-200 transition-colors"
      >
        <FaInstagram className="text-foreground-500 hover:text-primary-500 transition-colors" />
      </Link>
      <Link
        href="https://twitter.com"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-medium hover:bg-background-200 transition-colors"
      >
        <FaTwitter className="text-foreground-500 hover:text-primary-500 transition-colors" />
      </Link>
      <Link
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-medium hover:bg-background-200 transition-colors"
      >
        <FaFacebook className="text-foreground-500 hover:text-primary-500 transition-colors" />
      </Link>
    </div>
  );
};

export default SocialMediaButtons;
