import { User, UserCredentials, SupabaseClientOptions, Session, ApiError, AuthSession, RealtimeClient } from "@supabase/supabase-js";
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
    if (session !== undefined) {
      return;
    }

    (async () => {
      const { data: urlSession } = await supabase.auth.getSessionFromUrl();

      const authSession = supabase.auth.session();

      if (!urlSession && authSession === null) {
        // supabase.auth.signIn({ refreshToken: "Vw_D_DpoofHRPzEW240U_A" });
        setSession(authSession);
      } else if (authSession !== undefined) {
        setSession(authSession);
      }

      const { data: listener } = supabase.auth.onAuthStateChange(async (event, listenerSession) => {
        console.log("EVENT OCCURRED", { event, listenerSession });
        setSession(listenerSession ?? null);
      });

      return () => {
        listener?.unsubscribe();
      };
    })();
  }, [session]);

  const value: AuthContextInterface = {
    signUp: function (credentials, options) {
      return supabase.auth.signUp(credentials, options);
    },
    signIn: function (credentials, options) {
      return supabase.auth.signIn(credentials, options);
    },
    signOut: function () {
      return supabase.auth.signOut();
    },
    session: session,
  };

  return <AuthContext.Provider value={value}>{session === undefined ? "Loading" : children}</AuthContext.Provider>;
}

export { useAuth, AuthProvider };
