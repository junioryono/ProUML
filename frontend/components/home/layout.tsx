import { User } from "types";

import UserAccountNav from "@/components/dashboard/user-account-nav";
import SiteFooter from "@/components/site-footer";
import MainNav from "@/components/main-nav";

export default function HomeLayout({ user, children }: { user: User; children: React.ReactNode }) {
   return (
      <div className="flex min-h-screen flex-col">
         <header className="container sticky top-0 z-10 bg-white">
            <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
               <MainNav
                  user={user}
                  items={[
                     {
                        title: "Home",
                        href: "/",
                     },
                     {
                        title: "Documentation",
                        href: "/documentation.pdf",
                        newTab: true,
                     },
                     {
                        title: "Poster",
                        href: "/poster.pdf",
                        newTab: true,
                     },
                     {
                        title: "GitHub",
                        href: "https://github.com/junioryono/ProUML",
                        newTab: true,
                     },
                  ]}
               />
               <UserAccountNav user={user} />
            </div>
         </header>
         <main className="flex-1">{children}</main>
         <SiteFooter />
      </div>
   );
}
