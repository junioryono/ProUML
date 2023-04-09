import { Project } from "types";
import { createProject } from "@/lib/auth-fetch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/ui/toast";
import CreateButton from "@/components/dashboard/create-button";

export default function ProjectsHeader({
   projects,
   selectingItems,
   setSelectingItems,
}: {
   projects: Project[];
   selectingItems: boolean;
   setSelectingItems: (value: boolean) => void;
}) {
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);

   async function onClickHandler() {
      if (isLoading) {
         return;
      }

      setIsLoading(true);

      const formData = new FormData();

      createProject(formData)
         .then((res) => {
            if (res.success === false) {
               throw new Error(res.reason);
            }

            router.refresh();

            return toast({
               title: "Success!",
               message: "Your team was successfuly created!",
               type: "success",
            });
         })
         .catch((error) => {
            console.error(error);
            return toast({
               title: "Something went wrong.",
               message: error.message,
               type: "error",
            });
         })
         .finally(() => setIsLoading(false));
   }

   return (
      <div className="flex gap-3">
         {!selectingItems ? (
            <>
               {projects.length > 1 && (
                  <button
                     className="self-center relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm flex-none font-medium text-white hover:bg-brand-400 focus:outline-none"
                     onClick={() => setSelectingItems(true)}
                  >
                     Select
                  </button>
               )}

               <CreateButton title="New project" isLoading={isLoading} onClick={onClickHandler} />
            </>
         ) : (
            <button
               className="self-center relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm flex-none font-medium text-white hover:bg-brand-400 focus:outline-none"
               onClick={() => setSelectingItems(false)}
            >
               Cancel
            </button>
         )}
      </div>
   );
}
