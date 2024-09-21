import { Button, Link } from "@nextui-org/react";
import React from "react";
import { BsInstagram } from "react-icons/bs";
 
const Footer = () => {
  return (
    <footer className="w-full h-16 content-center text-center bg-secondary">
      <p>© 2024 Gena Courtney</p>
      <Button
        as={Link}
        href="https://www.instagram.com/genacourtney/"
        target="_blank"
        size="lg"
        isIconOnly
        radius="full"
        variant="light"
      >
        <BsInstagram size={20} />
      </Button>
    </footer>
  );
};

export default Footer;
