import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter as FontSans } from "@next/font/google";
import { Toaster } from "@/ui/toast";

import { TailwindIndicator } from "@/components/tailwind-indicator";
import Analytics from "@/components/analytics";

const fontSans = FontSans({
   subsets: ["latin"],
   variable: "--font-inter",
});

// fontSans.variable

export default function App({ Component, pageProps }: AppProps<any>) {
   return (
      <div className={fontSans.className}>
         <Component {...pageProps} />
         <Analytics />
         <Toaster position="bottom-right" />
         <TailwindIndicator />
      </div>
   );
}
