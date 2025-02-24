"use client";

import {
  Link,
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { useState } from "react";
import SocialMediaButtons from "./components/SocialMediaButtons";
import { charm } from "./fonts/fonts";
// import { BsInstagram } from "react-icons/bs";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClose = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Navbar
      className={`bg-transparent p-1 `}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      isBlurred={false}
      shouldHideOnScroll
      maxWidth="full"
      height="96px"
    >
      <NavbarContent
        justify="start"
        className="md:invisible text-foreground-900"
      >
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent justify="center" className="hidden md:contents space-x-10">
        <NavbarItem>
          <Link href="/">
            <p className="text-6xl text-foreground-900">Home</p>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/gallery">
            <p className="text-6xl text-foreground-900">Work</p>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#contact">
            <p className="text-6xl text-foreground-900">Contact</p>
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* <NavbarContent justify="center" className="md:hidden">
        <NavbarBrand>
          <Image src={"images/logo.png"} className="max-h-[64px]" />
        </NavbarBrand>
      </NavbarContent> */}

      <NavbarContent justify="end">
        <NavbarItem className="hidden md:contents">
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
          <Link href="#about" onPress={handleClose}>
            <p>Contact</p>
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default NavBar;
