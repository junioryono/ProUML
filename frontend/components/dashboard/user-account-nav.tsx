"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-client";
import { DropdownMenu } from "@/ui/dropdown";
import { UserAvatar } from "@/components/dashboard/user-avatar";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";
import { User } from "types";

export function UserAccountNav({ userResponse }: { userResponse: User }) {
   const router = useRouter();
   const { logout, user, setUser } = useAuth();
   const [isLoading, setIsLoading] = useState<boolean>(false);

   useEffect(() => {
      setUser(userResponse);
   }, [userResponse]);

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
               <Link href={"/user/" + user.user_id} className="flex items-center justify-start gap-2 p-4 cursor-pointer">
                  <div className="flex flex-col space-y-1 leading-none">
                     {user.full_name && <p className="font-medium">{user.full_name}</p>}
                     {user.email && <p className="w-[200px] truncate text-sm text-slate-600">{user.email}</p>}
                  </div>
               </Link>

               {user.role === "admin" && (
                  <>
                     <DropdownMenu.Separator />
                     <Link href="/admin/dashboard">
                        <DropdownMenu.Item className="cursor-pointer">Admin dashboard</DropdownMenu.Item>
                     </Link>
                  </>
               )}

               <DropdownMenu.Separator />

               <Link href={"/user/" + user.user_id}>
                  <DropdownMenu.Item className="cursor-pointer">Your profile</DropdownMenu.Item>
               </Link>

               <Link href="/dashboard/projects">
                  <DropdownMenu.Item className="cursor-pointer">Your projects</DropdownMenu.Item>
               </Link>

               <Link href="/dashboard/teams">
                  <DropdownMenu.Item className="cursor-pointer">Your teams</DropdownMenu.Item>
               </Link>

               <Link href="/dashboard/diagrams">
                  <DropdownMenu.Item className="cursor-pointer">Your diagrams</DropdownMenu.Item>
               </Link>

               <Link href="/dashboard/issues">
                  <DropdownMenu.Item className="cursor-pointer">Your issues</DropdownMenu.Item>
               </Link>

               <DropdownMenu.Separator />

               <Link href="/help">
                  <DropdownMenu.Item className="cursor-pointer">Help</DropdownMenu.Item>
               </Link>

               <Link href="/dashboard/settings">
                  <DropdownMenu.Item className="cursor-pointer">Settings</DropdownMenu.Item>
               </Link>

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
