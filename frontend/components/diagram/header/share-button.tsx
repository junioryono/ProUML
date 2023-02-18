import type X6Type from "@antv/x6";

import { useState, useRef, Fragment } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "@/ui/toast";
import { Icons } from "@/components/icons";
import { Diagram, User } from "types";

const userAddSchema = z.object({
   email: z.string().min(8),
});

type FormData = z.infer<typeof userAddSchema>;

export default function ShareButton({ user, diagram }: { user: User; diagram: Diagram }) {
   const {
      handleSubmit,
      register,
      reset,
      formState: { errors },
   } = useForm<FormData>({
      resolver: zodResolver(userAddSchema),
   });
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [open, setOpen] = useState(false);
   const cancelButtonRef = useRef(null);

   async function onSubmit(data: FormData) {
      console.log("onSubmit", data);
      toast({
         message: "Test Message.",
         type: "success",
      });
   }

   return (
      <>
         <button
            className="ml-4 mr-2 self-center relative inline-flex h-8 items-center rounded-md border border-transparent bg-blue-500 px-4 text-xs flex-none font-medium text-white hover:bg-blue-600 focus:outline-none"
            onClick={() => setOpen(true)}
         >
            Share
         </button>
         <Transition.Root show={open} as={Fragment}>
            <Dialog
               className="relative z-10"
               initialFocus={cancelButtonRef}
               onClose={() => {
                  setOpen(false);
                  reset();
               }}
            >
               <form onSubmit={handleSubmit(onSubmit)}>
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
                     <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                           as={Fragment}
                           enter="ease-out duration-300"
                           enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                           enterTo="opacity-100 translate-y-0 sm:scale-100"
                           leave="ease-in duration-200"
                           leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                           leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                           <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                              <div className="bg-white px-4 pt-5 pb-4 ml-6">
                                 <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                       <Dialog.Title className="text-xl font-medium leading-7 text-gray-900">
                                          Share &quot;{diagram.name}&quot;
                                       </Dialog.Title>
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-white pl-10 pr-10 mb-3">
                                 <div className="flex">
                                    <input
                                       id="email"
                                       placeholder="name@example.com"
                                       className="w-full my-0 mb-2 block h-9 rounded-md border border-slate-300 py-5 px-3 text-base placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none"
                                       type="text"
                                       autoCapitalize="none"
                                       autoComplete="both"
                                       autoCorrect="off"
                                       spellCheck="false"
                                       name="email"
                                       disabled={isLoading}
                                       {...register("email")}
                                    />
                                    <div className="flex flex-row hover:bg-slate-100 my-3 pl-2 cursor-pointer">
                                       Editor
                                       <svg
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          focusable="false"
                                          className="cursor-pointer"
                                       >
                                          <path d="M7 10l5 5 5-5H7z"></path>
                                       </svg>
                                    </div>
                                 </div>
                                 {errors?.email && <p className="text-sm mt-1 mb-1 text-red-600">{errors.email.message}</p>}
                              </div>

                              <div className="bg-white px-4 sm:px-6">
                                 <div className="sm:flex sm:items-start">
                                    <div className="text-center sm:ml-4 sm:text-left">
                                       <Dialog.Title className="text-md font-medium leading-7 text-gray-900">
                                          People with access
                                       </Dialog.Title>
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-white px-6 pt-2 pb-4 ml-4 flex flex-col">
                                 <div>Hello1</div>
                                 <div>Hello2</div>
                              </div>

                              <div className="bg-white px-4 sm:px-6">
                                 <div className="sm:flex sm:items-start">
                                    <div className="text-center sm:ml-4 sm:text-left">
                                       <Dialog.Title className="text-md font-medium leading-7 text-gray-900">
                                          General access
                                       </Dialog.Title>
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-white px-6 pt-2 pb-4 ml-4 mr-4 flex flex-row hover:bg-slate-300 rounded-md">
                                 <svg
                                    focusable="false"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    className="rounded-md mt-2 bg-slate-400 hover:bg-slate-50"
                                 >
                                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                                 </svg>
                                 <div className=" flex flex-col cursor-pointer rounded-md px-2 mb-1">
                                    Restricted
                                    <div className="text-xs text-stone-500">Only people with access can open the link</div>
                                 </div>
                                 <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    focusable="false"
                                    className="cursor-pointer hover:bg-slate-400"
                                 >
                                    <path d="M7 10l5 5 5-5H7z"></path>
                                 </svg>
                              </div>

                              <div className="bg-gray-50 px-4 py-3 flex flex-row sm:flex-row-reverse sm:px-6">
                                 <button
                                    type="button"
                                    className="w-fit ml-3 sm:ml-0 sm:mr-4 relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none"
                                    onClick={() => setOpen(false)}
                                    ref={cancelButtonRef}
                                 >
                                    Invite
                                 </button>
                                 <button
                                    type="button"
                                    className="mr-auto w-fit ml-3 sm:ml-0 relative inline-flex h-9 items-center rounded-md border px-3 py-2 text-sm font-medium text-blue-500 hover:bg-blue-50 focus:outline-none"
                                    //onClick={() => setOpen(false)}
                                    ref={cancelButtonRef}
                                 >
                                    <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" className="pr-2">
                                       <path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"></path>
                                    </svg>
                                    Copy Link
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
