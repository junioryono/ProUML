"use client";

import Link from "next/link";

import { useAuth } from "@/lib/auth-client";
import { DropdownMenu } from "@/ui/dropdown";
import { UserAvatar } from "@/components/dashboard/user-avatar";
import { useRouter } from "next/navigation";

export function UserAccountNav() {
  const router = useRouter();
  const { logout, user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger className="flex items-center gap-2 overflow-hidden focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 focus-visible:outline-none">
        <UserAvatar user={user} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mt-2 md:w-[240px]" align="end">
          <div className="flex items-center justify-start gap-2 p-4">
            <div className="flex flex-col space-y-1 leading-none">
              {user.full_name && <p className="font-medium">{user.full_name}</p>}
              {user.email && <p className="w-[200px] truncate text-sm text-slate-600">{user.email}</p>}
            </div>
          </div>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <Link href="/dashboard" className="w-full">
              Dashboard
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <Link href="/dashboard/billing" className="w-full">
              Billing
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <Link href="/dashboard/settings" className="w-full">
              Settings
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <Link href="/docs" target="_blank" className="w-full">
              Documentation
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <Link href="https://github.com/junioryono/prouml" className="w-full" target="_blank">
              GitHub
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            className="cursor-pointer"
            onSelect={(event) => {
              event.preventDefault();
              logout().then((res) => {
                if (res) {
                  router.push("/");
                }
              });
            }}
          >
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
}
