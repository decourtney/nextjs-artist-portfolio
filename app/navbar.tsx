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
// import { charm } from "./fonts/fonts";
// import { BsInstagram } from "react-icons/bs";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "GALLERY", href: "/gallery" },
  { label: "CONTACT", href: "#contact" },
];

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
      // height="96px"
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
        {/* <NavbarItem> */}
        {navLinks.map((navItem) => (
          <NavbarItem key={`navbar-${navItem.label}`}>
            <ActiveLink href={navItem.href!}>
              {({ isActive }) => (
                <div
                  className={`px-1 font-bold text-2xl text-foreground-400 content-center hover:shadow-[inset_0_-4px_0_hsl(var(--heroui-primary-500))] pointer-events-auto ${
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
        {/* <Link href="/">
            <p className="font-black text-2xl text-foreground-400">HOME</p>
          </Link> */}
        {/* </NavbarItem> */}
        {/* <NavbarItem>
          <Link href="/gallery">
            <p className="font-black text-2xl text-foreground-400">GALLERY</p>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#contact">
            <p className="font-black text-2xl text-foreground-400">CONTACT</p>
          </Link>
        </NavbarItem> */}
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

      <NavbarMenu className="bg-background-00 items-center">
        <NavbarMenuItem>
          <Link href="/" onPress={handleClose}>
            <p>GALLERY</p>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/gallery" onPress={handleClose}>
            <p>gallery</p>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="#about" onPress={handleClose}>
            <p>CONTACT</p>
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default NavBar;
