// A react component that will render a success or failure message based on if the user email verification was successful or not.
import { verifyEmail } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";

export default function VerifyEmailPage({
   verifyEmailRequest,
}: {
   verifyEmailRequest: Awaited<ReturnType<typeof verifyEmail>>;
}) {
   return (
      <div>
         <div>Hello</div>
         <div>{JSON.stringify(verifyEmailRequest)}</div>
      </div>
   );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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

   return {
      props: {
         verifyEmailRequest: await verifyEmail(token),
      },
   };
};
