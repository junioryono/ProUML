"use client";

import * as React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { MainNavItem } from "types";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { MobileNav } from "@/components/mobile-nav";
import { useAuth } from "@/lib/auth-client";

interface MainNavProps {
   items?: MainNavItem[];
   children?: React.ReactNode;
}

export function MainNav({ items, children }: MainNavProps) {
   const { user } = useAuth();
   const segment = useSelectedLayoutSegment();
   const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

   if (!items?.length) {
      items = [
         {
            title: "Marketplace",
            href: "/marketplace",
         },
         {
            title: "Explore",
            href: "/explore",
         },
         {
            title: "GitHub",
            href: "https://github.com/junioryono/prouml",
            newTab: true,
            hideOnXS: true,
         },
      ];
   }

   const mobileMenuItems = [
      {
         title: "Home",
         href: "/",
      },
      {
         title: "Projects",
         href: "/dashboard/projects",
      },
      {
         title: "Diagrams",
         href: "/dashboard/diagrams",
      },
      {
         title: "Issues",
         href: "/dashboard/issues",
      },
      {
         title: "Settings",
         href: "/dashboard/settings",
      },
   ];

   return (
      <div className="flex gap-4 sm:gap-6 lg:gap-10">
         <Link href="/" className={cn("items-center space-x-2 flex", user && "hidden lg:flex")}>
            <Icons.logo />
            <span className="font-bold inline-block">ProUML</span>
         </Link>

         {user && (
            <>
               <button
                  className="flex lg:hidden items-center space-x-2 z-[100]"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
               >
                  {showMobileMenu ? <Icons.close /> : <Icons.logo />}
                  <span className="font-bold">Menu</span>
               </button>
               {showMobileMenu && (
                  <MobileNav items={mobileMenuItems} hide={() => setShowMobileMenu(false)}>
                     {children}
                  </MobileNav>
               )}
            </>
         )}

         {items?.length ? (
            <nav className="gap-3 sm:gap-6 flex">
               {items?.map((item, index) => (
                  <Link
                     key={index}
                     href={item.disabled ? "#" : item.href}
                     target={item.newTab ? "_blank" : undefined}
                     className={cn(
                        "flex items-center text-sm font-semibold text-slate-600",
                        item.href.startsWith(`/${segment}`) && "text-slate-900",
                        item.disabled && "cursor-not-allowed opacity-80",
                        item.hideOnXS && "hidden sm:flex",
                     )}
                  >
                     {item.title}
                  </Link>
               ))}
            </nav>
         ) : null}
      </div>
   );
}
