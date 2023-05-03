import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useMemo, useState } from "react";
import { lightColorOptions } from "../styling-options/colors";
import { Issue } from "types";
import { cn, formatTime } from "@/lib/utils";

export default function IssuePanel({ issue }: { issue: Issue }) {
   console.log("issue", issue);

   const issueDate = useMemo(() => formatTime(issue.created_at), [issue.created_at]);

   return (
      <>
         {/* ---------------------- ISSUE SETTINGS SECTION ---------------------- */}
         <div className="flex flex-row justify-between">
            <label className="font-bold mb-1 text-left">Issue Name</label>
            <div className="flex justify-end text-gray-500">{issueDate}</div>
         </div>
         <input
            className="border border-gray-400 p-2 rounded-lg shadow-md focus:outline-none hover:border-gray-500 focus:border-gray-500 focus:border-transparent"
            value={issue.title}
         />

         <label className="font-bold mb-1 mt-4 text-left">Issue Description</label>
         <textarea
            className="border border-gray-400 p-2 mb-2 rounded-lg shadow-md focus:outline-none hover:border-gray-500 focus:border-gray-500 focus:border-transparent h-32"
            value={issue.description}
         ></textarea>

         <div className="flex flex-row pt-2 pb-3 items-center justify-center text-gray-500">
            <div className="pr-1">Created by:</div>
            <div className="text-center">{issue.created_by.full_name}</div>
         </div>

         <hr className="border-slate-400" />
      </>
   );
}
