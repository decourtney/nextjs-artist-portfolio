// import { Button, Link } from "@heroui/react";
import React from "react";
// import { BsInstagram, BsTwitter, BsFacebook, BsLinkedin } from "react-icons/bs";
import SocialMediaButtons from "./components/SocialMediaButtons";

const Footer = () => {
  return (
    <footer className="flex justify-center items-center w-full bg-background-200">
      <div className="mx-auto flex flex-col items-center p-4">
        {/* Social icons row */}
        {/* <div className="flex space-x-4 text-foreground-100">
          <SocialMediaButtons />
        </div> */}
        {/* Footer text */}
        <p className="text-foreground-100 text-tiny">
          © Gena Courtney. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
