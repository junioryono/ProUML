import { getSession, verifyEmail } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import { User } from "types";

import DashboardLayout from "@/components/dashboard/layout";
import DashboardHeader from "@/components/dashboard/header";
import DashboardShell from "@/components/dashboard/shell";

export default function VerifyEmailPage({
   user,
   verifyEmailRequest,
}: {
   user: User;
   verifyEmailRequest: Awaited<ReturnType<typeof verifyEmail>>;
}) {
   return (
      <DashboardLayout user={user}>
         <DashboardShell>
            <DashboardHeader heading="Email Verification" text="Verify your email address." />
            <div className="flex flex-col">
               <div className="flex flex-col items-center justify-center">
                  {!verifyEmailRequest.success ? (
                     <p className="text-lg font-semibold text-center text-gray-900">{verifyEmailRequest.reason}</p>
                  ) : !user ? (
                     <div>
                        <p className="text-lg font-semibold text-center text-gray-900">Your email has been verified.</p>
                        <p className="text-lg font-semibold text-center text-gray-900">
                           Please{" "}
                           <a href="/login" className="text-blue-600 hover:text-blue-700 hover:underline">
                              login
                           </a>{" "}
                           to continue.
                        </p>
                     </div>
                  ) : (
                     <p>Your email has been verified.</p>
                  )}
               </div>
            </div>
         </DashboardShell>
      </DashboardLayout>
   );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const cookies = ctx.req.headers.cookie;
   const token = ctx.query.token;

   if (!token) {
      return {
         redirect: {
            destination: "/login?redirect=/dashboard/diagrams",
            permanent: false,
         },
      };
   } else if (typeof token !== "string") {
      return {
         redirect: {
            destination: "/login?redirect=/dashboard/diagrams",
            permanent: false,
         },
      };
   }

   const verifyEmailRequest = await verifyEmail(token, {
      headers: {
         cookie: cookies,
      },
   });

   if (!verifyEmailRequest.success) {
      return {
         props: {
            verifyEmailRequest: verifyEmailRequest,
         },
      };
   }

   if (!verifyEmailRequest.cookie) {
      return {
         props: {
            verifyEmailRequest: verifyEmailRequest,
         },
      };
   }

   ctx.res.setHeader("set-cookie", verifyEmailRequest.cookie);

   const userRequest = await getSession({
      headers: {
         cookie: verifyEmailRequest.cookie,
      },
   });

   if (!userRequest.success) {
      return {
         props: {
            verifyEmailRequest: verifyEmailRequest,
         },
      };
   }

   return {
      props: {
         user: userRequest.response,
         verifyEmailRequest: verifyEmailRequest,
      },
   };
};
