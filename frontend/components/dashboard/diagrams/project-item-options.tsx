import { Fragment, SetStateAction, useEffect, useRef, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";

import { Project } from "types";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "@/ui/toast";
import { useForm } from "react-hook-form";
import { User } from "types";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { deleteProject, updateProject, addProjectUser } from "@/lib/auth-fetch";
import ShareProject from "./share-project";

export default function ProjectItemOptions({
   user,
   project,
   showMenu,
   setShowMenu,
}: {
   user: User;
   project: Project;
   showMenu: boolean;
   setShowMenu: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}) {
   const router = useRouter();
   const [projects, setProjects] = useState<Project[]>([]);
   const didFetchProjects = useRef(false);

   const [renameOpen, setRenameOpen] = useState(false);
   const [assignProjectOpen, setAssignProjectOpen] = useState(false);
   const [sharePopupOpen, setSharePopupOpen] = useState(false);

   useEffect(() => {
      if (renameOpen) {
         setShowMenu(false);
      }
   }, [renameOpen]);

   useEffect(() => {
      if (assignProjectOpen) {
         setShowMenu(false);
      }
   }, [assignProjectOpen]);
   // when a menu shows up, scroll down to it
   useEffect(() => {
      if (showMenu) {
         const menu = document.getElementById("");
         if (menu) {
            menu.scrollIntoView({ behavior: "smooth" });
         }
      }
   }, [showMenu]);

   return (
      <Menu
         as="div"
         className="relative inline-block text-left"
         onClick={(e: { preventDefault: () => void }) => e.preventDefault()}
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
                           className={cn(
                              active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                              "px-4 py-2 text-sm flex flex-row",
                           )}
                           onClick={() => setRenameOpen(true)}
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="w-5 h-5 mr-5"
                           >
                              <path
                                 fillRule="evenodd"
                                 clipRule="evenodd"
                                 d="M13 9H10V17H8V9H5V7H13V9ZM18 13H16V17H14V13H12V11H18V13Z"
                                 fill="#000000"
                              />
                           </svg>
                           Rename
                        </div>
                     )}
                  </Menu.Item>
               </div>
               <div className="py-1">
                  <Menu.Item>
                     {({ active }) => (
                        <div
                           className={cn(
                              active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                              "px-4 py-2 text-sm flex flex-row",
                           )}
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
                           <svg
                              width="20px"
                              height="20px"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-5"
                           >
                              <g strokeWidth="0"></g>
                              <g strokeLinecap="round" strokeLinejoin="round"></g>
                              <g>
                                 <path
                                    d="M10 10V16M14 10V16M18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6M4 6H20M15 6V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V6"
                                    stroke="#000000"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                 ></path>
                              </g>
                           </svg>
                           Delete
                        </div>
                     )}
                  </Menu.Item>
                  {/* <Menu.Item>
                     {({ active }) => (
                        <div
                           className={cn(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm")}
                        >
                           Duplicate
                        </div>
                     )}
                  </Menu.Item> */}
               </div>
               <div className="py-1">
                  <Menu.Item>
                     {({ active }) => (
                        <div
                           className={cn(
                              active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                              "px-4 py-2 text-sm flex flex-row",
                           )}
                           onClick={() => window.open(`/project/${project.id}`, "_blank")}
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="800px"
                              height="800px"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="w-5 h-5 mr-5"
                           >
                              <path
                                 d="M8 21H20.4C20.7314 21 21 20.7314 21 20.4V3.6C21 3.26863 20.7314 3 20.4 3H3.6C3.26863 3 3 3.26863 3 3.6V16"
                                 stroke="#000000"
                                 strokeWidth="1.5"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              />
                              <path
                                 d="M10 6L18 6"
                                 stroke="#000000"
                                 strokeWidth="1.5"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              />
                              <path
                                 d="M6 6H7"
                                 stroke="#000000"
                                 strokeWidth="1.5"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              />
                              <path
                                 d="M3.5 20.5L12 12M12 12V16M12 12H8"
                                 stroke="#000000"
                                 strokeWidth="1.5"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              />
                           </svg>
                           Open in new tab
                        </div>
                     )}
                  </Menu.Item>
               </div>

               <div className="py-1">
                  <Menu.Item>
                     {({ active }) => (
                        <div
                           className={cn(
                              active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                              "px-4 py-2 text-sm flex flex-row",
                           )}
                           onClick={() => {
                              // open the share dialog popup
                              setSharePopupOpen(true);
                           }}
                        >
                           <svg
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="#000000"
                              className="w-5 h-5 mr-5"
                           >
                              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" stroke-linejoin="round"></g>
                              <g id="SVGRepo_iconCarrier">
                                 <title></title>
                                 <g id="Complete">
                                    <g id="user-add">
                                       <g>
                                          <path
                                             d="M17,21V19a4,4,0,0,0-4-4H5a4,4,0,0,0-4,4v2"
                                             fill="none"
                                             stroke="#000000"
                                             strokeLinecap="round"
                                             stroke-linejoin="round"
                                             strokeWidth="2"
                                          ></path>
                                          <circle
                                             cx="9"
                                             cy="7"
                                             fill="none"
                                             r="4"
                                             stroke="#000000"
                                             strokeLinecap="round"
                                             stroke-linejoin="round"
                                             strokeWidth="2"
                                          ></circle>
                                          <line
                                             fill="none"
                                             stroke="#000000"
                                             strokeLinecap="round"
                                             stroke-linejoin="round"
                                             strokeWidth="2"
                                             x1="17"
                                             x2="23"
                                             y1="11"
                                             y2="11"
                                          ></line>
                                          <line
                                             fill="none"
                                             stroke="#000000"
                                             strokeLinecap="round"
                                             stroke-linejoin="round"
                                             strokeWidth="2"
                                             x1="20"
                                             x2="20"
                                             y1="8"
                                             y2="14"
                                          ></line>
                                       </g>
                                    </g>
                                 </g>
                              </g>
                           </svg>
                           Share Project
                        </div>
                     )}
                  </Menu.Item>
               </div>
            </Menu.Items>
         </Transition>

         <ShareProject open={sharePopupOpen} setOpen={setSharePopupOpen} user={user} role={user.role} project={project} />
         <RenameTransition projectId={project.id} projectName={project.name} show={renameOpen} setShow={setRenameOpen} />
      </Menu>
   );
}

