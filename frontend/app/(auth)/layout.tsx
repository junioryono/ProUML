import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = getSession();

  if (user) {
    redirect("/dashboard");
  }

  return <div className="min-h-screen">{children}</div>;
}
