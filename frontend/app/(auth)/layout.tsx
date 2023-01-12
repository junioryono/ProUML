import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
   const user = await getSession();

   if (user.success) {
      redirect("/dashboard/diagrams");
   }

   return <div className="min-h-screen">{children}</div>;
}
