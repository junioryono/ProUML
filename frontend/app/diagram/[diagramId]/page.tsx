import { redirect } from "next/navigation";
import { cache } from "react";

import { getSession, getDiagram } from "@/lib/auth-server";
import { Diagram } from "types";

export default async function DiagramPage({ params: { diagramId } }: { params: { diagramId: string } }) {
   const user = await getSession();

   if (!user) {
      redirect("/login?redirect=/dashboard/diagrams");
   }

   const diagram: Diagram = await getDiagram(diagramId).catch((err) => {
      console.error(err);
      return null;
   });

   if (!diagram) {
      return (
         <div>
            <div>Diagram not found</div>
            <div>
               Go back to <a href="/dashboard/diagrams">Dashboard</a>
            </div>
         </div>
      );
   }

   return (
      <div>
         <div>Diagram Id: {diagramId}</div>
         <div>{JSON.stringify(diagram)}</div>
      </div>
   );
}
