import { TagDocument } from "@/models/Tag";
import
  {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    SharedSelection,
  } from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import
  {
    IoIosAdd,
    IoIosArrowDown,
    IoIosCheckmark,
    IoIosClose,
  } from "react-icons/io";

type CategoryDropDownProps = {
  availableItems: TagDocument[];
  selectedItems: string[] | null;
  onSelectionChange: (newSelected: string[]) => void;
};

const CategoryDropDown = ({
  availableItems,
  selectedItems,
  onSelectionChange,
}: CategoryDropDownProps) => {
  const [selectedKeys, setSelectedKeys] = useState<SharedSelection>(
    new Set(selectedItems)
  );
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedKeys(new Set(selectedItems));
  }, [selectedItems]);

  const unionItems = useMemo(() => {
    const itemMap = new Map<string, string>();

    availableItems.forEach((availItem: TagDocument) => {
      itemMap.set(availItem.label.toLowerCase(), availItem.label.toLowerCase());
    });

    selectedItems?.forEach((selItem: string) => {
      if (!itemMap.has(selItem.toLowerCase())) {
        itemMap.set(selItem.toLowerCase(), selItem.toLowerCase());
      }
    });

    return Array.from(itemMap.values());
  }, [availableItems, selectedItems]);

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
        {selectedItems?.length}
      </Button>
      {displayInput ? (
        <div ref={inputContainerRef} className="flex">
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

export default CategoryDropDown;
