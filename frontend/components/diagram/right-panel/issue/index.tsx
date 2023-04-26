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
         <div className="font-bold mb-1">Issue</div>
         <div className="font-bold">{issue.title}</div>

         <div>{issueDate}</div>
         <div>Created by:</div>
         <div>{issue.created_by.full_name}</div>
         <div>{issue.description}</div>
         <div
            className={cn("flex justify-center h-48 my-4 overflow-hidden", issue.connected_cells.length > 1 && "h-60")}
            dangerouslySetInnerHTML={{ __html: issue.image }}
         />
      </>
   );
}
