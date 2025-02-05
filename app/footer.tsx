import { Button, Link } from "@heroui/react";
import React from "react";
import { BsInstagram } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className=" bg-secondary">
      <div className="  ">
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
      </div>
    </footer>
  );
};

export default Footer;
