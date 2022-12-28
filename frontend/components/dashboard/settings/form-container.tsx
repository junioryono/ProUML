"use client";

import { useAuth } from "@/lib/auth-client";
import { User } from "types";

// Create a function that takes a react component as an argument

type ComponentWithSkeleton = React.ComponentType<{ user?: User }> & {
  Skeleton: React.ComponentType;
};

export function FormContainer({ Component }: { Component: ComponentWithSkeleton }) {
  const { user } = useAuth();

  if (user === undefined) {
    return <Component.Skeleton />;
  }

  if (!user) {
    return null;
  }

  return <Component user={user} />;
}
