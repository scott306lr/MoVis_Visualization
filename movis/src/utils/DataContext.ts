import { createContext } from "react";
import type { DateValueType } from "react-tailwindcss-datepicker/dist/types";

export const DateContext = createContext<{
    dateRange: {startDate: Date ; endDate: Date };
    setDateRange: React.Dispatch<React.SetStateAction<{startDate: Date ; endDate: Date }>>;
  } | null>(null);