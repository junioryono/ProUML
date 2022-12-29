"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn, fetchAPI } from "@/lib/utils";
import { Card } from "@/ui/card";
import { toast } from "@/ui/toast";
import { Icons } from "@/components/icons";
import { UserNameFormSkeleton } from "./user-name-form-skeleton";
import { useAuth } from "@/lib/auth-client";

const userNameSchema = z.object({
   fullName: z.string().min(3).max(32),
});

type FormData = z.infer<typeof userNameSchema>;

export function UserNameForm() {
   const { user, setUser } = useAuth();
   const {
      handleSubmit,
      register,
      formState: { errors },
   } = useForm<FormData>({
      resolver: zodResolver(userNameSchema),
      defaultValues: {
         fullName: user.full_name,
      },
   });
   const [isSaving, setIsSaving] = useState<boolean>(false);

   async function onSubmit(data: FormData) {
      if (data.fullName === user.full_name) {
         return toast({
            title: "No changes detected.",
            message: "Your name is already set to this value.",
            type: "default",
         });
      }

      setIsSaving(true);

      const form = new FormData();
      form.append("fullName", data.fullName);

      const success = await fetchAPI("/auth/update-profile", {
         method: "PATCH",
         body: form,
      })
         .then((res) => res.json())
         .then((res) => {
            if (res && res.success === true) {
               setUser((prev) => ({ ...prev, full_name: data.fullName }));
               return true;
            }

            return null;
         })
         .catch((err) => {
            console.error(err);
            return null;
         });

      setIsSaving(false);

      if (!success) {
         return toast({
            title: "Something went wrong.",
            message: "Your name was not updated. Please try again.",
            type: "error",
         });
      }

      toast({
         message: "Your name has been updated.",
         type: "success",
      });
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <Card>
            <Card.Header>
               <Card.Title>Your Name</Card.Title>
               <Card.Description>Enter your full name or a display name you are comfortable with.</Card.Description>
            </Card.Header>
            <Card.Content>
               <div className="grid gap-1">
                  <label className="sr-only" htmlFor="name">
                     Name
                  </label>
                  <input
                     id="name"
                     className="my-0 mb-2 block h-9 w-full max-w-[350px] rounded-md border border-slate-300 py-2 px-3 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-1"
                     size={32}
                     name="name"
                     {...register("fullName")}
                  />
                  {errors?.fullName && <p className="px-1 text-xs text-red-600">{errors.fullName.message}</p>}
               </div>
            </Card.Content>
            <Card.Footer>
               <button
                  type="submit"
                  className={cn(
                     "relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                     {
                        "cursor-not-allowed opacity-60": isSaving,
                     },
                  )}
                  disabled={isSaving}
               >
                  {isSaving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  <span>Save</span>
               </button>
            </Card.Footer>
         </Card>
      </form>
   );
}

UserNameForm.Skeleton = UserNameFormSkeleton;
