import MainNav from "@/components/main-nav";
import UserAccountNav from "@/components/dashboard/user-account-nav";
import DashboardNav from "./nav";
import { User } from "types";

export default function DashboardLayout({ user, children }: { user: User; children: React.ReactNode }) {
   return (
      <div className="mx-auto flex flex-col space-y-6">
         <header className="container sticky top-0 z-10 bg-white">
            <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
               <MainNav user={user} />
               <UserAccountNav user={user} />
            </div>
         </header>
         <div className="container grid gap-12 lg:grid-cols-[200px_1fr]">
            <aside className="hidden w-[200px] flex-col lg:flex">
               <DashboardNav
                  items={[
                     {
                        title: "Diagrams",
                        href: "/dashboard/diagrams",
                        icon: "post",
                     },
                     {
                        title: "Projects",
                        href: "/dashboard/projects",
                        icon: "fileImage",
                     },
                     {
                        title: "Issues",
                        href: "/dashboard/issues",
                        icon: "bug",
                     },
                     {
                        title: "Settings",
                        href: "/dashboard/settings",
                        icon: "settings",
                     },
                  ]}
               />
            </aside>
            <main className="flex w-full flex-1 flex-col">{children}</main>
         </div>
      </div>
   );
}
