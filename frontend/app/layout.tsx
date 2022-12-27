import { Inter as FontSans } from "@next/font/google";

import "@/styles/globals.css";

import { cn } from "@/lib/utils";
import { Toaster } from "@/ui/toast";
import { Analytics } from "@/components/analytics";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import Providers from "@/lib/auth-client";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-inter",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={cn("bg-white font-sans text-slate-900 antialiased", fontSans.variable)}>
      <head />
      <body className="min-h-screen">
        <Providers>
          {children}
          <Analytics />
          <Toaster position="bottom-right" />
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}
