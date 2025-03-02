import { TagDocument } from "@/models/Tag";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  SharedSelection,
} from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";
import {
  IoIosAdd,
  IoIosArrowDown,
  IoIosCheckmark,
  IoIosClose,
} from "react-icons/io";

type ItemDropDownProps = {
  availableItems: TagDocument[];
  selectedItems: string[];
  onSelectionChange: (newSelected: string[]) => void;
};

const ItemDropDown = ({
  availableItems,
  selectedItems,
  onSelectionChange,
}: ItemDropDownProps) => {
  const [selectedKeys, setSelectedKeys] = useState<SharedSelection>(
    new Set(selectedItems)
  );
  const [displayInput, setDisplayInput] = useState<Boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [dropDownOpen, setDropDownOpen] = useState<Boolean>(false);

  const unionItems = useMemo(() => {
    const itemMap = new Map<string, string>();

    availableItems.forEach((availItem: TagDocument) => {
      itemMap.set(availItem.label.toLowerCase(), availItem.label.toLowerCase());
    });

    selectedItems.forEach((selItem: string) => {
      if (!itemMap.has(selItem.toLowerCase())) {
        itemMap.set(selItem.toLowerCase(), selItem.toLowerCase());
      }
    });

    return Array.from(itemMap.values());
  }, [availableItems, selectedItems]);

  const handleOnPress = () => {
    // Convert the current selection to an array of strings.
    const currentSelection = Array.from(selectedKeys as unknown as Set<string>);
    const trimmed = inputValue.trim();
    if (trimmed !== "" && !currentSelection.includes(trimmed)) {
      const newSelection = [...currentSelection, trimmed];
      setSelectedKeys(new Set(newSelection) as SharedSelection);
      onSelectionChange(newSelection);
    }
    closeInput();
  };

  const closeInput = () => {
    setDisplayInput(false);
    setInputValue("");
  };

  return (
    <ButtonGroup>
      <Button
        disabled
        disableAnimation
        isIconOnly
        className="pointer-events-none"
      >
        {selectedItems.length}
      </Button>
      {displayInput ? (
        <>
          <Input
            type="text"
            radius="none"
            maxLength={60}
            fullWidth
            placeholder="Type Here"
            className=" w-[123.83px]"
            onValueChange={(value) => setInputValue(value)}
          ></Input>
          <Button
            isIconOnly
            className="text-2xl text-red-500"
            onPress={closeInput}
          >
            <IoIosClose />
          </Button>
          {inputValue && (
            <Button
              isIconOnly
              className="text-3xl text-green-500"
              onPress={handleOnPress}
            >
              <IoIosCheckmark />
            </Button>
          )}
        </>
      ) : (
        <>
          <Dropdown
            onOpenChange={(isOpen) => {
              setDropDownOpen(isOpen);
            }}
          >
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
              onSelectionChange={(keys) => {
                const newSelected = Array.from(keys) as string[];
                setSelectedKeys(new Set(newSelected));
                onSelectionChange(newSelected);
              }}
            >
              {unionItems.map((item) => (
                <DropdownItem key={item}>{item}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          {dropDownOpen ? (
            <Button
              isIconOnly
              isDisabled
              disableAnimation
              className="text-lg pointer-events-none"
            >
              <IoIosAdd />
            </Button>
          ) : (
            <Button
              isIconOnly
              className="text-2xl text-green-500"
              onPress={() => setDisplayInput(!displayInput)}
            >
              <IoIosAdd />
            </Button>
          )}
        </>
      )}
    </ButtonGroup>
  );
};

export default ItemDropDown;
