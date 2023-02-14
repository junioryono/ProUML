import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter as FontSans } from "@next/font/google";
import { Toaster } from "@/ui/toast";

import { TailwindIndicator } from "@/components/tailwind-indicator";
import Analytics from "@/components/analytics";

const fontSans = FontSans({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps<any>) {
   return (
      <>
         <style jsx global>{`
            :root {
               --font-inter: ${fontSans.style.fontFamily};
            }
         `}</style>
         <Component {...pageProps} />
         <Analytics />
         <Toaster position="bottom-right" />
         <TailwindIndicator />
      </>
   );
}
