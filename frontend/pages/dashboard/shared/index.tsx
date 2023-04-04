import { getSharedDiagrams, getSession } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import { User } from "types";

import DashboardShell from "@/components/dashboard/shell";
import DiagramItem from "@/components/dashboard/diagrams/diagram-item";
import EmptyPlaceholder from "@/components/dashboard/empty-placeholder";
import DashboardLayout from "@/components/dashboard/layout";

export default function DashboardSharedPage({
   user,
   diagramsRequest,
}: {
   user: User;
   diagramsRequest: Awaited<ReturnType<typeof getSharedDiagrams>>;
}) {
   // if there is no shared diagrams, show empty placeholder
   const showEmptyPlaceholder =
      !diagramsRequest.success || (!diagramsRequest.response.diagrams.length && !diagramsRequest.response.projects.length);

   return (
      <DashboardLayout user={user}>
         <DashboardShell>
            <div className="flex justify-between px-2">
               <div className="grid gap-1">
                  <div className="flex">
                     <h1 className="text-2xl font-bold tracking-wide text-slate-900 cursor-default">Shared Diagrams</h1>
                  </div>
                  <p className="text-neutral-500 cursor-default">Edit and manage shared diagrams.</p>
               </div>
            </div>
            <div className="flex flex-col">
               {showEmptyPlaceholder ? (
                  <EmptyPlaceholder>
                     <EmptyPlaceholder.Icon name="post" />
                     <EmptyPlaceholder.Title>No shared diagrams</EmptyPlaceholder.Title>
                     <EmptyPlaceholder.Description>
                        You don&apos;t have any shared diagrams. Share a diagram or ask to be invited to collaborate on a
                        diagram.
                     </EmptyPlaceholder.Description>
                  </EmptyPlaceholder>
               ) : (
                  <>
                     {diagramsRequest.response.projects.length > 0 && (
                        <div className="flex flex-wrap select-none">
                           {diagramsRequest.response.projects.map((project) => (
                              <ProjectItem key={project.id} project={project} />
                           ))}
                        </div>
                     )}
                     {diagramsRequest.response.diagrams.length > 0 && (
                        <div className="flex flex-wrap select-none">
                           {diagramsRequest.response.diagrams.map((diagram) => (
                              <DiagramItem key={diagram.id} diagram={diagram} userId={user.user_id} />
                           ))}
                        </div>
                     )}
                  </>
               )}
            </div>
         </DashboardShell>
      </DashboardLayout>
   );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const cookies = ctx.req.headers.cookie;

   const [userRequest, diagramsRequest] = await Promise.all([
      getSession({
         headers: {
            cookie: cookies,
         },
      }),
      getSharedDiagrams({
         headers: {
            cookie: cookies,
         },
      }),
   ]);

   if (!userRequest.success) {
      return {
         redirect: {
            destination: "/login?redirect=/dashboard/shared",
            permanent: false,
         },
      };
   }

   if (userRequest.cookie) {
      ctx.res.setHeader("set-cookie", userRequest.cookie);
   } else if (diagramsRequest.cookie) {
      ctx.res.setHeader("set-cookie", diagramsRequest.cookie);
   }

   return {
      props: {
         user: userRequest.response || null,
         diagramsRequest: diagramsRequest,
      },
   };
};
