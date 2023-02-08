"use client";

import { NewDiagram } from "@/components/dashboard/diagrams/new-diagram";
import { useState } from "react";
import { CreateButton } from "@/components/dashboard/create-button";
import { Project } from "types";

export function DiagramsHeader({
   diagramsLength,
   showEmptyPlaceholder,
   project,
}: {
   diagramsLength: number;
   showEmptyPlaceholder: boolean;
   project?: Project;
}) {
   const [open, setOpen] = useState(false);

   return (
      <>
         <div className="flex justify-between px-2">
            <div className="grid gap-1">
               <h1 className="text-2xl font-bold tracking-wide text-slate-900">Diagrams</h1>
               {project && <h1 className="text-2xl font-bold tracking-wide text-slate-900">/ {project.name}</h1>}
               <p className="text-neutral-500">Create and manage diagrams.</p>
            </div>
            {!!diagramsLength && !open && (
               <CreateButton title="New diagram" onClick={() => setOpen((current) => !current)} />
            )}
         </div>
         {!showEmptyPlaceholder && open && (
            <NewDiagram className="transition-all ease-out duration-700 mb-0" project={project} />
         )}
      </>
   );
}
