import { redirect } from "next/navigation";

import { DashboardNav } from "@/components/dashboard/nav";
import { UserAccountNav } from "@/components/dashboard/user-account-nav";
import { MainNav } from "@/components/main-nav";
import { getSession } from "@/lib/auth";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = getSession();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  return (
    <div className="mx-auto flex flex-col space-y-6">
      <header className="container sticky top-0 z-10 bg-white">
        <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
          <MainNav
            items={[
              {
                title: "Documentation",
                href: "/docs",
              },
              {
                title: "Support",
                href: "/support",
                disabled: true,
              },
            ]}
          />
          <UserAccountNav />
        </div>
      </header>
      <div className="container grid gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav
            items={[
              {
                title: "Diagrams",
                href: "/dashboard",
                icon: "post",
              },
              {
                title: "Pages",
                href: "/",
                icon: "page",
                disabled: true,
              },
              {
                title: "Media",
                href: "/",
                icon: "media",
                disabled: true,
              },
              {
                title: "Billing",
                href: "/dashboard/billing",
                icon: "billing",
              },
              {
                title: "Settings",
                href: "/dashboard/settings",
                icon: "settings",
              },
            ]}
          />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
