import { getSession } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import Link from "next/link";

import AuthLayout from "@/components/auth/layout";
import RegisterForm from "@/components/auth/register";
import { Icons } from "@/components/icons";

export default function Index() {
   return (
      <AuthLayout>
         <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
            <Link
               href="/login"
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
                  <RegisterForm />
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
