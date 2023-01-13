import { type NextPage } from "next";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import { api } from "../../utils/api";
import Map from "../../components/geo-map";
import ZoomCard from "../../components/ZoomCard";
// import WordCloud from "./word-cloud";
import { getCountDict } from "../../utils/relationUtils";
import type { MovieData } from "../../utils/myClasses";
import WordCloudNew from "../../components/word-cloud-better";

// ChartJS stuff
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";
import { ChartOptions, convertDicttoChartData } from "../../utils/chartUtils";
import { useContext } from "react";
import { DateContext } from "../../utils/DataContext";
import LoadingSpinner from "../../components/LoadingSpinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
  // autocolors
);

interface IProps {
  title?: string;
  number?: number;
  prefix?: string;
}

const dateToStr = (date: Date | undefined, day = false) => {
  if (date == undefined) return "1900-00-00";
  const yyyymm = `${date.getFullYear()}-${("0" + (1 + date.getMonth())).slice(
    -2
  )}`;
  if (!day) return yyyymm;
  return `${yyyymm}-${("0" + date.getDate()).slice(-2)}`;
};

const NumCard: React.FC<IProps> = (props) => {
  return (
    <>
      <div className="flex flex-col justify-center rounded-xl bg-white/20 p-4 text-lg text-white hover:bg-white/30">
        <div>{props.title}</div>
        <div className="text-4xl font-bold">
          {props.prefix}
          {props.number?.toLocaleString("en-US")}
        </div>
      </div>
    </>
  );
};

const GenreBarPlot: React.FC<{ data: MovieData[] }> = (props) => {
  // get genre counts
  const TOP_COUNT = 20;
  const countDict = getCountDict(
    props.data,
    ["genres"],
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
        data: countArr,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    ...ChartOptions(null, false, false),
    indexAxis: "y" as const,
    scales: {},
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="h-full w-full">
      <Bar data={data} options={chartOptions} />
    </div>
  );
};

