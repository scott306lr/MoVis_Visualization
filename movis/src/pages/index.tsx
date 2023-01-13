import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { api } from "../utils/api";
import { useContext } from "react";
import { IoAnalytics } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi2";
import { RiBubbleChartFill } from "react-icons/ri";

import DataRangeComp from "../components/DataRangeComp";
import { DateContext } from "../utils/DataContext";

import LoadingSpinner from "../components/LoadingSpinner";

const Home: NextPage = () => {
  const appContext = useContext(DateContext);
  const { data: movies } = api.movie.dateRange.useQuery({
    minDate: appContext?.dateRange.startDate ?? new Date("2015-01-01"),
    maxDate: appContext?.dateRange.endDate ?? new Date("2016-12-31"),
  });

  return (
    <>
      <Head>
        <title>MoVis</title>
        <meta
          name="description"
          content="A Comprehensive Visualization System for The Movies Dataset"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Navbar /> */}
      <main className="flex min-h-screen flex-col items-center justify-center space-y-10 bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-20 px-4 py-16">
          <div className="text-center font-extrabold tracking-tight text-white">
            <h1 className="text-5xl sm:text-[5rem]">
              Mo
              <span className="text-[hsl(280,100%,70%)]">Vis</span>
            </h1>
            <h2 className="text-4xl sm:text-[3rem]">
              <span className="text-[hsl(295,32%,69%)]">
                The Movies Dataset Visualization
              </span>
            </h2>
          </div>

          {/* <div className="flex flex-col items-center justify-center gap-4">
            <h3 className="text-center text-2xl font-bold text-white">
              Analyze Movies <br /> Between a Time Period:
            </h3>
            <DataRangeComp />
          </div> */}

          <div className="flex flex-col items-center justify-center gap-4">
            <h3 className="text-center text-3xl font-bold text-white">
              Pick one of the following <br /> perspective to start your
              analysis:
            </h3>

            <div
              className="align-center w-128 inline-flex h-32 rounded-md shadow-sm"
              role="group"
            >
              <Link
                href="/overview"
                type="button"
                className="inline-flex flex-1 items-center space-x-5 rounded-l-full border border-gray-200 bg-white/50 bg-white px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
              >
                <IoAnalytics className="h-16 w-16" />
                <h3 className="w-fit text-center text-2xl font-bold">
                  Movie Overview Insights
                </h3>
              </Link>

              <Link
                href="/compare"
                type="button"
                className="inline-flex flex-1 items-center space-x-5 border border-gray-200 bg-white/50 bg-white px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
              >
                <HiUserGroup className="h-16 w-16" />
                <h3 className="w-fit text-center text-2xl font-bold">
                  Specific Company Comparison
                </h3>
              </Link>
              <Link
                href="/relation"
                type="button"
                className="inline-flex flex-1 items-center space-x-5 rounded-r-full border border-gray-200 bg-white/50 bg-white px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
              >
                <RiBubbleChartFill className="h-16 w-16" />
                <h3 className="w-fit text-center text-2xl font-bold ">
                  Relations of Different Aspects
                </h3>
              </Link>
            </div>
            <h3 className="w-full text-center text-lg font-bold text-white">
              {movies == null ? (
                <>
                  <div className="mb-1">Preloading data...</div>
                  <LoadingSpinner />
                </>
              ) : (
                `Data loaded complete. A total of ${movies.length} movies found. `
              )}
            </h3>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
