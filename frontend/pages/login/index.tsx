import { getSession } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import Link from "next/link";

import AuthLayout from "@/components/auth/layout";
import LoginForm from "@/components/auth/login";
import { Icons } from "@/components/icons";

export default function Index() {
   return (
      <AuthLayout>
         <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <Link
               href="/"
               className="absolute top-4 left-4 inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent py-2 px-3 text-center text-sm  font-medium text-slate-900 hover:border-slate-200 hover:bg-slate-100 focus:z-10 focus:outline-none md:top-8 md:left-8"
            >
               <>
                  <Icons.chevronLeft className="mr-2 h-4 w-4" />
                  Back
               </>
            </Link>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
               <div className="flex flex-col space-y-2 text-center">
                  <Icons.logo className="mx-auto h-6 w-6" />
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-sm text-slate-600">Enter your details to sign in to your account</p>
               </div>
               <LoginForm />
               <p className="px-8 text-center text-sm text-slate-600">
                  <Link href="/register" className="underline hover:text-brand">
                     Don&apos;t have an account? Sign Up
                  </Link>
               </p>
            </div>
         </div>
      </AuthLayout>
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
            destination: "/dashboard/diagrams",
            permanent: false,
         },
      };
   }

   return {
      props: {},
   };
};
