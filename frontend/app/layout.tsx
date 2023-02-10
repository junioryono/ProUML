import { Inter as FontSans } from "@next/font/google";

import "@/styles/globals.css";

import { cn } from "@/lib/utils";
import { Toaster } from "@/ui/toast";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import AuthProvider from "@/lib/auth-client";

import Analytics from "@/components/analytics";

const fontSans = FontSans({
   subsets: ["latin"],
   variable: "--font-inter",
});

export const metadata = {
   title: "ProUML",
   description: "TODO",
   url: "https://prouml.com.com",
   siteName: "ProUML",
   images: {
      url: "https://prouml.com.com/og.jpg",
      alt: "ProUML",
   },
   locale: "en-US",
   type: "website",
   twitter: {
      card: "summary_large_image",
      title: "ProUML",
      description: "TODO",
      images: {
         url: "https://prouml.com.com/og.jpg",
         alt: "ProUML",
      },
   },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en" className={cn("bg-white font-sans text-slate-900 antialiased", fontSans.variable)}>
         <head />
         <body className="min-h-screen">
            <AuthProvider>
               {children}
               <Analytics />
               <Toaster position="bottom-right" />
               <TailwindIndicator />
            </AuthProvider>
         </body>
      </html>
   );
}
