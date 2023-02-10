"use client";

import Link from "next/link";

import { useState } from "react";
import { useAuth } from "@/lib/auth-client";
import { DropdownMenu } from "@/ui/dropdown";
import { UserAvatar } from "@/components/dashboard/user-avatar";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";

export default function UserAccountNav({ className }: { className?: string }) {
   const router = useRouter();
   const { logout, user } = useAuth();
   const [isLoading, setIsLoading] = useState<boolean>(false);

   if (user === undefined) {
      return (
         <div className="flex items-center gap-2 overflow-hidden focus-visible:outline-none select-none">
            <UserAvatar className={className} />
         </div>
      );
   }

   if (!user) {
      return (
         <nav>
            <Link
               href="/login"
               className="relative inline-flex h-8 items-center rounded-md border border-transparent bg-brand-500 px-6 py-1 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none"
            >
               Login
            </Link>
         </nav>
      );
   }

   return (
      <DropdownMenu>
         <DropdownMenu.Trigger className="flex items-center gap-2 overflow-hidden focus-visible:outline-none select-none">
            <UserAvatar user={user} className={className} />
         </DropdownMenu.Trigger>
         <DropdownMenu.Portal>
            <DropdownMenu.Content className="mt-4 md:w-[240px] rounded-md" align="end">
               <Link
                  href={"/user/[id]"}
                  as={`/user/${user.user_id}`}
                  className="flex items-center justify-start gap-2 p-4 cursor-pointer focus:bg-slate-50 focus:text-black"
               >
                  <div className="flex flex-col space-y-1 leading-none">
                     {user.full_name && <p className="font-medium">{user.full_name}</p>}
                     {user.email && <p className="w-[200px] truncate text-sm text-slate-600">{user.email}</p>}
                  </div>
               </Link>

               {user.role === "admin" && (
                  <>
                     <DropdownMenu.Separator />
                     <Link href="/admin/dashboard">
                        <DropdownMenu.Item className="cursor-pointer focus:bg-slate-50 focus:text-black">
                           Admin dashboard
                        </DropdownMenu.Item>
                     </Link>
                  </>
               )}

               <DropdownMenu.Separator />

               <Link href={"/user/[id]"} as={`/user/${user.user_id}`}>
                  <DropdownMenu.Item className="cursor-pointer focus:bg-slate-50 focus:text-black">
                     Your profile
                  </DropdownMenu.Item>
               </Link>

               <Link href="/dashboard/diagrams">
                  <DropdownMenu.Item className="cursor-pointer focus:bg-slate-50 focus:text-black">
                     Your diagrams
                  </DropdownMenu.Item>
               </Link>

               <Link href="/dashboard/projects">
                  <DropdownMenu.Item className="cursor-pointer focus:bg-slate-50 focus:text-black">
                     Your projects
                  </DropdownMenu.Item>
               </Link>

               <Link href="/dashboard/issues">
                  <DropdownMenu.Item className="cursor-pointer focus:bg-slate-50 focus:text-black">
                     Your issues
                  </DropdownMenu.Item>
               </Link>

               <DropdownMenu.Separator />

               <Link href="/help">
                  <DropdownMenu.Item className="cursor-pointer focus:bg-slate-50 focus:text-black">Help</DropdownMenu.Item>
               </Link>

               <Link href="/dashboard/settings">
                  <DropdownMenu.Item className="cursor-pointer focus:bg-slate-50 focus:text-black">
                     Settings
                  </DropdownMenu.Item>
               </Link>

               <DropdownMenu.Separator />

               <DropdownMenu.Item
                  className="cursor-pointer focus:bg-slate-50 focus:text-black"
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
