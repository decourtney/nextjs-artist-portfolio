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
import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  IoIosAdd,
  IoIosArrowDown,
  IoIosCheckmark,
  IoIosClose,
} from "react-icons/io";

type SizeDropDownProps = {
  availableItems: TagDocument[];
  selectedItem: string | null;
  onSelectionChange: (newSelected: string) => void;
};

const SizeDropDown = ({
  availableItems,
  selectedItem,
  onSelectionChange,
}: SizeDropDownProps) => {
  const normalizedSelectedItem = selectedItem || "";
  const [selectedKeys, setSelectedKeys] = useState<SharedSelection>(
    new Set([normalizedSelectedItem])
  );
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedKeys(new Set([normalizedSelectedItem]));
  }, [normalizedSelectedItem]);

  const unionItems = useMemo(() => {
    const itemMap = new Map<string, string>();
    availableItems.forEach((availItem: TagDocument) => {
      // Assume TagDocument has a label property.
      itemMap.set(availItem.label.toLowerCase(), availItem.label.toLowerCase());
    });
    if (
      normalizedSelectedItem &&
      !itemMap.has(normalizedSelectedItem.toLowerCase())
    ) {
      itemMap.set(normalizedSelectedItem.toLowerCase(), normalizedSelectedItem);
    }
    return Array.from(itemMap.values());
  }, [availableItems, normalizedSelectedItem]);

  // Detect clicks outside the input container to close input.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        displayInput &&
        inputContainerRef.current &&
        !inputContainerRef.current.contains(e.target as Node)
      ) {
        closeInput();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [displayInput]);

  const handleOnPress = () => {
    const trimmed = inputValue.trim();
    if (trimmed !== "") {
      setSelectedKeys(new Set([trimmed]));
      onSelectionChange(trimmed);
    }
    closeInput();
  };

  const closeInput = () => {
    setDisplayInput(false);
    setInputValue("");
  };

  return (
    <ButtonGroup>
      {displayInput ? (
        <div
          ref={inputContainerRef}
          className="flex rounded-l-xl overflow-hidden"
        >
          <Input
            type="text"
            radius="none"
            maxLength={60}
            fullWidth
            placeholder="Type Here"
            className="w-[125px]"
            onValueChange={(value) => setInputValue(value)}
          ></Input>

          {inputValue ? (
            <Button
              isIconOnly
              className="text-3xl text-green-500"
              onPress={handleOnPress}
            >
              <IoIosCheckmark />
            </Button>
          ) : (
            <Button
              isIconOnly
              className="text-2xl text-red-500"
              onPress={closeInput}
            >
              <IoIosClose />
            </Button>
          )}
        </div>
      ) : (
        <>
          <Dropdown
            onOpenChange={(isOpen) => {
              setDropDownOpen(isOpen);
            }}
          >
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="w-[125px] text-foreground-100"
              >
                {selectedItem ? selectedItem : "Size"}
                <span>
                  <IoIosArrowDown />
                </span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              closeOnSelect={true}
              selectionMode="single"
              selectedKeys={selectedKeys}
              onSelectionChange={(keys) => {
                const newSelected = Array.from(keys as unknown as Set<string>);
                setSelectedKeys(new Set(newSelected) as SharedSelection);
                // If nothing is selected, pass an empty string; otherwise, pass the first item.
                const value = newSelected.length > 0 ? newSelected[0] : "";
                onSelectionChange(value);
              }}
            >
              {unionItems.map((item) => (
                <DropdownItem key={item} textValue={item}>
                  {item}
                </DropdownItem>
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

export default SizeDropDown;
