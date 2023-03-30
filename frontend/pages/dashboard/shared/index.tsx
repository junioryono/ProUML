import { getDiagrams, getSession } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import { User } from "types";

import DashboardShell from "@/components/dashboard/shell";
import DiagramsHeader from "@/components/dashboard/diagrams/header";
import DiagramItem from "@/components/dashboard/diagrams/diagram-item";
import ProjectItem from "@/components/dashboard/diagrams/project-item";
import EmptyPlaceholder from "@/components/dashboard/empty-placeholder";
import NewDiagram from "@/components/dashboard/diagrams/new-diagram";
import DashboardLayout from "@/components/dashboard/layout";

export default function DashboardSharedPage({
   user,
   diagramsRequest,
}: {
   user: User;
   diagramsRequest: Awaited<ReturnType<typeof getDiagrams>>;
}) {
   // if there is no shared diagrams, show empty placeholder
   const showEmptyPlaceholder =
      diagramsRequest.response.diagrams.filter((diagram) => diagram.is_shared_with_current_user).length === 0;

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
                  <>
                     <EmptyPlaceholder>
                        <EmptyPlaceholder.Icon name="post" />
                        <EmptyPlaceholder.Title>No shared diagrams</EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>
                           You don&apos;t have any diagrams shared with you. Get some friends.
                        </EmptyPlaceholder.Description>
                     </EmptyPlaceholder>
                  </>
               ) : (
                  <div className="flex flex-wrap select-none">
                     {diagramsRequest.response.diagrams.map(
                        (diagram) =>
                           // if diagram is shared, show it
                           diagram.is_shared_with_current_user && (
                              <DiagramItem key={diagram.id} diagram={diagram} userId={user.user_id} />
                           ),
                     )}
                  </div>
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
      getDiagrams({
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
