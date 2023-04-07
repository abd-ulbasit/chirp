import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime)
import { type RouterOutputs, } from "~/utils/api";
import Link from "next/link";
type PostViewProps = RouterOutputs["posts"]["getAll"][number]
export const PostView = (props: PostViewProps) => {
    const { post, author } = props;
    return (
        <div className="card flex-row px-1 py-3 gap-4 border">
            <div>
                <Image src={author.profileImageUrl} alt="Profile pic" className="rounded-full" width={56} height={56} />
            </div>
            <div key={post.id} className="flex flex-col ">
                <div className="flex gap-2">
                    <Link href={`/@${author.username ?? ""}`}>
                        <div>{`@${author.username ?? ""}`}</div>
                    </Link>
                    <div>&apos;</div>
                    <div>{dayjs(post.createdAt).fromNow()}</div>
                </div>
                <div className="text-2xl">
                    <Link href={`/post/${post.id}`}>
                        {post.content}
                    </Link>
                </div>
            </div>
        </div>
    )
}