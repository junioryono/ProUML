import Link from "next/link";

import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";
import { UserAccountNav } from "@/components/dashboard/user-account-nav";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
  const user = undefined;
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container sticky top-0 z-40 bg-white">
        <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
          <MainNav
            items={[
              {
                title: "Features",
                href: "/features",
                disabled: true,
              },
              {
                title: "Pricing",
                href: "/pricing",
              },
              {
                title: "Blog",
                href: "/blog",
              },
              {
                title: "Documentation",
                href: "/docs",
              },
              {
                title: "Contact",
                href: "/contact",
                disabled: true,
              },
            ]}
          />
          {user ? (
            <UserAccountNav />
          ) : (
            <nav>
              <Link
                href="/login"
                className="relative inline-flex h-8 items-center rounded-md border border-transparent bg-brand-500 px-6 py-1 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Login
              </Link>
            </nav>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
