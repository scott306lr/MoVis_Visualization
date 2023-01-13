//Navbar component
import React from "react";
import Link from "next/link";

import { api } from "../utils/api";
import DataRangeComp from "./DataRangeComp";
import { IoAnalytics } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi2";
import { RiBubbleChartFill } from "react-icons/ri";
import { AiFillHome } from "react-icons/ai";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-10 flex h-20 flex-row items-center justify-between bg-black px-20 text-white">
      <Link href="/" className="flex items-center text-4xl font-bold">
        <AiFillHome className="mr-2 h-8 w-8" />
        Mo<span className="text-[hsl(280,100%,70%)]">Vis</span>
      </Link>
      <div className="page-nav flex flex-row items-center gap-6">
        <Link
          href="/overview"
          className="flex items-center space-x-2 align-middle text-xl font-bold hover:text-[hsl(295,32%,69%)]"
        >
          <IoAnalytics className="h-8 w-8" />
          <span>Overview</span>
        </Link>
        <Link
          href="/compare"
          className="flex items-center space-x-2 align-middle text-xl font-bold hover:text-[hsl(295,32%,69%)]"
        >
          <HiUserGroup className="h-8 w-8" />
          <span>Company Comparison</span>
        </Link>
        <Link
          href="/relation"
          className="flex items-center space-x-2 align-middle text-xl font-bold hover:text-[hsl(295,32%,69%)]"
        >
          <RiBubbleChartFill className="h-8 w-8" />
          <span>Relation Analysis</span>
        </Link>
      </div>
      <div className="flex flex-col items-start align-middle text-sm">
        <span>Select comparison time period:</span>
        <DataRangeComp />
      </div>
    </div>
  );
}
