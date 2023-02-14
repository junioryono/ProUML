import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";

import { Project } from "types";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { deleteProject, updateProject } from "@/lib/auth-fetch";
import { toast } from "@/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const projectRenameSchema = z.object({
   name: z.string().min(1),
});

type FormData = z.infer<typeof projectRenameSchema>;

export default function ProjectItemOptions({
   project,
   showMenu,
   setShowMenu,
}: {
   project: Project;
   showMenu: boolean;
   setShowMenu: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}) {
   const router = useRouter();

   const {
      handleSubmit,
      register,
      reset,
      formState: { errors },
   } = useForm<FormData>({
      resolver: zodResolver(projectRenameSchema),
      defaultValues: {
         name: project.name,
      },
   });
   const [renameIsLoading, setRenameIsLoading] = useState<boolean>(false);
   const [renameOpen, setRenameOpen] = useState(false);
   const cancelButtonRef = useRef(null);

   async function onRenameSubmit(data: FormData) {
      setRenameIsLoading(true);

      updateProject(project.id, data)
         .then((res) => {
            if (res.success === false) {
               throw new Error(res.reason);
            }

            setRenameOpen(false);
            router.refresh();
            return toast({
               message: "Project renamed.",
               type: "success",
            });
         })
         .catch((err) => {
            console.error(err);
            return toast({
               title: "Something went wrong.",
               message: "Incorrect password. Please try again.",
               type: "error",
            });
         })
         .finally(() => {
            setRenameIsLoading(false);
         });
   }

   useEffect(() => {
      if (!renameOpen) {
         reset({
            name: project.name,
         });
      }
   }, [renameOpen, project.name]);

   return (
      <Menu
         as="div"
         className="relative inline-block text-left"
         onClick={(e: { preventDefault: () => void }) => {
            e.preventDefault();
         }}
      >
         <Menu.Button
            className="bg-white rounded-full p-1 text-gray-500 hover:text-gray-500 focus:outline-none hover:bg-slate-100 hidden md:block"
            onClick={() => setShowMenu((current) => !current)}
         >
            <span className="sr-only">View options</span>
            <Icons.ellipsis />
         </Menu.Button>

         <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            show={showMenu}
         >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none top-8 sm:top-12">
               <div className="py-1">
                  <Menu.Item>
                     {({ active }) => (
                        <div
                           className={cn(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm")}
                           onClick={() => setRenameOpen(true)}
                        >
                           Rename
                        </div>
                     )}
                  </Menu.Item>
               </div>
               <div className="py-1">
                  <Menu.Item>
                     {({ active }) => (
                        <div
                           className={cn(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm")}
                           onClick={() => {
                              deleteProject(project.id).then((res) => {
                                 if (res.success === false) {
                                    return toast({
                                       title: "Something went wrong.",
                                       message: res.reason,
                                       type: "error",
                                    });
                                 }

                                 router.refresh();
                                 return toast({
                                    title: "Project deleted",
                                    message: "The project has been deleted.",
                                    type: "success",
                                 });
                              });
                           }}
                        >
                           Delete
                        </div>
                     )}
                  </Menu.Item>
                  <Menu.Item>
                     {({ active }) => (
                        <div
                           className={cn(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm")}
                        >
                           Duplicate
                        </div>
                     )}
                  </Menu.Item>
               </div>
               <div className="py-1">
                  <Menu.Item>
                     {({ active }) => (
                        <div
                           className={cn(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm")}
                           onClick={() => window.open(`/project/${project.id}`, "_blank")}
                        >
                           Open in new tab
                        </div>
                     )}
                  </Menu.Item>
               </div>
            </Menu.Items>
         </Transition>

         <Transition.Root show={renameOpen} as={Fragment}>
            <Dialog className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setRenameOpen(false)}>
               <form onSubmit={handleSubmit(onRenameSubmit)}>
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
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                       <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                                          Rename &quot;{project.name}&quot;
                                       </Dialog.Title>
                                       <div className="mt-2">
                                          <p className="text-sm text-gray-500">Please enter a new name for the project.</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-white px-10 pt-2 pb-3 mb-2">
                                 <input
                                    id="name"
                                    placeholder="Project Name"
                                    defaultValue={project.name}
                                    className="w-full my-0 mb-2 block h-9 rounded-md border border-slate-300 py-2 px-3 text-base placeholder:text-slate-400 hover:border-slate-400"
                                    type="name"
                                    autoCapitalize="none"
                                    autoComplete="current-name"
                                    autoCorrect="off"
                                    name="name"
                                    disabled={renameIsLoading}
                                    {...register("name")}
                                 />
                                 {errors?.name && <p className="text-sm mt-1 mb-1 text-red-600">{errors.name.message}</p>}
                              </div>
                              <div className="bg-gray-50 px-4 py-3 flex flex-row sm:flex-row-reverse sm:px-6">
                                 <button
                                    type="submit"
                                    className="hover:bg-brand-400 relative bg-brand-500 inline-flex h-9 items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white"
                                    disabled={renameIsLoading}
                                 >
                                    {renameIsLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                                    Rename
                                 </button>
                                 <button
                                    type="button"
                                    className="w-fit ml-3 sm:ml-0 sm:mr-4 relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-300 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400"
                                    onClick={() => setRenameOpen(false)}
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
      </Menu>
   );
}
