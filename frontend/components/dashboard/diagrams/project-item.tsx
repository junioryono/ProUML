import Link from "next/link";

import { formatDate } from "@/lib/utils";
import { Project } from "types";
import ProjectItemOptions from "./project-item-options";
import { LongPressDetectEvents, useLongPress } from "use-long-press";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ProjectItem({ project }: { project: Project }) {
   const [showMenu, setShowMenu] = useState(false);
   const linkRef = useRef<HTMLAnchorElement>(null);
   // Store project.updated_at as a Date object
   const [updatedAt, setUpdatedAt] = useState<string>(formatDate(project.updated_at.toString(), "Edited"));

   // Update the date every 15 seconds
   useEffect(() => {
      if (!project) return;

      const interval = setInterval(() => {
         setUpdatedAt(formatDate(project.updated_at.toString(), "Edited"));
      }, 15 * 1000);

      return () => clearInterval(interval);
   }, [project]);

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
      // Add a gray border to the project item
      // Add padding between each item
      <div className="w-1/2 sm:w-1/2 md:w-1/3 xl:w-1/4 mb-2">
         {/* Add a link to the project item and open it in a new tab */}
         <div className="m-2 h-[267px] border-gray-200 border rounded">
            <Link
               ref={linkRef}
               href="/dashboard/diagrams/project/[id]"
               as={`/dashboard/diagrams/project/${project.id}`}
               {...onLongPress()}
               className="cursor-pointer"
               onContextMenu={(e) => {
                  e.preventDefault();
                  return false;
               }}
            >
               <div className="pl-4 pr-2 border-gray-200 flex h-full">
                  <div className="flex-grow overflow-hidden whitespace-nowrap">
                     <h2 className="title-font text-sm sm:text-lg font-medium text-gray-900 overflow-ellipsis overflow-hidden">
                        {project.name}
                     </h2>
                     <p className="mt-1 text-xs sm:text-sm overflow-ellipsis overflow-hidden">{updatedAt}</p>
                  </div>
                  <div className="h-fit ml-auto md:mt-auto">
                     <ProjectItemOptions project={project} showMenu={showMenu} setShowMenu={setShowMenu} />
                  </div>
               </div>
            </Link>
         </div>
      </div>
   );
}
