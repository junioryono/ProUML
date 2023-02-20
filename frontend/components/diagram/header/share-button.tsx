import type X6Type from "@antv/x6";

import { useState, useRef, Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "@/ui/toast";
import { Icons } from "@/components/icons";
import { Diagram, User } from "types";
import { getDiagramUsers } from "@/lib/auth-fetch";

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
   const [users, setUsers] = useState<User[]>(null);
   const cancelButtonRef = useRef(null);

   async function onSubmit(data: FormData) {
      console.log("onSubmit", data);
      toast({
         message: "Test Message.",
         type: "success",
      });
   }

   useEffect(() => {
      if (!diagram) {
         return;
      }

      if (!open) {
         setUsers(null);
         return;
      }

      getDiagramUsers(diagram.id).then((res) => {
         console.log("res", res);
         if (res && res.response) {
            setUsers(res.response);
         } else {
            toast({
               message: "Failed to get users.",
               type: "error",
            });
         }
      });
   }, [open, diagram]);

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
                                    <div className="flex flex-row hover:bg-slate-50 my-2 pl-2 cursor-pointer">
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

                              {users &&
                                 users.map((sharedUser) => (
                                    <div className="bg-white flex flex-row">
                                       <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="40"
                                          height="40"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          className="mt-2 ml-3"
                                       >
                                          <path
                                             opacity="0.4"
                                             d="M12 22.01C17.5228 22.01 22 17.5329 22 12.01C22 6.48716 17.5228 2.01001 12 2.01001C6.47715 2.01001 2 6.48716 2 12.01C2 17.5329 6.47715 22.01 12 22.01Z"
                                             fill="#292D32"
                                          />
                                          <path
                                             d="M12 6.93994C9.93 6.93994 8.25 8.61994 8.25 10.6899C8.25 12.7199 9.84 14.3699 11.95 14.4299C11.98 14.4299 12.02 14.4299 12.04 14.4299C12.06 14.4299 12.09 14.4299 12.11 14.4299C12.12 14.4299 12.13 14.4299 12.13 14.4299C14.15 14.3599 15.74 12.7199 15.75 10.6899C15.75 8.61994 14.07 6.93994 12 6.93994Z"
                                             fill="#292D32"
                                          />
                                          <path
                                             d="M18.7807 19.36C17.0007 21 14.6207 22.01 12.0007 22.01C9.3807 22.01 7.0007 21 5.2207 19.36C5.4607 18.45 6.1107 17.62 7.0607 16.98C9.7907 15.16 14.2307 15.16 16.9407 16.98C17.9007 17.62 18.5407 18.45 18.7807 19.36Z"
                                             fill="#292D32"
                                          />
                                       </svg>
                                       <div className="flex flex-col">
                                          <div className="flex flex-row pt-2 pl-2">
                                             {sharedUser.full_name}
                                             {sharedUser.user_id === user.user_id && (
                                                <span className="text-xs text-stone-500 pl-2 mb-1 mt-auto">(you)</span>
                                             )}
                                             <div className="flex flex-row text-gray-600 hover:bg-slate-50 hover:text-black pl-3 cursor-pointer pl-auto  mr-1 rounded">
                                                Editor
                                                <svg
                                                   width="24"
                                                   height="24"
                                                   viewBox="0 0 24 24"
                                                   focusable="false"
                                                   className="cursor-pointer fill-slate-500"
                                                >
                                                   <path d="M7 10l5 5 5-5H7z"></path>
                                                </svg>
                                             </div>
                                          </div>
                                          <div className="text-xs text-stone-500 pb-1 pl-2">{sharedUser.email}</div>
                                       </div>
                                    </div>
                                 ))}

                              <div className="bg-white px-4 sm:px-6">
                                 <div className="sm:flex sm:items-start">
                                    <div className="text-center sm:ml-4 sm:text-left">
                                       <Dialog.Title className="text-md font-medium leading-7 text-gray-900">
                                          General access
                                       </Dialog.Title>
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-white px-6 mx-2 mb-4 mt-1 flex flex-row hover:bg-slate-100 rounded-l-full rounded-md">
                                 <svg
                                    focusable="false"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    className="rounded-md mt-2.5 bg-slate-100 hover:bg-slate-50"
                                 >
                                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                                 </svg>
                                 <div className=" flex flex-col cursor-pointer rounded-md px-2 mb-1">
                                    <div className="flex flex-row text-sm cursor-pointer hover:bg-slate-200 w-28 pl-2 mt-1 rounded-md">
                                       Restricted
                                       <svg width="20" height="20" viewBox="0 0 24 24" focusable="false" className="">
                                          <path d="M7 10l5 5 5-5H7z"></path>
                                       </svg>
                                    </div>
                                    <div className="text-xs text-stone-500  pl-2">
                                       Only people with access can open the link
                                    </div>
                                 </div>
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
