import { createProject } from "@/lib/auth-fetch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/ui/toast";
import CreateButton from "@/components/dashboard/create-button";

export default function ProjectsHeader() {
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

   return <CreateButton title="New project" isLoading={isLoading} onClick={onClickHandler} />;
}
