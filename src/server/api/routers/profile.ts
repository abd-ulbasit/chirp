import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { filterForClient } from "~/server/helpers/filterUserForClient";

export const profileRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ input }) => {
      console.log("input is: ", input);

      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });
      console.log("user from getUserList", user);
      // const user = await clerkClient.users.getUser(input.username);
      // console.log("user from get user", user);
      // const user =await clerkClient.users.getUserList()

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }
      return filterForClient(user);
    }),
  getAllUserIds: publicProcedure.query(async () => {
    const users = await clerkClient.users.getUserList();
    return users.map((user) => {
      return {
        params: {
          username: user.username!,
        },
      };
    });
  }),
});
