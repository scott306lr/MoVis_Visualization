import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;

type KeyMap<T> = {
  [key: string]: T;
};

type CompanyData = RouterOutput["company"]["betweenYearRange"][number];
type MovieData = RouterOutput["getAll"]["movie"][number];

type Subset = {
  name: string;
  data: MovieData[];
  selected: boolean;
};

const AllGenres = [
  "Animation",
  "Adventure",
  "Family",
  "Comedy",
  "Fantasy",
  "Romance",
  "Drama",
  "Action",
  "Crime",
  "Thriller",
  "Horror",
  "History",
  "Science Fiction",
  "Mystery",
  "War",
  "Music",
  "Documentary",
  "Western",
  "TV Movie",
];

export { AllGenres };
export type { KeyMap, Subset, MovieData, CompanyData };
