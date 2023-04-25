import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useState } from "react";
import { lightColorOptions } from "../styling-options/colors";
import { Issue } from "types";
import { cn } from "@/lib/utils";

export default function IssuePanel({ issue }: { issue: Issue }) {
   console.log("issue", issue);
   return (
      <>
         {/* ---------------------- ISSUE SETTINGS SECTION ---------------------- */}
         <div className="font-bold mb-1">Issue</div>
         <div>{issue.id}</div>
         <div>{issue.created_at}</div>
         <div>{issue.updated_at}</div>
         <div>Created by:</div>
         <div>{issue.created_by.full_name}</div>
         <div>{issue.title}</div>
         <div>{issue.description}</div>
         <div
            className={cn("flex justify-center h-48 my-4 overflow-hidden", issue.connected_cells.length > 1 && "h-60")}
            dangerouslySetInnerHTML={{ __html: issue.image }}
         />
      </>
   );
}
