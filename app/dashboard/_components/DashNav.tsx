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
    <Navbar>
      <NavbarContent justify="start"><NavbarItem>{session.data?.user.email}</NavbarItem></NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button onPress={() => signOut({ callbackUrl: "/" })}>
            Logout
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default DashNav;
