import { useState } from "react";
import { Project } from "types";

import NewDiagram from "@/components/dashboard/diagrams/new-diagram";
import CreateButton from "@/components/dashboard/create-button";

export default function DiagramsHeader({
   diagramsLength,
   showEmptyPlaceholder,
   project,
   selectingItems,
   setSelectingItems,
}: {
   diagramsLength: number;
   showEmptyPlaceholder: boolean;
   project?: Project;
   selectingItems: boolean;
   setSelectingItems: (current: boolean) => void;
}) {
   const [open, setOpen] = useState(false);

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
            <div className="flex gap-3">
               {/* initial buttons shown on the diagrams dashboard page */}
               {!!diagramsLength && !selectingItems && !open && (
                  <>
                     {diagramsLength > 1 && (
                        <button
                           className="self-center relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm flex-none font-medium text-white hover:bg-brand-400 focus:outline-none"
                           onClick={() => setSelectingItems(true)}
                        >
                           Select
                        </button>
                     )}

                     <CreateButton title="New diagram" onClick={() => setOpen((current) => !current)} />
                  </>
               )}

               {/* when the user can select items */}
               {!!diagramsLength && selectingItems && !open && (
                  <button
                     className="self-center relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm flex-none font-medium text-white hover:bg-brand-400 focus:outline-none"
                     onClick={() => setSelectingItems(false)}
                  >
                     Cancel
                  </button>
               )}

               {/* when the user is creating a new diagram */}
               {!!diagramsLength && open && (
                  <button
                     className="self-center relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm flex-none font-medium text-white hover:bg-brand-400 focus:outline-none"
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
