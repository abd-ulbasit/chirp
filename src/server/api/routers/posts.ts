import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, privateProcedure, publicProcedure } from "./../trpc";
import type { User } from "@clerk/nextjs/dist/api";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
const filterForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 4 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(4, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});
export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      orderBy: [{ createdAt: "desc" }],
    });
    const users = (
      await clerkClient.users.getUserList({
        limit: 100,
        userId: posts.map((post) => post.authorId),
      })
    ).map(filterForClient);
    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);
      if (!author)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Could not find author for post ${post.id}`,
        });
      return {
        post,
        author,
      };
    });
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
      const post = await ctx.prisma.post.create({
        data: {
          content: input.content,
          authorId: ctx.userId,
        },
      });
      return post;
    }),
});
