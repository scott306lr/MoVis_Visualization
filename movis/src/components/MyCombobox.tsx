import type { Dispatch, SetStateAction } from "react";
import { Fragment, useState, useRef } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { HiCheck } from "react-icons/hi2";
import { HiOutlineSearch } from "react-icons/hi";

import fuzzysort from "fuzzysort";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { KeyMap, MovieData } from "../utils/myClasses";
import MyListbox from "./MyListbox";

// Change string[] to data[]
interface IProps {
  data: MovieData[];
  selected: MovieData[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelected: Dispatch<SetStateAction<MovieData[] | any[]>>;
}

const myKeyMap = {
  title: "Title",
  genres: "Genre",
  test: "Test",
} as KeyMap<string>;

const MyCombobox: React.FC<IProps> = ({ data, selected, setSelected }) => {
  const [query, setQuery] = useState("");
  const [filterkey, setFilterkey] = useState("title");

  // merge genres into one string for fuzzy sort filtering
  const moddedData = data.map((d) => {
    return {
      ...d,
      genres: d.genres.join(", "),
    };
  });

  //Fuzzy sort filtering data with key selected by listbox
  const filteredData = fuzzysort
    .go(query, moddedData, {
      threshold: -50,
      // limit: 10,
      all: true,
      key: filterkey,
    })
    .map((d) => d.obj);

  //For virtualizer
  const parentRef = useRef<HTMLUListElement | null>(null);
  const virtualizer = useVirtualizer({
    count: filteredData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 8,
    paddingStart: 64,
  });

  //Data information shown in combobox's list
  const DataInfo: React.FC<{ data: typeof moddedData[number] }> = (props) => {
    return (
      <span
        className={`block truncate ${selected ? "font-bold" : "font-semibold"}`}
      >
        {props.data.title}
      </span>
    );
  };

  return (
    <div className="flex w-full items-center justify-center align-middle">
      <Combobox value={selected} by="id" onChange={setSelected} multiple>
        <div className="relative mt-1 w-full">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <HiOutlineSearch
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options
              className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
              `}
              ref={parentRef}
            >
              <div
                style={{
                  height: virtualizer.getTotalSize(),
                  width: "100%",
                  position: "relative",
                  backgroundColor: "white",
                  zIndex: 1,
                }}
              >
                <div
                  className="relative h-16 cursor-default select-none bg-teal-700/30 py-2 pl-10 pr-4 text-teal-900 hover:bg-teal-700 hover:text-white"
                  onClick={() => {
                    if (selected.length === filteredData.length) {
                      setSelected([]);
                    } else {
                      setSelected(filteredData);
                    }
                  }}
                >
                  {selected.length === filteredData.length ? (
                    <span className="block truncate text-base font-semibold hover:font-bold">
                      Unselect All
                      <p className="font-light">
                        {`Unselect all ${filteredData.length} tracks`}
                      </p>
                    </span>
                  ) : (
                    <span className="block truncate text-base font-semibold hover:font-bold">
                      Select All
                      <p className="font-light">
                        {`Select all ${filteredData.length} tracks`}
                      </p>
                    </span>
                  )}
                </div>

                {filteredData.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  virtualizer.getVirtualItems().map((virtualRow) => {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const data = filteredData[virtualRow.index]!;
                    return (
                      <Combobox.Option
                        key={virtualRow.key}
                        data-index={virtualRow.index}
                        ref={virtualizer.measureElement}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-teal-600 text-white" : "text-gray-900"
                          }`
                        }
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                        value={data}
                      >
                        {({ selected, active }) => (
                          <>
                            <DataInfo data={data} />
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? "text-white" : "text-teal-600"
                                }`}
                              >
                                <HiCheck
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    );
                  })
                )}
              </div>
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      <div className="flex items-center justify-center space-x-1 px-2 align-middle">
        <p>By: </p>
        <MyListbox
          keyMap={myKeyMap}
          selected={filterkey}
          setSelected={setFilterkey}
        />
      </div>
    </div>
  );
};

export default MyCombobox;
