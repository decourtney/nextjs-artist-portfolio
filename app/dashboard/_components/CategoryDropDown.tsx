import { TagDocument } from "@/models/Tag";
import { Menu, Transition } from "@headlessui/react";
import { useEffect, useMemo, useRef, useState, Fragment } from "react";
import {
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
  const [selectedValues, setSelectedValues] = useState<string[]>(
    selectedItems || []
  );
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedValues(selectedItems || []);
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
    if (trimmed !== "" && !selectedValues.includes(trimmed)) {
      const newSelection = [...selectedValues, trimmed];
      setSelectedValues(newSelection);
      onSelectionChange(newSelection);
    }
    closeInput();
  };

  const closeInput = () => {
    setDisplayInput(false);
    setInputValue("");
  };

  const toggleItem = (item: string) => {
    const newSelection = selectedValues.includes(item)
      ? selectedValues.filter((i) => i !== item)
      : [...selectedValues, item];
    setSelectedValues(newSelection);
    onSelectionChange(newSelection);
  };

  return (
    <div className="flex">
      <div className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-l-md bg-gray-50 text-gray-700">
        {selectedValues.length}
      </div>
      {displayInput ? (
        <div ref={inputContainerRef} className="flex">
          <input
            type="text"
            maxLength={60}
            placeholder="Type Here"
            className="w-[125px] px-3 py-2 border-y border-gray-300 focus:outline-none"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />

          {inputValue ? (
            <button
              className="px-3 text-3xl text-green-500 hover:bg-gray-100 border-y border-r border-gray-300"
              onClick={handleOnPress}
            >
              <IoIosCheckmark />
            </button>
          ) : (
            <button
              className="px-3 text-2xl text-red-500 hover:bg-gray-100 border-y border-r border-gray-300"
              onClick={closeInput}
            >
              <IoIosClose />
            </button>
          )}
        </div>
      ) : (
        <>
          <Menu as="div" className="relative">
            {({ open }) => {
              useEffect(() => setDropDownOpen(open), [open]);
              return (
                <>
                  <Menu.Button className="w-[125px] px-3 py-2 border border-gray-300 flex items-center justify-between hover:bg-gray-100">
                    <span>Categories</span>
                    <IoIosArrowDown />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute z-10 mt-2 w-[125px] origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {unionItems.map((item) => (
                          <Menu.Item key={item}>
                            {({ active }) => (
                              <button
                                className={`${active ? "bg-gray-100" : ""} ${
                                  selectedValues.includes(item)
                                    ? "text-blue-600"
                                    : "text-gray-900"
                                } group flex w-full items-center px-4 py-2 text-sm`}
                                onClick={() => toggleItem(item)}
                              >
                                {item}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              );
            }}
          </Menu>
          {dropDownOpen ? (
            <button
              disabled
              className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-lg text-gray-400"
            >
              <IoIosAdd />
            </button>
          ) : (
            <button
              className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-2xl text-green-500 hover:bg-gray-100"
              onClick={() => setDisplayInput(!displayInput)}
            >
              <IoIosAdd />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryDropDown;
