import { User, UserCredentials, SupabaseClientOptions, Session, ApiError, AuthSession } from "@supabase/supabase-js";
import React, { useContext, useState, useEffect, createContext } from "react";
import { supabase } from "./supabase";

//import {definitions} from "types/supabase"

// declare function signUp(): void;

interface AuthContextInterface {
  signUp(
    { email, password, phone }: UserCredentials,
    options?:
      | {
          redirectTo?: string | undefined;
          data?: object | undefined;
          captchaToken?: string | undefined;
        }
      | undefined,
  ): Promise<{ user: User | null; session: Session | null; error: ApiError | null }>;
  signIn(
    { email, phone, password, refreshToken, provider, oidc }: UserCredentials,
    options?:
      | {
          redirectTo?: string | undefined;
          shouldCreateUser?: boolean | undefined;
          scopes?: string | undefined;
          captchaToken?: string | undefined;
          queryParams?: { [key: string]: string } | undefined;
        }
      | undefined,
  ): Promise<{ user: User | null; session: Session | null; error: ApiError | null }>;
  signOut(): Promise<{
    error: ApiError | null;
  }>;
  session: AuthSession | null | undefined;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("Auth context is not inside provider.");
  }

  return context;
}

function AuthProvider({ children }: any) {
  const [session, setSession] = useState<AuthSession | null | undefined>(undefined);

  useEffect(() => {
    const authSession = supabase.auth.session();

    if (authSession === null) {
      setSession(authSession);
    } else if (authSession !== undefined) {
      setSession(authSession);
    }

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, listenerSession) => {
      console.log("session changed", listenerSession);
      setSession(listenerSession ?? null);
    });

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("m nmm", session);
  }, [session]);

  const value: AuthContextInterface = {
    signUp: (credentials, options) => supabase.auth.signUp(credentials, options),
    signIn: (credentials, options) => supabase.auth.signIn(credentials, options),
    signOut: () => supabase.auth.signOut(),
    session: session,
  };

  return <AuthContext.Provider value={value}>{session === undefined ? "Loading" : children}</AuthContext.Provider>;
}

export { useAuth, AuthProvider };
