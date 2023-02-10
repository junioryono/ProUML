import DashboardShell from "@/components/dashboard/shell";
import DashboardHeader from "@/components/dashboard/header";
import ProjectsHeader from "@/components/dashboard/projects/header";
import EmptyPlaceholder from "@/components/dashboard/empty-placeholder";

import { getSession, getProject } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function DashboardProjectPage({ params: { id } }: { params: { id: string } }) {
   const user = await getSession();

   if (!user.success) {
      redirect("/login?redirect=/dashboard/projects");
   }

   const projectsRequest = await getProject(id);

   return (
      <DashboardShell>
         <DashboardHeader heading="Projects" text="Create and manage projects.">
            <ProjectsHeader />
         </DashboardHeader>
         <div className="flex flex-col">
            {!projectsRequest.success ? (
               <EmptyPlaceholder>
                  <EmptyPlaceholder.Icon name="fileImage" />
                  <EmptyPlaceholder.Title>No projects created</EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                     You haven&apos;t created any projects yet. Start creating one.
                  </EmptyPlaceholder.Description>
               </EmptyPlaceholder>
            ) : (
               <div className="flex flex-wrap select-none">{JSON.stringify(projectsRequest.response)}</div>
            )}
         </div>
      </DashboardShell>
   );
}
