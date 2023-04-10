import Link from "next/link";

import { formatDate } from "@/lib/utils";
import { Diagram, Project } from "types";
import DiagramItemOptions from "./diagram-item-options";
import { LongPressDetectEvents, useLongPress } from "use-long-press";
import { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

export default function DiagramItem({
   diagram,
   project,
   userId,
   selectable,
   selectedItems,
   setSelectedItems,
}: {
   diagram: Diagram;
   project?: Project;
   userId?: string;
   selectable?: boolean;
   selectedItems?: (Diagram | Project)[];
   setSelectedItems?: React.Dispatch<React.SetStateAction<(Diagram | Project)[]>>;
}) {
   const [showMenu, setShowMenu] = useState(false);
   const linkRef = useRef<HTMLAnchorElement>(null);
   // Store diagram.updated_at as a Date object
   const [updatedAt, setUpdatedAt] = useState<string>(formatDate(diagram.updated_at.toString(), "Edited"));
   const [selected, setSelected] = useState(false);

   // Update the date every 15 seconds
   useEffect(() => {
      if (!diagram) return;

      const interval = setInterval(() => {
         setUpdatedAt(formatDate(diagram.updated_at.toString(), "Edited"));
      }, 15 * 1000);

      return () => clearInterval(interval);
   }, [diagram]);

   const onLongPress = useLongPress(
      () => {
         setShowMenu(true);
      },
      {
         cancelOnMovement: true,
         threshold: 700,
         detect: LongPressDetectEvents.TOUCH,
      },
   );

   function handleClickOutside(event: Event) {
      if (linkRef.current && !linkRef.current.contains(event.target as Node)) {
         setShowMenu(false);
      }
   }

   useEffect(() => {
      if (!showMenu) return;

      document.addEventListener("click", handleClickOutside, true);
      document.addEventListener("touchstart", handleClickOutside, true);
      return () => {
         document.removeEventListener("click", handleClickOutside, true);
         document.addEventListener("touchstart", handleClickOutside, true);
      };
   }, [showMenu]);

   useEffect(() => {
      if (!selectable) setSelected(false);
   }, [selectable]);

   const updateSelectedItems = (selectedItem: Diagram) => {
      if (!selectedItems || !setSelectedItems) return;

      if (selected) {
         setSelectedItems((prev) => prev.filter((item) => item.id !== selectedItem.id));
      } else {
         setSelectedItems((prev) => [...prev, selectedItem]);
      }
   };

   return (
      // Add a gray border to the diagram item
      // Add padding between each item
      <div className="w-1/2 sm:w-1/2 md:w-1/3 xl:w-1/4 mb-2">
         {/* Add a link to the diagram item and open it in a new tab */}
         <div
            className={cn(
               "m-2 border-gray-200 border rounded-md hover:border-blue-500",
               selected && selectable && "border-blue-500",
            )}
         >
            {/* if not selectable */}
            {!selectable ? (
               <Link
                  ref={linkRef}
                  href="/dashboard/diagrams/[id]"
                  as={`/dashboard/diagrams/${diagram.id}`}
                  {...onLongPress()}
                  className="cursor-pointer"
                  onContextMenu={(e) => {
                     e.preventDefault();
                     return false;
                  }}
               >
                  <div className="relative block h-48 overflow-hidden">
                     {diagram.image && (
                        <img
                           className="block h-full w-full object-cover object-center rounded-t-md"
                           src={diagram.image}
                           alt={diagram.name}
                           draggable={false}
                        />
                     )}
                  </div>
                  <div className="pt-2 pb-2 pl-4 pr-2 border-t border-gray-200 flex">
                     <div className="flex-grow overflow-hidden whitespace-nowrap">
                        <h2 className="title-font text-sm sm:text-base font-medium text-gray-900 overflow-ellipsis overflow-hidden">
                           {diagram.name}
                        </h2>
                        <p className="mt-1 text-xs sm:text-xs text-gray-500 overflow-ellipsis overflow-hidden">
                           {updatedAt}
                        </p>
                     </div>
                     <div className="h-fit ml-auto md:mt-auto flex gap-1 items-center">
                        {diagram.is_shared_with_current_user && <Icons.users size={22} />}
                        <DiagramItemOptions
                           diagram={diagram}
                           project={project}
                           userId={userId}
                           showMenu={showMenu}
                           setShowMenu={setShowMenu}
                        />
                     </div>
                  </div>
               </Link>
            ) : (
               <div
                  onClick={() => {
                     // set selected to true
                     setSelected(!selected);

                     // update the selectedItems array
                     updateSelectedItems(diagram);
                  }}
                  className="cursor-pointer"
               >
                  <div className="relative block h-48 overflow-hidden">
                     {diagram.image && (
                        <img
                           className="block h-full w-full object-cover object-center rounded-t-md"
                           src={diagram.image}
                           alt={diagram.name}
                        />
                     )}
                  </div>
                  <div className="pt-2 pb-2 pl-4 pr-2 border-t border-gray-200 flex">
                     <div className="flex-grow overflow-hidden whitespace-nowrap">
                        <h2 className="title-font text-sm sm:text-base font-medium text-gray-900 overflow-ellipsis overflow-hidden">
                           {diagram.name}
                        </h2>
                        <p className="mt-1 text-xs sm:text-xs text-gray-500 overflow-ellipsis overflow-hidden">
                           {updatedAt}
                        </p>
                     </div>
                     <div className="h-fit ml-auto md:mt-auto flex gap-1 items-center">
                        {diagram.is_shared_with_current_user && <Icons.users size={22} />}
                        <div
                           className={cn(
                              "bg-white border border-slate-400 rounded-full h-6 w-6 m-1 text-gray-500 hover:text-gray-500 focus:outline-none hover:bg-slate-100 hidden md:block",
                              selected && "bg-black",
                           )}
                        >
                           {/* if selected */}
                           {selected && (
                              // svg src: https://www.svgrepo.com/svg/510901/check?edit=true
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                 <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                 <g id="SVGRepo_iconCarrier">
                                    <g id="Interface / Check">
                                       <path
                                          id="Vector"
                                          d="M6 12L10.2426 16.2426L18.727 7.75732"
                                          stroke="#ffffff"
                                          strokeWidth="3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                       ></path>
                                    </g>
                                 </g>
                              </svg>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
