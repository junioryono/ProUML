import { useState, useRef, Fragment, Dispatch, SetStateAction, useCallback } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { forgotPassword, changePassword } from "@/lib/auth-fetch";
import { Card } from "@/ui/card";
import { toast } from "@/ui/toast";
import { Icons } from "@/components/icons";
import { User } from "types";

import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import UserPasswordFormSkeleton from "./user-password-form-skeleton";

const userDeleteSchema = z.object({
   "old-password": z.string().min(8),
   "new-password": z.string().min(8),
   "confirm-new-password": z.string().min(8),
});

type FormData = z.infer<typeof userDeleteSchema>;

export default function UserPasswordForm({ user }: { user: User }) {
   const {
      handleSubmit,
      register,
      reset,
      formState: { errors },
   } = useForm<FormData>({
      resolver: zodResolver(userDeleteSchema),
   });
   const [isLoading, setIsLoading] = useState<boolean>(false);

   const onSubmitEmailVerified = useCallback(async () => {
      if (!user || !user.email_verified) {
         return toast({
            title: "Email not verified.",
            message: "You must verify your email before you can reset your password.",
            type: "error",
         });
      }

      setIsLoading(true);

      const forgotPasswordResult = await forgotPassword(user.email);

      setIsLoading(false);

      if (!forgotPasswordResult.success) {
         return toast({
            title: "Something went wrong.",
            message: forgotPasswordResult.reason,
            type: "error",
         });
      }

      toast({
         title: "Password reset email sent!",
         message: "You will receive an email shortly.",
         type: "success",
      });
   }, [user]);

   const onSubmitEmailNotVerified = useCallback(
      async (data: FormData) => {
         if (!user || user.email_verified) {
            return toast({
               title: "Email already verified.",
               message: "You can change your password from the dashboard.",
               type: "error",
            });
         }

         if (data["new-password"] !== data["confirm-new-password"]) {
            return toast({
               title: "Passwords do not match.",
               message: "Please make sure your passwords match.",
               type: "error",
            });
         }

         setIsLoading(true);

         const changePasswordResult = await changePassword(data["old-password"], data["new-password"]);

         setIsLoading(false);

         if (!changePasswordResult.success) {
            return toast({
               title: "Something went wrong.",
               message: changePasswordResult.reason,
               type: "error",
            });
         }

         toast({
            title: "Password changed successfully!",
            message: "You can now login with your new password.",
            type: "success",
         });
      },
      [user],
   );

   return (
      <>
         <Card>
            <Card.Header>
               <Card.Title>Change Password</Card.Title>
               <Card.Description>
                  {user.email_verified
                     ? "Send a password reset email to your inbox."
                     : "Enter a new password for your account."}
               </Card.Description>
            </Card.Header>
            {!user.email_verified && (
               <Card.Content>
                  <div className="grid gap-2">
                     <div className="grid gap-1">
                        <label className="sr-only" htmlFor="old-password">
                           Old Password
                        </label>
                        <input
                           placeholder="Old Password"
                           className="my-0 mb-2 block h-9 w-full max-w-[350px] rounded-md border border-slate-300 py-2 px-3 text-base placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none"
                           type="password"
                           autoCapitalize="none"
                           autoComplete="old-password"
                           autoCorrect="off"
                           name="old-password"
                           disabled={isLoading}
                           {...register("old-password")}
                        />
                        {errors?.["old-password"] && (
                           <p className="px-1 text-xs text-red-600">{errors["old-password"].message}</p>
                        )}
                     </div>
                     <div className="grid gap-1">
                        <label className="sr-only" htmlFor="new-password">
                           New Password
                        </label>
                        <input
                           placeholder="New Password"
                           className="my-0 mb-2 block h-9 w-full max-w-[350px] rounded-md border border-slate-300 py-2 px-3 text-base placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none"
                           type="password"
                           autoCapitalize="none"
                           autoComplete="new-password"
                           autoCorrect="off"
                           name="new-password"
                           disabled={isLoading}
                           {...register("new-password")}
                        />
                        {errors?.["new-password"] && (
                           <p className="px-1 text-xs text-red-600">{errors["new-password"].message}</p>
                        )}
                     </div>
                     <label className="sr-only" htmlFor="confirm-new-password">
                        Confirm Password
                     </label>
                     <input
                        placeholder="Confirm New Password"
                        className="my-0 mb-2 block h-9 w-full max-w-[350px] rounded-md border border-slate-300 py-2 px-3 text-base placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none"
                        type="password"
                        autoCapitalize="none"
                        autoComplete="confirm-new-password"
                        autoCorrect="off"
                        name="confirm-new-password"
                        disabled={isLoading}
                        {...register("confirm-new-password")}
                     />
                     {errors?.["confirm-new-password"] && (
                        <p className="px-1 text-xs text-red-600">{errors["confirm-new-password"].message}</p>
                     )}
                  </div>
               </Card.Content>
            )}
            <Card.Footer>
               <button
                  className={cn(
                     "hover:bg-brand-400 relative bg-brand-500 inline-flex h-9 items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none",
                     {
                        "cursor-not-allowed opacity-60": isLoading,
                     },
                  )}
                  onClick={(e) => {
                     e.preventDefault();
                     if (isLoading) return;

                     if (user.email_verified) {
                        onSubmitEmailVerified();
                     } else {
                        handleSubmit(onSubmitEmailNotVerified)();
                     }
                  }}
                  type="button"
               >
                  <span>{user.email_verified ? "Send" : "Change Password"}</span>
               </button>
            </Card.Footer>
         </Card>
      </>
   );
}

UserPasswordForm.Skeleton = UserPasswordFormSkeleton;
