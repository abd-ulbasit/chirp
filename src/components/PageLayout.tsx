import type { PropsWithChildren } from "react";


export const PageLayout = (props: PropsWithChildren) => {
    return (

        <main className="flex justify-center h-screen">
            <div className="border-slate-200 border-x w-full md:max-w-3xl">{props.children}</div>
        </main>
    )
}
