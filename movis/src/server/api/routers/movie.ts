import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const movieRouter = createTRPCRouter({
  betweenYearRange: publicProcedure
    .input(z.object({ minYear: z.number(), maxYear: z.number() }))
    .query(async ({ ctx, input }) => {
      const movieWithRatings = await ctx.prisma.movie.findMany({
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
          ratings: {
            select: {
              rating: true,
            },
          },
        },
      });

      //drop ratings
      const ratedMovies = movieWithRatings.map((movie) => {
        const ratings = movie.ratings.map((rating) => rating.rating);
        const averageRating =
          ratings.reduce((a, b) => a + b, 0) / ratings.length;
        const { ratings: _, ...movieWithoutRatings } = movie;
        return { ...movieWithoutRatings, averageRating };
      });

      return ratedMovies;
    }),

  dateRange: publicProcedure
    .input(z.object({ minDate: z.date(), maxDate: z.date() }))
    .query(async ({ ctx, input }) => {
      const movieWithRatings = await ctx.prisma.movie.findMany({
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
          ratings: {
            select: {
              rating: true,
            },
          },
        },
      });

      //drop ratings
      const ratedMovies = movieWithRatings.map((movie) => {
        const ratings = movie.ratings.map((rating) => rating.rating);
        const averageRating =
          ratings.reduce((a, b) => a + b, 0) / ratings.length;
        const { ratings: _, ...movieWithoutRatings } = movie;
        return { ...movieWithoutRatings, averageRating };
      });

      return ratedMovies;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const movieWithRatings = await ctx.prisma.movie.findMany({
      include: {
        spoken_languages: true,
        keywords: true,
        crew: true,
        genres: true,
        countries: true,
        companies: true,
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    //drop ratings
    const ratedMovies = movieWithRatings.map((movie) => {
      const ratings = movie.ratings.map((rating) => rating.rating);
      const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      const { ratings: _, ...movieWithoutRatings } = movie;
      return { ...movieWithoutRatings, averageRating };
    });

    return ratedMovies;
  }),
});
