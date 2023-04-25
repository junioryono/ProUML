import { HTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";

interface CreateButtonProps extends HTMLAttributes<HTMLButtonElement> {
   title: string;
   isLoading?: boolean;
   children?: React.ReactNode;
}

export default function CreateButton({ className, title, isLoading, children, ...props }: CreateButtonProps) {
   return (
      <button
         className={cn(
            "self-center relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm flex-none font-medium text-white hover:bg-brand-400 focus:outline-none",
            {
               "cursor-not-allowed opacity-60": isLoading,
            },
            className,
         )}
         {...props}
         disabled={isLoading}
      >
         {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
         {children}
         {title}
      </button>
   );
}
