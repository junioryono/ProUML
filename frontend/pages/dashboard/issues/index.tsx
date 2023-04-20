import { getAllIssues, getSession } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import { APIResponse, Issue, User } from "types";

import DashboardShell from "@/components/dashboard/shell";
import EmptyPlaceholder from "@/components/dashboard/empty-placeholder";
import DashboardLayout from "@/components/dashboard/layout";
import DashboardHeader from "@/components/dashboard/header";
import { NewLineKind } from "typescript";
import { useState } from "react";

export default function DashboardIssuesPage({ user, issuesRequest }: { user: User; issuesRequest: APIResponse<Issue[]> }) {
   const showEmptyPlaceholder = !issuesRequest.success || !issuesRequest.response.length;

   return (
      <DashboardLayout user={user}>
         <DashboardShell>
            <DashboardHeader heading="Issues" text="Manage issues assigned to you." />
            <div className="flex flex-col">
               {showEmptyPlaceholder ? (
                  <>
                     <EmptyPlaceholder>
                        <EmptyPlaceholder.Icon name="post" />
                        <EmptyPlaceholder.Title>No issues assigned to you.</EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>Issues are assigned in the diagrams.</EmptyPlaceholder.Description>
                     </EmptyPlaceholder>
                  </>
               ) : (
                  <>
                     <div className="mb-2">
                        <div className="m-2 border-black border-[1.4px] rounded-md h-screen w-[1100px]">
                           <div className="p-2 bg-black rounded-t-sm text-white flex flex-row justify-between">
                              <div className="ml-2">Name</div>
                              <div className="">Issued</div>
                              <div className="mx-12">By</div>
                           </div>
                           {issuesRequest.response.map((issue, index) => (
                              <IssueComponent key={index} issue={issue} />
                           ))}
                        </div>
                     </div>
                  </>
               )}
            </div>
         </DashboardShell>
      </DashboardLayout>
   );
}

function IssueComponent({ issue }: { issue: Issue }) {
   const [open, setOpen] = useState(false);
   const [checked, setChecked] = useState(false);

   const handleCheck = () => {
      setChecked(!checked);
   };

   if (!open) {
      return (
         <div
            className="mt-2 mb-2 ml-2 mr-2 border-gray-200 flex flex-col cursor-pointer group"
            onClick={() => setOpen(true)}
         >
            <div className="flex overflow-hidden whitespace-nowrap">
               <div className="border-gray-200 border rounded-md hover:border-blue-500 cursor-pointer px-2 pt-0.5 bg-slate-200 w-full">
                  <div className="text-gray-600">{issue.id}</div>

                  <h2 className="title-fon sm:text-base font-medium pr-2 pt-1 text-gray-900 flex flex-row justify-between">
                     <div className="">{issue.title}</div>
                     <div className="">{issue.created_at}</div>
                     <div className="text-sm text-gray-600">Name & Icon</div>
                  </h2>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="h-18 mt-2 mb-2 ml-2 mr-2 border-gray-200 flex flex-col group">
         <div className="flex overflow-hidden">
            <div className="border-gray-200 border rounded-md px-2 pt-0.5 bg-slate-200 w-full">
               <div className="text-gray-600 flex flex-row justify-between">
                  Issue number
                  <div className="flex items-center mb-4">
                     <input
                        id="default-checkbox"
                        type="checkbox"
                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                     ></input>
                     <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Issue Completed
                     </label>
                  </div>
               </div>
               <p className="p-2 font-medium">"Diagram name" then cn if "in project name"</p>
               <div className="relative block h-48 overflow-hidden">
                  {/* TODO <img
            className="block h-full w-min object-cover object-center border-gray-300"
            src="https://images.unsplash.com/photo-1616169900003-8e1b6b2b1b1a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
            draggable={false}
         /> */}
               </div>
               <p className="px-2 pb-2 text-sm hover:text-blue-500 cursor-pointer w-32">Go to diagram</p>
               <p className="p-2 text-sm">
                  <b>Description: </b>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore sunt, accusamus
                  incidunt a hic possimus. Eaque, aliquid asperiores et sed ut eveniet ea blanditiis distinctio amet maiores
                  hic neque nemo. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore sunt, accusamus incidunt
                  a hic possimus. Eaque, aliquid asperiores et sed ut eveniet ea blanditiis distinctio amet maiores hic neque
                  nemo. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore sunt, accusamus incidunt a hic
                  possimus. Eaque, aliquid asperiores et sed ut eveniet ea blanditiis distinctio amet maiores hic neque nemo.
               </p>
               <h2 className="title-fon sm:text-base font-medium pr-2 pt-1 text-gray-900 flex flex-row justify-between">
                  <div className="">Issue Name</div>
                  <div className="">Date and Time</div>
                  <div className="text-sm text-gray-600">Name & Icon</div>
               </h2>
            </div>
         </div>
      </div>
   );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const cookies = ctx.req.headers.cookie;

   const [userRequest, issuesRequest] = await Promise.all([
      getSession({
         headers: {
            cookie: cookies,
         },
      }),
      getAllIssues({
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
   } else if (issuesRequest.cookie) {
      ctx.res.setHeader("set-cookie", issuesRequest.cookie);
   }

   return {
      props: {
         user: userRequest.response || null,
         issuesRequest: issuesRequest,
      },
   };
};
