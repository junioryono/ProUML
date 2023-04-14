import type X6Type from "@antv/x6";
import React, { useState, useRef, Fragment, useEffect, MutableRefObject } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/icons";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "@/ui/toast";
import { cn } from "@/lib/utils";
import { createIssue } from "@/lib/auth-fetch";
const Icon = Icons["bug"];

const issueAddSchema = z.object({
   title: z.string().min(1, "Must be at least 1 character"),
   description: z.string().min(1, "Must be at least 1 character"),
});

type FormData = z.infer<typeof issueAddSchema>;

export default function AddIssue({ graph, diagramId }: { graph: MutableRefObject<X6Type.Graph>; diagramId: string }) {
   const {
      handleSubmit,
      register,
      reset,
      formState: { errors, isValid },
   } = useForm<FormData>({
      resolver: zodResolver(issueAddSchema),
   });

   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [open, setOpen] = useState(false);
   const [showSubmitButton, setShowSubmitButton] = useState(false);

   const [selectedCells, setSelectedCells] = useState<X6Type.Cell[]>([]);
   const [image, setImage] = useState<string>();

   useEffect(() => {
      if (!graph || !graph.current) {
         return;
      }

      setSelectedCells(graph.current?.getSelectedCells());

      graph.current?.on("cell:selected", () => {
         setSelectedCells(graph.current?.getSelectedCells());
      });

      graph.current?.on("cell:unselected", () => {
         setSelectedCells(graph.current?.getSelectedCells());
      });
   }, [graph]);

   useEffect(() => {
      if (!open || !graph || !graph.current) {
         setImage(undefined);
         return;
      }

      const selectedCells = graph.current?.getSelectedCells();
      const bbox = graph.current?.getCellsBBox(selectedCells);
      const viewbox = graph.current?.localToGraph(bbox);
      graph.current?.toSVG((base64SVG) => setImage(base64SVG), {
         copyStyles: false,
         serializeImages: true,
         selectedCellIds: selectedCells.map((cell) => cell.id),
         viewBox: viewbox,
      });
   }, [open, graph, selectedCells]);

   useEffect(() => {
      setShowSubmitButton(isValid);
   }, [isValid]);

   useEffect(() => {
      console.log("image", image);
   }, [image]);

   async function onNewIssueSubmit(data: FormData) {
      setIsLoading(true);
      const res = await createIssue(diagramId, {
         ...data,
         connected_cells: selectedCells.map((cell) => cell.id),
         image,
      });
      setIsLoading(false);
      if (res && res.success) {
         toast({
            title: "Issue created",
            message: "Issue created successfully",
            type: "success",
         });
         setOpen(false);
         setShowSubmitButton(false);
         reset();
      } else {
         toast({
            title: "Error",
            message: res.reason,
            type: "error",
         });
      }
   }

   return (
      <>
         <div
            className={cn(
               "w-10 h-full px-2 text-xs flex justify-center items-center gap-1",
               selectedCells.length ? "hover:bg-diagram-menu-item-hovered" : "cursor-not-allowed",
            )}
            onClick={() => selectedCells.length && setOpen(true)}
         >
            <Icon
               className={cn(
                  "stroke-1",
                  // If there are no selected cells, disable the button
                  selectedCells.length ? "text-white" : "text-gray-400",
               )}
            />
         </div>
         <Transition.Root show={open} as={Fragment}>
            <Dialog
               className="relative z-10"
               onClose={() => {
                  setOpen(false);
                  setShowSubmitButton(false);
                  reset();
               }}
            >
               <form onSubmit={handleSubmit(onNewIssueSubmit)}>
                  <Transition.Child
                     as={Fragment}
                     enter="ease-out duration-300"
                     enterFrom="opacity-0"
                     enterTo="opacity-100"
                     leave="ease-in duration-200"
                     leaveFrom="opacity-100"
                     leaveTo="opacity-0"
                  >
                     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                  </Transition.Child>

                  <div className="fixed inset-0 z-10 overflow-y-auto">
                     <div className="flex min-h-full justify-center text-center items-center p-0">
                        <Transition.Child
                           as={Fragment}
                           enter="ease-out duration-300"
                           enterFrom="opacity-0 translate-y-0 scale-95"
                           enterTo="opacity-100 translate-y-0 scale-100"
                           leave="ease-in duration-200"
                           leaveFrom="opacity-100 translate-y-0 scale-100"
                           leaveTo="opacity-0 translate-y-0 scale-95"
                        >
                           <Dialog.Panel className="relative transform rounded-lg bg-white text-left shadow-xl transition-all my-8 w-full max-w-lg overflow-visible">
                              <div
                                 className={cn("h-1", isLoading && "animate-[loading-bar_1s_linear_infinite] bg-blue-500")}
                              />
                              <Dialog.Title className="pl-6 pt-5 pb-3 text-xl font-medium leading-7 text-gray-900">
                                 Add an issue
                              </Dialog.Title>

                              <div className="bg-white pl-6 pr-6 mb-3">
                                 <div className="flex mb-2">
                                    <input
                                       placeholder="Title"
                                       className="w-full my-0 block h-11 border rounded-t-md border-slate-300 pl-3 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none"
                                       autoCapitalize="none"
                                       autoComplete="off"
                                       autoCorrect="off"
                                       spellCheck="false"
                                       {...register("title")}
                                    />
                                 </div>
                                 {errors?.["title"] && (
                                    <p className="text-sm mb-1 text-red-600">{errors["title"].message}</p>
                                 )}
                                 <div className="flex mb-2">
                                    <textarea
                                       placeholder="Descripton"
                                       className="w-full my-0 block h-20 rounded-b-md border border-slate-300 pt-2 pl-3 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none"
                                       autoCapitalize="none"
                                       autoComplete="off"
                                       autoCorrect="off"
                                       spellCheck="false"
                                       {...register("description")}
                                    />
                                 </div>
                                 {errors?.["description"] && (
                                    <p className="text-sm mt-1 mb-1 text-red-600">{errors["description"].message}</p>
                                 )}

                                 {image && (
                                    <div
                                       className={cn(
                                          "flex justify-center h-48 my-4 overflow-hidden",
                                          selectedCells.length > 1 && "h-60",
                                       )}
                                       dangerouslySetInnerHTML={{ __html: image }}
                                    />
                                 )}
                              </div>

                              <div className="bg-gray-50 py-4 flex flex-row-reverse px-6 select-none rounded-b-lg">
                                 <button
                                    type="button"
                                    className={cn(
                                       "w-fit ml-0 relative inline-flex h-10 items-center rounded-full border border-transparent bg-blue-700 px-6 py-3 text-sm font-medium text-white hover:drop-shadow-md hover:bg-blue-800 focus:outline-none",
                                       showSubmitButton && "mr-4",
                                    )}
                                    onClick={showSubmitButton ? handleSubmit(onNewIssueSubmit) : () => setOpen(false)}
                                 >
                                    {showSubmitButton ? "Add" : "Cancel"}
                                 </button>
                              </div>
                           </Dialog.Panel>
                        </Transition.Child>
                     </div>
                  </div>
               </form>
            </Dialog>
         </Transition.Root>
      </>
   );
}
