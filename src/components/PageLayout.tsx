import 'tailwindcss/tailwind.css'
import { useTheme } from "next-themes";
import type { PropsWithChildren } from "react";

const ThemeChanger = () => {
    const { theme, setTheme } = useTheme()
    // const themes = ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"];
    const themes = ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua"]
    const handleThemeSelect = (theme: string) => {
        setTheme(theme)
        // document.body.click()
    }
    return (

        <div className="dropdown dropdown-end dropdown-hover hidden sm:block " id='dropdown' >
            <label tabIndex={0} className="btn  capitalize w-48">Theme : {theme}</label>
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

    return (

        <main className="flex justify-center relative">
            <div className="w-full md:max-w-3xl">{props.children}</div>
            <div className='fixed right-3 top-3' >
                <ThemeChanger></ThemeChanger>
            </div>
        </main>
    )
}
