import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { movieRouter } from "./routers/movie";
import { getAllRouter } from "./routers/getAll";
import { companyRouter } from "./routers/company";
import { personRouter } from "./routers/person";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  getAll: getAllRouter,
  movie: movieRouter,
  company: companyRouter,
  person: personRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
