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
  return (
    <Navbar>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button onPress={() => signOut({ callbackUrl: "/dashboard" })}>
            Logout
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default DashNav;
