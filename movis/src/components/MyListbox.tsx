import { Listbox, Transition } from "@headlessui/react";
import type { Dispatch, SetStateAction } from "react";
import { Fragment } from "react";
import { HiChevronUpDown } from "react-icons/hi2";
import { KeyMap } from "../utils/myClasses";

interface IProps {
  keyMap: KeyMap<string>;
  selected: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelected: Dispatch<SetStateAction<string>>;
}

const MyListbox: React.FC<IProps> = ({ keyMap, selected, setSelected }) => {
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative mt-1 w-fit">
        <Listbox.Button className="relative w-full cursor-default rounded-lg  bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate text-gray-900">
            {keyMap[selected]}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <HiChevronUpDown
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {Object.keys(keyMap).map((key, i) => (
              <Listbox.Option
                key={i}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-4 pr-4 ${
                    active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                  }`
                }
                value={key}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {keyMap[key]}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default MyListbox;
