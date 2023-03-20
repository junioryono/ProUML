import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { DropdownMenu, SubDropdownMenu } from "@/ui/dropdown";
import { Diagram } from "types";
import { cn } from "@/lib/utils";

export default function DiagramSettings({ diagram }: { diagram: Diagram }) {
   const [diagramName, setDiagramName] = useState(diagram.name);
   const [editDiagramName, setEditDiagramName] = useState(false);
   const editDiagramRef = useRef<HTMLDivElement>(null);
   const [openArrow, setOpenArrow] = useState(false);
   const [open, setOpen] = useState(false);
   const [hovered, setHovered] = useState(false);

   // open the arrow when the dropdown menu is open or hovered
   useEffect(() => {
      if (open || hovered) {
         setOpenArrow(true);
      } else {
         setOpenArrow(false);
      }
   }, [open, hovered]);

   // stop editing the diagram name when the user clicks outside of the input
   useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
         if (editDiagramRef.current && !editDiagramRef.current.contains(e.target as Node)) {
            setEditDiagramName(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [editDiagramRef]);

   return (
      <DropdownMenu onOpenChange={setOpen}>
         <div className="flex justify-center items-center gap-1 h-full">
            <div ref={editDiagramRef}>
               <input
                  type={"text"}
                  className={cn("bg-transparent text-md py-0.5 focus-outline-none focus:outline-none focus:ring-0")}
                  onClick={(e) => {
                     // if the user clicks on the input when it is not in edit mode already, select all the text
                     if (!editDiagramName) {
                        e.currentTarget.select();
                     }

                     setEditDiagramName(true);
                  }}
                  onChange={(e) => setDiagramName(e.currentTarget.value)}
                  value={diagram.name}
               />
            </div>
            {/* {diagram.name}
            </div> */}
            <DropdownMenu.Trigger
               className="h-full cursor-default px-1.5 w-5 hover:bg-diagram-menu-item-hovered focus-visible:outline-none"
               onMouseEnter={() => setHovered(true)}
               onMouseLeave={() => setHovered(false)}
               onContextMenu={(e) => e.preventDefault()}
            >
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
         </div>

         <DropdownMenu.Portal>
            <DropdownMenu.Content className="mt-1 mr-2 py-1 md:w-52 rounded-none bg-diagram-menu border-0" align="end">
               {/* Version history of diagram */}
               <DropdownMenu.Item
                  className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                  onClick={() => {
                     // show history
                  }}
               >
                  <div>Show version history</div>
               </DropdownMenu.Item>

               <DropdownMenu.Separator className="my-1 bg-[#636363]" />

               {/* Duplicate diagram */}
               <DropdownMenu.Item
                  className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                  onClick={() => {
                     // duplicate diagram
                  }}
               >
                  <div>Duplicate</div>
               </DropdownMenu.Item>

               {/* Rename diagram */}
               <DropdownMenu.Item
                  className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                  onSelect={() => {
                     // rename diagram
                  }}
               >
                  <div>Rename</div>
               </DropdownMenu.Item>

               {/* Move diagram to project if its not in a project */}
               {!diagram.project && (
                  <DropdownMenu.Item
                     className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                     onClick={() => {
                        // move diagram to project
                     }}
                  >
                     <div>Move to project...</div>
                  </DropdownMenu.Item>
               )}

               {/* Delete the diagram */}
               <DropdownMenu.Item
                  className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                  onClick={() => {
                     // delete the diagram
                  }}
               >
                  <div>Delete...</div>
               </DropdownMenu.Item>
            </DropdownMenu.Content>
         </DropdownMenu.Portal>
      </DropdownMenu>
   );
}
