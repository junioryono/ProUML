import Link from "next/link";

import { formatDate } from "@/lib/utils";
import { Diagram } from "types";
import { DiagramItemOptions } from "./diagram-item-options";

export function DiagramItem({ diagram }: { diagram: Diagram }) {
   return (
      // Add a gray border to the diagram item
      // Add padding between each item
      <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-2">
         {/* Add a link to the diagram item and open it in a new tab */}
         <div className="m-2 border-gray-200 border rounded cursor-pointer">
            <Link href="/diagram/[id]" as={`/diagram/${diagram.id}`}>
               <div className="relative block h-48 overflow-hidden ">
                  <img className="block h-full w-full object-cover object-center" src="https://dummyimage.com/420x260" />
               </div>
               <div className="pt-3 pb-2 pl-4 border-t border-gray-200 flex">
                  <div className="flex-grow">
                     <h2 className="title-font text-mg font-medium text-gray-900">{diagram.name}</h2>
                     <p className="mt-1 text-sm">{formatDate(diagram.created_at?.toString())}</p>
                  </div>
                  <div className="h-fit mt-auto mr-2">
                     <DiagramItemOptions diagram={diagram} />
                  </div>
               </div>
            </Link>
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
