import Link from "next/link";

import { formatDate } from "@/lib/utils";

export function UserItem({ diagram }: any) {
   return (
      <div className="flex items-center justify-between p-4">
         <div className="grid gap-1">
            <Link href={`/editor/${diagram.id}`} className="font-semibold hover:underline">
               {diagram.title}
            </Link>
            <div>
               <p className="text-sm text-slate-600">{formatDate(diagram.createdAt?.toDateString())}</p>
            </div>
         </div>
         {/* <PostOperations post={{ id: post.id, title: post.title }} /> */}
         {/* <PostDeleteButton post={{ id: post.id, title: post.title }} /> */}
      </div>
   );
}

UserItem.Skeleton = function UserItemSkeleton() {
   return (
      <div className="p-4">
         <div className="space-y-3">
            {/* <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" /> */}
         </div>
      </div>
   );
};
