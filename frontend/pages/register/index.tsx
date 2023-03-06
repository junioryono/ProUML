import { getSession } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import Link from "next/link";

import { useSearchParams, useRouter } from "next/navigation";
import { register as registerAuth } from "@/lib/auth-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/ui/toast";
import { useState } from "react";
import * as z from "zod";

import { LoginProviders } from "@/components/auth/login-providers";
import { Icons } from "@/components/icons";

const userRegisterSchema = z.object({
   email: z.string().email(),
   password: z.string().min(8),
   fullName: z.string().min(1),
});

type FormData = z.infer<typeof userRegisterSchema>;

export default function Index() {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>({
      resolver: zodResolver(userRegisterSchema),
   });
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const searchParams = useSearchParams();
   const router = useRouter();

   async function onSubmit(data: FormData) {
      setIsLoading(true);

      const registerResult = await registerAuth(data.email, data.password, data.fullName);

      setIsLoading(false);

      if (!registerResult.success) {
         return toast({
            title: "Something went wrong.",
            message: "Your registration request failed. Please try again with a different email or password.",
            type: "error",
         });
      }

      toast({
         title: "Registration successful!",
         message: "You will be redirected to your dashboard shortly.",
         type: "success",
      });

      return router.push(searchParams.get("redirect") || "/dashboard/diagrams");
   }

   return (
      <div className="min-h-screen">
         <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
            <Link
               href={searchParams.get("redirect") ? `/login?redirect=${searchParams.get("redirect")}` : "/login"}
               className="absolute top-4 right-4 inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent py-2 px-3 text-center text-sm  font-medium text-slate-900 hover:border-slate-200 hover:bg-slate-100 focus:z-10 focus:outline-none md:top-8 md:right-8"
            >
               Login
            </Link>
            <div className="hidden h-full bg-slate-100 lg:block" />
            <div className="lg:p-8">
               <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                  <div className="flex flex-col space-y-2 text-center">
                     <Icons.logo className="mx-auto h-6 w-6" />
                     <h1 className="text-2xl font-bold">Create an account</h1>
                     <p className="text-sm text-slate-600">Enter your email below to create your account</p>
                  </div>
                  <div className="grid gap-6">
                     <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-2">
                           <div className="grid gap-1">
                              <label className="sr-only" htmlFor="fullName">
                                 Full Name
                              </label>
                              <input
                                 placeholder="Full Name"
                                 className="my-0 mb-2 block h-9 w-full rounded-md border border-slate-300 py-2 px-3 text-base placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none"
                                 type="fullName"
                                 autoCapitalize="none"
                                 autoComplete="fullName"
                                 autoCorrect="off"
                                 name="fullName"
                                 disabled={isLoading}
                                 {...register("fullName")}
                              />
                              {errors?.fullName && <p className="px-1 text-xs text-red-600">{errors.fullName.message}</p>}
                           </div>
                           <div className="grid gap-1">
                              <label className="sr-only" htmlFor="email">
                                 Email
                              </label>
                              <input
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
                              Sign Up
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
                  <p className="px-8 text-center text-sm text-slate-600">
                     By clicking continue, you agree to our{" "}
                     <Link href="/terms" className="underline hover:text-brand">
                        Terms of Service
                     </Link>{" "}
                     and{" "}
                     <Link href="/privacy" className="underline hover:text-brand">
                        Privacy Policy
                     </Link>
                     .
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const cookies = ctx.req.headers.cookie;

   const userRequest = await getSession({
      headers: {
         cookie: cookies,
      },
   });

   if (userRequest.success) {
      return {
         redirect: {
            destination: (ctx.query.redirect as string) || "/dashboard/diagrams",
            permanent: false,
         },
      };
   }

   if (userRequest.cookie) {
      ctx.res.setHeader("set-cookie", userRequest.cookie);
   }

   return {
      props: {},
   };
};
