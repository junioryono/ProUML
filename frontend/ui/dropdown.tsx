"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import { cn } from "@/lib/utils";

export function DropdownMenu({ ...props }: DropdownMenuPrimitive.DropdownMenuProps) {
   return <DropdownMenuPrimitive.Root {...props} />;
}

DropdownMenu.Trigger = React.forwardRef<HTMLButtonElement, DropdownMenuPrimitive.DropdownMenuTriggerProps>(
   function DropdownMenuTrigger({ ...props }, ref) {
      return <DropdownMenuPrimitive.Trigger {...props} ref={ref} />;
   },
);

DropdownMenu.Portal = DropdownMenuPrimitive.Portal;

DropdownMenu.Content = React.forwardRef<HTMLDivElement, DropdownMenuPrimitive.MenuContentProps>(function DropdownMenuContent(
   { className, ...props },
   ref,
) {
   return (
      <DropdownMenuPrimitive.Content
         ref={ref}
         align="end"
         className={cn(
            "overflow-hidden border border-slate-50 bg-white shadow-md animate-in slide-in-from-top-1",
            className,
         )}
         {...props}
      />
   );
});

DropdownMenu.Item = React.forwardRef<HTMLDivElement, DropdownMenuPrimitive.DropdownMenuItemProps>(function DropdownMenuItem(
   { className, ...props },
   ref,
) {
   return (
      <DropdownMenuPrimitive.Item
         ref={ref}
         className={cn(
            "flex cursor-default select-none items-center py-2 px-3 text-sm text-slate-600 outline-none",
            className,
         )}
         {...props}
      />
   );
});

DropdownMenu.Separator = React.forwardRef<HTMLDivElement, DropdownMenuPrimitive.DropdownMenuSeparatorProps>(
   function DropdownMenuItem({ className, ...props }, ref) {
      return <DropdownMenuPrimitive.Separator ref={ref} className={cn("h-px bg-slate-200", className)} {...props} />;
   },
);

export function SubDropdownMenu({ ...props }: DropdownMenuPrimitive.DropdownMenuSubProps) {
   return <DropdownMenuPrimitive.Sub {...props} />;
}

SubDropdownMenu.Trigger = React.forwardRef<HTMLDivElement, DropdownMenuPrimitive.DropdownMenuSubTriggerProps>(
   function SubDropdownMenuTrigger({ className, ...props }, ref) {
      return (
         <DropdownMenuPrimitive.SubTrigger
            ref={ref}
            className={cn(
               "flex items-center justify-between cursor-default select-none text-white text-xs pl-7 pr-4 h-6 focus:bg-diagram-menu-item-selected active:bg-[#0d99ff] focus:text-white focus-visible:outline-none",
               className,
            )}
            {...props}
         />
      );
   },
);

SubDropdownMenu.Content = React.forwardRef<HTMLDivElement, DropdownMenuPrimitive.MenuSubContentProps>(
   function SubDropdownMenuContent({ className, ...props }, ref) {
      return (
         <DropdownMenuPrimitive.SubContent
            ref={ref}
            className={cn("py-1 md:w-48 rounded-none bg-diagram-menu", className)}
            {...props}
         />
      );
   },
);

SubDropdownMenu.Arrow = function () {
   return (
      <svg className="ml-1" width="8" height="7" viewBox="0 0 8 7" xmlns="http://www.w3.org/2000/svg">
         <path
            className="fill-white"
            d="M3.646 5.354l-3-3 .708-.708L4 4.293l2.646-2.647.708.708-3 3L4 5.707l-.354-.353z"
            fillRule="evenodd"
            fillOpacity="1"
            fill="#000"
            stroke="none"
         />
      </svg>
   );
};

export default DropdownMenu;
