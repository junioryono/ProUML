import { ReactNode, useState } from "react";
import { MainNavItem, User } from "types";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import Link from "next/link";

import MobileNav from "@/components/mobile-nav";
import { Icons } from "@/components/icons";

interface MainNavProps {
   user: User;
   items?: MainNavItem[];
   children?: ReactNode;
}

export default function MainNav({ user, items, children }: MainNavProps) {
   const router = useRouter();
   const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

   if (!items?.length) {
      items = [
         {
            title: "Home",
            href: "/",
            hideOnXS: true,
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
         title: "Diagrams",
         href: "/dashboard/diagrams",
      },
      {
         title: "Shared",
         href: "/dashboard/shared",
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
                        "flex items-center text-sm font-semibold text-slate-600 hover:text-black",
                        item.href.startsWith(router.asPath) && "text-slate-black",
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
