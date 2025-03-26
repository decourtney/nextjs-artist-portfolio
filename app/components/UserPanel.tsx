"use client";

import {
  NavbarContent,
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
  Button,
  DropdownSection,
} from "@heroui/react";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { TiUpload } from "react-icons/ti";
import { FaHouseUser, FaGamepad } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { signOut, useSession } from "next-auth/react";

const UserPanel = () => {
  const { data: session } = useSession();

  return (
    <NavbarContent justify="end">
      <div className="flex items-center gap-4 group">
        <Avatar
          isBordered
          radius="full"
          as="button"
          color="success" // TODO: change color relative to loggedin/out
          name="username" // TODO: replace with user info
          className="h-auto"
          size="md"
          src={session!.user.image || "https://i.pravatar.cc/300"}
        />
        <div className="group-hover:underline">{session!.user.username}</div>
      </div>

      <Dropdown
        placement="bottom-end"
        className="py-2 px-2 rounded-lg bg-primary"
      >
        <DropdownTrigger>
          <Button isIconOnly color="default" variant="light">
            <div className="text-xl">
              <IoIosArrowDown />
            </div>
          </Button>
        </DropdownTrigger>

        <DropdownMenu aria-label="Profile Actions" variant="flat">       
          <DropdownSection title="Explore" showDivider>
            <DropdownItem key="my_library" endContent={<FaGamepad />}>
              My Library
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Create" showDivider>
            <DropdownItem key="upload_game" endContent={<TiUpload />}>
              Upload Game
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Account" showDivider>
            <DropdownItem key="view_profile" endContent={<FaHouseUser />}>
              View Profile
            </DropdownItem>
            <DropdownItem
              key="logout"
              endContent={<BiLogOut />}
              onPress={() => signOut({ callbackUrl: "/" })}
            >
              Log Out
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </NavbarContent>
  );
};

export default UserPanel;
