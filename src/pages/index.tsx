import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime)
import { api } from "~/utils/api";
import { Loading, LoadingPage } from "~/components/Loading";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { PageLayout } from "~/components/PageLayout";
import { Tweet } from "~/components/Tweet";
const CreateTweetWizard = () => {
  const [content, setContent] = useState("")
  const user = useUser();
  const ctx = api.useContext()
  const { mutate: createTweet, isLoading: isTweeting } = api.tweet.create.useMutation({
    onSuccess: async () => {
      await ctx.tweet.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to Tweet! Please try again later.");
      }
    }

  })
  if (!user) return null;
  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createTweet({ content: content })
      setContent(() => "")
    }
  }
  return (
    <div className="flex gap-4 w-full" >
      <Image src={user.user?.profileImageUrl ?? ""} alt="Profile pic" className="rounded-full" width={56} height={56} />
      <input type="text" placeholder="Have something on mind?" value={content} className="bg-transparent grow outline-none" onKeyDown={handleInputKeyPress}
        onChange={(e) => setContent(e.currentTarget.value)} ></input>
      {content != "" && !isTweeting && <button className="btn" onClick={() => { createTweet({ content: content }); setContent(() => "") }} >Tweet</button>}
      {isTweeting && <div className="flex justify-center items-center" >
        <Loading size={30}></Loading>
      </div>
      }
    </div>
  )
}
const Feed = () => {
  const { data: tweets, isLoading: feedIsLoading } = api.tweet.getAll.useQuery()
  if (feedIsLoading) return <div className="flex w-full h-screen justify-center items-center " >
    <Loading></Loading>
  </div>
  if (!tweets) return <div className="text-center" >No Tweets</div>
  return (
    <div className="flex flex-col gap-2" >
      {tweets?.map((tweet) => <Tweet {...tweet} key={tweet.tweet.id} />)}
    </div>
  )
}
const Home: NextPage = () => {
  const { isLoaded, isSignedIn } = useUser();
  // console.log(user);
  if (!isLoaded) return <LoadingPage size={70}></LoadingPage>
  return (
    <>
      <Head>
        <title>Twitter </title>
        <meta name="description" content="It's a twitter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>

        <div className="p-2 py-4">
          {isSignedIn ? <CreateTweetWizard></CreateTweetWizard> : null}
        </div>
        <Feed></Feed>
      </PageLayout>

    </>
  );
};
// export const getStaticProps = () => {
//   return {
//     props: {
//       // props for your component
//     },
//   }
// }
// export const getStaticPaths = () => {
//   return {
//     paths: [],
//     fallback: true,
//   }
// }
export default Home;
