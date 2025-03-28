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
import SocialMediaButtons from "./SocialMediaButtons";
import ActiveLink from "./ActiveLink";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "GALLERY", href: "/gallery" },
  { label: "ABOUT", href: "/#about" },
  { label: "CONTACT", href: "/#contact" },
];

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClose = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Navbar
      className="bg-background-200 md:bg-transparent font-medium pointer-events-none"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      isBlurred={false}
      maxWidth="full"
    >
      <NavbarContent justify="start"></NavbarContent>

      <NavbarContent justify="center" className="hidden md:contents space-x-5">
        {navLinks.map((navItem) => (
          <NavbarItem key={`navbar-${navItem.label}`}>
            <ActiveLink href={navItem.href}>{navItem.label}</ActiveLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="">
        <NavbarItem className="text-foreground-500">
          <SocialMediaButtons />
        </NavbarItem>

        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden text-foreground-400"
        />
      </NavbarContent>

      <NavbarMenu className="font-bold pt-10 items-center space-y-6 bg-background-100 bg-gradient-to-b from-background-200 to-transparent">
        {navLinks.map((navItem) => (
          <NavbarMenuItem key={`navbarmenu-${navItem.label}`}>
            <ActiveLink href={navItem.href!} onClick={handleClose}>
              {navItem.label}
            </ActiveLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavBar;
