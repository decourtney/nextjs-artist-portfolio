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

type Tag = {
  _id: string;
  name: string;
};

type CategoryDropDownProps = {
  availableCategories: Tag[];
  selectedCategories: string[];
  onSelectionChange: (newSelected: string[]) => void;
};

const CategoryDropDown: React.FC<CategoryDropDownProps> = ({
  availableCategories,
  selectedCategories,
  onSelectionChange,
}) => {
  const [selectedKeys, setSelectedKeys] = useState<SharedSelection>(
    new Set(selectedCategories)
  );
  const [displayInput, setDisplayInput] = useState<Boolean>(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setSelectedKeys(new Set(selectedCategories));
  }, [selectedCategories]);

  const unionCategories = useMemo(() => {
    console.log("Client avail cats: ", availableCategories);
    console.log("Client sel cats: ", selectedCategories);
    const categoryMap = new Map<string, string>();

    // Add available categories by name (lowercased as key, original name as value)
    availableCategories.forEach((cat) => {
      categoryMap.set(cat.name.toLowerCase(), cat.name.toLowerCase());
    });

    // For each selected category name, add it if not already present
    selectedCategories.forEach((selectedName) => {
      const lowerName = selectedName.toLowerCase();
      if (!categoryMap.has(lowerName)) {
        categoryMap.set(lowerName, selectedName);
      }
    });

    return Array.from(categoryMap.values());
  }, [availableCategories, selectedCategories]);

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
      {/* <div className="flex w-48"> */}
      <Button
        disabled
        disableAnimation
        isIconOnly
        className="pointer-events-none"
      >
        {selectedCategories.length}
      </Button>
      {displayInput ? (
        <>
          <Input
            type="text"
            radius="none"
            maxLength={60}
            fullWidth
            placeholder="New Category"
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
          <Dropdown>
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
              {unionCategories.map((cat) => (
                <DropdownItem key={cat}>{cat}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Button
            isIconOnly
            className="text-2xl text-green-500"
            onPress={() => setDisplayInput(!displayInput)}
          >
            <IoIosAdd />
          </Button>
        </>
      )}
      {/* </div> */}
    </ButtonGroup>
  );
};

export default CategoryDropDown;
