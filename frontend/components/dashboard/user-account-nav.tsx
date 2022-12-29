"use client";

import Link from "next/link";

import { useState } from "react";
import { useAuth } from "@/lib/auth-client";
import { DropdownMenu } from "@/ui/dropdown";
import { UserAvatar } from "@/components/dashboard/user-avatar";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";

export function UserAccountNav() {
   const router = useRouter();
   const { logout, user } = useAuth();
   const [isLoading, setIsLoading] = useState<boolean>(false);

   if (user === undefined) {
      return (
         <div className="flex items-center gap-2 overflow-hidden focus-visible:outline-none select-none">
            <UserAvatar />
         </div>
      );
   }

   if (!user) {
      return null;
   }

   return (
      <DropdownMenu>
         <DropdownMenu.Trigger className="flex items-center gap-2 overflow-hidden focus-visible:outline-none select-none">
            <UserAvatar user={user} />
         </DropdownMenu.Trigger>
         <DropdownMenu.Portal>
            <DropdownMenu.Content className="mt-4 md:w-[240px]" align="end">
               <div className="flex items-center justify-start gap-2 p-4">
                  <div className="flex flex-col space-y-1 leading-none">
                     {user.full_name && <p className="font-medium">{user.full_name}</p>}
                     {user.email && <p className="w-[200px] truncate text-sm text-slate-600">{user.email}</p>}
                  </div>
               </div>
               <DropdownMenu.Separator />
               <DropdownMenu.Item onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenu.Item>
               <DropdownMenu.Item onClick={() => router.push("/dashboard/billing")}>Billing</DropdownMenu.Item>
               <DropdownMenu.Item onClick={() => router.push("/dashboard/settings")}>Settings</DropdownMenu.Item>
               <DropdownMenu.Separator />
               <DropdownMenu.Item onClick={() => router.push("/docs")}>Documentation</DropdownMenu.Item>
               <DropdownMenu.Item>
                  <Link href="https://github.com/junioryono/prouml" className="w-full" target="_blank">
                     GitHub
                  </Link>
               </DropdownMenu.Item>
               <DropdownMenu.Separator />
               <DropdownMenu.Item
                  className="cursor-pointer"
                  onSelect={(e) => {
                     e.preventDefault();
                     setIsLoading(true);
                     router.prefetch("/");
                     logout()
                        .then((res) => {
                           if (res) {
                              router.push("/");
                           }
                        })
                        .catch((err) => {
                           console.error(err);
                        })
                        .finally(() => {
                           setIsLoading(false);
                        });
                  }}
               >
                  {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Sign out
               </DropdownMenu.Item>
            </DropdownMenu.Content>
         </DropdownMenu.Portal>
      </DropdownMenu>
   );
}
