"use client";

import type X6Type from "@antv/x6";

import { useState, useRef, Fragment } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "@/ui/toast";
import { useAuth } from "@/lib/auth-client";
import { Icons } from "@/components/icons";
import { Diagram } from "types";

const userAddSchema = z.object({
   email: z.string().min(8),
});

type FormData = z.infer<typeof userAddSchema>;

export default function ShareButton({ diagram }: { diagram: Diagram }) {
   const { user, setUser } = useAuth();
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

                              <div className="bg-white px-10 mb-3">
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

                              <div className="bg-white px-6 pt-2 pb-4 ml-4 flex flex-col">
                                 <div>Restricted</div>
                              </div>

                              <div className="bg-gray-50 px-4 py-3 flex flex-row sm:flex-row-reverse sm:px-6">
                                 <button
                                    type="button"
                                    className="w-fit ml-3 sm:ml-0 sm:mr-4 relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none"
                                    onClick={() => setOpen(false)}
                                    ref={cancelButtonRef}
                                 >
                                    Done
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
