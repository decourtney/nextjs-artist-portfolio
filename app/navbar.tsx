"use client";

import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { useState } from "react";
// import { BsInstagram } from "react-icons/bs";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClose = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Navbar
      className="bg-background-100"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      isBlurred={false}
      maxWidth="xl"
      height="5rem"
    >
      <NavbarContent justify="center">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden "
        />
      </NavbarContent>

      <NavbarContent justify="center">
        <NavbarBrand>
          <p className="font-serif font-bold text-2xl">
            Gena Courtney
          </p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <Link href="/">
          <p>home</p>
        </Link>
        <Link href="/gallery">
          <p>gallery</p>
        </Link>
        <Link href="/about">
          <p>about</p>
        </Link>
        <Link href="/contact">
          <p>contact</p>
        </Link>

        {/* <NavbarItem>
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
        </NavbarItem> */}
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Link href="/" onPress={handleClose}>
            <p>home</p>
          </Link>
          <Link href="/gallery" onPress={handleClose}>
            <p>gallery</p>
          </Link>
          <Link href="/about" onPress={handleClose}>
            <p>about</p>
          </Link>
          <Link href="/contact" onPress={handleClose}>
            <p>contact</p>
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default NavBar;
