"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CreateButtonProps extends HTMLAttributes<HTMLButtonElement> {
   title: string;
}

export function CreateButton({ className, title, ...props }: CreateButtonProps) {
   return (
      <button
         className={cn(
            "self-center relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm flex-none font-medium text-white hover:bg-brand-400 focus:outline-none",
            className,
         )}
         {...props}
      >
         {title}
      </button>
   );
}
