import Link from "next/link";

import { formatDate } from "@/lib/utils";
import { Diagram, Project } from "types";
import DiagramItemOptions from "./diagram-item-options";
import { LongPressDetectEvents, useLongPress } from "use-long-press";
import { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/icons";

export default function DiagramItem({ diagram, project }: { diagram: Diagram; project?: Project }) {
   const [showMenu, setShowMenu] = useState(false);
   const linkRef = useRef<HTMLAnchorElement>(null);
   // Store diagram.updated_at as a Date object
   const [updatedAt, setUpdatedAt] = useState<string>(formatDate(diagram.updated_at.toString(), "Edited"));

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

   return (
      // Add a gray border to the diagram item
      // Add padding between each item
      <div className="w-1/2 sm:w-1/2 md:w-1/3 xl:w-1/4 mb-2">
         {/* Add a link to the diagram item and open it in a new tab */}
         <div className="m-2 border-gray-200 border rounded">
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
                        className="block h-full w-full object-cover object-center"
                        src={diagram.image}
                        alt={diagram.name}
                     />
                  )}
               </div>
               <div className="pt-3 pb-2 pl-4 pr-2 border-t border-gray-200 flex">
                  <div className="flex-grow overflow-hidden whitespace-nowrap">
                     <h2 className="title-font text-sm sm:text-lg font-medium text-gray-900 overflow-ellipsis overflow-hidden">
                        {diagram.name}
                     </h2>
                     <p className="mt-1 text-xs sm:text-sm overflow-ellipsis overflow-hidden">{updatedAt}</p>
                  </div>
                  <div className="h-fit ml-auto md:mt-auto flex gap-1 items-center">
                     {!diagram.in_unshared_project && <Icons.users size={22} />}
                     <DiagramItemOptions diagram={diagram} project={project} showMenu={showMenu} setShowMenu={setShowMenu} />
                  </div>
               </div>
            </Link>
         </div>
      </div>
   );
}
