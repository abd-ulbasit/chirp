import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";

const MyApp: AppType = ({ Component, pageProps }) => {

  return (
    <ThemeProvider defaultTheme="cyberpunk" >

      <ClerkProvider {...pageProps} >
        <Toaster position="top-right" />
        <Component {...pageProps} />
      </ClerkProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
