import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useMemo, useState } from "react";
import { lightColorOptions } from "../styling-options/colors";
import { Issue } from "types";
import { cn, formatTime } from "@/lib/utils";
import Image from "next/image";
import FadeIn from "@/components/fade-in";

export default function IssuePanel({ issue }: { issue: Issue }) {
   const issueDate = useMemo(() => formatTime(issue.created_at), [issue.created_at]);

   const [issueName, setIssueName] = useState(issue.title);
   const [issueDescription, setIssueDescription] = useState(issue.description);

   // update the issue name and description when the issue changes
   useEffect(() => {
      setIssueName(issue.title);
      setIssueDescription(issue.description);
   }, [issue]);

   return (
      // Fade in the issue if a new one is selected
      <FadeIn fadeDelay={500} key={issue.id}>
         {/* ---------------------- ISSUE SETTINGS SECTION ---------------------- */}
         <div className="flex flex-row justify-between">
            <label className="font-bold mb-1 text-left">Issue Name</label>
            <div className="flex justify-end text-gray-500">{issueDate}</div>
         </div>
         <div className="pb-3">
            <input
               className="border w-full bg-slate-200 border-gray-400 p-2 rounded-lg shadow-md focus:outline-none hover:border-gray-500 focus:border-gray-500 "
               value={issueName}
               onChange={(e) => setIssueName(e.target.value)}
            />
         </div>

         <label className="font-bold mb-1 mt-4 text-left">Issue Description</label>
         <textarea
            className="border w-full bg-slate-200 border-gray-400 p-2 mb-2 rounded-lg shadow-md focus:outline-none hover:border-gray-500 focus:border-gray-500 h-32"
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
         ></textarea>

         <div className="flex pb-3 items-center justify-center text-gray-500">
            <div className="pr-1">Created by:</div>
            <div>
               <Image
                  src={issue.created_by.picture}
                  width={30}
                  height={30}
                  className="rounded-full border-2 border-double -ml-4 only:ml-0"
                  alt="avatar"
               />
            </div>
            <div className="text-center">{issue.created_by.full_name}</div>
         </div>

         <hr className="border-slate-400" />

         <div
            className={cn("flex justify-center my-4 overflow-hidden", issue.connected_cells.length > 1 && "h-60")}
            dangerouslySetInnerHTML={{ __html: issue.image }}
         />
      </FadeIn>
   );
}
