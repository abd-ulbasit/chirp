# Chirp - A Twitter Clone

## Roadmap

- [x] User Authentication
- [x] User Profiles
- [x] User Tweets
- [ ] Enhanced User Interface
- [ ] User Replies
- [ ] User Retweets
- [ ] User Follows
- [ ] User Feed
- [ ] User Likes
- [ ] User Search
- [ ] User Settings
- [ ] User DMs

## Stack

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Vercel](https://vercel.com)
- Clerk
- React-hot-toast
- Upstash

And A lot of other cool opensource libraries and tools.

## Getting Started

- Clone the repo
- Install dependencies with `pnpm`
- Create a `.env` file with the following variables:
  - `NEXT_PUBLIC_CLERK_FRONTEND_API`
  - `CLERK_API_KEY`
  - `CLERK_API_SECRET`
  - `UPSTASH_API_KEY`
  - `UPSTASH_API_SECRET`
  - `DATABASE_URL`
- Run `pnpm dev` to start the development server
- Run `pnpm build` to build the app for production
