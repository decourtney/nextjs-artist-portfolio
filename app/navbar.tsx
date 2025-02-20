"use client";

import {
  Image,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { useState } from "react";
import SocialMediaButtons from "./components/SocialMediaButtons";
// import { BsInstagram } from "react-icons/bs";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClose = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Navbar
      className="bg-background-300 text-primary"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      isBlurred={false}
      shouldHideOnScroll
      maxWidth="full"
      height="32px"
    >
      <NavbarContent justify="start" className="md:hidden">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent justify="start" className="hidden md:contents">
        <NavbarItem>
          <Link href="/">
            <p>Home</p>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/gallery">
            <p>Work</p>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/about">
            <p>About</p>
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* <NavbarContent justify="center" className="md:hidden">
        <NavbarBrand>
          <Image src={"images/logo.png"} className="max-h-[64px]" />
        </NavbarBrand>
      </NavbarContent> */}

      <NavbarContent justify="end">
        <NavbarItem className="hidden md:contents ">
          <SocialMediaButtons />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-background-100 items-center">
        <NavbarMenuItem>
          <Link href="/" onPress={handleClose}>
            <p>Work</p>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/gallery" onPress={handleClose}>
            <p>gallery</p>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/about" onPress={handleClose}>
            <p>About</p>
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default NavBar;
