import { type NextPage } from "next";
import { useState } from "react";
import ComCombobox from "../../components/ComCombobox";
import Navbar from "../../components/Navbar";
import ZoomCard from "../../components/ZoomCard";

import { api } from "../../utils/api";
import type { CompanyData, MovieData } from "../../utils/myClasses";
import { AllGenres } from "../../utils/myClasses";
import Head from "next/head";

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
  ArcElement,
} from "chart.js";

import { Bar, Line, Doughnut } from "react-chartjs-2";
import { ChartOptions, convertDicttoChartData } from "../../utils/chartUtils";

import { Carousel, ListGroup } from "flowbite-react";
import { getCountDict } from "../../utils/relationUtils";
import type { Company } from "@prisma/client";
import { proseWrap } from "../../../prettier.config.cjs";
import { procedureTypes } from "@trpc/server";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const CarouselElement: React.FC<{ url: string; title: string }> = (props) => {
  return (
    <div className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white">
      <img src={props["url"]} title={props["title"]}></img>
    </div>
  );
};

// https://flowbite-react.com/carousel/
const MyCarousel: React.FC<{ data: CompanyData[]; size: number }> = (props) => {
  const movies: MovieData[] = props.data.reduce((a, b) => {
    return a.concat(b);
  });

  movies.sort((a, b) => {
    return b["popularity"] - a["popularity"];
  });

  const posterElement = movies
    .map((d) => ({ url: d["poster_url"], title: d["title"] }))
    .slice(0, props.size);

  return (
    <Carousel slideInterval={3000}>
      {posterElement.map((val, idx) => (
        <CarouselElement key={idx} url={val["url"]} title={val["title"]} />
      ))}
    </Carousel>
  );
};

// https://react-chartjs-2.js.org/examples/line-chart/
const MyLinePlot: React.FC<{
  companies: Company[];
  data: CompanyData[];
  title: string;
  attr: string;
}> = (props) => {
  const options = {
    ...ChartOptions(null, true, false),

    scales: {},
    responsive: true,
    maintainAspectRatio: false,
    spanGaps: true,
    // responsive: true,
    // maintainAspectRatio: false,
    // plugins: {
    //   legend: {
    //     position: "bottom" as const,
    //   },
    //   title: {
    //     display: false,
    //     text: "Line Chart",
    //   },
    // },
  };

  const dateToStr = (date: Date | undefined) => {
    if (date == undefined) return "1900-00-00";
    return `${date.getFullYear()}-${("0" + (1 + date.getMonth())).slice(-2)}-${(
      "0" + date.getDay()
    ).slice(-2)}`;
  };

  function onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }

  const all_labels = props.data.map((val) => {
    return val.map((movie) => {
      return dateToStr(movie.release_date);
    });
  });

  const labels = all_labels
    .reduce((a, b) => {
      return a.concat(b);
    })
    .filter(onlyUnique);

  labels.sort();

  const formatLabels = labels.map((d) => d.slice(0, -3));

  const data = {
    labels: formatLabels,
    datasets: props.data.map((com, idx) => {
      return {
        label: props.companies[idx]?.name,
        data: labels.map((date) => {
          for (let i = 0; i < com.length; i++) {
            if (Object.is(dateToStr(com[i]?.release_date), date)) {
              if (props.attr === "averageRating") return com[i]?.averageRating;
              if (props.attr === "budget")
                return com[i]?.budget === 0 ? NaN : com[i]?.budget;
              if (props.attr === "revenue")
                return com[i]?.revenue === 0 ? NaN : com[i]?.revenue;
              if (props.attr === "popularity") return com[i]?.popularity;
            }
          }
          return NaN;
        }),
        borderColor: brdr_color_maps[idx],
        backgroundColor: back_color_maps[idx],
        borderWidth: 1,
        stepped: false,
      };
    }),
  };

  return (
    <div className="h-full w-full">
      <Line options={options} data={data} />
    </div>
  );
};

const back_color_maps: string[] = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
];

const brdr_color_maps: string[] = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
];

const MyBarPlot: React.FC<{ companies: Company[]; data: CompanyData[] }> = (
  props
) => {
  const [filterkey, setFilterkey] = useState("genres");

  const countDicts = props.data.map((comp) => {
    return getCountDict(comp, [filterkey], [], "name", 0, undefined);
  });

  const data = {
    labels: AllGenres,
    datasets: countDicts.map((countDict, idx) => {
      const { labels, data: countArr } = convertDicttoChartData(countDict);
      return {
        label: props.companies[idx]?.name,
        data: countArr,
        backgroundColor: back_color_maps[idx],
        borderColor: brdr_color_maps[idx],
        borderWidth: 1,
      };
    }),
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
      {/* <h1>Movies Count</h1> */}
      <Bar data={data} options={chartOptions} />
    </div>
  );
};