const projectRenameSchema = z.object({
   name: z.string().min(1),
});

type RenameFormData = z.infer<typeof projectRenameSchema>;

function RenameTransition({
   projectId,
   projectName,
   show,
   setShow,
}: {
   projectId: string;
   projectName: string;
   show: boolean;
   setShow: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}) {
   const router = useRouter();
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const cancelButtonRef = useRef(null);
   const {
      handleSubmit,
      register,
      reset,
      formState: { errors },
   } = useForm<RenameFormData>({
      resolver: zodResolver(projectRenameSchema),
      defaultValues: {
         name: projectName,
      },
   });

   async function onSubmit(data: RenameFormData) {
      setIsLoading(true);

      updateProject(projectId, data)
         .then((res) => {
            if (res.success === false) {
               throw new Error(res.reason);
            }

            setShow(false);
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
               message: err.message,
               type: "error",
            });
         })
         .finally(() => {
            setIsLoading(false);
         });
   }

   useEffect(() => {
      if (!show) {
         reset({
            name: projectName,
         });
      }
   }, [show, projectName]);

   return (
      <Transition.Root show={show} as={Fragment}>
         <Dialog className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setShow(false)}>
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
                                 <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                                       Rename &quot;{projectName}&quot;
                                    </Dialog.Title>
                                    <div className="mt-2">
                                       <p className="text-sm text-gray-500">Please enter a new name for the project.</p>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="bg-white px-10 pt-2 pb-3 mb-2">
                              <input
                                 placeholder="Project Name"
                                 defaultValue={projectName}
                                 className="w-full my-0 mb-2 block h-9 rounded-md border border-slate-300 py-2 px-3 text-base placeholder:text-slate-400 hover:border-slate-400"
                                 type="name"
                                 autoCapitalize="none"
                                 autoComplete="current-name"
                                 autoCorrect="off"
                                 name="name"
                                 disabled={isLoading}
                                 {...register("name")}
                              />
                              {errors?.name && <p className="text-sm mt-1 mb-1 text-red-600">{errors.name.message}</p>}
                           </div>
                           <div className="bg-gray-50 px-4 py-3 flex flex-row sm:flex-row-reverse sm:px-6">
                              <button
                                 type="submit"
                                 className="hover:bg-brand-400 relative bg-brand-500 inline-flex h-9 items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white"
                                 disabled={isLoading}
                              >
                                 {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                                 Rename
                              </button>
                              <button
                                 type="button"
                                 className="w-fit ml-3 sm:ml-0 sm:mr-4 relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-300 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400"
                                 onClick={() => setShow(false)}
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
   );
}
