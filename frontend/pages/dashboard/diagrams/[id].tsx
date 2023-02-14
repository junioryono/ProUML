import { getSession, getDiagram } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import { Diagram, User } from "types";
import Link from "next/link";

import DiagramLayout from "@/components/diagram/layout";

export default function DiagramPage({ user, diagram }: { user: User; diagram: Diagram }) {
   if (!diagram) {
      return (
         <div>
            <div>Diagram not found</div>
            <div>
               Go back to <Link href="/dashboard/diagrams">Dashboard</Link>
            </div>
         </div>
      );
   }

   return <DiagramLayout user={user} diagram={diagram} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const id = ctx.params.id as string;
   const cookies = ctx.req.headers.cookie;

   const [userRequest, diagramsRequest] = await Promise.all([
      getSession({
         headers: {
            cookie: cookies,
         },
      }),
      getDiagram(id, {
         headers: {
            cookie: cookies,
         },
      }),
   ]);

   if (!userRequest.success) {
      return {
         redirect: {
            destination: "/login?redirect=/dashboard/diagrams/" + id,
            permanent: false,
         },
      };
   }

   return {
      props: {
         user: userRequest.response || null,
         diagram: diagramsRequest.response || null,
      },
   };
};
