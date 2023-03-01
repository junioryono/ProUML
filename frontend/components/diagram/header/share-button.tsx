import type X6Type from "@antv/x6";

import { useState, useRef, Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "@/ui/toast";
import { Icons } from "@/components/icons";
import { Diagram, User } from "types";
import { getDiagramUsers, addDiagramUser } from "@/lib/auth-fetch";
import Image from "next/image";

const userAddSchema = z.object({
   email: z.string().min(8),
   role: z.string().min(1),
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
      defaultValues: {
         email: "",
         role: "editor",
      },
   });
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [open, setOpen] = useState(false);
   const [users, setUsers] = useState<User[]>(null);
   const [isOpen, setIsOpen] = useState(false);
   const toggleDropdown = () => setIsOpen(!isOpen);
   const [showMenu, setShowMenu] = useState(false);
   const handleMenuClick = () => setShowMenu(!showMenu);
   const [dropDown, setDropDown] = useState(false);
   const dropDownSet = () => setDropDown(!dropDown);

   async function onSubmit(data: FormData) {
      console.log("onSubmit", data);
      setIsLoading(true);
      const res = await addDiagramUser(diagram.id, data.email, data.role);
      setIsLoading(false);
      if (res && res.success) {
         toast({
            message: "User added.",
            type: "success",
         });
         setOpen(false);
         reset();
      } else {
         toast({
            message: "Failed to add user.",
            type: "error",
         });
      }
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

                              <div className="bg-white pl-10 pr-10 mb-1">
                                 <div className="flex">
                                    <input
                                       id="email"
                                       placeholder="Add people and groups"
                                       className="w-full my-0 mb-2 block h-9 rounded-md border border-slate-300 py-5 px-3 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none"
                                       type="email"
                                       autoCapitalize="none"
                                       autoComplete="both"
                                       autoCorrect="off"
                                       spellCheck="false"
                                       name="email"
                                       disabled={isLoading}
                                       {...register("email")}
                                    />
                                    <div className="relative">
                                       <div
                                          className="flex flex-row pl-2 ml-2 h-10 mr-4 border border-slate-300 hover:border-slate-400 rounded-xl cursor-pointer items-center"
                                          onClick={toggleDropdown}
                                       >
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
                                       {isOpen && (
                                          <div className="absolute z-10 bg-white rounded-lg shadow-lg mt-2">
                                             <ul>
                                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-t">
                                                   Viewer
                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Commentator</li>
                                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                   <svg
                                                      width="16"
                                                      height="16"
                                                      viewBox="0 0 24 24"
                                                      focusable="false"
                                                      className="inline-block mr-3 text-black"
                                                   >
                                                      <path
                                                         fill="currentColor"
                                                         d="M9.428 18.01L4.175 12.82l1.296-1.288 3.957 3.94L18.441 6.804l1.288 1.288L9.428 18.01z"
                                                      ></path>
                                                   </svg>
                                                   Editor
                                                </li>
                                             </ul>
                                          </div>
                                       )}
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

                              <div className="pb-4">
                                 {users &&
                                    users.map((sharedUser) => (
                                       <div className="bg-white flex flex-row hover:bg-slate-100 rounded-l-3xl ml-3">
                                          <Image
                                             src={sharedUser.picture}
                                             width={35}
                                             height={35}
                                             className="rounded-full m-2"
                                             alt="avatar"
                                          />
                                          <div className="flex flex-col w-full">
                                             <div className="flex flex-row pt-1 pl-1">
                                                {sharedUser.full_name}
                                                {sharedUser.user_id === user.user_id && (
                                                   <span className="text-xs text-stone-500 pl-2 mb-1 mt-auto">(you)</span>
                                                )}
                                                <div
                                                   className="flex flex-row text-gray-600 text-sm px-2 hover:bg-slate-200 mt-1 hover:text-black cursor-pointer pl-auto mr-10 rounded ml-auto"
                                                   onClick={dropDownSet}
                                                >
                                                   {capitalizeFirstLetter(sharedUser.role)}
                                                   {sharedUser.role !== "owner" && (
                                                      <svg
                                                         width="20"
                                                         height="20"
                                                         viewBox="0 0 24 24"
                                                         focusable="false"
                                                         className="fill-slate-500"
                                                      >
                                                         <path d="M7 10l5 5 5-5H7z" />
                                                      </svg>
                                                   )}
                                                </div>
                                                {dropDown && (
                                                   <div className="absolute z-10 bg-white rounded-lg shadow-lg mt-2">
                                                      <ul>
                                                         <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-t">
                                                            Viewer
                                                         </li>
                                                         <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                            Commentator
                                                         </li>
                                                         <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                            <svg
                                                               width="16"
                                                               height="16"
                                                               viewBox="0 0 24 24"
                                                               focusable="false"
                                                               className="inline-block mr-3 text-black"
                                                            >
                                                               <path
                                                                  fill="currentColor"
                                                                  d="M9.428 18.01L4.175 12.82l1.296-1.288 3.957 3.94L18.441 6.804l1.288 1.288L9.428 18.01z"
                                                               ></path>
                                                            </svg>
                                                            Editor
                                                         </li>
                                                      </ul>
                                                   </div>
                                                )}
                                             </div>
                                             <div className="text-xs text-stone-500 pb-1 pl-1">{sharedUser.email}</div>
                                          </div>
                                       </div>
                                    ))}
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

                              <div className="bg-white px-6 mx-2 mb-4 mt-1 flex flex-row hover:bg-slate-100 rounded-l-full rounded-md">
                                 <svg
                                    focusable="false"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    className="rounded-md mt-2 bg-slate-100 hover:bg-slate-50"
                                 >
                                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                                 </svg>
                                 <div className="relative">
                                    <div
                                       className="flex flex-row text-sm cursor-pointer text-stone-900 hover:bg-slate-200 w-24 pl-2 mt-1 rounded-md"
                                       onClick={handleMenuClick}
                                    >
                                       Restricted
                                       <svg width="20" height="20" viewBox="0 0 24 24" focusable="false" className="">
                                          <path d="M7 10l5 5 5-5H7z"></path>
                                       </svg>
                                    </div>
                                    {showMenu && (
                                       <div className="absolute z-10 bg-white rounded-lg shadow-lg mt-1">
                                          <div className="pr-10 pl-5 pb-2 pt-2 text-sm hover:bg-gray-100 cursor-pointer rounded-t-md">
                                             <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                focusable="false"
                                                className="inline-block mr-3 text-black"
                                             >
                                                <path
                                                   fill="currentColor"
                                                   d="M9.428 18.01L4.175 12.82l1.296-1.288 3.957 3.94L18.441 6.804l1.288 1.288L9.428 18.01z"
                                                ></path>
                                             </svg>
                                             Restricted
                                          </div>
                                          <div className="pr-10 pl-5 pb-3 pt-2 text-sm hover:bg-gray-100 cursor-pointer">
                                             Anyone with link
                                          </div>
                                       </div>
                                    )}
                                    <div className="text-xs text-stone-500 pl-2 mb-1">
                                       Only people with access can open the link
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-gray-50 px-4 py-3 flex flex-row sm:flex-row-reverse sm:px-6">
                                 <button
                                    type="button"
                                    className="w-fit ml-3 sm:ml-0 sm:mr-4 relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none"
                                    onClick={handleSubmit(onSubmit)}
                                 >
                                    Invite
                                 </button>
                                 <button
                                    type="button"
                                    className="w-fit ml-3 sm:ml-0 sm:mr-4 relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none"
                                    onClick={() => setOpen(false)}
                                 >
                                    Cancel
                                 </button>
                                 <button
                                    type="button"
                                    className="mr-auto w-fit ml-3 sm:ml-0 relative inline-flex h-9 items-center rounded-md border px-3 py-2 text-sm font-medium text-blue-500 hover:bg-blue-50 focus:outline-none"
                                    //onClick={() => setOpen(false)}
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

function capitalizeFirstLetter(string: string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}
