import { User } from "types";

type ComponentWithSkeleton = React.ComponentType<{ user: User }>;

export default function FormContainer({ Component, user }: { Component: ComponentWithSkeleton; user: User }) {
   return <Component user={user} />;
}
