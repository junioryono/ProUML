import React, { useState, useRef, Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "@/ui/toast";
import { Project, User } from "types";
import { getProjectUsers, addProjectUser, removeProjectUser, updateProject } from "@/lib/auth-fetch";
import Image from "next/image";
import { cn } from "@/lib/utils";
// import { Icons } from "@/components/icons";

const userAddSchema = z.object({
   // We are using "new-password" here because the browser will try to autofill the password field
   "new-password": z
      .string()
      .min(8)
      .max(255)
      .email("Invalid email address")
      .transform((v) => v.toLowerCase()),
});

type FormData = z.infer<typeof userAddSchema>;

export default function ShareProject({
   open,
   setOpen,
   user,
   role,
   project,
}: {
   open: boolean;
   setOpen: (value: boolean) => void;
   user: User;
   role: string;
   project: Project;
}) {
   const {
      handleSubmit,
      register,
      reset,
      formState: { errors, isValid },
   } = useForm<FormData>({
      resolver: zodResolver(userAddSchema),
      defaultValues: {
         "new-password": "",
      },
   });

   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [users, setUsers] = useState<User[]>(null);

   const [allowedToInvite, setAllowedToEdit] = useState<boolean>(role === "owner");
   const [allowedToInviteButton, setAllowedToInvite] = useState<boolean>(role === "owner");
   const [newUserDropdown, setNewUserDropdown] = useState(false);
   const [newUserRole, setNewUserRole] = useState("editor");
   const newUserDropdownRef = useRef<HTMLDivElement>(null);
   const [showInviteButton, setShowInviteButton] = useState(false);

   const [generalAccessDropdown, setGeneralAccessDropdown] = useState(false);
   const [generalAccess, setGeneralAccess] = useState(project.public);
   const generalAccessDropdownRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (newUserDropdownRef.current && !newUserDropdownRef.current.contains(event.target as Node)) {
            setNewUserDropdown(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [newUserDropdownRef]);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (generalAccessDropdownRef.current && !generalAccessDropdownRef.current.contains(event.target as Node)) {
            setGeneralAccessDropdown(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [generalAccessDropdownRef]);

   async function onNewUserSubmit(data: FormData) {
      setIsLoading(true);
      const res = await addProjectUser(project.id, data["new-password"], newUserRole);
      setIsLoading(false);
      if (res && res.success) {
         toast({
            title: "User added.",
            message: "User has been added to the project.",
            type: "success",
         });
         setOpen(false);
         setShowInviteButton(false);
         reset();
      } else {
         toast({
            title: "Failed to add user.",
            message: res.reason,
            type: "error",
         });
      }
   }

   async function updateGeneralAccess(publicAccess: boolean) {
      if (publicAccess === generalAccess) {
         return;
      }

      setIsLoading(true);
      const res = await updateProject(project.id, { public: publicAccess });
      setIsLoading(false);
      if (res && res.success) {
         setGeneralAccess(publicAccess);
         if (publicAccess) {
            toast({
               title: "Project is now public.",
               message: "Anyone with the link can view and edit this project.",
               type: "success",
            });
         } else {
            toast({
               title: "Project is now private.",
               message: "Only users you share this project with can view and edit it.",
               type: "success",
            });
         }
      } else {
         if (publicAccess) {
            toast({
               title: "Failed to make project public.",
               message: res.reason,
               type: "error",
            });
         } else {
            toast({
               title: "Failed to make project private.",
               message: res.reason,
               type: "error",
            });
         }
      }
   }

   async function updateAllowedToEdit(allowed: boolean) {
      if (allowed === allowedToInviteButton) {
         return;
      }

      setIsLoading(true);
      const res = await updateProject(project.id, { allow_editor_permissions: allowed });
      setIsLoading(false);
      if (res && res.success) {
         setAllowedToInvite(allowed);
         if (allowed) {
            toast({
               title: "Project editors can now manage users.",
               message: "Editors can now add and remove users from the project.",
               type: "success",
            });
         } else {
            toast({
               title: "Project editors can no longer manage users.",
               message: "Editors can no longer add and remove users from the project.",
               type: "success",
            });
         }
      } else {
         if (allowed) {
            toast({
               title: "Failed to allow project editors to manage users.",
               message: res.reason,
               type: "error",
            });
         } else {
            toast({
               title: "Failed to disallow project editors to manage users.",
               message: res.reason,
               type: "error",
            });
         }
      }
   }

   useEffect(() => {
      if (!project) {
         return;
      }

      if (!open) {
         setUsers(null);
         return;
      }

      getProjectUsers(project.id).then((res) => {
         if (res && res.response) {
            setUsers(res.response.users || []);
         } else {
            toast({
               title: "Failed to get users.",
               message: res.reason,
               type: "error",
            });
         }
      });
   }, [open, project]);

   useEffect(() => {
      setShowInviteButton(isValid);
   }, [isValid]);

   return (
      <>
         <Transition.Root show={open} as={Fragment}>
            <Dialog
               className="relative z-10"
               onClose={() => {
                  setOpen(false);
                  setShowInviteButton(false);
                  reset();
               }}
            >
               <form onSubmit={handleSubmit(onNewUserSubmit)}>
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
                              {!allowedToInvite && (
                                 <>
                                    <div
                                       className={cn(
                                          "h-1",
                                          isLoading && "animate-[loading-bar_1s_linear_infinite] bg-blue-500",
                                       )}
                                    />
                                    <Dialog.Title className="pl-6 pt-5 pb-3 text-xl font-medium leading-7 text-gray-900">
                                       Share &quot;{project.name}&quot;
                                    </Dialog.Title>

                                    <div className="bg-white pl-6 pr-6 mb-3">
                                       <div className="flex mb-2">
                                          <input
                                             placeholder="Email address"
                                             className="w-full my-0 block h-11 rounded-md  border border-slate-300 pl-3 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none"
                                             autoCapitalize="none"
                                             autoComplete="off"
                                             autoCorrect="off"
                                             spellCheck="false"
                                             {...register("new-password")}
                                          />
                                       </div>

                                       {errors?.["new-password"] && (
                                          <p className="text-sm mt-1 mb-1 text-red-600">{errors["new-password"].message}</p>
                                       )}
                                    </div>
                                 </>
                              )}

                              <Dialog.Title
                                 className={cn(
                                    "pl-6 text-md font-medium leading-7 text-gray-900",
                                    !allowedToInvite && "pl-6 pt-5 pb-3 text-xl font-medium leading-7 text-gray-900",
                                 )}
                              >
                                 People with access
                              </Dialog.Title>
                              <div className="pb-4">
                                 {users &&
                                    users.map((sharedUser) => (
                                       <UserWithAccess
                                          key={sharedUser.user_id}
                                          projectId={project.id}
                                          user={sharedUser}
                                          currentUserId={user.user_id}
                                          currentUserRole={role}
                                          setIsLoading={setIsLoading}
                                          setUsers={setUsers}
                                          allowedToInvite={allowedToInvite}
                                       />
                                    ))}
                              </div>

                              <Dialog.Title className="pl-6 text-md font-medium leading-7 text-gray-900">
                                 General access
                              </Dialog.Title>
                              <div className="group">
                                 <div className="bg-white pl-6 mb-4 mt-1 flex flex-row group-hover:bg-slate-100">
                                    <svg
                                       focusable="false"
                                       width="38"
                                       height="38"
                                       viewBox="0 0 24 24"
                                       className="rounded-full self-center bg-slate-100 group-hover:bg-white p-2"
                                    >
                                       <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                                    </svg>
                                    <div className="relative ml-2" ref={generalAccessDropdownRef}>
                                       <div
                                          className={cn(
                                             "flex flex-row text-sm text-stone-900 mt-1 mb-0.5 py-0.5 rounded-md w-fit pl-2 pr-1 cursor-default",
                                             allowedToInvite && "hover:bg-slate-200 cursor-pointer select-none",
                                             generalAccessDropdown && "text-black bg-slate-200",
                                          )}
                                          onClick={() => {
                                             if (allowedToInvite) {
                                                setGeneralAccessDropdown(!generalAccessDropdown);
                                             }
                                          }}
                                       >
                                          {generalAccess ? "Anyone with link" : "Restricted"}
                                          {allowedToInvite && (
                                             <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                focusable="false"
                                                className="ml-1"
                                             >
                                                <path d="M7 10l5 5 5-5H7z"></path>
                                             </svg>
                                          )}
                                       </div>
                                       {generalAccessDropdown && (
                                          <div className="absolute z-10 bg-white rounded-lg shadow-lg mt-2 w-60 left-0 top-5 py-2 select-none">
                                             <div
                                                className="flex px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-t items-center"
                                                onClick={() => {
                                                   setGeneralAccessDropdown(false);
                                                   updateGeneralAccess(false);
                                                }}
                                             >
                                                <div className="w-10 flex justify-center">
                                                   {!generalAccess && (
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
                                                         />
                                                      </svg>
                                                   )}
                                                </div>
                                                Restricted
                                             </div>
                                             <div
                                                className="flex px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-t items-center"
                                                onClick={() => {
                                                   setGeneralAccessDropdown(false);
                                                   updateGeneralAccess(true);
                                                }}
                                             >
                                                <div className="w-10 flex justify-center">
                                                   {generalAccess && (
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
                                                         />
                                                      </svg>
                                                   )}
                                                </div>
                                                Anyone with link
                                             </div>
                                          </div>
                                       )}
                                       <div className="text-xs text-stone-500 pl-2 mb-1">
                                          {generalAccess
                                             ? "Anyone with the link can view"
                                             : "Only people with access can open the link"}
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              {role === "owner" && (
                                 <>
                                    <hr className="border-slate-400 mx-6 mb-5" />

                                    <div
                                       className="flex pl-[0.7rem] ml-[1.6rem] mb-5 mt-3 group-hover:bg-slate-100 rounded-l-full rounded-md cursor-default"
                                       onClick={(e) => {
                                          e.preventDefault();
                                          updateAllowedToEdit(!allowedToInviteButton);
                                       }}
                                    >
                                       <input
                                          type="checkbox"
                                          className="h-4 w-4 self-center mr-[0.6rem]"
                                          checked={allowedToInviteButton}
                                          onChange={() => {}}
                                       />
                                       <div className="text-sm">Editors can change permissions and share</div>
                                    </div>
                                 </>
                              )}

                              <div className="bg-gray-50 py-4 flex flex-row-reverse px-6 select-none rounded-b-lg">
                                 {showInviteButton && (
                                    <button
                                       type="button"
                                       className="w-fit ml-0 relative inline-flex h-10 items-center rounded-full border border-transparent bg-blue-700 px-6 py-3 text-sm font-medium text-white hover:drop-shadow-md hover:bg-blue-800 focus:outline-none"
                                       onClick={handleSubmit(onNewUserSubmit)}
                                    >
                                       Invite
                                    </button>
                                 )}
                                 <button
                                    type="button"
                                    className={cn(
                                       "w-fit ml-0 relative inline-flex h-10 items-center rounded-full border border-transparent bg-blue-700 px-6 py-3 text-sm font-medium text-white hover:drop-shadow-md hover:bg-blue-800 focus:outline-none",
                                       showInviteButton && "mr-4",
                                    )}
                                    onClick={() => setOpen(false)}
                                 >
                                    {showInviteButton ? "Cancel" : "Done"}
                                 </button>
                                 <button
                                    type="button"
                                    className="mr-auto w-fit relative inline-flex h-10 items-center rounded-full border border-black px-3 py-3 text-sm font-medium text-blue-700 hover:bg-blue-50 focus:outline-none"
                                    onClick={() => {
                                       // Copy link to clipboard
                                       navigator.clipboard.writeText(`https://prouml.com/dashboard/diagrams/${project.id}`);
                                       toast({
                                          title: "Link copied to clipboard",
                                          message: "You can now share this link with others",
                                          type: "success",
                                       });
                                    }}
                                 >
                                    <svg
                                       width="24"
                                       height="24"
                                       viewBox="0 0 24 24"
                                       focusable="false"
                                       className="pr-2 fill-blue-700"
                                    >
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

function UserWithAccess({
   projectId,
   user,
   currentUserId,
   currentUserRole,
   setIsLoading,
   setUsers,
   allowedToInvite,
}: {
   projectId: string;
   user: User;
   currentUserId: string;
   currentUserRole: string;
   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
   setUsers: React.Dispatch<React.SetStateAction<User[]>>;
   allowedToInvite: boolean;
}) {
   const [roleDropdown, setRoleDropdown] = useState(false);
   const roleDropdownRef = useRef<HTMLDivElement>(null);
   const [role, setRole] = useState(user.role);

   async function removeUser() {
      setIsLoading(true);
      const res = await removeProjectUser(projectId, user.user_id);
      if (res && res.success) {
         setUsers((users) => users.filter((u) => u.user_id !== user.user_id));
         toast({
            title: "User removed",
            message: "The user has been removed from the project",
            type: "success",
         });
      } else {
         toast({
            title: "There was an error removing the user from the project",
            message: res.reason,
            type: "error",
         });
      }
      setIsLoading(false);
   }

   // const allowedToInviteUser = (currentUserRole === "owner" && role !== "owner") || (allowedToInvite && role !== "owner");

   return (
      <div className="bg-white flex flex-row hover:bg-slate-100 pl-3">
         <Image src={user.picture} width={35} height={35} className="rounded-full m-2 select-none" alt="avatar" />
         <div className="flex flex-col w-full">
            <div className="flex flex-row pt-1 pl-1">
               <div className="flex flex-col">
                  <span>
                     {user.full_name}
                     {user.user_id === currentUserId && <span className="pl-1 mb-1 mt-auto">(you)</span>}
                  </span>
                  <span className="text-xs text-stone-500 pb-1">{user.email}</span>
               </div>
               <div className="relative ml-auto group" ref={roleDropdownRef}>
                  <div className="flex flex-row text-gray-600 text-sm pl-2 py-1 mt-1 pl-auto mr-7 rounded cursor-default">
                     {user.role}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

function capitalizeFirstLetter(string: string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}
