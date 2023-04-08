import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { PageLayout } from "~/components/PageLayout"
import { PostView } from "~/components/PostView"
import { generateSSGHelper } from "~/server/helpers/generateSSGHelper"
import { api } from "~/utils/api"

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: post, isLoading: loadingPost } = api.posts.getbyId.useQuery({ id })
  if (loadingPost) return <div>Loading</div>
  if (!post) return <div>404</div>
  return (
    <>
      <Head>
        <title>{`${post.post.content} - ${post.author.username ?? ""}`}</title>
      </Head>
      <PageLayout>
        <PostView {...post} key={post?.post.id ?? ""}></PostView>
      </PageLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;
  if (typeof id !== "string") throw new Error("Invalid id");
  await ssg.posts.getbyId.prefetch({ id });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id
    }
  }
}
export const getStaticPaths = () => {
  // ! TODO: Implement this : when we have a way to get all post ids
  // const { data: params } = await api.posts.getAllIds.useQuery()
  // const paths = params?.map((id) => ({ params: { id } })) ?? []
  return {
    paths: [],
    fallback: false
  }
}
export default SinglePostPage