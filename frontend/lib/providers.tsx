import { AuthProvider } from "@lib/auth-client";

export default function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
