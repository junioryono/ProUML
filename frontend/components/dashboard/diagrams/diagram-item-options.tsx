import { Fragment, SetStateAction, useEffect, useRef, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";

import { Diagram, Project } from "types";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
   addDiagramToProject,
   deleteDiagram,
   removeDiagramFromProject,
   updateDiagram,
   createDiagram,
   getProjects,
   removeDiagramUser,
} from "@/lib/auth-fetch";
import { toast } from "@/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export default function DiagramItemOptions({
   diagram,
   project,
   userId,
   showMenu,
   setShowMenu,
}: {
   diagram: Diagram;
   project?: Project;
   userId?: string;
   showMenu: boolean;
   setShowMenu: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}) {
   const router = useRouter();
   const [projects, setProjects] = useState<Project[]>([]);
   const didFetchProjects = useRef(false);

   const [renameOpen, setRenameOpen] = useState(false);
   const [assignProjectOpen, setAssignProjectOpen] = useState(false);

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

   useEffect(() => {
      if (!project && !didFetchProjects.current && !projects.length && assignProjectOpen) {
         didFetchProjects.current = true;

         getProjects()
            .then((res) => {
               if (res.success === false) {
                  throw new Error(res.reason);
               }

               setProjects(res.response);
            })
            .catch((error) => {
               console.error(error);
               return toast({
                  title: "Something went wrong.",
                  message: error.message,
                  type: "error",
               });
            });
      }
   }, [project, projects, assignProjectOpen]);

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
               {!project && !diagram.is_from_unshared_project && !diagram.is_shared_with_current_user && (
                  <div className="py-1">
                     <Menu.Item>
                        {({ active }) => (
                           <div
                              className={cn(
                                 active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                 "px-4 py-2 text-sm flex flex-row",
                              )}
                              onClick={() => setAssignProjectOpen(true)}
                           >
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="20px"
                                 height="20px"
                                 viewBox="0 0 64 64"
                                 strokeWidth="4"
                                 stroke="#000000"
                                 fill="none"
                                 className="w-5 h-5 mr-5"
                              >
                                 <path d="M41.64,50.37h-32a2,2,0,0,1-2-2V15.63a2,2,0,0,1,2-2H23.32L28.75,20H54.39a2,2,0,0,1,2,2V37.33" />
                                 <circle cx="50.24" cy="45.23" r="10.01" strokeLinecap="round" />
                                 <line x1="50.24" y1="39.76" x2="50.24" y2="50.71" />
                                 <line x1="44.76" y1="45.23" x2="55.72" y2="45.23" />
                              </svg>
                              Assign to project
                           </div>
                        )}
                     </Menu.Item>
                  </div>
               )}

               {(!diagram.is_from_unshared_project ||
                  (diagram.is_from_unshared_project && diagram.current_user_has_edit_permission)) && (
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
               )}

               <div className="py-1">
                  {project && (
                     <Menu.Item>
                        {({ active }) => (
                           <div
                              className={cn(
                                 active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                 "px-4 py-2 text-sm flex flex-row",
                              )}
                              onClick={() => {
                                 setShowMenu(false);
                                 removeDiagramFromProject(project.id, diagram.id).then((res) => {
                                    if (res.success === false) {
                                       return toast({
                                          title: "Something went wrong.",
                                          message: res.reason,
                                          type: "error",
                                       });
                                    }

                                    router.refresh();
                                    return toast({
                                       title: "Diagram removed",
                                       message: "The diagram has been removed from the project.",
                                       type: "success",
                                    });
                                 });
                              }}
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
                                    d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H10M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V10.8125"
                                    stroke="#000000"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                 />
                                 <path
                                    d="M14.0251 15.0251C13.3918 15.6585 13 16.5335 13 17.5C13 19.433 14.567 21 16.5 21C17.4665 21 18.3415 20.6082 18.9749 19.9749M14.0251 15.0251C14.6585 14.3918 15.5335 14 16.5 14C18.433 14 20 15.567 20 17.5C20 18.4665 19.6082 19.3415 18.9749 19.9749M14.0251 15.0251L16.5 17.5L18.9749 19.9749"
                                    stroke="#000000"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                 />
                              </svg>
                              Remove from project
                           </div>
                        )}
                     </Menu.Item>
                  )}

                  {!diagram.is_from_unshared_project && !diagram.is_shared_with_current_user ? (
                     <Menu.Item>
                        {({ active }) => (
                           <div
                              className={cn(
                                 active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                 "px-4 py-2 text-sm flex flex-row",
                              )}
                              onClick={() => {
                                 setShowMenu(false);
                                 deleteDiagram(diagram.id).then((res) => {
                                    if (res.success === false) {
                                       return toast({
                                          title: "Something went wrong.",
                                          message: res.reason,
                                          type: "error",
                                       });
                                    }

                                    router.refresh();
                                    return toast({
                                       title: "Diagram deleted",
                                       message: "The diagram has been deleted.",
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
                  ) : (
                     <Menu.Item>
                        {({ active }) => (
                           <div
                              className={cn(
                                 active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                 "px-4 py-2 text-sm flex flex-row",
                              )}
                              onClick={() => {
                                 setShowMenu(false);
                                 removeDiagramUser(diagram.id, userId).then((res) => {
                                    if (res.success === false) {
                                       return toast({
                                          title: "Something went wrong.",
                                          message: res.reason,
                                          type: "error",
                                       });
                                    }

                                    router.refresh();
                                    return toast({
                                       title: "Diagram removed",
                                       message: "The diagram has been removed from your account.",
                                       type: "success",
                                    });
                                 });
                              }}
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
                                    d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H10M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V10.8125"
                                    stroke="#000000"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                 />
                                 <path
                                    d="M14.0251 15.0251C13.3918 15.6585 13 16.5335 13 17.5C13 19.433 14.567 21 16.5 21C17.4665 21 18.3415 20.6082 18.9749 19.9749M14.0251 15.0251C14.6585 14.3918 15.5335 14 16.5 14C18.433 14 20 15.567 20 17.5C20 18.4665 19.6082 19.3415 18.9749 19.9749M14.0251 15.0251L16.5 17.5L18.9749 19.9749"
                                    stroke="#000000"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                 />
                              </svg>
                              Remove
                           </div>
                        )}
                     </Menu.Item>
                  )}

                  <Menu.Item>
                     {({ active }) => (
                        <div
                           className={cn(
                              active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                              "px-4 py-2 text-sm flex flex-row",
                           )}
                           onClick={() => {
                              setShowMenu(false);

                              const formData = new FormData();
                              formData.append("duplicateDiagramId", diagram.id);

                              if (project) {
                                 formData.append("projectId", project.id);
                              }

                              createDiagram(formData).then((res) => {
                                 if (res.success === false) {
                                    return toast({
                                       title: "Something went wrong.",
                                       message: res.reason,
                                       type: "error",
                                    });
                                 }

                                 router.refresh();
                                 return toast({
                                    title: "Diagram duplicated",
                                    message: `${diagram.name} has been duplicated.`,
                                    type: "success",
                                 });
                              });
                           }}
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20px"
                              height="20px"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="w-5 h-5 mr-5"
                           >
                              <path
                                 d="M19.688 5.69833C20.3342 6.28473 20.6573 6.57793 20.8287 6.96478C21 7.35163 21 7.78795 21 8.66058L21 13C21 14.8856 21 15.8284 20.4142 16.4142C19.8284 17 18.8856 17 17 17H13C11.1144 17 10.1716 17 9.58579 16.4142C9 15.8284 9 14.8856 9 13L9 7C9 5.11438 9 4.17157 9.58579 3.58579C10.1716 3 11.1144 3 13 3H15.17C15.9332 3 16.3148 3 16.6625 3.13422C17.0101 3.26845 17.2927 3.52488 17.8579 4.03776L19.688 5.69833Z"
                                 stroke="#323232"
                                 strokeWidth="2"
                                 strokeLinejoin="round"
                              />
                              <path
                                 d="M9 7L7 7C5.11438 7 4.17157 7 3.58579 7.58579C3 8.17157 3 9.11438 3 11L3 17C3 18.8856 3 19.8284 3.58579 20.4142C4.17157 21 5.11438 21 7 21H11C12.8856 21 13.8284 21 14.4142 20.4142C15 19.8284 15 18.8856 15 17V17"
                                 stroke="#323232"
                                 strokeWidth="2"
                                 strokeLinejoin="round"
                              />
                           </svg>
                           Duplicate
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
                           onClick={() => window.open(`/dashboard/diagrams/${diagram.id}`, "_blank")}
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
            </Menu.Items>
         </Transition>

         <RenameTransition diagramId={diagram.id} diagramName={diagram.name} show={renameOpen} setShow={setRenameOpen} />
         <AssignProjectTransition
            diagramId={diagram.id}
            diagramName={diagram.name}
            show={assignProjectOpen}
            setShow={setAssignProjectOpen}
            projects={projects}
         />
      </Menu>
   );
}

const diagramRenameSchema = z.object({
   name: z.string().min(1),
});

type RenameFormData = z.infer<typeof diagramRenameSchema>;

function RenameTransition({
   diagramId,
   diagramName,
   show,
   setShow,
}: {
   diagramId: string;
   diagramName: string;
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
      resolver: zodResolver(diagramRenameSchema),
      defaultValues: {
         name: diagramName,
      },
   });

   async function onSubmit(data: RenameFormData) {
      setIsLoading(true);

      updateDiagram(diagramId, data)
         .then((res) => {
            if (res.success === false) {
               throw new Error(res.reason);
            }

            setShow(false);
            router.refresh();
            return toast({
               message: "Diagram renamed.",
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
            name: diagramName,
         });
      }
   }, [show, diagramName]);

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
                                       Rename &quot;{diagramName}&quot;
                                    </Dialog.Title>
                                    <div className="mt-2">
                                       <p className="text-sm text-gray-500">Please enter a new name for the diagram.</p>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="bg-white px-10 pt-2 pb-3 mb-2">
                              <input
                                 placeholder="Diagram Name"
                                 defaultValue={diagramName}
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

function AssignProjectTransition({
   diagramId,
   diagramName,
   show,
   setShow,
   projects,
}: {
   diagramId: string;
   diagramName: string;
   show: boolean;
   setShow: React.Dispatch<React.SetStateAction<boolean | undefined>>;
   projects: Project[];
}) {
   const router = useRouter();
   const [selectedProjectId, setSelectedProjectId] = useState<string>("");
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const cancelButtonRef = useRef(null);

   async function onSubmit(e: { preventDefault: () => void }) {
      e.preventDefault();

      if (selectedProjectId === "") {
         return toast({
            title: "Error assigning diagram.",
            message: "Please select a project.",
            type: "error",
         });
      }

      setIsLoading(true);

      addDiagramToProject(selectedProjectId, diagramId)
         .then((res) => {
            if (res.success === false) {
               throw new Error(res.reason);
            }

            setShow(false);
            router.refresh();
            return toast({
               title: "Diagram assigned to project.",
               message: "The diagram has been assigned to the project.",
            });
         })
         .catch((err) => {
            console.error(err);
            return toast({
               title: "Error assigning diagram to project.",
               message: err.message,
               type: "error",
            });
         })
         .finally(() => {
            setIsLoading(false);
         });
   }

   return (
      <Transition.Root show={show} as={Fragment}>
         <Dialog className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setShow(false)}>
            <form onSubmit={onSubmit}>
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
                                       Assign &quot;{diagramName}&quot; to a project
                                    </Dialog.Title>
                                    <div className="mt-2">
                                       <p className="text-sm text-gray-500">Please choose a project.</p>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="bg-white px-10 pb-3 mb-2">
                              <select
                                 name="projectId"
                                 className="w-full h-8 border border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                                 disabled={isLoading}
                                 value={selectedProjectId}
                                 onChange={(e) => setSelectedProjectId(e.target.value)}
                              >
                                 <option disabled value="">
                                    Select a project
                                 </option>
                                 {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                       {project.name}
                                    </option>
                                 ))}
                              </select>
                           </div>
                           <div className="bg-gray-50 px-4 py-3 flex flex-row sm:flex-row-reverse sm:px-6">
                              <button
                                 type="submit"
                                 className="hover:bg-brand-400 relative bg-brand-500 inline-flex h-9 items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white"
                                 disabled={isLoading}
                              >
                                 {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                                 Assign
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
