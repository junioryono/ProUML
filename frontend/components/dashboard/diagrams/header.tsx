import { useState, useEffect } from "react";
import { Diagram, Project } from "types";

import SelectedItemsOptions from "@/components/dashboard/diagrams/selected-items-options";
import NewDiagram from "@/components/dashboard/diagrams/new-diagram";
import CreateButton from "@/components/dashboard/create-button";
import { createProject } from "@/lib/auth-fetch";
import { toast } from "@/ui/toast";
import { useRouter } from "next/navigation";

export default function DiagramsHeader({
   diagramsLength,
   showEmptyPlaceholder,
   project,
   selectingItems,
   setSelectingItems,
   selectedItems,
   setSelectedItems,
}: {
   diagramsLength: number;
   showEmptyPlaceholder: boolean;
   project?: Project;
   selectingItems: boolean;
   setSelectingItems: (current: boolean) => void;
   selectedItems: (Diagram | Project)[];
   setSelectedItems: (current: (Diagram | Project)[]) => void;
}) {
   const router = useRouter();
   const [open, setOpen] = useState(false);
   const [showMenu, setShowMenu] = useState(false);
   const [isLoadingProject, setIsLoadingProject] = useState(false);

   // if the user presses the escape key while selecting items, close the selection
   useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
         if (event.key === "Escape") {
            setSelectingItems(false);
            setSelectedItems([]);
         }
      };

      window.addEventListener("keydown", handleEscape);

      return () => {
         window.removeEventListener("keydown", handleEscape);
      };
   }, [setSelectingItems, setSelectedItems]);

   async function onClickHandlerProject() {
      if (isLoadingProject) {
         return;
      }

      setIsLoadingProject(true);

      const formData = new FormData();

      createProject(formData)
         .then((res) => {
            if (res.success === false) {
               throw new Error(res.reason);
            }

            router.refresh();

            return toast({
               title: "Success!",
               message: "Your team was successfuly created!",
               type: "success",
            });
         })
         .catch((error) => {
            console.error(error);
            return toast({
               title: "Something went wrong.",
               message: error.message,
               type: "error",
            });
         })
         .finally(() => setIsLoadingProject(false));
   }

   return (
      <>
         <div className="flex justify-between px-2">
            <div className="grid gap-1">
               <div className="flex">
                  <h1 className="text-2xl font-bold tracking-wide text-slate-900 cursor-default">Diagrams</h1>
                  {project && (
                     <>
                        <h1 className="text-2xl px-2 tracking-wide text-slate-900 opacity-70">/</h1>
                        <h1 className="text-2xl font-bold tracking-wide text-slate-900">{project.name}</h1>
                     </>
                  )}
               </div>
               <p className="text-neutral-500 cursor-default">Create and manage diagrams.</p>
            </div>
            <div className="flex gap-3 items-center">
               {/* initial buttons shown on the diagrams dashboard page */}
               {!!diagramsLength && !selectingItems && !open && (
                  <>
                     {diagramsLength > 1 && (
                        <button
                           className="relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm flex-none font-medium text-white hover:bg-brand-400 focus:outline-none"
                           onClick={() => setSelectingItems(true)}
                        >
                           Select
                        </button>
                     )}

                     <CreateButton title="New project" isLoading={isLoadingProject} onClick={onClickHandlerProject} />
                     <CreateButton title="New diagram" onClick={() => setOpen((current) => !current)} />
                  </>
               )}

               {/* when the user can select items */}
               {!!diagramsLength && selectingItems && !open && (
                  <>
                     {/* show the amount of items selected if there are any selected */}
                     {selectedItems.length > 0 ? (
                        <>
                           <span className="font-medium text-slate-900 text-center">{selectedItems.length} selected</span>
                           <SelectedItemsOptions
                              showMenu={showMenu}
                              setShowMenu={setShowMenu}
                              selectedItems={selectedItems}
                           />
                        </>
                     ) : (
                        <span className="font-medium text-slate-900 mr-3">Select items</span>
                     )}

                     <button
                        className="relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm flex-none font-medium text-white hover:bg-brand-400 focus:outline-none"
                        onClick={() => {
                           setSelectingItems(false);
                           // empty the selected items array
                           setSelectedItems([]);
                        }}
                     >
                        Cancel
                     </button>
                  </>
               )}

               {/* when the user is creating a new diagram */}
               {!!diagramsLength && open && (
                  <button
                     className="relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm flex-none font-medium text-white hover:bg-brand-400 focus:outline-none"
                     onClick={() => setOpen((current) => !current)}
                  >
                     Cancel
                  </button>
               )}
            </div>
         </div>
         {!showEmptyPlaceholder && open && (
            <NewDiagram className="transition-all ease-out duration-700 mb-0" project={project} />
         )}
      </>
   );
}
