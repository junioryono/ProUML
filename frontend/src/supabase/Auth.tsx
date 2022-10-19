import { User, SupabaseClientOptions, Session, AuthSession, AuthError, RealtimeClient, SignInWithOAuthCredentials, OAuthResponse } from "@supabase/supabase-js";
import React, { useContext, useState, useEffect, createContext } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";

//import {definitions} from "types/supabase"

// declare function signUp(): void;

interface AuthContextInterface {
  signIn(): Promise<OAuthResponse>;
  signOut(): Promise<{
    error: AuthError | null;
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
  const navigate = useNavigate();

  useEffect(() => {
    if (session !== undefined) {
      return;
    }

    (async () => {
      const {
        data: { session: authSession },
      } = await supabase.auth.getSession();

      // Remove '#' from end of URL. This happens after signing in with Supabase
      if (authSession !== null && (window.location.hash || window.location.href.endsWith("#"))) {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      }

      setSession(authSession);

      const {
        data: { subscription: listener },
      } = supabase.auth.onAuthStateChange(async (event, listenerSession) => {
        console.log("EVENT OCCURRED", { event, listenerSession });
        setSession(listenerSession);
      });

      return () => {
        listener?.unsubscribe();
      };
    })();
  }, [session]);

  const value: AuthContextInterface = {
    signIn: async function () {
      const response = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: !process.env.REACT_APP_DEV ? "https://prouml.com/dashboard" : "http://localhost:3000/dashboard",
        },
      });

      if (response.error) {
        await supabase.auth.initialize();
      }

      return response;
    },
    signOut: function () {
      navigate("/");
      return supabase.auth.signOut();
    },
    session: session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { useAuth, AuthProvider };
