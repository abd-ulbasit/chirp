import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime)
import { type RouterOutputs, } from "~/utils/api";
import Link from "next/link";
type TweetProps = RouterOutputs["tweet"]["getAll"][number]
export const Tweet = (props: TweetProps) => {
    const { tweet, author } = props;
    return (
        <div className="card flex-row px-1 py-3 gap-4 border">
            <div>
                <Image src={author.profileImageUrl} alt="Profile pic" className="rounded-full" width={56} height={56} />
            </div>
            <div key={tweet.id} className="flex flex-col ">
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
        </div>
    )
}