import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const getAllRouter = createTRPCRouter({
  movie: publicProcedure.query(async ({ ctx }) => {
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
        }
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

  person: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.person.findMany();
  }),

  country: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.country.findMany();
  }),

  keyword: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.keyword.findMany();
  }),

  company: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.company.findMany();
  }),

  genre: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.genre.findMany();
  }),

  language: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.language.findMany();
  }),

  user: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  rating: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.rating.findMany();
  })

});
