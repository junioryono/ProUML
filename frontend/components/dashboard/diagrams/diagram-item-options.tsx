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
} from "@/lib/auth-fetch";
import { toast } from "@/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export default function DiagramItemOptions({
   diagram,
   project,
   showMenu,
   setShowMenu,
}: {
   diagram: Diagram;
   project?: Project;
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
               {!project && !diagram.in_unshared_project && (
                  <div className="py-1">
                     <Menu.Item>
                        {({ active }) => (
                           <div
                              className={cn(
                                 active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                 "block px-4 py-2 text-sm",
                              )}
                              onClick={() => setAssignProjectOpen(true)}
                           >
                              Assign to project
                           </div>
                        )}
                     </Menu.Item>
                  </div>
               )}

               {(!diagram.in_unshared_project ||
                  (diagram.in_unshared_project && diagram.unshared_project_edit_permission)) && (
                  <div className="py-1">
                     <Menu.Item>
                        {({ active }) => (
                           <div
                              className={cn(
                                 active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                 "block px-4 py-2 text-sm",
                              )}
                              onClick={() => setRenameOpen(true)}
                           >
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
                                 "block px-4 py-2 text-sm",
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
                              Remove from project
                           </div>
                        )}
                     </Menu.Item>
                  )}

                  {!diagram.in_unshared_project && (
                     <Menu.Item>
                        {({ active }) => (
                           <div
                              className={cn(
                                 active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                 "block px-4 py-2 text-sm",
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
                              Delete
                           </div>
                        )}
                     </Menu.Item>
                  )}

                  <Menu.Item>
                     {({ active }) => (
                        <div
                           className={cn(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm")}
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
                           onClick={() => window.open(`/diagram/${diagram.id}`, "_blank")}
                        >
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
