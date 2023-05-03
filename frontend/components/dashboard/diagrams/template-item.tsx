import { createDiagram } from "@/lib/auth-fetch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/ui/toast";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { DiagramTemplate, Project } from "types";
import Image from "next/image";

export default function TemplateItem({ template, project }: { template: DiagramTemplate; project?: Project }) {
   const router = useRouter();
   const [isLoading, setIsLoading] = useState<boolean>(false);

   async function onClickHandler() {
      if (isLoading) {
         return;
      }

      setIsLoading(true);

      const formData = new FormData();
      formData.append("template", template.name);

      if (project) {
         formData.append("projectId", project.id);
      }

      createDiagram(formData)
         .then((res) => {
            if (res.success === false) {
               throw new Error(res.reason);
            }

            router.push(`/dashboard/diagrams/${res.response}`);

            return toast({
               title: "Success!",
               message: "Your project was successfully imported. Redirecting you to the diagram editor.",
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
      <div className="w-36 h-52 mb-4 mr-3">
         <div
            className={cn(
               "w-[inherit] m-1 flex flex-col items-center justify-center pt-5 pb-6 border-gray-150 border rounded-md bg-white h-full text-center",
               !isLoading && "cursor-pointer hover:border-blue-500",
            )}
            onClick={onClickHandler}
         >
            {template.image && (
               <Image src={template.image} width={128} height={91} alt={template.label} className="w-32 h-auto" />
            )}
            <p className="mb-2 mt-3 px-1 text-sm text-gray-500 font-semibold">{template.label}</p>
            {isLoading && <Icons.spinner className="h-4 w-4 animate-spin" />}
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
