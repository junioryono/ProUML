import type X6Type from "@antv/x6";

import { MutableRefObject, useEffect, useRef, useState } from "react";
import { DropdownMenu, SubDropdownMenu } from "@/ui/dropdown";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Menu({ graph }: { graph: MutableRefObject<X6Type.Graph> }) {
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
            className="cursor-default w-[52px] h-full px-2 text-xs flex justify-center items-center gap-1 hover:bg-diagram-menu-item-hovered focus-visible:outline-none"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onContextMenu={(e) => e.preventDefault()}
         >
            <Icons.logo
               style={{
                  strokeWidth: 1.3,
                  width: 20,
               }}
            />
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
            <DropdownMenu.Content className="mt-1 ml-2 py-1 md:w-48 rounded-none bg-diagram-menu border-0" align="end">
               <Link href="/dashboard/diagrams">
                  <DropdownMenu.Item className="text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white">
                     Back to dashboard
                  </DropdownMenu.Item>
               </Link>

               <DropdownMenu.Separator className="my-1 bg-[#636363]" />

               <SubDropdownMenu>
                  <SubDropdownMenu.Trigger>
                     <div>File</div>
                     <SubDropdownMenu.Arrow />
                  </SubDropdownMenu.Trigger>
                  <SubDropdownMenu.Content>
                     <DropdownMenu.Item
                        className="text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white"
                        onSelect={(e) => {
                           e.preventDefault();
                        }}
                     >
                        Import
                     </DropdownMenu.Item>

                     <DropdownMenu.Item
                        className="text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white"
                        onSelect={(e) => {
                           e.preventDefault();
                        }}
                     >
                        Export
                     </DropdownMenu.Item>
                  </SubDropdownMenu.Content>
               </SubDropdownMenu>

               <SubDropdownMenu>
                  <SubDropdownMenu.Trigger>
                     <div>Edit</div>
                     <SubDropdownMenu.Arrow />
                  </SubDropdownMenu.Trigger>
                  <SubDropdownMenu.Content>
                     <DropdownMenu.Item
                        className="text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white"
                        onSelect={(e) => {
                           e.preventDefault();
                        }}
                     >
                        New
                     </DropdownMenu.Item>
                  </SubDropdownMenu.Content>
               </SubDropdownMenu>

               <SubDropdownMenu>
                  <SubDropdownMenu.Trigger>
                     <div>View</div>
                     <SubDropdownMenu.Arrow />
                  </SubDropdownMenu.Trigger>
                  <SubDropdownMenu.Content>
                     <DropdownMenu.Item
                        className="text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white"
                        onSelect={(e) => {
                           e.preventDefault();
                        }}
                     >
                        New
                     </DropdownMenu.Item>
                  </SubDropdownMenu.Content>
               </SubDropdownMenu>

               <SubDropdownMenu>
                  <SubDropdownMenu.Trigger>
                     <div>Object</div>
                     <SubDropdownMenu.Arrow />
                  </SubDropdownMenu.Trigger>
                  <SubDropdownMenu.Content>
                     <DropdownMenu.Item
                        className="text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white"
                        onSelect={(e) => {
                           e.preventDefault();
                        }}
                     >
                        New
                     </DropdownMenu.Item>
                  </SubDropdownMenu.Content>
               </SubDropdownMenu>

               <SubDropdownMenu>
                  <SubDropdownMenu.Trigger>
                     <div>Text</div>
                     <SubDropdownMenu.Arrow />
                  </SubDropdownMenu.Trigger>
                  <SubDropdownMenu.Content>
                     <DropdownMenu.Item
                        className="text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white"
                        onSelect={(e) => {
                           e.preventDefault();
                        }}
                     >
                        New
                     </DropdownMenu.Item>
                  </SubDropdownMenu.Content>
               </SubDropdownMenu>

               <SubDropdownMenu>
                  <SubDropdownMenu.Trigger>
                     <div>Arrange</div>
                     <SubDropdownMenu.Arrow />
                  </SubDropdownMenu.Trigger>
                  <SubDropdownMenu.Content>
                     <DropdownMenu.Item
                        className="text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white"
                        onSelect={(e) => {
                           e.preventDefault();
                        }}
                     >
                        New
                     </DropdownMenu.Item>
                  </SubDropdownMenu.Content>
               </SubDropdownMenu>

               <DropdownMenu.Separator className="my-1 bg-[#636363]" />

               <SubDropdownMenu>
                  <SubDropdownMenu.Trigger>
                     <div>Preferences</div>
                     <SubDropdownMenu.Arrow />
                  </SubDropdownMenu.Trigger>
                  <SubDropdownMenu.Content>
                     <DropdownMenu.Item
                        className="text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white"
                        onSelect={(e) => {
                           e.preventDefault();
                        }}
                     >
                        New
                     </DropdownMenu.Item>
                  </SubDropdownMenu.Content>
               </SubDropdownMenu>
            </DropdownMenu.Content>
         </DropdownMenu.Portal>
      </DropdownMenu>
   );
}
