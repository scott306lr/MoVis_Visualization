import { number, z, array, map } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const companyRouter = createTRPCRouter({
  betweenYearRange: publicProcedure
    .input(
      z.object({
        companyIds: z.number().array(),
        minYear: z.number(),
        maxYear: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const companyWithRatings = await ctx.prisma.company.findMany({
        where: {
          id: {
            in: input.companyIds,
          },
        },
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
            },
          },
        },
      });

      const ratedCompanies = companyWithRatings.map((rating) => {
        return rating.movies.map((movie) => {
          const ratings = movie.ratings.map((rating) => rating.rating);
          const averageRating =
            ratings.reduce((a, b) => a + b, 0) / ratings.length;
          const { ratings: _, ...movieWithoutRatings } = movie;

          return { ...movieWithoutRatings, averageRating };
        });
      });

      return ratedCompanies;
    }),

    dateRange: publicProcedure
    .input(
      z.object({
        companyId: z.number(),
        minDate: z.date(),
        maxDate: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const companyWithRatings = await ctx.prisma.company.findFirstOrThrow({
        where: {
          id: input.companyId,
        },
        include: {
          movies: {
            where: {
              release_date: {
                gte: new Date(input.minDate).toISOString(),
                lte: new Date(input.maxDate).toISOString(),
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
            },
          },
        },
      });

      if (!companyWithRatings.movies) {
        return [];
      }
      
      const ratedCompanies = companyWithRatings.movies.map((movie) => {
          const ratings = movie.ratings.map((rating) => rating.rating);
          const averageRating =
            ratings.reduce((a, b) => a + b, 0) / ratings.length;
          const { ratings: _, ...movieWithoutRatings } = movie;

          return { ...movieWithoutRatings, averageRating };
        });
      
      return ratedCompanies;
    }),
});
