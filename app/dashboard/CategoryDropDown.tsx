import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  SharedSelection,
} from "@heroui/react";
import React, { useMemo, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const CategoryDropDown = () => {
  const [selectedKeys, setSelectedKeys] = useState<SharedSelection>(
    new Set(["text"])
  );

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(",").replaceAll("_", " "),
    [selectedKeys]
  );

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button variant="bordered" className="text-foreground-100">
          Categories
          <span>
            <IoIosArrowDown />
          </span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        closeOnSelect={false}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <DropdownItem key="one">stuff</DropdownItem>
        <DropdownItem key="two">stuff</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default CategoryDropDown;
