import { getProject, getSession } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import { User, Diagram, Project } from "types";
import { useState } from "react";

import EmptyPlaceholder from "@/components/dashboard/empty-placeholder";
import DiagramItem from "@/components/dashboard/diagrams/diagram-item";
import NewDiagram from "@/components/dashboard/diagrams/new-diagram";
import DiagramsHeader from "@/components/dashboard/diagrams/header";
import DashboardLayout from "@/components/dashboard/layout";
import DashboardShell from "@/components/dashboard/shell";

export default function DashboardDiagramsProjectsPage({
   user,
   projectRequest,
}: {
   user: User;
   projectRequest: Awaited<ReturnType<typeof getProject>>;
}) {
   const showEmptyPlaceholder = !projectRequest.success || !projectRequest.response.diagrams?.length;
   const [selectingItems, setSelectingItems] = useState(false);

   // selected items which can consist of diagrams or projects
   const [selectedItems, setSelectedItems] = useState<(Diagram | Project)[]>([]);

   return (
      <DashboardLayout user={user}>
         <DashboardShell>
            <DiagramsHeader
               diagramsLength={!projectRequest.success ? 0 : projectRequest.response.diagrams?.length}
               showEmptyPlaceholder={showEmptyPlaceholder}
               project={projectRequest.response}
               selectingItems={selectingItems}
               setSelectingItems={setSelectingItems}
               selectedItems={selectedItems}
               setSelectedItems={setSelectedItems}
            />
            <div className="flex flex-col">
               {showEmptyPlaceholder ? (
                  <>
                     <NewDiagram project={projectRequest.response} />
                     <EmptyPlaceholder>
                        <EmptyPlaceholder.Icon name="post" />
                        <EmptyPlaceholder.Title>No diagrams created</EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>
                           You don&apos;t have any diagrams yet. Start creating one.
                        </EmptyPlaceholder.Description>
                     </EmptyPlaceholder>
                  </>
               ) : (
                  <div className="flex flex-wrap select-none">
                     {projectRequest.response.diagrams?.map((diagram) => (
                        <DiagramItem
                           key={diagram.id}
                           diagram={diagram}
                           project={projectRequest.response}
                           selectable={selectingItems}
                           selectedItems={selectedItems}
                           setSelectedItems={setSelectedItems}
                        />
                     ))}
                  </div>
               )}
            </div>
         </DashboardShell>
      </DashboardLayout>
   );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const id = ctx.params.id as string;
   const cookies = ctx.req.headers.cookie;

   const [userRequest, projectRequest] = await Promise.all([
      getSession({
         headers: {
            cookie: cookies,
         },
      }),
      getProject(id, {
         headers: {
            cookie: cookies,
         },
      }),
   ]);

   if (!userRequest.success) {
      return {
         redirect: {
            destination: "/login?redirect=/dashboard/diagrams/project/" + id,
            permanent: false,
         },
      };
   }

   if (userRequest.cookie) {
      ctx.res.setHeader("set-cookie", userRequest.cookie);
   } else if (projectRequest.cookie) {
      ctx.res.setHeader("set-cookie", projectRequest.cookie);
   }

   return {
      props: {
         user: userRequest.response || null,
         projectRequest: projectRequest,
      },
   };
};
