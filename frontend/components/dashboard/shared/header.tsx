import { Diagram, Project } from "types";
import { createProject } from "@/lib/auth-fetch";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "@/ui/toast";
import CreateButton from "@/components/dashboard/create-button";
import SelectedItemsOptions from "@/components/dashboard/diagrams/selected-items-options";

export default function SharedHeader({
   diagramsLength,
   project,
   selectingItems,
   setSelectingItems,
   selectedItems,
   setSelectedItems,
}: {
   diagramsLength: number;
   project?: Project;
   selectingItems: boolean;
   setSelectingItems: (current: boolean) => void;
   selectedItems: (Diagram | Project)[];
   setSelectedItems: (current: (Diagram | Project)[]) => void;
}) {
   const [showMenu, setShowMenu] = useState(false);

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

   return (
      <>
         <div className="flex justify-between px-2">
            <div className="grid gap-1">
               <div className="flex">
                  <h1 className="text-2xl font-bold tracking-wide text-slate-900 cursor-default">Shared</h1>
                  {project && (
                     <>
                        <h1 className="text-2xl px-2 tracking-wide text-slate-900 opacity-70">/</h1>
                        <h1 className="text-2xl font-bold tracking-wide text-slate-900">{project.name}</h1>
                     </>
                  )}
               </div>
               <p className="text-neutral-500 cursor-default">Edit and manage shared diagrams and projects.</p>
            </div>
            <div className="flex gap-3 items-center">
               {/* initial buttons shown on the diagrams dashboard page */}
               {!!diagramsLength && !selectingItems && (
                  <>
                     {diagramsLength > 1 && (
                        <button
                           className="relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm flex-none font-medium text-white hover:bg-brand-400 focus:outline-none"
                           onClick={() => setSelectingItems(true)}
                        >
                           Select
                        </button>
                     )}
                  </>
               )}

               {/* when the user can select items */}
               {!!diagramsLength && selectingItems && (
                  <>
                     {/* show the amount of items selected if there are any selected */}
                     {selectedItems.length > 0 ? (
                        <>
                           <span className="font-medium text-slate-900">{selectedItems.length} selected</span>
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
            </div>
         </div>
      </>
   );
}
