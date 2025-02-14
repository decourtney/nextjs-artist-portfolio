import { Button, Link } from "@heroui/react";
import React from "react";
import { BsInstagram, BsTwitter, BsFacebook, BsLinkedin } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="p-6 ">
      <div className="container mx-auto flex flex-col items-center">
        {/* Social icons row */}
        <div className="flex space-x-4 mb-4 ">
          <Button
            as={Link}
            href="https://www.instagram.com/genacourtney/"
            target="_blank"
            size="lg"
            isIconOnly
            radius="full"
            variant="light"
            className="text-primary"
          >
            <BsInstagram size={20} />
          </Button>
          <Button
            as={Link}
            href="https://twitter.com/yourusername"
            target="_blank"
            size="lg"
            isIconOnly
            radius="full"
            variant="light"
            className="text-primary"
          >
            <BsTwitter size={20} />
          </Button>
          <Button
            as={Link}
            href="https://facebook.com/yourusername"
            target="_blank"
            size="lg"
            isIconOnly
            radius="full"
            variant="light"
            className="text-primary"
          >
            <BsFacebook size={20} />
          </Button>
          <Button
            as={Link}
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            size="lg"
            isIconOnly
            radius="full"
            variant="light"
            className="text-primary"
          >
            <BsLinkedin size={20} />
          </Button>
        </div>
        {/* Footer text */}
        <p className="text-primary text-sm">
          © Gena Courtney. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
