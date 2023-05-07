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
      <div className="w-32 h-52 mx-1 mt-1 mb-2 items-center justify-center">
         <div
            className={cn(
               "w-[inherit] m-1 flex flex-col items-center justify-center pt-5 pb-6 border-gray-150 border rounded-md bg-white h-full text-center shadow-md",
               !isLoading && "cursor-pointer hover:border-blue-500 hover:shadow-lg",
            )}
            onClick={onClickHandler}
         >
            {template.image ? (
               <Image src={template.image} width={128} height={91} alt={template.label} className="w-28 h-auto" />
            ) : (
               <svg
                  viewBox="0 0 20 20"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-gray-400"
                  fill="rgb(156 163 175 / var(--tw-text-opacity))"
                  stroke="rgb(156 163 175 / var(--tw-text-opacity))"
               >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                     <title>file_missing [#9ca38f]</title> <desc>Created with Sketch.</desc> <defs> </defs>{" "}
                     <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g
                           id="Dribbble-Light-Preview"
                           transform="translate(-140.000000, -1479.000000)"
                           fill="rgb(156 163 175 / var(--tw-text-opacity))"
                        >
                           <g id="icons" transform="translate(56.000000, 160.000000)">
                              <path
                                 d="M103.00661,1328.99735 C102.458093,1328.99735 102.01292,1329.44521 102.01292,1329.99704 C102.01292,1330.54887 102.458093,1330.99673 103.00661,1330.99673 C103.555127,1330.99673 104.0003,1330.54887 104.0003,1329.99704 C104.0003,1329.44521 103.555127,1328.99735 103.00661,1328.99735 L103.00661,1328.99735 Z M95.0570894,1336.99484 C94.5085725,1336.99484 94.0633993,1337.4427 94.0633993,1337.99453 C94.0633993,1338.54635 94.5085725,1338.99421 95.0570894,1338.99421 C95.6056063,1338.99421 96.0507795,1338.54635 96.0507795,1337.99453 C96.0507795,1337.4427 95.6056063,1336.99484 95.0570894,1336.99484 L95.0570894,1336.99484 Z M99.0318497,1336.99484 C98.4833327,1336.99484 98.0381596,1337.4427 98.0381596,1337.99453 C98.0381596,1338.54635 98.4833327,1338.99421 99.0318497,1338.99421 C99.5803666,1338.99421 100.02554,1338.54635 100.02554,1337.99453 C100.02554,1337.4427 99.5803666,1336.99484 99.0318497,1336.99484 L99.0318497,1336.99484 Z M103.00661,1336.99484 C102.458093,1336.99484 102.01292,1337.4427 102.01292,1337.99453 C102.01292,1338.54635 102.458093,1338.99421 103.00661,1338.99421 C103.555127,1338.99421 104.0003,1338.54635 104.0003,1337.99453 C104.0003,1337.4427 103.555127,1336.99484 103.00661,1336.99484 L103.00661,1336.99484 Z M87.1075688,1336.99484 C86.5590519,1336.99484 86.1138788,1336.54698 86.1138788,1335.99515 C86.1138788,1335.44333 85.6687056,1334.99547 85.1201887,1334.99547 L85.0565925,1334.99547 C84.5080756,1334.99547 84.0003,1335.44333 84.0003,1335.99515 L84.0003,1336.99484 L84.0629025,1336.99484 C84.0629025,1337.99453 84.9850469,1338.99421 86.0820807,1338.99421 L86.1138788,1338.99421 L87.1075688,1338.99421 C87.6560858,1338.99421 88.1012589,1338.54635 88.1012589,1337.99453 C88.1012589,1337.4427 87.6560858,1336.99484 87.1075688,1336.99484 L87.1075688,1336.99484 Z M85.1201887,1320.99987 C85.6687056,1320.99987 86.1138788,1320.55201 86.1138788,1320.00018 C86.1138788,1319.44836 85.6687056,1319.0005 85.1201887,1319.0005 C84.5716718,1319.0005 84.1264986,1319.44836 84.1264986,1320.00018 C84.1264986,1320.55201 84.5716718,1320.99987 85.1201887,1320.99987 L85.1201887,1320.99987 Z M103.00661,1332.9961 C102.458093,1332.9961 102.01292,1333.44396 102.01292,1333.99578 C102.01292,1334.54761 102.458093,1334.99547 103.00661,1334.99547 C103.555127,1334.99547 104.0003,1334.54761 104.0003,1333.99578 C104.0003,1333.44396 103.555127,1332.9961 103.00661,1332.9961 L103.00661,1332.9961 Z M89.094949,1319.0005 C88.5464321,1319.0005 88.1012589,1319.44836 88.1012589,1320.00018 C88.1012589,1320.55201 88.5464321,1320.99987 89.094949,1320.99987 C89.6434659,1320.99987 90.088639,1320.55201 90.088639,1320.00018 C90.088639,1319.44836 89.6434659,1319.0005 89.094949,1319.0005 L89.094949,1319.0005 Z M93.0697093,1319.0005 C92.5211923,1319.0005 92.0760192,1319.44836 92.0760192,1320.00018 C92.0760192,1320.55201 92.5211923,1320.99987 93.0697093,1320.99987 C93.6182262,1320.99987 94.0633993,1320.55201 94.0633993,1320.00018 C94.0633993,1319.44836 93.6182262,1319.0005 93.0697093,1319.0005 L93.0697093,1319.0005 Z M85.1201887,1324.99861 C85.6687056,1324.99861 86.1138788,1324.55075 86.1138788,1323.99893 C86.1138788,1323.4471 85.6687056,1322.99924 85.1201887,1322.99924 C84.5716718,1322.99924 84.1264986,1323.4471 84.1264986,1323.99893 C84.1264986,1324.55075 84.5716718,1324.99861 85.1201887,1324.99861 L85.1201887,1324.99861 Z M85.1201887,1332.9961 C85.6687056,1332.9961 86.1138788,1332.54824 86.1138788,1331.99641 C86.1138788,1331.44458 85.6687056,1330.99673 85.1201887,1330.99673 C84.5716718,1330.99673 84.1264986,1331.44458 84.1264986,1331.99641 C84.1264986,1332.54824 84.5716718,1332.9961 85.1201887,1332.9961 L85.1201887,1332.9961 Z M91.0823291,1336.99484 C90.5338122,1336.99484 90.088639,1337.4427 90.088639,1337.99453 C90.088639,1338.54635 90.5338122,1338.99421 91.0823291,1338.99421 C91.630846,1338.99421 92.0760192,1338.54635 92.0760192,1337.99453 C92.0760192,1337.4427 91.630846,1336.99484 91.0823291,1336.99484 L91.0823291,1336.99484 Z M103.00661,1326.99798 C103.555127,1326.99798 103.874101,1326.55012 103.874101,1325.9983 C103.874101,1325.55544 103.941672,1325.00361 103.645553,1324.7057 L98.2975127,1319.29341 C97.9318348,1318.92552 97.5790748,1319.0005 97.0444695,1319.0005 C96.4959526,1319.0005 95.9245808,1319.44836 95.9245808,1320.00018 L95.9245808,1324.99861 C95.9245808,1326.10226 96.9401321,1326.99798 98.0381596,1326.99798 L103.00661,1326.99798 Z M84.1264986,1327.99767 C84.1264986,1327.44584 84.5716718,1326.99798 85.1201887,1326.99798 C85.6687056,1326.99798 86.1138788,1327.44584 86.1138788,1327.99767 C86.1138788,1328.5495 85.6687056,1328.99735 85.1201887,1328.99735 C84.5716718,1328.99735 84.1264986,1328.5495 84.1264986,1327.99767 L84.1264986,1327.99767 Z"
                                 id="file_missing-[#9ca38f]"
                              ></path>
                           </g>
                        </g>
                     </g>
                  </g>
               </svg>
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
