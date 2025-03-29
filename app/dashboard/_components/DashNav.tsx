"use client";

import React from "react";
import {
  Button,
  Link,
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { signIn, signOut, useSession } from "next-auth/react";

const DashNav = () => {
  const session = useSession();
  console.log(session);
  return (
    <Navbar className="bg-background-200 border-b border-divider-200">
      <NavbarContent justify="start">
        <NavbarItem className="text-foreground-500">
          {session.data?.user.email}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="center" className="hidden md:flex gap-4">
        <NavbarItem>
          <Link href="/" className="text-foreground-500 hover:text-primary-500">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/gallery"
            className="text-foreground-500 hover:text-primary-500"
          >
            Gallery
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            onPress={() => signOut({ callbackUrl: "/" })}
            color="primary"
            variant="flat"
          >
            Logout
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default DashNav;
