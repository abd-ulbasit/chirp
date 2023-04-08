import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { filterForClient } from "~/server/helpers/filterUserForClient";
import type { Tweet } from "@prisma/client";

// Create a new ratelimiter, that allows 4 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});
const addUserDataToTweets = async (tweets: Tweet[]) => {
  const users = (
    await clerkClient.users.getUserList({
      limit: 100,
      userId: tweets.map((tweet) => tweet.authorId),
    })
  ).map(filterForClient);
  return tweets.map((tweet) => {
    const author = users.find((user) => user.id === tweet.authorId);
    if (!author)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Could not find author for tweet ${tweet.id}`,
      });
    return {
      tweet: tweet,
      author,
    };
  });
};
export const tweetRouter = createTRPCRouter({
  getbyTweetId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const tweet = await ctx.prisma.tweet.findUnique({
        where: { id: input.id },
      });
      if (!tweet) throw new TRPCError({ code: "NOT_FOUND" });
      return (await addUserDataToTweets([tweet]))[0];
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const tweets = await ctx.prisma.tweet.findMany({
      orderBy: [{ createdAt: "desc" }],
    });
    return addUserDataToTweets(tweets);
  }),
  getTweetsByAuthor: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return addUserDataToTweets(
        await ctx.prisma.tweet.findMany({
          where: { authorId: input.userId },
          orderBy: [{ createdAt: "desc" }],
          take: 100,
        })
      );
    }),
  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji().min(1).max(30),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.userId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      const tweet = await ctx.prisma.tweet.create({
        data: {
          content: input.content,
          authorId: ctx.userId,
        },
      });
      return tweet;
    }),
});
