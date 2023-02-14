import "@/styles/globals.css";
import { Toaster } from "@/ui/toast";
import type { AppProps } from "next/app";

import { TailwindIndicator } from "@/components/tailwind-indicator";
import Analytics from "@/components/analytics";

export default function App({ Component, pageProps }: AppProps<any>) {
   return (
      <>
         <Component {...pageProps} />
         <Analytics />
         <Toaster position="bottom-right" />
         <TailwindIndicator />
      </>
   );
}
