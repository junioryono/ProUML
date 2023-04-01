import type X6Type from "@antv/x6";
import { useEffect, useRef, useState, useCallback } from "react";
import { DropdownMenu, SubDropdownMenu } from "@/ui/dropdown";
import { Diagram } from "types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
   addDiagramToProject,
   deleteDiagram,
   removeDiagramFromProject,
   updateDiagram,
   createDiagram,
   getProjects,
   removeDiagramUser,
} from "@/lib/auth-fetch";
import { toast } from "@/ui/toast";
import * as z from "zod";

export default function DiagramLabel({
   diagram,
   role,
   wsTimedOut,
}: {
   diagram: Diagram;
   role: string;
   wsTimedOut: boolean;
}) {
   const [diagramName, setDiagramName] = useState(diagram.name);
   const [editDiagramName, setEditDiagramName] = useState(false);
   const editDiagramRef = useRef<HTMLDivElement>(null);
   const [openArrow, setOpenArrow] = useState(false);
   const [open, setOpen] = useState(false);
   const [hovered, setHovered] = useState(false);
   const router = useRouter();

   // open the arrow when the dropdown menu is open or hovered
   useEffect(() => {
      if (open || hovered) {
         setOpenArrow(true);
      } else {
         setOpenArrow(false);
      }
   }, [open, hovered]);

   // close the dropdown menu when the user clicks outside of it
   function updateDiagramName() {
      setEditDiagramName(false);

      // if the diagram name is empty, set it to "Untitled Diagram"
      if (diagramName === "") {
         setDiagramName("Untitled Diagram");
      }
      // if diagram is different from the current name, update diagram name in db
      if (diagramName !== diagram.name) {
         console.log("updating diagram name");
         const diagramRenameSchema = z.object({
            name: z.string().min(1),
         });
         type RenameFormData = z.infer<typeof diagramRenameSchema>;

         // update the diagram name in the db
         updateDiagram(diagram.id, { name: diagramName } as RenameFormData)
            .then((res) => {
               if (res.success === false) {
                  throw new Error(res.reason);
               }

               // update the diagram name
               diagram.name = diagramName;

               return toast({
                  message: "Diagram renamed.",
                  type: "success",
               });
            })
            .catch((err) => {
               console.error(err);
               return toast({
                  title: "Something went wrong.",
                  message: err.message,
                  type: "error",
               });
            });
      }
   }

   // close diagram name text editing input when user clicks outside the input
   function handleClickOutside(e: MouseEvent) {
      if (editDiagramRef.current && !editDiagramRef.current.contains(e.target as Node)) {
         updateDiagramName();
      }
   }

   // close diagram name text editing input when user presses enter
   function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
         updateDiagramName();
      }
   }

   // add event listeners when editDiagramName is true and the diagram name changes
   useEffect(() => {
      if (editDiagramName) {
         document.addEventListener("mousedown", handleClickOutside);
         document.addEventListener("keydown", handleKeyDown);
         return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
         };
      }
   }, [editDiagramName, diagramName]);

   // when the editDiagramName input is opened, select all text inside of it
   useEffect(() => {
      if (editDiagramName) {
         setTimeout(() => {
            editDiagramRef.current.querySelector("input")?.select();
         }, 0);
      }
   }, [editDiagramName]);

   return (
      <div className="h-full basis-2/4 flex justify-center items-center gap-2 text-sm select-none">
         {/* show proj label if diagram is in a proj and if diagram name is not being edited */}
         {diagram.project && !editDiagramName && (
            <>
               <Link
                  href={"/dashboard/diagrams/project/[id]"}
                  as={`/dashboard/diagrams/project/${diagram.project.id}`}
                  className="opacity-70 hover:opacity-100 cursor-pointer"
               >
                  {diagram.project.name}
               </Link>
               <div className="opacity-30 text-xl font-light">/</div>
            </>
         )}

         {/* show diagram name w dropdown if user is the owner and if not timed out */}
         {!wsTimedOut && role === "owner" ? (
            <DropdownMenu onOpenChange={setOpen}>
               <div className="flex justify-center items-center gap-1 h-full">
                  {!editDiagramName ? (
                     <div onClick={() => setEditDiagramName(true)}>{diagramName}</div>
                  ) : (
                     <div ref={editDiagramRef}>
                        <input
                           className={cn("bg-transparent text-md text-center py-0.5 focus:outline-none focus:ring-0")}
                           onChange={(e) => setDiagramName(e.currentTarget.value)}
                           value={diagramName}
                        />
                     </div>
                  )}

                  {!editDiagramName && (
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
                  )}
               </div>

               <DropdownMenu.Portal>
                  <DropdownMenu.Content className="mt-1 mr-2 py-1 md:w-52 rounded-none bg-diagram-menu border-0" align="end">
                     {/* Version history of diagram */}
                     {/* <DropdownMenu.Item
                        className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                        onClick={() => {
                           // show history
                        }}
                     >
                        <div>Show version history</div>
                     </DropdownMenu.Item>

                     <DropdownMenu.Separator className="my-1 bg-[#636363]" /> */}

                     {/* Rename diagram */}
                     <DropdownMenu.Item
                        className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                        onClick={() => {
                           setEditDiagramName(true);
                        }}
                     >
                        <div>Rename</div>
                     </DropdownMenu.Item>

                     {/* Duplicate diagram */}
                     <DropdownMenu.Item
                        className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                        onClick={() => {
                           // duplicate diagram
                           const formData = new FormData();
                           formData.append("duplicateDiagramId", diagram.id);

                           if (diagram.project) {
                              formData.append("projectId", diagram.project.id);
                           }

                           createDiagram(formData).then((res) => {
                              if (res.success === false) {
                                 return toast({
                                    title: "Something went wrong.",
                                    message: res.reason,
                                    type: "error",
                                 });
                              }

                              return toast({
                                 title: "Diagram duplicated",
                                 message: `${diagram.name} has been duplicated.`,
                                 type: "success",
                              });
                           });
                        }}
                     >
                        <div>Duplicate</div>
                     </DropdownMenu.Item>

                     {/* Move diagram to project if its not in a project */}
                     {!diagram.project ? (
                        <DropdownMenu.Item
                           className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                           onClick={() => {
                              // move diagram to project
                           }}
                        >
                           <div>Move to project...</div>
                        </DropdownMenu.Item>
                     ) : (
                        <DropdownMenu.Item
                           className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                           onClick={() => {
                              removeDiagramFromProject(diagram.project.id, diagram.id).then((res) => {
                                 if (res.success === false) {
                                    return toast({
                                       title: "Something went wrong.",
                                       message: res.reason,
                                       type: "error",
                                    });
                                 }

                                 router.refresh();
                                 return toast({
                                    title: "Diagram removed",
                                    message: "The diagram has been removed from the project.",
                                    type: "success",
                                 });
                              });
                           }}
                        >
                           <div>Remove from project...</div>
                        </DropdownMenu.Item>
                     )}

                     <DropdownMenu.Separator className="my-1 bg-[#636363]" />

                     {/* Delete the diagram */}
                     <DropdownMenu.Item
                        className="flex text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white"
                        onClick={() => {
                           // delete the diagram
                           deleteDiagram(diagram.id).then((res) => {
                              if (res.success === false) {
                                 return toast({
                                    title: "Something went wrong.",
                                    message: res.reason,
                                    type: "error",
                                 });
                              }

                              // if diagram is in a proj, go to the project page
                              if (diagram.project) {
                                 router.push(`/dashboard/diagrams/project/${diagram.project.id}`);
                              }
                              // otherwise go to the dashboard
                              else {
                                 router.push("/dashboard");
                              }

                              return toast({
                                 title: "Diagram deleted",
                                 message: "The diagram has been deleted.",
                                 type: "success",
                              });
                           });
                        }}
                     >
                        <div>Delete...</div>
                     </DropdownMenu.Item>
                  </DropdownMenu.Content>
               </DropdownMenu.Portal>
            </DropdownMenu>
         ) : (
            <>
               {wsTimedOut ? (
                  // if timed out, let the user click the diagram name to refresh
                  <div onClick={() => router.refresh()} className="cursor-pointer flex gap-1.5 items-center">
                     {diagramName}
                  </div>
               ) : (
                  // just show the diagram name if not timed out and not an owner
                  <div>{diagramName}</div>
               )}
            </>
         )}
      </div>
   );
}
