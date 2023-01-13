import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const personRouter = createTRPCRouter({
  betweenYearRange: publicProcedure
    .input(z.object({ minYear: z.number(), maxYear: z.number() }))
    .query( async ({ ctx, input }) => {
      const personWithRatings = await ctx.prisma.person.findMany({
        include: {
          movies: {
            where: {
              release_date: {
                gte: new Date(input.minYear, 0, 1).toISOString(),
                lte: new Date(input.maxYear, 12, 31).toISOString(),
              },
            },
            include: {
              spoken_languages: true,
              keywords: true,
              crew: true,
              genres: true,
              countries: true,
              companies: true,
              ratings: true,
            }
          },
        },
      });
      
      const ratedPeople = personWithRatings.map((person) => {
        const movies = person.movies.map((movie) => {
          const ratings = movie.ratings.map((rating) => rating.rating);
          const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
          const { ratings: _, ...movieWithoutRatings } = movie;
          return { ...movieWithoutRatings, averageRating };
        })
        return { ...person, movies };
      });
  
      return ratedPeople;
    }),
});
