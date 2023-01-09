"use client";

import { NewDiagram } from "@/components/dashboard/diagrams/new-diagram";
import { useState } from "react";
import { DiagramCreateButton } from "./diagram-create-button";

export function DiagramsHeader({
   diagramsLength,
   showEmptyPlaceholder,
}: {
   diagramsLength: number;
   showEmptyPlaceholder: boolean;
}) {
   const [open, setOpen] = useState(false);

   return (
      <>
         <div className="flex justify-between px-2">
            <div className="grid gap-1">
               <h1 className="text-2xl font-bold tracking-wide text-slate-900">Diagrams</h1>
               <p className="text-neutral-500">Create and manage diagrams.</p>
            </div>
            {!!diagramsLength && !open && <DiagramCreateButton onClick={() => setOpen((current) => !current)} />}
         </div>
         {!showEmptyPlaceholder && open && <NewDiagram className="transition-all ease-out duration-700 mb-0" />}
      </>
   );
}
