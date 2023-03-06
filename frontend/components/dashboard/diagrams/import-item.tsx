import { useRouter } from "next/navigation";
import { createDiagram } from "@/lib/auth-fetch";
import { useState } from "react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { toast } from "@/ui/toast";
import { Project } from "types";

const validFileTypes = [
   "zip",
   "application/octet-stream",
   "application/zip",
   "application/x-zip",
   "application/x-zip-compressed",
];

export default function ImportItem({ project }: { project?: Project }) {
   const router = useRouter();
   const [isLoading, setIsLoading] = useState<boolean>(false);

   async function onProjectImport(e: React.ChangeEvent<HTMLInputElement>) {
      setIsLoading(true);

      if (!e.target.files || !validFileTypes.includes(e.target.files[0].type)) {
         e.target.value = null; // Reset form files
         setIsLoading(false);
         return toast({
            title: "Something went wrong.",
            message: "Your project must be uploaded in a compressed format (application/zip).",
            type: "error",
         });
      }

      const formData = new FormData();
      formData.append("project", e.target.files[0]);

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
         .finally(() => {
            e.target.value = null; // Reset form files
            setIsLoading(false);
         });
   }

   return (
      <div className="w-36 lg:w-1/5 xl:w-1/7 mb-4 mr-3 lg:mr-0">
         <div className="w-[inherit] lg:w-auto flex items-center justify-center m-1">
            <label
               htmlFor="dropzone-file"
               className={cn(
                  "flex flex-col items-center justify-center w-full h-52 border-2 bg-slate-50 border-gray-300 border-dashed rounded-lg",
                  !isLoading && "cursor-pointer hover:bg-white hover:border-gray-400",
               )}
            >
               <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                     aria-hidden="true"
                     className="w-10 h-10 mb-3 text-gray-400"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                     ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 font-semibold">Import project</p>
                  <p className="text-xs text-gray-500">.zip (max 2GB)</p>
               </div>
               {isLoading && <Icons.spinner className="h-4 w-4 animate-spin" />}
               <input
                  type="file"
                  accept={validFileTypes.join(",")}
                  className="hidden"
                  onChange={onProjectImport}
                  disabled={isLoading}
               />
            </label>
         </div>
      </div>
   );
}
