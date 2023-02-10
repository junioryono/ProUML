"use client";

import { useAuth } from "@/lib/auth-client";

type ComponentWithSkeleton = React.ComponentType & {
   Skeleton: React.ComponentType;
};

export default function FormContainer({ Component }: { Component: ComponentWithSkeleton }) {
   const { user } = useAuth();

   if (user === undefined) {
      return <Component.Skeleton />;
   }

   if (!user) {
      return null;
   }

   return <Component />;
}
