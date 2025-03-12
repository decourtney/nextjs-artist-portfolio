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
import ActiveLink from "./components/ActiveLink";
import { IoIosMenu } from "react-icons/io";
// import { charm } from "./fonts/fonts";
// import { BsInstagram } from "react-icons/bs";

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
      className="bg-background-200  md:bg-transparent font-medium"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      isBlurred={false}
      shouldHideOnScroll
      maxWidth="full"
    >
      <NavbarContent justify="start"></NavbarContent>

      <NavbarContent justify="center" className="hidden md:contents space-x-5">
        {/* <NavbarItem> */}
        {navLinks.map((navItem) => (
          <NavbarItem key={`navbar-${navItem.label}`}>
            <ActiveLink href={navItem.href!}>
              {({ isActive }) => (
                <div
                  className={`px-1 text-lg text-foreground-500 content-center hover:shadow-[inset_0_-4px_0_hsl(var(--heroui-primary-500))] pointer-events-auto ${
                    isActive
                      ? "shadow-[inset_0_-4px_0_hsl(var(--heroui-primary-500))]"
                      : ""
                  }`}
                >
                  {navItem.label}
                </div>
              )}
            </ActiveLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="">
        <NavbarItem className="text-foreground-500">
          <SocialMediaButtons />
        </NavbarItem>

        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:invisible text-foreground-400"
        />
      </NavbarContent>

      <NavbarMenu className="font-bold pt-10 items-center space-y-6 bg-background-100 bg-gradient-to-b from-background-200 to-transparent">
        {navLinks.map((navItem) => (
          <NavbarMenuItem key={`navbar-${navItem.label}`} onClick={handleClose}>
            <ActiveLink href={navItem.href!}>
              {({ isActive }) => (
                <div
                  className={`px-1 text-3xl text-foreground-500 content-center hover:shadow-[inset_0_-4px_0_hsl(var(--heroui-primary-500))] pointer-events-auto ${
                    isActive
                      ? "shadow-[inset_0_-4px_0_hsl(var(--heroui-primary-500))]"
                      : ""
                  }`}
                >
                  {navItem.label}
                </div>
              )}
            </ActiveLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavBar;
