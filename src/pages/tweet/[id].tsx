import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { PageLayout } from "~/components/PageLayout"
import { Tweet as Tweet } from "~/components/Tweet"
import { generateSSGHelper } from "~/server/helpers/generateSSGHelper"
import { api } from "~/utils/api"

const SingleTweetPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: tweet, isLoading: loadingTweet } = api.tweet.getbyTweetId.useQuery({ id })
  if (loadingTweet) return <div>Loading</div>
  if (!tweet) return <div>404</div>
  return (
    <>
      <Head>
        <title>{`${tweet.tweet.content} - ${tweet.author.username ?? ""}`}</title>
      </Head>
      <PageLayout>
        <Tweet {...tweet} key={tweet?.tweet.id ?? ""}></Tweet>
      </PageLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;
  if (typeof id !== "string") throw new Error("Invalid id");
  await ssg.tweet.getbyTweetId.prefetch({ id });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id
    }
  }
}
export const getStaticPaths = () => {
  // ! TODO: Implement this : when we have a way to get all tweets ids
  // const { data: params } = await api.tweet.getAllIds.useQuery()
  // const paths = params?.map((id) => ({ params: { id } })) ?? []
  return {
    paths: [],
    fallback: false
  }
}
export default SingleTweetPage