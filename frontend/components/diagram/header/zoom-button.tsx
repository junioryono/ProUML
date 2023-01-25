"use client";

import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { DropdownMenu, SubDropdownMenu } from "@/ui/dropdown";
import { cn } from "@/lib/utils";

export function ZoomButton({ graph, zoom }: { graph: MutableRefObject<X6Type.Graph>; zoom: number }) {
   const [openArrow, setOpenArrow] = useState(false);
   const [open, setOpen] = useState(false);
   const [hovered, setHovered] = useState(false);

   useEffect(() => {
      if (open || hovered) {
         setOpenArrow(true);
      } else {
         setOpenArrow(false);
      }
   }, [open, hovered]);

   return (
      <DropdownMenu onOpenChange={setOpen}>
         <DropdownMenu.Trigger
            className="cursor-default w-16 h-full px-2 text-xs flex justify-center items-center gap-1 hover:bg-diagram-menu-item-hovered focus-visible:outline-none"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onContextMenu={(e) => e.preventDefault()}
         >
            <div className="select-none">{Math.round(zoom * 100)}%</div>
            <svg
               className={cn("transition-all duration-100", openArrow ? "mt-[6px]" : "mt-0")}
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
         </DropdownMenu.Trigger>

         <DropdownMenu.Portal>
            <DropdownMenu.Content className="mt-1 mr-2 py-1 md:w-52 rounded-none bg-diagram-menu" align="end">
               {/* Make an input that will take the users zoom input */}
               <input
                  className="pl-7 h-6 w-full bg-transparent text-white text-xs focus:outline-none"
                  defaultValue={Math.round(zoom * 100) + "%"}
                  onKeyDown={(e) => {
                     if (e.key === "Enter") {
                        const zoomInput = parseInt(e.currentTarget.value);
                        graph.current?.zoom((zoomInput || 0) / 100, { absolute: true });
                     }
                  }}
               />

               <DropdownMenu.Separator className="my-1 bg-[#636363]" />

               <DropdownMenu.Item
                  className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                  onSelect={() => {
                     graph.current?.zoom(0.1);
                  }}
               >
                  <div>Zoom in</div>
                  <div className="ml-auto">Ctrl++</div>
               </DropdownMenu.Item>

               <DropdownMenu.Item
                  className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                  onSelect={() => {
                     graph.current?.zoom(-0.1);
                  }}
               >
                  <div>Zoom out</div>
                  <div className="ml-auto">Ctrl+-</div>
               </DropdownMenu.Item>

               <DropdownMenu.Item
                  className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                  onSelect={() => {
                     graph.current?.zoom(0.5, { absolute: true });
                  }}
               >
                  <div>Zoom to 50%</div>
               </DropdownMenu.Item>

               <DropdownMenu.Item
                  className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                  onSelect={() => {
                     graph.current?.zoom(1, { absolute: true });
                  }}
               >
                  <div>Zoom to 100%</div>
                  <div className="ml-auto">Ctrl+0</div>
               </DropdownMenu.Item>

               <DropdownMenu.Item
                  className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                  onSelect={() => {
                     graph.current?.zoom(2, { absolute: true });
                  }}
               >
                  <div>Zoom to 200%</div>
               </DropdownMenu.Item>

               <DropdownMenu.Separator className="my-1 bg-[#636363]" />

               <DropdownMenu.Item
                  className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                  onSelect={() => {
                     graph.current?.zoomToFit({ padding: 20 });
                  }}
               >
                  <div>Fit content</div>
                  <div className="ml-auto">Ctrl+1</div>
               </DropdownMenu.Item>
            </DropdownMenu.Content>
         </DropdownMenu.Portal>
      </DropdownMenu>
   );
}
