import React, { useState, useRef, Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "@/ui/toast";
import { Diagram, User } from "types";
import { getDiagramUsers, addDiagramUser, updateDiagramUser, removeDiagramUser, updateDiagram } from "@/lib/auth-fetch";
import Image from "next/image";
import { cn } from "@/lib/utils";

function validateEmail(email: string) {
   const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
   return re.test(email);
}

const userAddSchema = z.object({
   email: z
      .string()
      .min(8)
      .refine((v) => validateEmail(v), {
         message: "Invalid email address",
      }),
});

type FormData = z.infer<typeof userAddSchema>;

export default function ShareButton({ user, role, diagram }: { user: User; role: string; diagram: Diagram }) {
   const {
      handleSubmit,
      register,
      reset,
      formState: { errors },
   } = useForm<FormData>({
      resolver: zodResolver(userAddSchema),
      defaultValues: {
         email: "",
      },
   });
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [open, setOpen] = useState(false);
   const [users, setUsers] = useState<User[]>(null);

   const [newUserDropdown, setNewUserDropdown] = useState(false);
   const [newUserRole, setNewUserRole] = useState("editor");
   const newUserDropdownRef = useRef<HTMLDivElement>(null);
   const [showInviteButton, setShowInviteButton] = useState(false);

   const [generalAccessDropdown, setGeneralAccessDropdown] = useState(false);
   const [generalAccess, setGeneralAccess] = useState(diagram.public);
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
      const res = await addDiagramUser(diagram.id, data.email, newUserRole);
      setIsLoading(false);
      if (res && res.success) {
         toast({
            title: "User added.",
            message: "User has been added to the diagram.",
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
      const res = await updateDiagram(diagram.id, { public: publicAccess });
      setIsLoading(false);
      if (res && res.success) {
         setGeneralAccess(publicAccess);
         if (publicAccess) {
            toast({
               title: "Diagram is now public.",
               message: "Anyone with the link can view and edit this diagram.",
               type: "success",
            });
         } else {
            toast({
               title: "Diagram is now private.",
               message: "Only users you share this diagram with can view and edit it.",
               type: "success",
            });
         }
      } else {
         if (publicAccess) {
            toast({
               title: "Failed to make diagram public.",
               message: res.reason,
               type: "error",
            });
         } else {
            toast({
               title: "Failed to make diagram private.",
               message: res.reason,
               type: "error",
            });
         }
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
         if (res && res.response) {
            setUsers(res.response);
         } else {
            toast({
               title: "Failed to get users.",
               message: res.reason,
               type: "error",
            });
         }
      });
   }, [open, diagram]);

   return (
      <>
         <button
            className="mx-2 self-center relative inline-flex h-8 items-center rounded-md border border-transparent bg-blue-500 px-4 text-xs flex-none font-medium text-white hover:bg-blue-600 focus:outline-none"
            onClick={() => setOpen(true)}
         >
            Share
         </button>
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
                           <Dialog.Panel
                              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                              style={{
                                 overflow: "inherit",
                              }}
                           >
                              {/* Loading bar like google docs sharing. On top of the modal. use loading-bar animation from tailwind */}
                              <div
                                 className={cn("h-1", isLoading && "animate-[loading-bar_1s_linear_infinite] bg-blue-500")}
                              />
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
                                       placeholder="Email address"
                                       className="w-full my-0 mb-2 block h-9 rounded-md border border-slate-300 py-5 px-3 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none"
                                       autoCapitalize="none"
                                       autoComplete="off"
                                       autoCorrect="off"
                                       spellCheck="false"
                                       name="email"
                                       {...register("email")}
                                       onKeyDown={(e) => {
                                          const validEmail = validateEmail(e.currentTarget.value);
                                          setShowInviteButton(validEmail);
                                       }}
                                    />
                                    <div ref={newUserDropdownRef} className="relative select-none">
                                       <div
                                          className="flex flex-row ml-2 h-10 border border-slate-300 hover:border-slate-400 rounded-xl cursor-pointer items-center w-[6rem] justify-end pr-2"
                                          onClick={() => setNewUserDropdown(!newUserDropdown)}
                                       >
                                          {capitalizeFirstLetter(newUserRole)}
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
                                       {newUserDropdown && (
                                          <div className="absolute z-10 bg-white rounded-lg shadow-lg mt-2 w-40 left-2 top-8 py-2">
                                             <ul>
                                                <li
                                                   className="flex px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-t items-center"
                                                   onClick={() => {
                                                      setNewUserDropdown(false);
                                                      setNewUserRole("editor");
                                                   }}
                                                >
                                                   <div className="w-10 flex justify-center">
                                                      {newUserRole === "editor" && (
                                                         <svg
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            focusable="false"
                                                            className="inline-block mr-2 text-black"
                                                         >
                                                            <path
                                                               fill="currentColor"
                                                               d="M9.428 18.01L4.175 12.82l1.296-1.288 3.957 3.94L18.441 6.804l1.288 1.288L9.428 18.01z"
                                                            />
                                                         </svg>
                                                      )}
                                                   </div>
                                                   Editor
                                                </li>
                                                <li
                                                   className="flex px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-t items-center"
                                                   onClick={() => {
                                                      setNewUserDropdown(false);
                                                      setNewUserRole("viewer");
                                                   }}
                                                >
                                                   <div className="w-10 flex justify-center">
                                                      {newUserRole === "viewer" && (
                                                         <svg
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            focusable="false"
                                                            className="inline-block mr-2 text-black"
                                                         >
                                                            <path
                                                               fill="currentColor"
                                                               d="M9.428 18.01L4.175 12.82l1.296-1.288 3.957 3.94L18.441 6.804l1.288 1.288L9.428 18.01z"
                                                            />
                                                         </svg>
                                                      )}
                                                   </div>
                                                   Viewer
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
                                       <UserWithAccess
                                          key={sharedUser.user_id}
                                          diagramId={diagram.id}
                                          user={sharedUser}
                                          currentUserId={user.user_id}
                                          currentUserRole={role}
                                          setIsLoading={setIsLoading}
                                          setUsers={setUsers}
                                       />
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
                                    className="rounded-md self-center bg-slate-100 hover:bg-slate-50"
                                 >
                                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                                 </svg>
                                 <div className="relative ml-2" ref={generalAccessDropdownRef}>
                                    <div
                                       className={cn(
                                          "flex flex-row text-sm text-stone-900 mt-1 mb-0.5 py-0.5 rounded-md w-fit pl-2 pr-1 cursor-default",
                                          role === "owner" && "hover:bg-slate-200 cursor-pointer select-none",
                                          generalAccessDropdown && "text-black bg-slate-200",
                                       )}
                                       onClick={() => {
                                          if (role === "owner") {
                                             setGeneralAccessDropdown(!generalAccessDropdown);
                                          }
                                       }}
                                    >
                                       {generalAccess ? "Anyone with link" : "Restricted"}
                                       {role === "owner" && (
                                          <svg width="20" height="20" viewBox="0 0 24 24" focusable="false" className="">
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

                              <div className="bg-gray-50 px-4 py-3 flex flex-row sm:flex-row-reverse sm:px-6 select-none">
                                 {showInviteButton && (
                                    <button
                                       type="button"
                                       className="w-fit ml-3 sm:ml-0 sm:mr-4 relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none"
                                       onClick={handleSubmit(onNewUserSubmit)}
                                    >
                                       Invite
                                    </button>
                                 )}
                                 <button
                                    type="button"
                                    className="w-fit ml-3 sm:ml-0 sm:mr-4 relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none"
                                    onClick={() => setOpen(false)}
                                 >
                                    {showInviteButton ? "Cancel" : "Done"}
                                 </button>
                                 <button
                                    type="button"
                                    className="mr-auto w-fit ml-3 sm:ml-0 relative inline-flex h-9 items-center rounded-md border px-3 py-2 text-sm font-medium text-blue-500 hover:bg-blue-50 focus:outline-none"
                                    onClick={() => {
                                       // Copy link to clipboard
                                       navigator.clipboard.writeText(`https://prouml.com/dashboard/diagrams/${diagram.id}`);
                                       toast({
                                          title: "Link copied to clipboard",
                                          message: "You can now share this link with others",
                                          type: "success",
                                       });
                                    }}
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

function UserWithAccess({
   diagramId,
   user,
   currentUserId,
   currentUserRole,
   setIsLoading,
   setUsers,
}: {
   diagramId: string;
   user: User;
   currentUserId: string;
   currentUserRole: string;
   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
   setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}) {
   const [roleDropdown, setRoleDropdown] = useState(false);
   const roleDropdownRef = useRef<HTMLDivElement>(null);
   const [role, setRole] = useState(user.role);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
            setRoleDropdown(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [roleDropdownRef]);

   async function updateRole(role: string) {
      if (role === user.role) {
         return;
      }

      setIsLoading(true);
      const res = await updateDiagramUser(diagramId, user.user_id, role);
      if (res && res.success) {
         setUsers((users) => users.map((u) => (u.user_id === user.user_id ? { ...u, role } : u)));
         setRole(role);
         toast({
            title: "Role updated",
            message: "The user's role has been updated",
            type: "success",
         });
      } else {
         toast({
            title: "There was an error updating the user's role",
            message: res.reason,
            type: "error",
         });
      }
      setIsLoading(false);
   }

   async function removeUser() {
      setIsLoading(true);
      const res = await removeDiagramUser(diagramId, user.user_id);
      if (res && res.success) {
         setUsers((users) => users.filter((u) => u.user_id !== user.user_id));
         toast({
            title: "User removed",
            message: "The user has been removed from the diagram",
            type: "success",
         });
      } else {
         toast({
            title: "There was an error removing the user from the diagram",
            message: res.reason,
            type: "error",
         });
      }
      setIsLoading(false);
   }

   return (
      <div className="bg-white flex flex-row hover:bg-slate-100 rounded-l-3xl ml-3">
         <Image src={user.picture} width={35} height={35} className="rounded-full m-2 select-none" alt="avatar" />
         <div className="flex flex-col w-full">
            <div className="flex flex-row pt-1 pl-1">
               <div className="flex flex-col">
                  <span>
                     {user.full_name}
                     {user.user_id === currentUserId && (
                        <span className="text-xs text-stone-500 pl-2 mb-1 mt-auto">(you)</span>
                     )}
                  </span>
                  <span className="text-xs text-stone-500 pb-1">{user.email}</span>
               </div>

               <div className="relative ml-auto" ref={roleDropdownRef}>
                  <div
                     className={cn(
                        "flex flex-row text-gray-600 text-sm px-2 mt-1 pl-auto mr-10 rounded py-1 cursor-default",
                        currentUserRole === "owner" &&
                           role !== "owner" &&
                           "hover:text-black hover:bg-slate-200 cursor-pointer select-none",
                        roleDropdown && "text-black bg-slate-200",
                     )}
                     onClick={() => {
                        if (currentUserRole === "owner" && role !== "owner") {
                           setRoleDropdown(!roleDropdown);
                        }
                     }}
                  >
                     {capitalizeFirstLetter(role)}
                     {currentUserRole === "owner" && role !== "owner" && (
                        <svg width="20" height="20" viewBox="0 0 24 24" focusable="false" className="fill-slate-500 ml-1">
                           <path d="M7 10l5 5 5-5H7z" />
                        </svg>
                     )}
                  </div>
                  {roleDropdown && (
                     <div className="absolute z-10 bg-white rounded-lg shadow-lg mt-2 w-40 left-0 top-6 py-2">
                        <ul>
                           <li
                              className="flex px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-t items-center"
                              onClick={() => {
                                 setRoleDropdown(false);
                                 updateRole("editor");
                              }}
                           >
                              <div className="w-10 flex justify-center">
                                 {role === "editor" && (
                                    <svg
                                       width="16"
                                       height="16"
                                       viewBox="0 0 24 24"
                                       focusable="false"
                                       className="inline-block mr-2 text-black"
                                    >
                                       <path
                                          fill="currentColor"
                                          d="M9.428 18.01L4.175 12.82l1.296-1.288 3.957 3.94L18.441 6.804l1.288 1.288L9.428 18.01z"
                                       />
                                    </svg>
                                 )}
                              </div>
                              Editor
                           </li>
                           <li
                              className="flex px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-t items-center"
                              onClick={() => {
                                 setRoleDropdown(false);
                                 updateRole("viewer");
                              }}
                           >
                              <div className="w-10 flex justify-center">
                                 {role === "viewer" && (
                                    <svg
                                       width="16"
                                       height="16"
                                       viewBox="0 0 24 24"
                                       focusable="false"
                                       className="inline-block mr-2 text-black"
                                    >
                                       <path
                                          fill="currentColor"
                                          d="M9.428 18.01L4.175 12.82l1.296-1.288 3.957 3.94L18.441 6.804l1.288 1.288L9.428 18.01z"
                                       />
                                    </svg>
                                 )}
                              </div>
                              Viewer
                           </li>

                           <hr className="border-slate-400 mx-2 my-2" />

                           <li
                              className="flex px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-t items-center"
                              onClick={() => {
                                 setRoleDropdown(false);
                                 removeUser();
                              }}
                           >
                              Remove Access
                           </li>
                        </ul>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}

function capitalizeFirstLetter(string: string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}
