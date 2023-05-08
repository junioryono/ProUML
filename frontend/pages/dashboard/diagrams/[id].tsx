import { getSession, getDiagram } from "@/lib/auth-fetch";
import { GetServerSideProps } from "next";
import { Diagram, User } from "types";
import Link from "next/link";

import DiagramLayout from "@/components/diagram/layout";

export default function DiagramPage({ user, role, diagram }: { user: User; role: string; diagram: Diagram }) {
   console.log("DiagramPage", diagram);
   if (!diagram) {
      return (
         <div className="text-center pt-56">
            <div className="text-2xl">Diagram not found</div>
            <div>
               Go back to{" "}
               <Link href="/dashboard/diagrams" className="text-blue-500">
                  Dashboard
               </Link>
            </div>
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="200px"
               height="200px"
               viewBox="0 0 64 64"
               stroke-width="3"
               stroke="#000000"
               fill="none"
               className="mx-auto my-10"
            >
               <polyline points="34.48 54.28 11.06 54.28 11.06 18.61 23.02 5.75 48.67 5.75 48.67 39.42" />
               <polyline points="23.04 5.75 23.02 18.61 11.06 18.61" />
               <line x1="16.21" y1="45.68" x2="28.22" y2="45.68" />
               <line x1="16.21" y1="39.15" x2="31.22" y2="39.15" />
               <line x1="16.21" y1="33.05" x2="43.22" y2="33.05" />
               <line x1="16.21" y1="26.95" x2="43.22" y2="26.95" />
               <circle cx="42.92" cy="48.24" r="10.01" stroke-linecap="round" />
               <line x1="42.95" y1="53.52" x2="42.95" y2="53.73" stroke-linecap="round" />
               <line x1="42.95" y1="43.19" x2="42.95" y2="49.69" stroke-linecap="round" />
            </svg>
         </div>
      );
   }

   return <DiagramLayout user={user} role={role} diagram={diagram} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const id = ctx.params.id as string;
   const cookies = ctx.req.headers.cookie;

   const [userRequest, diagramRequest] = await Promise.all([
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

   if (userRequest.cookie) {
      ctx.res.setHeader("set-cookie", userRequest.cookie);
   } else if (diagramRequest.cookie) {
      ctx.res.setHeader("set-cookie", diagramRequest.cookie);
   }

   return {
      props: {
         user: userRequest.response || null,
         role: diagramRequest.response?.role || null,
         diagram: diagramRequest.response?.diagram || null,
      },
   };
};
