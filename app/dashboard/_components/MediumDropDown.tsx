import { TagDocument } from "@/models/Tag";
import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useMemo, useState, useRef } from "react";
import {
  IoIosAdd,
  IoIosArrowDown,
  IoIosCheckmark,
  IoIosClose,
} from "react-icons/io";

type MediumDropDownProps = {
  availableItems: TagDocument[];
  selectedItem: string | null;
  onSelectionChange: (newSelected: string) => void;
};

const MediumDropDown = ({
  availableItems,
  selectedItem,
  onSelectionChange,
}: MediumDropDownProps) => {
  const normalizedSelectedItem = selectedItem || "";
  const [selectedValue, setSelectedValue] = useState<string>(
    normalizedSelectedItem
  );
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedValue(normalizedSelectedItem);
  }, [normalizedSelectedItem]);

  const unionItems = useMemo(() => {
    const itemMap = new Map<string, string>();
    availableItems.forEach((availItem: TagDocument) => {
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
      setSelectedValue(trimmed);
      onSelectionChange(trimmed);
    }
    closeInput();
  };

  const closeInput = () => {
    setDisplayInput(false);
    setInputValue("");
  };

  return (
    <div className="flex">
      {displayInput ? (
        <div
          ref={inputContainerRef}
          className="flex rounded-l-xl overflow-hidden border border-gray-300"
        >
          <input
            type="text"
            maxLength={60}
            placeholder="Type Here"
            className="w-[125px] px-3 py-2 focus:outline-none"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />

          {inputValue ? (
            <button
              className="px-3 text-3xl text-green-500 hover:bg-gray-100"
              onClick={handleOnPress}
            >
              <IoIosCheckmark />
            </button>
          ) : (
            <button
              className="px-3 text-2xl text-red-500 hover:bg-gray-100"
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
                  <Menu.Button className="w-[125px] px-3 py-2 border border-gray-300 rounded-l-xl flex items-center justify-between hover:bg-gray-100">
                    <span>{selectedValue || "Medium"}</span>
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
                                  selectedValue === item
                                    ? "text-blue-600"
                                    : "text-gray-900"
                                } group flex w-full items-center px-4 py-2 text-sm`}
                                onClick={() => {
                                  setSelectedValue(item);
                                  onSelectionChange(item);
                                }}
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
              className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-xl text-lg text-gray-400"
            >
              <IoIosAdd />
            </button>
          ) : (
            <button
              className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-xl text-2xl text-green-500 hover:bg-gray-100"
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

export default MediumDropDown;
