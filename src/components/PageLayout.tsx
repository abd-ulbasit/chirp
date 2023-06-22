import 'tailwindcss/tailwind.css'
import { useTheme } from "next-themes";
import { useEffect, type PropsWithChildren, useState } from "react";
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
const ThemeChanger = () => {
    // This is a hack to prevent the hydration mismatch Error
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme()
    useEffect(() => setMounted(true), [])
    if (!mounted) return null;

    // const themes = ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"];
    const themes = ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua"]
    const handleThemeSelect = (theme: string) => {
        setTheme(theme)
        // document.body.click()
    }
    return (

        <div className="dropdown dropdown-end dropdown-hover hidden sm:block " id='dropdown' >
            <label tabIndex={0} className="btn  capitalize w-48">Theme : {theme ?? ""}</label>
            <ul tabIndex={0} className="dropdown-content menu p-1 shadow bg-base-100 rounded-box w-48">
                <div className='flex gap-2 flex-col  '  >
                    {themes.map((theme) =>
                        <button className='btn capitalize' key={theme} value={theme} onClick={() => handleThemeSelect(theme)}>
                            <li key={theme}>
                                {theme}
                            </li>
                        </button>
                    )}
                </div>
            </ul>
        </div>

    )
}


export const PageLayout = (props: PropsWithChildren) => {
    const { isSignedIn, user } = useUser()

    return (

        <main className="">
            <div className="navbar bg-base-100 fixed z-10">
                <div className="flex-1">
                    <Link href={"/"} className="btn btn-ghost normal-case text-xl">Twitter</Link>
                </div>
                <div className="flex-none">
                    <ThemeChanger></ThemeChanger>
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <Image src={user?.profileImageUrl ?? ""} alt={user?.username ?? ""} width={40} height={40} />
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">

                            <li>{isSignedIn ?
                                <SignOutButton>LogOut</SignOutButton> :
                                <SignInButton  >LogIn</SignInButton>}
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
            <div className="w-full md:max-w-3xl pt-20 border mx-auto">{props.children}</div>
        </main>
    )
}
