import { Card } from "@/ui/card";

export function UserEmailFormSkeleton() {
   return (
      <Card>
         <Card.Header className="animate-pulse">
            <Card.Title className="h-2 mt-3 mb-2 bg-slate-700 rounded max-w-sm" />
            <Card.Description className="h-2 mt-2 mb-1 bg-slate-700 rounded max-w-[225px]" />
         </Card.Header>
         <Card.Content className="animate-pulse">
            <div className=" h-8 mb-3 w-full max-w-[350px] bg-slate-700 rounded" />
         </Card.Content>
         <Card.Footer className="animate-pulse">
            <button
               type="submit"
               className="relative w-16 inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white"
               disabled={true}
            >
               <span />
            </button>
         </Card.Footer>
      </Card>
   );
}
