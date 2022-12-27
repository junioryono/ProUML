"use client";

import { useAuth } from "@/lib/auth-client";
import { User } from "types";

// Create a function that takes a react component as an argument

export function FormContainer({ Component }: { Component: React.ComponentType<{ user: User }> }) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return <Component user={user} />;
}
