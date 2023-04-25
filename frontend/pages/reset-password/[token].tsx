import { forgotPasswordVerifyToken, forgotPasswordReset } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import Link from "next/link";

import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { login } from "@/lib/auth-fetch";
import { toast } from "@/ui/toast";
import { useState } from "react";
import * as z from "zod";

import { Icons } from "@/components/icons";

const userLoginSchema = z.object({
   password: z.string().min(8),
   "confirm-password": z.string().min(8),
});

type FormData = z.infer<typeof userLoginSchema>;

export default function Index({ token }: { token: string }) {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>({
      resolver: zodResolver(userLoginSchema),
   });
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const router = useRouter();

   async function onSubmit(data: FormData) {
      if (data.password !== data["confirm-password"]) {
         return toast({
            title: "Passwords do not match.",
            message: "Please make sure your passwords match.",
            type: "error",
         });
      }

      setIsLoading(true);

      const resetPasswordResult = await forgotPasswordReset(token, data.password);

      setIsLoading(false);

      if (!resetPasswordResult.success) {
         return toast({
            title: "Something went wrong.",
            message: resetPasswordResult.reason,
            type: "error",
         });
      }

      toast({
         title: "Password reset successfully!",
         message: "Please login with your new password.",
         type: "success",
      });

      return router.push("/login");
   }

   return (
      <div className="min-h-screen">
         <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <Link
               href="/login"
               className="absolute top-4 left-4 inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent py-2 px-3 text-center text-sm  font-medium text-slate-900 hover:border-slate-200 hover:bg-slate-100 focus:z-10 focus:outline-none md:top-8 md:left-8"
            >
               <>
                  <Icons.chevronLeft className="mr-2 h-4 w-4" />
                  Back
               </>
            </Link>
            {!token ? (
               <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                  <div className="flex flex-col space-y-2 text-center">
                     <Icons.logo className="mx-auto h-6 w-6" />
                     <h1 className="text-2xl font-bold">Your password reset token is invalid or expired.</h1>
                     <p className="text-slate-600">Please request a new password reset token.</p>
                  </div>
               </div>
            ) : (
               <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                  <div className="flex flex-col space-y-2 text-center">
                     <Icons.logo className="mx-auto h-6 w-6" />
                     <h1 className="text-2xl font-bold">Reset Password</h1>
                     <p className="text-sm text-slate-600">Enter your new password below.</p>
                  </div>
                  <div className="grid gap-6">
                     <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-2">
                           <div className="grid gap-1">
                              <label className="sr-only" htmlFor="password">
                                 Password
                              </label>
                              <input
                                 placeholder="Password"
                                 className="my-0 mb-2 block h-9 w-full rounded-md border border-slate-300 py-2 px-3 text-base placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none"
                                 type="password"
                                 autoCapitalize="none"
                                 autoComplete="password"
                                 autoCorrect="off"
                                 name="password"
                                 disabled={isLoading}
                                 {...register("password")}
                              />
                              {errors?.password && <p className="px-1 text-xs text-red-600">{errors.password.message}</p>}
                           </div>
                           <label className="sr-only" htmlFor="confirm-password">
                              Confirm Password
                           </label>
                           <input
                              placeholder="Confirm Password"
                              className="my-0 mb-2 block h-9 w-full rounded-md border border-slate-300 py-2 px-3 text-base placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none"
                              type="password"
                              autoCapitalize="none"
                              autoComplete="confirm-password"
                              autoCorrect="off"
                              name="confirm-password"
                              disabled={isLoading}
                              {...register("confirm-password")}
                           />
                           {errors?.["confirm-password"] && (
                              <p className="px-1 text-xs text-red-600">{errors["confirm-password"].message}</p>
                           )}
                           <button
                              className="inline-flex w-full items-center justify-center rounded-lg bg-[#24292F] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#24292F]/90 focus:outline-none focus:ring-4 focus:ring-[#24292F]/50 disabled:opacity-50 dark:hover:bg-[#050708]/30 dark:focus:ring-slate-500"
                              disabled={isLoading}
                           >
                              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                              Change Password
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const token = ctx.query.token as string;

   if (!token) {
      return {
         redirect: {
            destination: "/login",
            permanent: false,
         },
      };
   }

   const tokenRequest = await forgotPasswordVerifyToken(token);

   return {
      props: {
         token: tokenRequest.success ? token : null,
      },
   };
};
