import { type NextPage } from "next";
import Link from "next/link";
import { useContext, useState } from "react";
import MyCombobox from "../../components/MyCombobox";
import Navbar from "../../components/Navbar";
import SubsetPicker from "../../components/SubsetPicker";
import ZoomCard from "../../components/ZoomCard";

import { api } from "../../utils/api";
import type { KeyMap, MovieData, Subset } from "../../utils/myClasses";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import {
  ChartOptions,
  convertDicttoChartData,
  getTopElementCount,
} from "../../utils/chartUtils";
import MyListbox from "../../components/MyListbox";
import { getCountDict } from "../../utils/relationUtils";
import { DateContext } from "../../utils/DataContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
  // autocolors
);

const myKeyMap = {
  companies: "The amount of movies a company haved produced",
  crew: "The amount of movies a crew member participated in",
  genres: "The amount of movies with the specific genre",
  keywords: "The amount of movies with the specific keyword",
  spoken_languages: "The amount of movies spoken a specific language",
  countries: "The amount of movies produced in a specific country",
} as KeyMap<string>;

const MyBarPlot: React.FC<{ data: MovieData[] }> = (props) => {
  const [filterkey, setFilterkey] = useState("genres");

  // get genre counts
  const TOP_COUNT = 20;
  const countDict = getCountDict(
    props.data,
    [filterkey], // ["genres"]
    [],
    "name",
    0,
    TOP_COUNT
  );
  const { labels, data: countArr } = convertDicttoChartData(countDict);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "2001 Movies",
        data: countArr,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-full w-full">
      <h1>
        {myKeyMap[filterkey]} (Top {TOP_COUNT}):
      </h1>
      <MyListbox
        keyMap={myKeyMap}
        selected={filterkey}
        setSelected={setFilterkey}
      />
      <Bar data={data} options={ChartOptions(null, true, true)} />
    </div>
  );
};

const Playground: NextPage = () => {
  // const { data: movies } = api.movie.getAll.useQuery();
  const appContext = useContext(DateContext);
  const { data: movies } = api.movie.dateRange.useQuery({
    minDate: appContext?.dateRange.startDate ?? new Date("2015-01-01"),
    maxDate: appContext?.dateRange.endDate ?? new Date("2016-12-31"),
  });

  // const { data: genres } = api.getAll.genre.useQuery();
  // console.log(genres?.map((d) => d.name));

  const [subsets, setSubsets] = useState<Subset[]>([]);
  const [selected, setSelected] = useState<MovieData[]>([]); // test for combobox

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="text-center font-extrabold tracking-tight text-white">
            <h1 className="text-5xl sm:text-[5rem]">Welcome</h1>
            <h2 className="text-3xl sm:text-[3rem]">
              <span className="text-[hsl(295,32%,69%)]">to My Playground</span>
            </h2>
          </div>
        </div>
        {movies != null ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
            <ZoomCard title="Fuzzy Search Movies">
              <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-lg text-white hover:bg-white/20">
                <MyCombobox
                  data={movies}
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>
            </ZoomCard>
            <ZoomCard title="Add New Subset">
              <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-lg text-white hover:bg-white/20">
                <button
                  className="rounded bg-[#2e026d] py-2 px-4 font-bold text-white hover:bg-[#15162c]"
                  onClick={() => {
                    const newSubset: Subset = {
                      name: "New Subset",
                      data: movies,
                      selected: false,
                    };
                    setSubsets([...subsets, newSubset]);
                  }}
                >
                  Add a Subset With Full Movie Data
                </button>
              </div>
            </ZoomCard>
            <ZoomCard title="Multi-select Subsets">
              <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-lg text-white hover:bg-white/20">
                <SubsetPicker subsets={subsets} setSubsets={setSubsets} />
              </div>
            </ZoomCard>

            <ZoomCard title="Element Count">
              <div className="flex flex-col gap-4 rounded-xl bg-white/90 p-4 text-lg text-black hover:bg-white/100">
                <MyBarPlot data={movies} />
              </div>
            </ZoomCard>
          </div>
        ) : (
          <h1 className="text-2xl font-bold text-white">Querying Data...</h1>
        )}
      </main>
    </>
  );
};

export default Playground;
