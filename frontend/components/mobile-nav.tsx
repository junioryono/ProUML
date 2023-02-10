"use client";

import * as React from "react";
import Link from "next/link";

import { MainNavItem } from "types";
import { cn } from "@/lib/utils";
import { useLockBody } from "@/hooks/use-lock-body";

interface MobileNavProps {
   hide: () => void;
   items: MainNavItem[];
   children?: React.ReactNode;
}

export default function MobileNav({ items, children, hide }: MobileNavProps) {
   useLockBody();

   return (
      <div className="fixed inset-0 top-0 pt-16 z-50 grid h-[100vh] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-left-96 lg:hidden">
         <div className="relative z-20 grid gap-6 rounded-md bg-white p-4 shadow-md">
            <nav className="grid grid-flow-row auto-rows-max text-sm">
               {items.map((item, index) => (
                  <Link
                     key={index}
                     href={item.disabled ? "#" : item.href}
                     className={cn(
                        "flex w-full items-center rounded-md px-2 py-2 text-sm font-medium hover:underline",
                        item.disabled && "cursor-not-allowed opacity-60",
                     )}
                     onClick={hide}
                  >
                     {item.title}
                  </Link>
               ))}
            </nav>
            {children}
         </div>
      </div>
   );
}