const CountLinePlot: React.FC<{
  movies: MovieData[];
}> = (props) => {
  const options = {
    ...ChartOptions(null, false, false),

    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        ticks: {
          color: "rgba(255, 110, 140, 1)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: true,
        position: "bottom",
        align: "center",
        labels: {
          boxWidth: 30,
          font: {
            size: 16,
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  function onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }

  const all_labels = props.movies
    .map((val) => {
      return dateToStr(val.release_date);
    })
    .filter(onlyUnique)
    .sort();

  const data = {
    labels: all_labels,
    datasets: [
      {
        label: "# of Movies",
        data: all_labels.map((dat) => {
          return props.movies.filter((mov) => {
            return Object.is(dateToStr(mov.release_date), dat);
          }).length;
        }),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 1,
        stepped: false,
        yAxisID: "y",
      },
      {
        label: "revenue",
        data: all_labels.map((dat) => {
          let sum = 0;
          props.movies.map((mov) => {
            if (Object.is(dateToStr(mov.release_date), dat)) sum += mov.revenue;
          });
          return sum;
        }),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 1,
        stepped: false,
        yAxisID: "y1",
      },
      {
        label: "budget",
        data: all_labels.map((dat) => {
          let sum = 0;
          props.movies.map((mov) => {
            if (Object.is(dateToStr(mov.release_date), dat)) sum += mov.budget;
          });
          return sum;
        }),
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderWidth: 1,
        stepped: false,
        yAxisID: "y1",
      },
    ],
  };
  console.log(data);

  return (
    <div className="h-full w-full">
      {/* <h1>{props.title}</h1> */}
      <Line options={options} data={data} />
    </div>
  );
};

const TopXHorizontalBarChart: React.FC<{
  movies: MovieData[];
  topN: number;
  chosenKey: string;
}> = (props) => {
  const { movies, topN: TOP_COUNT, chosenKey: key } = props;

  const countDict = getCountDict(
    movies,
    [key], // ["genres"]
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
        data: countArr,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    ...ChartOptions(null, false, false),
    indexAxis: "y" as const,
    scales: {},
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="h-full w-full">
      <Bar data={data} options={chartOptions} />
    </div>
  );
};

const Home: NextPage = () => {
  const appContext = useContext(DateContext);
  const { data: movies } = api.movie.dateRange.useQuery({
    minDate: appContext?.dateRange.startDate ?? new Date("2015-01-01"),
    maxDate: appContext?.dateRange.endDate ?? new Date("2016-12-31"),
  });

  let movieCount = 0,
    totalRevenue = 0,
    averageRevenue = 0;
  let keywordsDict = {};
  // Horizontal Bar Chart
  const topN = 10;

  if (movies === undefined) {
  } else {
    // compute movie count
    movieCount = movies.length;

    // compute total revenue
    totalRevenue = movies.reduce(
      (accumulator, currentMovie) => accumulator + currentMovie.revenue,
      0
    );

    // compute average revenue
    averageRevenue = Math.round(totalRevenue / movieCount);

    // parse keywords
    keywordsDict = getCountDict(movies, ["keywords"], [], "name", 0, 100);
  }

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
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {movies != null ? (
          <>
            <div className="container flex flex-col py-6">
              <div className="top-section flex w-full flex-row justify-between gap-3">
                <div className="text-left font-extrabold text-white">
                  <div className="text-3xl sm:text-5xl">
                    Mo
                    <span className="text-[hsl(280,100%,70%)]">Vis</span>
                  </div>
                  <div className="text-3xl text-[hsl(295,32%,69%)] sm:text-[2rem]">
                    Trends Visualization
                  </div>
                  <div>
                    Movies in between{" "}
                    {dateToStr(appContext?.dateRange.startDate, true) +
                      " ~ " +
                      dateToStr(appContext?.dateRange.endDate, true)}
                  </div>
                </div>
                <div className="flex gap-6 ">
                  <NumCard
                    title="Total Revenue:"
                    prefix="US$"
                    number={totalRevenue}
                  />
                  <NumCard
                    title="Total Number of Movies:"
                    number={movieCount}
                  />
                  <NumCard
                    title="Average Revenue Per Movie:"
                    prefix="US$"
                    number={averageRevenue}
                  />
                </div>
              </div>
            </div>
            <div className="grow-1 grid h-full w-full grid-cols-6 grid-rows-4 gap-4">
              <ZoomCard
                title="Movie Production Trends"
                className="col-span-3 row-span-2"
              >
                <div className="flex h-full flex-col gap-4 rounded-xl bg-white/90 p-4 text-lg text-black hover:bg-white/100">
                  <CountLinePlot movies={movies} />
                </div>
              </ZoomCard>
              <ZoomCard
                title="Production count by Country"
                className="col-span-3 row-span-2"
              >
                <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl bg-white/90 p-4 text-lg text-black hover:bg-white/100">
                  <Map data={movies} />
                  <div className="text-[0.5rem] text-gray-500">
                    Number are normalized by Log scale
                  </div>
                </div>
              </ZoomCard>

              <ZoomCard
                title="Genres Distribution"
                className="col-span-2 row-span-2"
              >
                <div className="flex h-full flex-col gap-4 rounded-xl bg-white/90 p-4 text-lg text-black hover:bg-white/100">
                  <GenreBarPlot data={movies} />
                </div>
              </ZoomCard>
              <ZoomCard
                title="Top 10 Actors With the Most Movies"
                className="col-span-2 row-span-2"
              >
                <div className="flex h-full flex-col gap-4 rounded-xl bg-white/90 p-4 text-lg text-black hover:bg-white/100">
                  <TopXHorizontalBarChart
                    movies={movies}
                    chosenKey="crew"
                    topN={topN}
                  />
                </div>
              </ZoomCard>

              <ZoomCard
                title="Most frequent keyword in movie"
                className="col-span-2 row-span-2"
              >
                <div className="flex h-full flex-col gap-4 rounded-xl bg-white/90 p-4 text-lg text-black hover:bg-white/100">
                  <WordCloudNew keywordsCountDict={keywordsDict} />
                </div>
              </ZoomCard>
            </div>
          </>
        ) : (
          <>
            <h1 className="mb-3 text-2xl font-bold text-white">
              Querying Data...
            </h1>
            <LoadingSpinner />
          </>
        )}
      </main>
    </>
  );
};

export default Home;
