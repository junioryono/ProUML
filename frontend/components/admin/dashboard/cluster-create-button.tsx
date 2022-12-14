"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { toast } from "@/ui/toast";

interface ClusterCreateButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

export function ClusterCreateButton({ className, ...props }: ClusterCreateButtonProps) {
   const router = useRouter();
   const [isLoading, setIsLoading] = React.useState<boolean>(false);

   async function onClick() {
      setIsLoading(true);

      const response = await fetch("/api/posts", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            title: "Untitled Post",
         }),
      });

      setIsLoading(false);

      if (!response?.ok) {
         return toast({
            title: "Something went wrong.",
            message: "Your post was not created. Please try again.",
            type: "error",
         });
      }

      const post = await response.json();

      // This forces a cache invalidation.
      router.refresh();

      router.push(`/editor/${post.id}`);
   }

   return (
      <button
         onClick={onClick}
         className={cn(
            "relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none",
            {
               "cursor-not-allowed opacity-60": isLoading,
            },
            className,
         )}
         disabled={isLoading}
         {...props}
      >
         {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.add className="mr-2 h-4 w-4" />}
         New cluster
      </button>
   );
}
