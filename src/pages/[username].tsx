import { UserProfile } from "@clerk/nextjs"
import { create } from "domain"
import { GetStaticPaths, GetStaticPathsContext, GetStaticProps, GetStaticPropsContext, NextPage } from "next"
import { LoadingPage } from "~/components/Loading"
import { api } from "~/utils/api"
import { createProxySSGHelpers } from "@trpc/react-query/ssg"
import { appRouter } from "~/server/api/root"
const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getUser.useQuery({ username: username })
  if (!user) return <div>404</div>
  console.log(user);

  return (
    <div>{user.username}</div>
    // <UserProfile></UserProfile>
  )
}
import superjson from "superjson"
import { prisma } from "~/server/db"
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  })
  console.log("Params", context.params);

  const atusername = context.params?.username;
  if (typeof atusername !== "string") throw new Error("Invalid username");
  const username = atusername.replace("@", "");
  await ssg.profile.getUser.prefetch({ username: username })
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username
    }
  }
}
// export async function getStaticPaths(context: GetStaticPathsContext) {
//   const { data: params } = api.profile.getAllUserIds.useQuery()
//   console.log("Params", params);

//   return { params, fallback: "blocking" }
// }
export const getStaticPaths = () => {
  return {
    paths: ["/@abd-ulbasit"],
    fallback: "blocking"
  }
}
export default ProfilePage
