// import { Button, Link } from "@heroui/react";
import React from "react";
// import { BsInstagram, BsTwitter, BsFacebook, BsLinkedin } from "react-icons/bs";
import SocialMediaButtons from "./components/SocialMediaButtons";

const Footer = () => {
  return (
    <footer className="h-[150px]">
      <div className="container mx-auto flex flex-col items-center">
        {/* Social icons row */}
        <div className="flex space-x-4 mb-4 ">
          <SocialMediaButtons />
        </div>
        {/* Footer text */}
        <p className="text-foreground-900 text-2xl">
          © Gena Courtney. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
