import { getSession, getDiagram } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { DiagramLayout } from "@/components/diagram/layout";

export default async function DiagramPage({ params: { diagramId } }: { params: { diagramId: string } }) {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/dashboard/diagrams");
   }

   const diagramRequest = await getDiagram(diagramId);

   if (!diagramRequest.success) {
      return (
         <div>
            <div>Diagram not found</div>
            <div>
               Go back to <a href="/dashboard/diagrams">Dashboard</a>
            </div>
         </div>
      );
   }

   return <DiagramLayout diagram={diagramRequest.response} />;
}
