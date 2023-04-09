import { getSharedDiagrams, getSession } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import { User, Diagram, Project } from "types";
import { useState } from "react";

import SharedHeader from "@/components/dashboard/shared/header";
import DashboardShell from "@/components/dashboard/shell";
import DiagramItem from "@/components/dashboard/diagrams/diagram-item";
import ProjectItem from "@/components/dashboard/diagrams/project-item";
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

   const [selectingItems, setSelectingItems] = useState(false);

   // selected items which can consist of diagrams or projects
   const [selectedItems, setSelectedItems] = useState<Diagram[] | Project[]>([]);

   return (
      <DashboardLayout user={user}>
         <DashboardShell>
            <SharedHeader
               diagramsLength={
                  !diagramsRequest.success
                     ? 0
                     : Math.max(diagramsRequest.response.diagrams.length, diagramsRequest.response.projects.length)
               }
               selectingItems={selectingItems}
               setSelectingItems={setSelectingItems}
               selectedItems={selectedItems}
               setSelectedItems={setSelectedItems}
            />

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
                              <ProjectItem
                                 key={project.id}
                                 project={project}
                                 selectable={selectingItems}
                                 selectedItems={selectedItems}
                                 setSelectedItems={setSelectedItems}
                              />
                           ))}
                        </div>
                     )}
                     {diagramsRequest.response.diagrams.length > 0 && (
                        <div className="flex flex-wrap select-none">
                           {diagramsRequest.response.diagrams.map((diagram) => (
                              <DiagramItem
                                 key={diagram.id}
                                 diagram={diagram}
                                 userId={user.user_id}
                                 selectable={selectingItems}
                                 selectedItems={selectedItems}
                                 setSelectedItems={setSelectedItems}
                              />
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
