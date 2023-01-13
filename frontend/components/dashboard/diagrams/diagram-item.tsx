"use client";

import Link from "next/link";

import { formatDate } from "@/lib/utils";
import { Diagram } from "types";
import { DiagramItemOptions } from "./diagram-item-options";
import { LongPressDetectEvents, useLongPress } from "use-long-press";
import { useEffect, useRef, useState } from "react";

export function DiagramItem({ diagram }: { diagram: Diagram }) {
   const [showMenu, setShowMenu] = useState(false);
   const ref = useRef<HTMLAnchorElement>(null);

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
      if (ref.current && !ref.current.contains(event.target as Node)) {
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

   return (
      // Add a gray border to the diagram item
      // Add padding between each item
      <div className="w-1/2 sm:w-1/2 md:w-1/3 xl:w-1/4 mb-2">
         {/* Add a link to the diagram item and open it in a new tab */}
         <div className="m-2 border-gray-200 border rounded">
            <Link
               ref={ref}
               href="/diagram/[id]"
               as={`/diagram/${diagram.id}`}
               {...onLongPress()}
               className="cursor-pointer"
               onContextMenu={(e) => {
                  e.preventDefault();
                  return false;
               }}
            >
               <div className="relative block h-48 overflow-hidden ">
                  <img className="block h-full w-full object-cover object-center" src="https://dummyimage.com/420x260" />
               </div>
               <div className="pt-3 pb-2 pl-4 pr-2 border-t border-gray-200 flex">
                  <div className="flex-grow overflow-hidden whitespace-nowrap">
                     <h2 className="title-font text-sm sm:text-lg font-medium text-gray-900 overflow-ellipsis overflow-hidden">
                        {diagram.name}
                     </h2>
                     <p className="mt-1 text-xs sm:text-sm overflow-ellipsis overflow-hidden">
                        {formatDate(diagram.created_at?.toString())}
                     </p>
                  </div>
                  <div className="h-fit ml-auto md:mt-auto">
                     <DiagramItemOptions diagram={diagram} showMenu={showMenu} setShowMenu={setShowMenu} />
                  </div>
               </div>
            </Link>
         </div>
      </div>
   );
}
