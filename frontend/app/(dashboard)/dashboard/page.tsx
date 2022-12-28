import { redirect } from "next/navigation";
import { cache } from "react";

import { DashboardHeader } from "@/components/dashboard/header";
import { PostCreateButton } from "@/components/dashboard/post-create-button";
import { DashboardShell } from "@/components/dashboard/shell";
import { PostItem } from "@/components/dashboard/post-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { getSession } from "@/lib/auth";
import { fetchAPI } from "@/lib/utils";
import { Diagram } from "types";

// const getDiagramsForUser = cache(async (userId: User["id"]) => {
//   return await db.diagram.findMany({
//     where: {
//       authorId: userId,
//     },
//     select: {
//       id: true,
//       title: true,
//       published: true,
//       createdAt: true,
//     },
//     orderBy: {
//       updatedAt: "desc",
//     },
//   })
// })

export default async function DashboardPage() {
  const user = getSession();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const diagrams: Diagram[] = await fetchAPI("/diagrams")
    .then((res) => res.json())
    .then((res) => {
      if (res && res.success === true) {
        return res.response as Diagram;
      }

      return null;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });

  console.log("diagrams", diagrams);

  return (
    <DashboardShell>
      <DashboardHeader heading="Diagrams" text="Create and manage diagrams.">
        <PostCreateButton />
      </DashboardHeader>
      <div>
        {diagrams?.length ? (
          <div className="divide-y divide-neutral-200 rounded-md border border-slate-200">
            {diagrams.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No diagrams created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>You don&apos;t have any diagrams yet. Start creating content.</EmptyPlaceholder.Description>
            <PostCreateButton className="border-slate-200 bg-white text-brand-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
}
