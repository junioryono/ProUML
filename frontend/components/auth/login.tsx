"use client";

import { useState, useEffect, HTMLAttributes } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { toast } from "@/ui/toast";
import { Icons } from "@/components/icons";
import { LoginProviders } from "./login-providers";
import { login } from "@/lib/auth-fetch";

interface LoginFormProps extends HTMLAttributes<HTMLDivElement> {}

export const userLoginSchema = z.object({
   email: z.string().email(),
   password: z.string().min(8),
});

type FormData = z.infer<typeof userLoginSchema>;

export default function LoginForm({ className, ...props }: LoginFormProps) {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>({
      resolver: zodResolver(userLoginSchema),
   });
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const searchParams = useSearchParams();
   const router = useRouter();

   async function onSubmit(data: FormData) {
      setIsLoading(true);

      const signInResult = await login(data.email, data.password);

      setIsLoading(false);

      if (!signInResult.success) {
         return toast({
            title: "Something went wrong.",
            message: "Incorrect email or password. Please try again.",
            type: "error",
         });
      }

      toast({
         title: "Logging you in!",
         message: "You will be redirected to your dashboard shortly.",
         type: "success",
      });

      return router.push(searchParams.get("redirect") || "/dashboard/diagrams");
   }

   return (
      <div className={cn("grid gap-6", className)} {...props}>
         <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
               <div className="grid gap-1">
                  <label className="sr-only" htmlFor="email">
                     Email
                  </label>
                  <input
                     id="email"
                     placeholder="name@example.com"
                     className="my-0 mb-2 block h-9 w-full rounded-md border border-slate-300 py-2 px-3 text-base placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none"
                     type="email"
                     autoCapitalize="none"
                     autoComplete="email"
                     autoCorrect="off"
                     name="email"
                     disabled={isLoading}
                     {...register("email")}
                  />
                  {errors?.email && <p className="px-1 text-xs text-red-600">{errors.email.message}</p>}
               </div>
               <label className="sr-only" htmlFor="password">
                  Password
               </label>
               <input
                  id="password"
                  placeholder="Password"
                  className="my-0 mb-2 block h-9 w-full rounded-md border border-slate-300 py-2 px-3 text-base placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  autoCorrect="off"
                  name="password"
                  disabled={isLoading}
                  {...register("password")}
               />
               {errors?.password && <p className="px-1 text-xs text-red-600">{errors.password.message}</p>}
               <button
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#24292F] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#24292F]/90 focus:outline-none focus:ring-4 focus:ring-[#24292F]/50 disabled:opacity-50 dark:hover:bg-[#050708]/30 dark:focus:ring-slate-500"
                  disabled={isLoading}
               >
                  {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
               </button>
            </div>
         </form>
         <div className="relative">
            <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
               <span className="bg-white px-2 text-slate-600">Or continue with</span>
            </div>
         </div>
         <LoginProviders isLoading={isLoading} />
      </div>
   );
}
