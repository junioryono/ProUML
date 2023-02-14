"use client";

import { useState, useRef, Fragment, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn, fetchAPI } from "@/lib/utils";
import { Card } from "@/ui/card";
import { toast } from "@/ui/toast";
import { Icons } from "@/components/icons";
import { User } from "types";

import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import UserDeleteFormSkeleton from "./user-delete-form-skeleton";

const userDeleteSchema = z.object({
   password: z.string().min(8),
});

type FormData = z.infer<typeof userDeleteSchema>;

export default function UserDeleteForm({ user }: { user: User }) {
   const {
      handleSubmit,
      register,
      reset,
      formState: { errors },
   } = useForm<FormData>({
      resolver: zodResolver(userDeleteSchema),
   });
   const [isLoading, setIsLoading] = useState<boolean>(false);

   const router = useRouter();
   const [open, setOpen] = useState(false);
   const cancelButtonRef = useRef(null);

   async function onSubmit(data: FormData) {
      setIsLoading(true);

      const form = new FormData();
      form.append("email", user.email);
      form.append("password", data.password);

      const success = await fetchAPI("/auth/delete-account", {
         method: "DELETE",
         body: form,
      })
         .then((res) => res.json())
         .then((res) => {
            if (res && res.success === true) {
               router.push("/");
               return true;
            }

            return null;
         })
         .catch((err) => {
            console.error(err);
            return null;
         });

      setIsLoading(false);

      if (!success) {
         return toast({
            title: "Something went wrong.",
            message: "Incorrect password. Please try again.",
            type: "error",
         });
      }

      toast({
         message: "Your account has been deleted.",
         type: "success",
      });
   }

   return (
      <>
         <Card>
            <Card.Header>
               <Card.Title>Delete your ProUML Account</Card.Title>
               <Card.Description>Permanently delete all your account data.</Card.Description>
            </Card.Header>
            <Card.Footer>
               <button
                  className={cn(
                     "hover:bg-red-700 relative bg-red-600 inline-flex h-9 items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none",
                     {
                        "cursor-not-allowed opacity-60": isLoading,
                     },
                  )}
                  onClick={(e) => {
                     e.preventDefault();
                     setOpen(true);
                  }}
                  type="button"
               >
                  <span>Delete</span>
               </button>
            </Card.Footer>
         </Card>
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
                              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                                 <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                       <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                       <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                                          Deactivate account
                                       </Dialog.Title>
                                       <div className="mt-2">
                                          <p className="text-sm text-gray-500">
                                             Are you sure you want to delete your account? All of your data will be
                                             permanently removed. This action cannot be undone.
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-white px-20 pt-2 pb-3 mb-2">
                                 <input
                                    id="password"
                                    placeholder="Password"
                                    className="w-full my-0 mb-2 block h-9 rounded-md border border-slate-300 py-2 px-3 text-base placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none"
                                    type="password"
                                    autoCapitalize="none"
                                    autoComplete="current-password"
                                    autoCorrect="off"
                                    name="password"
                                    disabled={isLoading}
                                    {...register("password")}
                                 />
                                 {errors?.password && (
                                    <p className="text-sm mt-1 mb-1 text-red-600">{errors.password.message}</p>
                                 )}
                              </div>
                              <div className="bg-gray-50 px-4 py-3 flex flex-row sm:flex-row-reverse sm:px-6">
                                 <button
                                    type="submit"
                                    className="hover:bg-red-700 relative bg-red-600 inline-flex h-9 items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none"
                                    disabled={isLoading}
                                 >
                                    {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                                    Delete
                                 </button>
                                 <button
                                    type="button"
                                    className="w-fit ml-3 sm:ml-0 sm:mr-4 relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none"
                                    onClick={() => setOpen(false)}
                                    ref={cancelButtonRef}
                                 >
                                    Cancel
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

UserDeleteForm.Skeleton = UserDeleteFormSkeleton;
