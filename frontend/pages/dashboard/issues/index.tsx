import { getSession } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import { User } from "types";

import DashboardShell from "@/components/dashboard/shell";
import EmptyPlaceholder from "@/components/dashboard/empty-placeholder";
import DashboardLayout from "@/components/dashboard/layout";
import DashboardHeader from "@/components/dashboard/header";

export default function DashboardIssuesPage({ user, issues }: { user: User; issues: any }) {
   return (
      <DashboardLayout user={user}>
         <DashboardShell>
            <DashboardHeader heading="Issues" text="Manage issues assigned to you." />
            <div className="flex flex-col">
               {/* {EmptyPlaceholder ? (
                  <>
                     <EmptyPlaceholder>
                        <EmptyPlaceholder.Icon name="post" />
                        <EmptyPlaceholder.Title>No issues assigned to you.</EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>Issues are assigned in the diagrams.</EmptyPlaceholder.Description>
                     </EmptyPlaceholder>
                  </>
               ) : ( */}
               <div className="w-1/2 sm:w-1/2 md:w-1/3 xl:w-1/4 mb-2">
                  {/* Add a link to the project item and open it in a new tab */}
                  <div className="m-2 border-gray-200 border rounded-md hover:border-blue-500">
                     <div className="pt-3 pb-2 pl-4 pr-2 border-gray-200 flex group">
                        <div className="flex overflow-hidden whitespace-nowrap">
                           <div className="pr-4 pt-0.5">Icon</div>
                           <h2 className="title-font text-sm sm:text-base font-medium pr-4 pt-1 text-gray-900 overflow-ellipsis overflow-hidden">
                              Issue Name
                           </h2>
                        </div>
                        <div className="h-fit ml-auto md:mt-auto">Time</div>
                     </div>
                  </div>
               </div>
               {/* )} */}
            </div>
         </DashboardShell>
      </DashboardLayout>
   );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const cookies = ctx.req.headers.cookie;

   const [userRequest] = await Promise.all([
      getSession({
         headers: {
            cookie: cookies,
         },
      }),
   ]);

   if (!userRequest.success) {
      return {
         redirect: {
            destination: "/login?redirect=/dashboard/issues",
            permanent: false,
         },
      };
   }

   if (userRequest.cookie) {
      ctx.res.setHeader("set-cookie", userRequest.cookie);
   }
   // else if (issuesRequest.cookie) {
   //    ctx.res.setHeader("set-cookie", issuesRequest.cookie);
   // }

   return {
      props: {
         user: userRequest.response || null,
      },
   };
};
