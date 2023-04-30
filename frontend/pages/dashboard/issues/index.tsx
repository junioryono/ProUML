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
import { cn, formatTime } from "@/lib/utils";
import { deleteIssue } from "@/lib/auth-fetch";
import { toast } from "@/ui/toast";

export default function DashboardIssuesPage({ user, issuesRequest }: { user: User; issuesRequest: APIResponse<Issue[]> }) {
   const [issues, setIssues] = useState<Issue[]>(issuesRequest.response || []);
   const showEmptyPlaceholder = !issuesRequest.success || !issuesRequest.response?.length;

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
                        <div className="m-2 border-black border-[1.4px] rounded-md overflow-auto">
                           <div className="p-2 bg-black rounded-t-sm text-white grid grid-flow-col ">
                              <div className="flex justify-start pl-4">Name</div>
                              <div className="flex justify-center">Issued</div>
                              <div className="flex justify-end pr-4">Issuer</div>
                           </div>
                           {issues.map((issue) => (
                              <IssueComponent key={issue.id} user={user} issue={issue} setIssues={setIssues} />
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

function IssueComponent({
   user,
   issue,
   setIssues,
}: {
   user: User;
   issue: Issue;
   setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
}) {
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

   const issueDate = useMemo(() => formatTime(issue.created_at), [issue.created_at]);

   if (!open) {
      return (
         <div className="my-2 mx-2 border-gray-200 flex flex-col cursor-pointer group" onClick={() => setOpen(true)}>
            <div className="flex overflow-hidden whitespace-nowrap">
               <div className="py-0.5 border-gray-200 border rounded-md hover:border-blue-500 cursor-pointer px-2 pt-0.5 bg-slate-200 w-full">
                  <div className="text-gray-600">{issue.id}</div>

                  <h2 className="pt-1 grid grid-cols-3 items-center">
                     <div className="flex justify-start">{issue.title}</div>
                     <div className="flex justify-center">{issueDate}</div>
                     <div className="flex justify-end items-center">
                        <Image
                           src={issue.created_by.picture}
                           width={30}
                           height={30}
                           className="rounded-full border-2 border-double -ml-4 only:ml-0"
                           alt="avatar"
                        />
                        <div className="ml-1">{issue.created_by.full_name}</div>
                     </div>
                  </h2>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div
         className="my-2 mx-2 border-gray-200 flex flex-col group border rounded-md hover:border-blue-500 overflow-hidden"
         onClick={() => setOpen(false)}
      >
         <div className="flex overflow-hidden">
            <div className="py-0.5 border-gray-200 border rounded-md px-2 pt-0.5 bg-slate-200 w-full">
               <div className="text-gray-600 flex flex-row justify-between">
                  <div className="text-gray-600">{issue.id}</div>
                  <div className="flex items-center mb-4" onClick={deleteIssueFunction}>
                     <button className="inline-flex items-center justify-center mt-1 px-3 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800">
                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" className="">
                           <g strokeWidth="0"></g>
                           <g strokeLinecap="round" strokeLinejoin="round"></g>
                           <g>
                              <path
                                 d="M10 10V16M14 10V16M18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6M4 6H20M15 6V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V6"
                                 stroke="#FFFFFF"
                                 strokeWidth="1.5"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              ></path>
                           </g>
                        </svg>
                     </button>
                  </div>
               </div>
               {/* <div className="p-2 font-medium flex flex-col items-center">
                  {issue.diagram.project && (
                     <div>
                        <b>Project:</b> {issue.diagram.project.name}
                     </div>
                  )}
                  <div>
                     <b>Diagram:</b> {issue.diagram.name}
                  </div>
               </div> */}

               <div className="p-1 text-sm text-center flex items-center justify-center">
                  <b>Where: </b>&nbsp;
                  {/* if the issue is in a diagram within a project */}
                  {issue.diagram.project && (
                     <>
                        <div className="hover:text-blue-500 cursor-pointer hover:underline">
                           <Link
                              href="/dashboard/diagrams/project/[id]"
                              as={`/dashboard/diagrams/project/${issue.diagram.project.id}`}
                           >
                              {issue.diagram.project.name}
                           </Link>
                        </div>
                        <span className="mx-1">/</span>
                     </>
                  )}
                  <div className="hover:text-blue-500 cursor-pointer hover:underline">
                     <Link href="/dashboard/diagrams/[id]" as={`/dashboard/diagrams/${issue.diagram.id}`}>
                        {issue.diagram.name}
                     </Link>
                  </div>
               </div>

               <p className="p-1 text-sm text-center">
                  <b>Description: </b>
                  {issue.description}
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
               {/* <p className="px-2 pb-3 text-sm hover:text-blue-500 cursor-pointer text-center underline">
                  <Link href="/dashboard/diagrams/[id]" as={`/dashboard/diagrams/${issue.diagram.id}`}>
                     Go to Diagram
                  </Link>
               </p> */}
               <h2 className="pt-1 grid grid-cols-3 items-center">
                  <div className="flex justify-start">{issue.title}</div>
                  <div className="flex justify-center">{issueDate}</div>
                  <div className="flex justify-end items-center">
                     <Image
                        src={issue.created_by.picture}
                        width={30}
                        height={30}
                        className="rounded-full border-2 border-double -ml-4 only:ml-0"
                        alt="avatar"
                     />
                     <div className="ml-1">{issue.created_by.full_name}</div>
                  </div>
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
