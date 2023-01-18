import { DashboardNav } from "@/components/dashboard/nav";
import { UserAccountNav } from "@/components/dashboard/user-account-nav";
import { MainNav } from "@/components/main-nav";
import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/dashboard");
   }

   return (
      <div className="mx-auto flex flex-col space-y-6">
         <header className="container sticky top-0 z-10 bg-white">
            <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
               <MainNav />
               <UserAccountNav />
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
                        title: "Teams",
                        href: "/dashboard/teams",
                        icon: "users",
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
