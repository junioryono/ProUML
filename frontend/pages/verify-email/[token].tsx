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
                     <div className="h-screen flex justify-center items-center">
                        <div className="bg-slate-300 p-14 rounded-2xl flex flex-col items-center">
                           <div className="bg-white rounded-full">
                              <svg
                                 fill="#00D100"
                                 viewBox="2 2 32 32"
                                 version="1.1"
                                 preserveAspectRatio="xMidYMid meet"
                                 xmlns="http://www.w3.org/2000/svg"
                                 height={100}
                                 width={100}
                              >
                                 <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                 <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                 <g id="SVGRepo_iconCarrier">
                                    <path
                                       className="clr-i-solid clr-i-solid-path-1"
                                       d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM28.45,12.63,15.31,25.76,7.55,18a1.4,1.4,0,0,1,2-2l5.78,5.78L26.47,10.65a1.4,1.4,0,1,1,2,2Z"
                                    ></path>
                                    <rect x="0" y="0" width="36" height="36" fillOpacity="0"></rect>
                                 </g>
                              </svg>
                           </div>
                           <p className="mt-2 font-bold">Your email has been verified.</p>
                        </div>
                     </div>
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