const MyDoughnut: React.FC<{
  companies: Company[];
  data: CompanyData[];
  title: string;
  attr: string;
}> = (props) => {
  const labels: string[] = props.companies.map((data) => {
    return data.name;
  });

  const count: number[] = props.data.map((data) => {
    const tmp = data.filter((mov) => {
      return mov["averageRating"] >= 7;
    });
    return tmp.length;
  });

  const config: any = {
    rotation: true,
    spacing: 0,
    hoverOffset: 30,

    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      title: {
        display: false,
        text: "Count#",
        font: {
          size: 20,
        },
      },
      layout: {
        padding: 100,
      },
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: "# of Movies",
        data: count,
        backgroundColor: back_color_maps,
        borderColor: brdr_color_maps,
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut options={config} data={data} />;
};

// const MyListGroupElement: React.FC<{
//   selected: Company[];
//   setSelected: any;
// }> = (props) => {
//   return (
//     <>
//       <ListGroup>
//         {props.selected.map((data) => {
//           return <ListGroup.Item>{data.name}</ListGroup.Item>;
//         })}
//       </ListGroup>
//     </>
//   );
// };

const Compare: NextPage = () => {
  // Error occurred during query execution:
  // ConnectorError(ConnectorError {
  //   user_facing_error: None,
  //   kind: QueryError(Server(ServerError {
  //     code: 1105, message: "target: movis-app.-.primary: vttablet: rpc error: code = Aborted desc = Row count exceeded 100000 (CallerID: planetscale-admin)", state: "HY000"
  //   })) })
  // const { data: persons } = api.getAll.person.useQuery();

  const { data: companies } = api.getAll.company.useQuery();
  const [selected, setSelected] = useState<Company[]>([
    { id: 1, name: "Pixar" },
    { id: 2486, name: "Studio Ghibli" },
    { id: 1947, name: "DreamWorks Animation" },
  ]);

  const sort_selected = selected;
  sort_selected.sort((a, b) => {
    return a.id - b.id;
  });

  const { data: companyData } = api.company.betweenYearRange.useQuery({
    companyIds: selected.map((data) => {
      return data.id;
    }),
    minYear: 1900,
    maxYear: 2100,
  });

  return (
    <>
      <Head>
        <title>MoVis: Comparison</title>
        <meta
          name="description"
          content="A Comprehensive Visualization System for The Movies Dataset"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {companyData != null && companies != null ? (
          <>
            <div className="container flex flex-col py-6">
              <div className="top-section flex-0 flex w-full flex-row justify-between gap-3">
                <div className="text-left text-white">
                  <div className="inline-block text-3xl font-extrabold sm:text-5xl">
                    Mo
                    <span className="font-extrabold text-[hsl(280,100%,70%)]">
                      Vis{" "}
                    </span>
                  </div>
                  <div className="ml-4 inline-block text-3xl text-[hsl(295,32%,69%)] sm:text-[2rem]">
                    Cast Comparison
                  </div>
                  <div className="my-1">
                    Compare the production and statistics of different crew.
                  </div>
                </div>
                <div className="align-right flex h-full w-full flex-1 items-center justify-end">
                  <div className="flex w-2/3 items-center justify-center">
                    <ComCombobox
                      data={companies}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="container grid h-full grid-cols-1 gap-4 sm:grid-cols-8 sm:grid-rows-6 md:gap-4">
              <ZoomCard title="Movie Revenue" className="col-span-3 row-span-3">
                <div className="flex h-full flex-col gap-4 rounded-xl bg-white/95 p-4 text-lg text-black hover:bg-white/100">
                  <MyLinePlot
                    companies={selected}
                    data={companyData}
                    title="Movie Revenue"
                    attr="revenue"
                  />
                </div>
              </ZoomCard>

              <ZoomCard title="Movie Budget" className="col-span-3 row-span-3">
                <div className="flex h-full flex-col gap-4 rounded-xl bg-white/95 p-4 text-lg text-black hover:bg-white/100">
                  <MyLinePlot
                    companies={selected}
                    data={companyData}
                    title="Movie Budget"
                    attr="budget"
                  />
                </div>
              </ZoomCard>

              <ZoomCard
                title="Top Rated Movies from Selected"
                className="col-span-2 row-span-3"
                manualZoomDim=" "
              >
                <div>
                  <MyCarousel data={companyData} size={10} />
                </div>
              </ZoomCard>

              <ZoomCard title="Movie Ratings" className="col-span-3 row-span-3">
                <div className="flex h-full flex-col gap-4 rounded-xl bg-white/95 p-4 text-lg text-black hover:bg-white/100">
                  <MyLinePlot
                    companies={selected}
                    data={companyData}
                    title="Movie Ratings"
                    attr="averageRating"
                  />
                </div>
              </ZoomCard>

              <ZoomCard
                title="Movie Popularity"
                className="col-span-3 row-span-3"
              >
                <div className="flex h-full flex-col gap-4 rounded-xl bg-white/95 p-4 text-lg text-black hover:bg-white/100">
                  <MyLinePlot
                    companies={selected}
                    data={companyData}
                    title="Movie Popularity"
                    attr="popularity"
                  />
                </div>
              </ZoomCard>

              <ZoomCard
                title="Movies Genres"
                className="col-span-2 row-span-3"
                manualZoomDim="h-screen"
              >
                <div className="flex h-full flex-col gap-4 rounded-xl bg-white/95 p-4 text-lg text-black hover:bg-white/100">
                  <MyBarPlot companies={selected} data={companyData} />
                </div>
              </ZoomCard>
            </div>
          </>
        ) : (
          <h1 className="text-2xl font-bold text-white">Querying Data...</h1>
        )}
      </main>
    </>
  );
};

export default Compare;
