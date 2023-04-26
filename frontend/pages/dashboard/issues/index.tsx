import { getAllIssues, getSession } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import { APIResponse, Issue, User } from "types";

import DashboardShell from "@/components/dashboard/shell";
import EmptyPlaceholder from "@/components/dashboard/empty-placeholder";
import DashboardLayout from "@/components/dashboard/layout";
import DashboardHeader from "@/components/dashboard/header";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { deleteIssue } from "@/lib/auth-fetch";
import { toast } from "@/ui/toast";

export default function DashboardIssuesPage({ user, issuesRequest }: { user: User; issuesRequest: APIResponse<Issue[]> }) {
   const [issues, setIssues] = useState<Issue[]>(issuesRequest.response || []);
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
                        <div className="m-2 border-black border-[1.4px] rounded-md h-screen w-[1100px] overflow-auto">
                           <div className="p-2 bg-black rounded-t-sm text-white flex flex-row ">
                              <div className="ml-2 w-5/12">Name</div>
                              <div className="w-4/12 pl-2">Issued</div>
                              <div className="mx-12 pl-16">By</div>
                           </div>
                           {issues.map((issue) => (
                              <IssueComponent key={issue.id} issue={issue} setIssues={setIssues} />
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

function IssueComponent({ issue, setIssues }: { issue: Issue; setIssues: React.Dispatch<React.SetStateAction<Issue[]>> }) {
   const [open, setOpen] = useState(false);
   const [checked, setChecked] = useState(false);

   const handleCheck = () => {
      setChecked(!checked);
   };

   const deleteIssueFunction = useCallback(
      async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
         e.stopPropagation();
         const response = await deleteIssue(issue.diagram.id, issue.id);

         if (!response.success) {
            return toast({
               title: "Something went wrong.",
               message: response.reason,
               type: "error",
            });
         }

         setIssues((prev) => prev.filter((i) => i.id !== issue.id));
         toast({
            title: "Issue deleted.",
            message: "The issue has been deleted.",
            type: "success",
         });
      },
      [issue],
   );

   const issueDate = useMemo(() => {
      const date = new Date(issue.created_at);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${month}/${day}/${year}`;
   }, [issue.created_at]);

   if (!open) {
      return (
         <div
            className="mt-2 mb-2 ml-2 mr-2 border-gray-200 flex flex-col cursor-pointer group overflow-scroll"
            onClick={() => setOpen(true)}
         >
            <div className="flex overflow-hidden whitespace-nowrap">
               <div className="border-gray-200 border rounded-md hover:border-blue-500 cursor-pointer px-2 pt-0.5 bg-slate-200 w-full">
                  <div className="text-gray-600">{issue.id}</div>

                  <h2 className="title-fon sm:text-base font-medium pr-2 pt-1 text-gray-900 flex flex-row">
                     <div className=" w-5/12">{issue.title}</div>
                     <div className=" w-5/12">{issueDate}</div>
                     <Image
                        src={issue.created_by.picture}
                        width={30}
                        height={30}
                        className={`rounded-full border-2 border-double -ml-4 only:ml-0`}
                        alt="avatar"
                     />
                     <div className="text-sm text-gray-600 mt-1 ml-1 ">{issue.created_by.full_name}</div>
                  </h2>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="h-18 mt-2 mb-2 ml-2 mr-2 border-gray-200 flex flex-col group border rounded-md hover:border-blue-500 overflow-hidden">
         <div className="flex overflow-hidden">
            <div className="border-gray-200 border rounded-md px-2 pt-0.5 bg-slate-200 w-full">
               <div className="text-gray-600 flex flex-row justify-between">
                  <div className="text-gray-600" onClick={() => setOpen(false)}>
                     {issue.id}
                  </div>
                  <div className="flex items-center mb-4" onClick={deleteIssueFunction}>
                     <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           className="w-4 h-4 mr-2"
                           viewBox="0 0 20 20"
                           fill="currentColor"
                        >
                           <path
                              fillRule="evenodd"
                              d="M16.364 3.636A8 8 0 1 0 3.636 16.364 8 8 0 0 0 16.364 3.636zm-1.414 1.414A6 6 0 1 1 5.05 14.95a6 6 0 0 1 9.9-8.9z"
                              clipRule="evenodd"
                           />
                           <path
                              fillRule="evenodd"
                              d="M10 4a1 1 0 0 1 1 1v8a1 1 0 0 1-2 0V5a1 1 0 0 1 1-1zM7 5a1 1 0 0 1 2 0v8a1 1 0 0 1-2 0V5z"
                              clipRule="evenodd"
                           />
                        </svg>
                        Delete
                     </button>
                  </div>
               </div>
               <p className="p-2 font-medium flex flex-col">
                  {issue.diagram.project && <div>Project: {issue.diagram.project.name}</div>}
                  <div>Diagram: {issue.diagram.name}</div>
               </p>
               <div className="relative block">
                  <div
                     className={cn(
                        "flex justify-center h-48 my-4 overflow-hidden",
                        issue.connected_cells.length > 1 && "h-60",
                     )}
                     dangerouslySetInnerHTML={{ __html: issue.image }}
                  />
               </div>
               <p className="px-2 pb-2 text-sm hover:text-blue-500 cursor-pointer text-center">
                  <Link href="/dashboard/diagrams/[id]" as={`/dashboard/diagrams/${issue.diagram.id}`}>
                     Go to Diagram
                  </Link>
               </p>
               <p className="p-2 text-sm">
                  <b>Description: </b>
                  {issue.description}
               </p>
               <h2 className="title-fon sm:text-base font-medium pr-2 pt-1 text-gray-900 flex flex-row">
                  <div className=" w-5/12">{issue.title}</div>
                  <div className=" w-5/12">{issueDate}</div>
                  <Image
                     src={issue.created_by.picture}
                     width={30}
                     height={30}
                     className={`rounded-full border-2 border-double -ml-4 only:ml-0`}
                     alt="avatar"
                  />
                  <div className="text-sm text-gray-600 mt-1 ml-1 ">{issue.created_by.full_name}</div>
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
