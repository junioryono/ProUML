"use client";

import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

export function Menu({ graph }: { graph: MutableRefObject<X6Type.Graph> }) {
   const [open, setOpen] = useState(false);
   const [hovered, setHovered] = useState(false);
   const ref = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleMouseEnter = () => {
         setHovered(true);
      };

      const handleMouseLeave = () => {
         setHovered(false);
      };

      const handleClick = () => {
         setOpen(true);
         setHovered(false);
      };

      const handleContextMenu = (e: MouseEvent) => {
         e.preventDefault();
      };

      const handleClickOutside = (e: MouseEvent) => {
         if (ref.current && !ref.current.contains(e.target as Node)) {
            setOpen(false);
         }
      };

      ref.current.addEventListener("mouseenter", handleMouseEnter);
      ref.current.addEventListener("mouseleave", handleMouseLeave);
      ref.current.addEventListener("click", handleClick);
      ref.current.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
         ref.current.removeEventListener("mouseenter", handleMouseEnter);
         ref.current.removeEventListener("mouseleave", handleMouseLeave);
         ref.current.removeEventListener("click", handleClick);
         ref.current.removeEventListener("contextmenu", handleContextMenu);
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   return (
      <div
         ref={ref}
         className="w-[52px] h-full px-2 text-xs flex justify-center items-center gap-1 hover:bg-[#111111]"
         onClick={() => {
            console.log("graph", graph.current);
         }}
      >
         <Icons.logo
            style={{
               strokeWidth: 1.3,
               width: 20,
            }}
         />
         <svg
            className={cn("transition-all duration-100", open || hovered ? "mt-[6px]" : "mt-0")}
            width="8"
            height="7"
            viewBox="0 0 8 7"
            xmlns="http://www.w3.org/2000/svg"
         >
            <path
               className="fill-white"
               d="M3.646 5.354l-3-3 .708-.708L4 4.293l2.646-2.647.708.708-3 3L4 5.707l-.354-.353z"
               fillRule="evenodd"
               fillOpacity="1"
               fill="#000"
               stroke="none"
            />
         </svg>
      </div>
   );
}
