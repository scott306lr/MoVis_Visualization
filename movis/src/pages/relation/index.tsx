import { type NextPage } from "next";
import React, { useContext, useMemo } from "react";

import Head from "next/head";
import type {
  ForceGraphProps,
  LinkObject,
  NodeObject,
} from "react-force-graph-3d";
import ForceGraph3D from "../../components/ForceGraph3DWrapper";
import Navbar from "../../components/Navbar";
import { useWindowSize } from "@react-hook/window-size";
// import SpriteText from "three-spritetext";

import { api } from "../../utils/api";
import type { MovieData } from "../../utils/myClasses";
import { getCountDictV2 } from "../../utils/relationUtils";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { RxText, RxTextNone } from "react-icons/rx";
import { GrStatusGoodSmall } from "react-icons/gr";
import SpriteText from "three-spritetext";
import { DateContext } from "../../utils/DataContext";

const toCompareMap = {
  spoken_languages: "Language",
  keywords: "Keyword",
  crew: "Actor",
  genres: "Genre",
  countries: "Country",
  companies: "Company",
} as { [key: string]: string };
const toCompareKeys = Object.keys(toCompareMap);
const toCompareValues = Object.values(toCompareMap);

const SelectionCard: React.FC<{
  title: string;
  max: number;
  value: number;
  color: string;
  setValue: Dispatch<SetStateAction<number>>;
  hide: boolean;
  setHide: () => void;
  disable: boolean;
  setDisable: () => void;
  text: boolean;
  setText: () => void;
}> = (props) => {
  return (
    <div
      className={`flex-column flex-column w-full rounded-2xl px-5 py-3 ${
        props.disable ? "bg-white/20" : "bg-white/50"
      }`}
    >
      <div className="flex w-full justify-between">
        <button
          className={`flex h-8 w-1/2 items-center rounded bg-gray-300 p-1 hover:bg-white ${
            props.disable ? "bg-gray-500 line-through" : ""
          }`}
          onClick={() => props.setDisable()}
        >
          <GrStatusGoodSmall
            className="mr-2 h-6 w-6"
            style={{ color: props.color }}
          />
          {props.title}
        </button>
        <div className="flex pb-2">
          <button
            className={`mr-1 flex h-8 w-8 items-center justify-center rounded-md bg-gray-300 ${
              props.disable ? "bg-gray-500 line-through" : "hover:bg-white"
            }`}
            onClick={() => props.setText()}
            disabled={props.disable}
          >
            {props.text ? <RxText /> : <RxTextNone />}
          </button>
          <button
            className={`flex h-8 w-8 items-center justify-center rounded-md bg-gray-300 ${
              props.disable ? "bg-gray-500 line-through" : "hover:bg-white"
            }`}
            onClick={() => props.setHide()}
            disabled={props.disable}
          >
            {props.hide ? <BiHide /> : <BiShow />}
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="range"
          min="0"
          step="1"
          max={Math.min(props.max, 500).toString()}
          list="tickmarks"
          value={props.value.toString()}
          className="h-2 w-full bg-[#b75def]"
          onChange={(e) => props.setValue(parseInt(e.target.value))}
          disabled={props.disable}
        />
        <input
          type="text"
          className="h-6 w-16 rounded-md bg-gray-300"
          readOnly
          value={props.value.toString()}
          onChange={(e) => props.setValue(parseInt(e.target.value))}
          disabled={props.disable}
        />
      </div>
    </div>
  );
};

