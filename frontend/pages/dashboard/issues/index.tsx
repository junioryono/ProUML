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
               <EmptyPlaceholder>
                  <EmptyPlaceholder.Icon name="bug" />
                  <EmptyPlaceholder.Title>No issues created</EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>There are no issues assigned to you.</EmptyPlaceholder.Description>
               </EmptyPlaceholder>
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
