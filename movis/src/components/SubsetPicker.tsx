import type { Dispatch, SetStateAction } from "react";
import React from "react";
import type { Subset } from "../utils/myClasses";

interface IProps {
  subsets: Subset[];
  setSubsets: Dispatch<SetStateAction<Subset[]>>;
}

const SubsetPicker: React.FC<IProps> = (props) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-lg text-white hover:bg-white/20">
      <ul className="flex flex-col gap-4">
        {props.subsets.map((subset, index) => (
          <li key={index}>
            <button
              className="flex items-center gap-2"
              onClick={() => {
                const newSubsets = [...props.subsets];
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                newSubsets[index].selected = !newSubsets[index].selected;
                props.setSubsets(newSubsets);
              }}
            >
              <h3 className="font-bold">{subset.name}</h3>
              {subset.selected ? "Yea" : "Nay"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubsetPicker;
