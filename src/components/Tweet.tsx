import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime)
import { api, type RouterOutputs, } from "~/utils/api";
import Link from "next/link";
import { AiOutlineDelete } from "react-icons/ai"
import { useSession } from "@clerk/nextjs";
type TweetProps = RouterOutputs["tweet"]["getAll"][number]
export const Tweet = (props: TweetProps) => {
    const session = useSession();
    const { tweet, author } = props;
    const ctx = api.useContext()
    const deleteTweet = api.tweet.delete.useMutation({
        onSuccess: async () => {
            await ctx.tweet.getAll.invalidate();
        }
    })
    const handleDeleteTweet = (id: string) => {
        deleteTweet.mutate({ id })
    }
    return (
        <div className="card flex-row px-1 py-3 gap-4 border">
            <div>
                <Image src={author.profileImageUrl} alt="Profile pic" className="rounded-full" width={56} height={56} />
            </div>
            <div key={tweet.id} className="flex flex-col flex-grow   ">
                <div className="flex gap-2">
                    <Link href={`/@${author.username ?? ""}`}>
                        <div>{`@${author.username ?? ""}`}</div>
                    </Link>
                    <div>&apos;</div>
                    <div>{dayjs(tweet.createdAt).fromNow()}</div>
                </div>
                <div className="">
                    <Link href={`/tweet/${tweet.id}`}>
                        {tweet.content}
                    </Link>
                </div>
            </div>
            {tweet.authorId === session.session?.user?.id &&
                <button className=" btn btn-circle btn-outline" disabled={deleteTweet.isLoading} onClick={() => handleDeleteTweet(tweet.id)} >{<AiOutlineDelete></AiOutlineDelete>}</button>

            }
            {tweet.authorId !== session.session?.user?.id && session.isSignedIn &&
                <button className="btn btn-circle" >R</button>

            }
        </div >
    )
}