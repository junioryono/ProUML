import "@/styles/globals.css";
import { Toaster } from "@/ui/toast";
import type { AppProps } from "next/app";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import TailwindIndicator from "@/components/tailwind-indicator";

export default function App({ Component, pageProps }: AppProps<any>) {
   return (
      <>
         <Component {...pageProps} />
         <VercelAnalytics />
         <Toaster position="bottom-right" />
         <TailwindIndicator />
      </>
   );
}
