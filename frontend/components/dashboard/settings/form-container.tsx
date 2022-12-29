"use client";

import { useAuth } from "@/lib/auth-client";
import { useEffect } from "react";
import { User } from "types";

type ComponentWithSkeleton = React.ComponentType & {
   Skeleton: React.ComponentType;
};

export function FormContainer({ Component, userResponse }: { Component: ComponentWithSkeleton; userResponse: User }) {
   const { user, setUser } = useAuth();

   useEffect(() => {
      setUser(userResponse);
   }, [userResponse]);

   if (user === undefined) {
      return <Component.Skeleton />;
   }

   if (!user) {
      return null;
   }

   return <Component />;
}
