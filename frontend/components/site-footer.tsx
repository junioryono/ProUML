import Link from "next/link";

import { Icons } from "@/components/icons";

export default function SiteFooter() {
   return (
      <footer className="container bg-white text-slate-600">
         <div className="flex  flex-col items-center justify-between gap-4 border-t border-t-slate-200 py-10 md:h-24 md:flex-row md:py-0">
            <Link
               href="/"
               rel="noreferrer"
               className="font-medium no-underline"
               onClick={(e) => {
                  if (window.location.pathname === "/") {
                     e.preventDefault();
                     window.scrollTo({ top: 0, behavior: "smooth" });
                  }
               }}
            >
               <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                  <Icons.logo />
                  <p className="text-center text-sm leading-loose md:text-left">ProUML</p>
               </div>
            </Link>
            <p className="text-center text-sm md:text-left">
               The source code is available on{" "}
               <Link
                  href="https://github.com/junioryono/prouml"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-4"
               >
                  GitHub
               </Link>
               .
            </p>
         </div>
      </footer>
   );
}
