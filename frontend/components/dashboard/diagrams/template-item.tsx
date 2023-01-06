"use client";

import Link from "next/link";

import { formatDate } from "@/lib/utils";
import { DiagramTemplate } from "types";

export function TemplateItem({ template }: { template: DiagramTemplate }) {
   return (
      <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/6 h-64 mb-4">
         <div
            className="m-2 border-gray-150 border rounded cursor-pointer bg-white h-full"
            onClick={() => {
               console.log("template", template);
            }}
         >
            {/* <div className="pt-4 pb-3 pl-4 border-t border-gray-200">
               <h2 className="title-font text-lg font-medium text-gray-900">{diagram.name}</h2>
               <p className="mt-1">{formatDate(diagram.created_at?.toString())}</p> 
        </div> */}
         </div>
      </div>
   );
}

TemplateItem.Skeleton = function TemplateItemSkeleton() {
   return (
      <div className="p-4">
         <div className="space-y-3">
            {/* <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" /> */}
         </div>
      </div>
   );
};
