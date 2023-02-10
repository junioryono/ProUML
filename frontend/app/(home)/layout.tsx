import MainNav from "@/components/main-nav";
import SiteFooter from "@/components/site-footer";
import UserAccountNav from "@/components/dashboard/user-account-nav";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
   return (
      <div className="flex min-h-screen flex-col">
         <header className="container sticky top-0 z-10 bg-white">
            <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
               <MainNav
                  items={[
                     {
                        title: "Features",
                        href: "/features",
                     },
                     {
                        title: "Blog",
                        href: "/blog",
                     },
                     {
                        title: "GitHub",
                        href: "https://github.com/junioryono/ProUML",
                        newTab: true,
                        hideOnXS: true,
                     },
                  ]}
               />
               <UserAccountNav />
            </div>
         </header>
         <main className="flex-1">{children}</main>
         <SiteFooter />
      </div>
   );
}
