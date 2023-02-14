import { getProjects, getSession } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import { Project, User } from "types";

import UserDeleteForm from "@/components/dashboard/settings/user-delete-form";
import UserEmailForm from "@/components/dashboard/settings/user-email-form";
import FormContainer from "@/components/dashboard/settings/form-container";
import UserNameForm from "@/components/dashboard/settings/user-name-form";
import DashboardLayout from "@/components/dashboard/layout";
import DashboardHeader from "@/components/dashboard/header";
import DashboardShell from "@/components/dashboard/shell";

export default function DashboardSettingsPage({ user }: { user: User }) {
   return (
      <DashboardLayout user={user}>
         <DashboardShell>
            <DashboardHeader heading="Settings" text="Manage account and website settings." />
            <div className="flex flex-col">
               <FormContainer Component={UserNameForm} user={user} />
            </div>
            <div>
               <FormContainer Component={UserEmailForm} user={user} />
            </div>
            <div>
               <FormContainer Component={UserDeleteForm} user={user} />
            </div>
         </DashboardShell>
      </DashboardLayout>
   );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const cookies = ctx.req.headers.cookie;

   const userRequest = await getSession({
      headers: {
         cookie: cookies,
      },
   });

   if (!userRequest.success) {
      return {
         redirect: {
            destination: "/login?redirect=/dashboard/settings",
            permanent: false,
         },
      };
   }

   if (userRequest.cookie) {
      ctx.res.setHeader("set-cookie", userRequest.cookie);
   }

   return {
      props: {
         user: userRequest.response || null,
      },
   };
};
