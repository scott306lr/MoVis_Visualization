import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import React from "react";
import Datepicker from "react-tailwindcss-datepicker";
import type { DateValueType } from "react-tailwindcss-datepicker/dist/types";
import { DateContext } from "../utils/DataContext";

// interface IProps {
//   value: DateValueType;
//   setValue: Dispatch<SetStateAction<DateValueType>>;
// }

const DataRangeComp: React.FC = () => {
  // const { dateRange, setDateRange } = useContext(DateContext);
  const appContext = useContext(DateContext);

  const handleValueChange = (newValue: DateValueType) => {
    if (newValue?.startDate != null && newValue?.endDate != null) {
      const d1 = new Date(newValue.endDate);
      const d2 = addYears(new Date(newValue.startDate), 2);
      appContext?.setDateRange({
        startDate: new Date(newValue.startDate),
        endDate: d1 > d2 ? d2 : d1,
      });
    }
  };

  const addYears = (date: Date, years: number) => {
    date.setFullYear(date.getFullYear() + years);
    return date;
  };

  const maxDate =
    appContext?.dateRange.startDate != null
      ? addYears(new Date(appContext?.dateRange.startDate), 2)
      : (new Date("2022-12-31") as Date);

  return (
    <Datepicker
      value={
        appContext?.dateRange ?? { startDate: new Date(), endDate: new Date() }
      }
      onChange={handleValueChange}
      showShortcuts={true}
      maxDate={maxDate}
      inputClassName="text-center font-bold w-64"
      containerClassName="w-fit"
    />
  );
};

export default DataRangeComp;
