import Link from "next/link";

import { formatDate } from "@/lib/utils";
import { Diagram } from "types";

export function DiagramItem({ diagram }: { diagram: Diagram }) {
   return (
      // Add a gray border to the diagram item
      // Add padding between each item
      <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-2">
         <div className="m-2 border-gray-200 border rounded">
            <a className="relative block h-48 overflow-hidden ">
               <img
                  className="block h-full w-full object-cover object-center cursor-pointer"
                  src="https://dummyimage.com/420x260"
               />
            </a>
            <div className="pt-4 pb-3 pl-4 border-t border-gray-200">
               <h2 className="title-font text-lg font-medium text-gray-900">{diagram.name}</h2>
               <p className="mt-1">{formatDate(diagram.created_at?.toString())}</p>
            </div>
         </div>
      </div>
   );
}

DiagramItem.Skeleton = function DiagramItemSkeleton() {
   return (
      <div className="p-4">
         <div className="space-y-3">
            {/* <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" /> */}
         </div>
      </div>
   );
};
