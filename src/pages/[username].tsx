import { GetStaticProps, type NextPage } from "next"
import { LoadingPage } from "~/components/Loading"
import { api } from "~/utils/api"
import { createProxySSGHelpers } from "@trpc/react-query/ssg"
import { appRouter } from "~/server/api/root"
import { PageLayout } from "~/components/PageLayout"
import Image from "next/image"
const ProfileFeed = (props: { userId?: string }) => {

  const { data: posts, isLoading: LoadingPosts } = api.posts.getPosts.useQuery({ userId: props.userId ?? "" })
  if (!posts && !LoadingPage) return <div>No Post to View</div>
  if (LoadingPosts) return <LoadingPage></LoadingPage>
  return (
    <div className="flex flex-col" >
      {posts?.map((post) => <PostView {...post} key={post.post.id} ></PostView>)}
    </div>
  )
}
const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getUser.useQuery({ username: username });
  if (!user) return <div>404</div>
  const size = 120;
  return (
    <PageLayout>
      <div className={`relative  bg-slate-800 h-32  `} >
        <div className={`absolute left-0 bottom-0 -mb-[60px] pl-8 `} ><Image src={user.profileImageUrl} alt={`${user.username ?? ""}'s profile pic`} height={size} width={size} className="rounded-full border-4 border-black" /></div>

        {/* <div className="w-full border-b border-slate-400 " ></div> */}
      </div>
      <div className="h-12" ></div>
      <div className="py-4 px-8" >
        <div className="font-bold text-lg" > @{user.username}</div>
      </div>
      {/* <div className="clear-both" ></div> */}
      <ProfileFeed userId={user.id} ></ProfileFeed>

    </PageLayout>
    // <UserProfile></UserProfile>
  )
}
import superjson from "superjson"
import { prisma } from "~/server/db"
import { PostView } from "~/components/PostView"
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
