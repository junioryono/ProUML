import Link from "next/link";

import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { User, Project } from "types";
import ProjectItemOptions from "./project-item-options";
import { LongPressDetectEvents, useLongPress } from "use-long-press";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icons } from "@/components/icons";

export default function ProjectItem({
   user,
   project,
   selectable,
   selectedItems,
   setSelectedItems,
}: {
   user: User;
   project: Project;
   selectable?: boolean;
   selectedItems?: Project[];
   setSelectedItems?: React.Dispatch<React.SetStateAction<Project[]>>;
}) {
   const [showMenu, setShowMenu] = useState(false);
   const linkRef = useRef<HTMLAnchorElement>(null);
   // Store project.updated_at as a Date object
   const [updatedAt, setUpdatedAt] = useState<string>(formatDate(project.updated_at.toString(), "Edited"));

   const [selected, setSelected] = useState(false);

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
      if (!selectable) setSelected(false);
   }, [selectable]);

   useEffect(() => {
      if (!showMenu) return;

      document.addEventListener("click", handleClickOutside, true);
      document.addEventListener("touchstart", handleClickOutside, true);
      return () => {
         document.removeEventListener("click", handleClickOutside, true);
         document.addEventListener("touchstart", handleClickOutside, true);
      };
   }, [showMenu]);

   const updateSelectedItems = (selectedItem: Project) => {
      if (!selectedItems) return;
      if (selectedItems.includes(selectedItem)) {
         setSelectedItems(selectedItems.filter((item) => item !== selectedItem));
      } else {
         setSelectedItems([...selectedItems, selectedItem]);
      }
   };

   return (
      // Add a gray border to the project item
      // Add padding between each item
      <div className="w-1/2 sm:w-1/2 md:w-1/3 xl:w-1/4 mb-2">
         {/* Add a link to the project item and open it in a new tab */}
         <div
            className={cn(
               "m-2 border-gray-300 border rounded-md hover:border-blue-500 hover:shadow-md h-14",
               selected && selectable && "border-blue-500 shadow-md",
            )}
         >
            {!selectable ? (
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
                  <div className="pt-3 pb-2 pl-4 pr-2 border-gray-300 flex group">
                     <div className="flex overflow-hidden whitespace-nowrap">
                        <div className="pr-4 pt-0.5">
                           <Icons.folder size={25} strokeWidth={0.4} className="group-hover:fill-black" />
                        </div>
                        <h2 className="title-font text-sm sm:text-base font-medium pr-4 pt-1 text-gray-900 overflow-ellipsis overflow-hidden">
                           {project.name}
                        </h2>
                        {/* <p className="mt-1 text-xs sm:text-sm overflow-ellipsis overflow-hidden">{updatedAt}</p> */}
                     </div>
                     <div className="h-fit ml-auto md:mt-auto">
                        <ProjectItemOptions user={user} project={project} showMenu={showMenu} setShowMenu={setShowMenu} />
                     </div>
                  </div>
               </Link>
            ) : (
               <div
                  onClick={() => {
                     setSelected(!selected);
                     // add the project to the selected items
                     updateSelectedItems(project);
                  }}
                  className="cursor-pointer"
               >
                  <div className="pt-3 pb-2 pl-4 pr-2 border-gray-200 flex group">
                     <div className="flex overflow-hidden whitespace-nowrap">
                        <div className="pr-4 pt-0.5">
                           <Icons.folder
                              size={25}
                              strokeWidth={0.4}
                              className={cn("group-hover:fill-black", selected && selectable && "fill-black")}
                           />
                        </div>
                        <h2 className="title-font text-sm sm:text-base font-medium pr-4 pt-1 text-gray-900 overflow-ellipsis overflow-hidden">
                           {project.name}
                        </h2>
                        {/* <p className="mt-1 text-xs sm:text-sm overflow-ellipsis overflow-hidden">{updatedAt}</p> */}
                     </div>
                     <div className=" ml-auto md:mt-auto">
                        {/* if selected */}
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