const MyMovieGraph: React.FC<{
  data: MovieData[] | undefined;
}> = (props) => {
  const [width, height] = useWindowSize();
  const [vLang, setVLang] = useState<number>(10);
  const [vWord, setVWord] = useState<number>(10);
  const [vCrew, setVCrew] = useState<number>(10);
  const [vGnre, setVGnre] = useState<number>(15);
  const [vCtry, setVCtry] = useState<number>(10);
  const [vComp, setVComp] = useState<number>(10);
  const [toHide, setToHide] = useState<boolean[]>(Array(7).fill(false));
  const [toDisable, setToDisable] = useState<boolean[]>([
    false,
    false,
    true,
    true,
    false,
    true,
    false,
  ]);
  const [toText, setToText] = useState<boolean[]>([
    false,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);

  const { countDict: langDict, uniqueCount: langCnt } = useMemo(
    () => getCountDictV2(props.data, ["spoken_languages"], [], "id", 0, vLang),
    [props.data, vLang]
  );
  const { countDict: wordDict, uniqueCount: wordCnt } = useMemo(
    () => getCountDictV2(props.data, ["keywords"], [], "id", 0, vWord),
    [props.data, vWord]
  );
  const { countDict: crewDict, uniqueCount: crewCnt } = useMemo(
    () => getCountDictV2(props.data, ["crew"], [], "id", 0, vCrew),
    [props.data, vCrew]
  );
  const { countDict: gnreDict, uniqueCount: gnreCnt } = useMemo(
    () => getCountDictV2(props.data, ["genres"], [], "id", 0, vGnre),
    [props.data, vGnre]
  );
  const { countDict: ctryDict, uniqueCount: ctryCnt } = useMemo(
    () => getCountDictV2(props.data, ["countries"], [], "id", 0, vCtry),
    [props.data, vCtry]
  );
  const { countDict: compDict, uniqueCount: compCnt } = useMemo(
    () => getCountDictV2(props.data, ["companies"], [], "id", 0, vComp),
    [props.data, vComp]
  );

  const langNodes = useMemo(
    () =>
      Object.values(langDict).map((d) => {
        return {
          id: `Language_${d.data.id}`,
          name: d.data.name,
          val: 20,
        };
      }),
    [langDict]
  );
  const wordNodes = useMemo(
    () =>
      Object.values(wordDict).map((d) => {
        return {
          id: `Keyword_${d.data.id}`,
          name: d.data.name,
          val: 20,
        };
      }),
    [wordDict]
  );
  const actrNodes = useMemo(
    () =>
      Object.values(crewDict).map((d) => {
        return {
          id: `Actor_${d.data.id}`,
          name: d.data.name,
          val: 20,
        };
      }),
    [crewDict]
  );
  const gnreNodes = useMemo(
    () =>
      Object.values(gnreDict).map((d) => {
        return {
          id: `Genre_${d.data.id}`,
          name: d.data.name,
          val: 20,
        };
      }),
    [gnreDict]
  );
  const ctryNodes = useMemo(
    () =>
      Object.values(ctryDict).map((d) => {
        return {
          id: `Country_${d.data.id}`,
          name: d.data.name,
          val: 20,
        };
      }),
    [ctryDict]
  );
  const compNodes = useMemo(
    () =>
      Object.values(compDict).map((d) => {
        return {
          id: `Company_${d.data.id}`,
          name: d.data.name,
          val: 20,
        };
      }),
    [compDict]
  );

  const movieNodes = useMemo(
    () =>
      props.data?.map((data) => {
        return {
          id: `Movie_${data.id}`,
          name: data.title,
          val: 0.01,
        };
      }) || [],
    [props.data]
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const links =
    props.data?.reduce((links, movie) => {
      const entry1 = movie.spoken_languages;
      const entry2 = movie.keywords;
      const entry3 = movie.crew;
      const entry4 = movie.genres;
      const entry5 = movie.countries;
      const entry6 = movie.companies;

      if (!toDisable[1]) {
        entry1.forEach((d) => {
          if (langDict[d.id] != null) {
            links.push({
              source: `Language_${d.id}`,
              target: `Movie_${movie.id}`,
            });
          }
        });
      }
      if (!toDisable[2]) {
        entry2.forEach((d) => {
          if (wordDict[d.id] != null) {
            links.push({
              source: `Keyword_${d.id}`,
              target: `Movie_${movie.id}`,
            });
          }
        });
      }
      if (!toDisable[3]) {
        entry3.forEach((d) => {
          if (crewDict[d.id] != null) {
            links.push({
              source: `Actor_${d.id}`,
              target: `Movie_${movie.id}`,
            });
          }
        });
      }
      if (!toDisable[4]) {
        entry4.forEach((d) => {
          if (gnreDict[d.id] != null) {
            links.push({
              source: `Genre_${d.id}`,
              target: `Movie_${movie.id}`,
            });
          }
        });
      }
      if (!toDisable[5]) {
        entry5.forEach((d) => {
          if (ctryDict[d.id] != null) {
            links.push({
              source: `Country_${d.id}`,
              target: `Movie_${movie.id}`,
            });
          }
        });
      }
      if (!toDisable[6]) {
        entry6.forEach((d) => {
          if (compDict[d.id] != null) {
            links.push({
              source: `Company_${d.id}`,
              target: `Movie_${movie.id}`,
            });
          }
        });
      }

      return links;
    }, [] as { source: string; target: string }[]) || [];

  const nodes = [];
  !toDisable[0] && nodes.push(...movieNodes);
  !toDisable[1] && nodes.push(...langNodes);
  !toDisable[2] && nodes.push(...wordNodes);
  !toDisable[3] && nodes.push(...actrNodes);
  !toDisable[4] && nodes.push(...gnreNodes);
  !toDisable[5] && nodes.push(...ctryNodes);
  !toDisable[6] && nodes.push(...compNodes);

  const graph = {
    nodes,
    links,
  };

  const toggleIdx = (
    idx: number,
    setState: Dispatch<SetStateAction<boolean[]>>
  ) => {
    setState((prev: boolean[]) => {
      const temp = Array.from(prev);
      temp[idx] = !temp[idx];
      return temp;
    });
  };

  const nameComp = (name: string | number | undefined, comp: string) =>
    name?.toString().split("_")[0] === comp;

  const assignColor = (name: string | number | undefined) => {
    if (nameComp(name, "Movie")) {
      return "#4caf50";
    } else if (nameComp(name, "Language")) {
      return "#f44336";
    } else if (nameComp(name, "Keyword")) {
      return "#2196f3";
    } else if (nameComp(name, "Actor")) {
      return "#ff9800";
    } else if (nameComp(name, "Genre")) {
      return "#9c27b0";
    } else if (nameComp(name, "Country")) {
      return "#795548";
    } else if (nameComp(name, "Company")) {
      return "#607d8b";
    } else {
      return "#ffffff";
    }
  };

  const assignBoolean = (name: string | number | undefined, arr: boolean[]) => {
    if (nameComp(name, "Movie")) {
      return !arr[0];
    } else if (nameComp(name, "Language")) {
      return !arr[1];
    } else if (nameComp(name, "Keyword")) {
      return !arr[2];
    } else if (nameComp(name, "Actor")) {
      return !arr[3];
    } else if (nameComp(name, "Genre")) {
      return !arr[4];
    } else if (nameComp(name, "Country")) {
      return !arr[5];
    } else if (nameComp(name, "Company")) {
      return !arr[6];
    }
    return false;
  };

  return (
    <>
      <ForceGraph3D
        width={width}
        height={height}
        // backgroundColor={"rgba(0,0,0,0)"}
        enableNodeDrag={false}
        graphData={graph}
        nodeLabel="name"
        nodeVisibility={(node: NodeObject) =>
          assignBoolean(node?.id, toHide) || nameComp(node?.id, "Movie")
        }
        nodeColor={(node: NodeObject) => assignColor(node?.id)}
        // nodeCanvasObjectMode={() => "after"}
        nodeThreeObjectExtend={true}
        // linkColor={(link: LinkObject) => assignColor(link.source?.toString())}
        linkColor="#FFFFFF"
        linkWidth={2}
        linkVisibility={(link: LinkObject) =>
          assignBoolean(link?.source?.toString(), toHide) &&
          assignBoolean(link?.target?.toString(), toHide)
        }
        nodeThreeObject={(node: ForceGraphProps["nodeThreeObject"]) => {
          if (assignBoolean(node?.id, toText)) return false;
          const sprite = new SpriteText(node.name) as any;
          sprite.color = "#FFFFFF";
          sprite.backgroundColor = false; //assignColor(node?.id);
          sprite.textHeight = 16;
          sprite.borderRadius = 0.9;
          sprite.padding = [3, 1];
          sprite.position.x = -2;
          sprite.position.y = 30;
          sprite.position.z = 10;
          return sprite;
        }}
      />
      {/* absolute side bar */}

      <div className="fixed top-16 right-4 h-screen w-72 overflow-y-auto rounded px-3 py-4">
        <div className="flex flex-col items-center gap-2">
          <SelectionCard
            title="Language"
            max={langCnt}
            color="#f44336"
            value={vLang}
            setValue={setVLang}
            hide={toHide[1] ?? false}
            setHide={() => toggleIdx(1, setToHide)}
            disable={toDisable[1] ?? false}
            setDisable={() => toggleIdx(1, setToDisable)}
            text={toText[1] ?? false}
            setText={() => toggleIdx(1, setToText)}
          />
          <SelectionCard
            title="Keyword"
            max={wordCnt}
            color="#2196f3"
            value={vWord}
            setValue={setVWord}
            hide={toHide[2] ?? false}
            setHide={() => toggleIdx(2, setToHide)}
            disable={toDisable[2] ?? false}
            setDisable={() => toggleIdx(2, setToDisable)}
            text={toText[2] ?? false}
            setText={() => toggleIdx(2, setToText)}
          />
          <SelectionCard
            title="Actor"
            max={crewCnt}
            color="#ff9800"
            value={vCrew}
            setValue={setVCrew}
            hide={toHide[3] ?? false}
            setHide={() => toggleIdx(3, setToHide)}
            disable={toDisable[3] ?? false}
            setDisable={() => toggleIdx(3, setToDisable)}
            text={toText[3] ?? false}
            setText={() => toggleIdx(3, setToText)}
          />
          <SelectionCard
            title="Genre"
            max={gnreCnt}
            color="#9c27b0"
            value={vGnre}
            setValue={setVGnre}
            hide={toHide[4] ?? false}
            setHide={() => toggleIdx(4, setToHide)}
            disable={toDisable[4] ?? false}
            setDisable={() => toggleIdx(4, setToDisable)}
            text={toText[4] ?? false}
            setText={() => toggleIdx(4, setToText)}
          />
          <SelectionCard
            title="Country"
            max={ctryCnt}
            color="#795548"
            value={vCtry}
            setValue={setVCtry}
            hide={toHide[5] ?? false}
            setHide={() => toggleIdx(5, setToHide)}
            disable={toDisable[5] ?? false}
            setDisable={() => toggleIdx(5, setToDisable)}
            text={toText[5] ?? false}
            setText={() => toggleIdx(5, setToText)}
          />
          <SelectionCard
            title="Company"
            max={compCnt}
            color="#4caf50"
            value={vComp}
            setValue={setVComp}
            hide={toHide[6] ?? false}
            setHide={() => toggleIdx(6, setToHide)}
            disable={toDisable[6] ?? false}
            setDisable={() => toggleIdx(6, setToDisable)}
            text={toText[6] ?? false}
            setText={() => toggleIdx(6, setToText)}
          />
          <button
            className="flex w-full flex-col items-center space-x-5 rounded-2xl bg-white/30 px-5 py-3 text-center align-middle hover:bg-white/70"
            onClick={() => toggleIdx(0, setToHide)}
          >
            <h1>{toHide[0] ? "Show Movie Links" : "Hide Movie Links"}</h1>
          </button>
        </div>
      </div>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRandomSubarray = (arr: any[] | undefined, size: number) => {
  if (arr == null) {
    return [];
  }
  if (size > arr.length) {
    return arr;
  }

  const shuffled = arr.slice(0);
  let i = arr.length;
  const min = i - size;
  let temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
};

const Relation: NextPage = () => {
  const appContext = useContext(DateContext);
  const { data: movies } = api.movie.dateRange.useQuery({
    minDate: appContext?.dateRange.startDate ?? new Date("2015-01-01"),
    maxDate: appContext?.dateRange.endDate ?? new Date("2016-12-31"),
  });

  const [value, setValue] = useState(50);
  const subArray = useMemo(
    () => getRandomSubarray(movies, ((movies?.length ?? 0) * value) / 100),
    [movies, value]
  );

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
      {movies != null && (
        <div className="top-section flex-0 fixed top-20 left-10 z-10 float-left flex flex-row justify-between gap-3">
          <div className="flex flex-col text-left text-white">
            <div className="inline-block text-3xl font-extrabold sm:text-5xl">
              Mo
              <span className="font-extrabold text-[hsl(280,100%,70%)]">
                Vis{" "}
              </span>
            </div>
            <div className="inline-block text-3xl text-[hsl(295,32%,69%)] sm:text-[2rem]">
              Relation Analysis
            </div>
            <div className="my-1">
              Here, you may choose to analyze attributes that you are
              interested.
            </div>
            <div>
              Each slidebar filters the top N entities with the most movie
              counts.
            </div>
          </div>
          <div className="fixed bottom-1 w-1/5 text-gray-400">
            <small>If you notice a lag of your browser, slide this bar:</small>
            <input
              type="range"
              min="0"
              step="5"
              max="100"
              list="tickmarks"
              value={value.toString()}
              className="h-1 w-full bg-[gray]"
              onChange={(e) => setValue(parseInt(e.target.value))}
            />
          </div>
        </div>
      )}
      <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <MyMovieGraph data={subArray} />
      </main>
    </>
  );
};

export default Relation;
