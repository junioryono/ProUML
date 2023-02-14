import { getProjects, getSession } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import { Project, User } from "types";

import EmptyPlaceholder from "@/components/dashboard/empty-placeholder";
import ProjectItem from "@/components/dashboard/diagrams/project-item";
import ProjectsHeader from "@/components/dashboard/projects/header";
import DashboardLayout from "@/components/dashboard/layout";
import DashboardHeader from "@/components/dashboard/header";
import DashboardShell from "@/components/dashboard/shell";

export default function DashboardProjectsPage({ user, projects }: { user: User; projects: Project[] }) {
   return (
      <DashboardLayout user={user}>
         <DashboardShell>
            <DashboardHeader heading="Projects" text="Create and manage projects.">
               <ProjectsHeader />
            </DashboardHeader>
            <div className="flex flex-col">
               {!projects || !projects.length ? (
                  <EmptyPlaceholder>
                     <EmptyPlaceholder.Icon name="fileImage" />
                     <EmptyPlaceholder.Title>No projects created</EmptyPlaceholder.Title>
                     <EmptyPlaceholder.Description>
                        You haven&apos;t created any projects yet. Start creating one.
                     </EmptyPlaceholder.Description>
                  </EmptyPlaceholder>
               ) : (
                  <div className="flex flex-wrap select-none">
                     {projects.map((project) => (
                        <ProjectItem key={project.id} project={project} />
                     ))}
                  </div>
               )}
            </div>
         </DashboardShell>
      </DashboardLayout>
   );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const cookies = ctx.req.headers.cookie;

   const [userRequest, projectsRequest] = await Promise.all([
      getSession({
         headers: {
            cookie: cookies,
         },
      }),
      getProjects({
         headers: {
            cookie: cookies,
         },
      }),
   ]);

   if (!userRequest.success) {
      return {
         redirect: {
            destination: "/login?redirect=/dashboard/projects",
            permanent: false,
         },
      };
   }

   if (userRequest.cookie) {
      ctx.res.setHeader("set-cookie", userRequest.cookie);
   } else if (projectsRequest.cookie) {
      ctx.res.setHeader("set-cookie", projectsRequest.cookie);
   }

   return {
      props: {
         user: userRequest.response || null,
         projects: projectsRequest.response || null,
      },
   };
};
