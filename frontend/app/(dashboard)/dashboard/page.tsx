import { redirect } from "next/navigation";
import { cache } from "react";

import { DashboardHeader } from "@/components/dashboard/header";
import { DiagramCreateButton } from "@/components/dashboard/diagram-create-button";
import { DashboardShell } from "@/components/dashboard/shell";
import { DiagramItem } from "@/components/dashboard/diagram-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { getSession, getDiagrams } from "@/lib/auth-server";
import { Diagram } from "types";

// const getDiagramsForUser = cache(async (userId: User["id"]) => {
//   return await db.diagram.findMany({
//     where: {
//       authorId: userId,
//     },
//     select: {
//       id: true,
//       title: true,
//       published: true,
//       createdAt: true,
//     },
//     orderBy: {
//       updatedAt: "desc",
//     },
//   })
// })

export default async function DashboardPage() {
   const user = await getSession();

   if (!user) {
      redirect("/login?redirect=/dashboard");
   }

   const diagrams: Diagram[] = await getDiagrams().catch((err) => {
      console.error(err);
      return null;
   });

   console.log("diagrams", diagrams);

   return (
      <DashboardShell>
         <DashboardHeader heading="Diagrams" text="Create and manage diagrams.">
            <DiagramCreateButton />
         </DashboardHeader>
         <div>
            {!diagrams || !diagrams.length ? (
               <EmptyPlaceholder>
                  <EmptyPlaceholder.Icon name="post" />
                  <EmptyPlaceholder.Title>No diagrams created</EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                     You don&apos;t have any diagrams yet. Start creating content.
                  </EmptyPlaceholder.Description>
                  <DiagramCreateButton className="border-slate-200 bg-white text-brand-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2" />
               </EmptyPlaceholder>
            ) : (
               <div className="flex flex-wrap">
                  {diagrams.map((diagram) => (
                     <DiagramItem key={diagram.id} diagram={diagram} />
                  ))}
               </div>
            )}
         </div>
      </DashboardShell>
   );
}
