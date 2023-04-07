import type { PropsWithChildren } from "react";


export const PageLayout = (props: PropsWithChildren) => {
    return (

        <main className="flex justify-center ">
            <div className="w-full md:max-w-3xl">{props.children}</div>
        </main>
    )
}
