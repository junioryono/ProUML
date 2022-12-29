"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "types";
import { getSession, login, logout, register } from "./auth-fetch";

interface AuthContextInterface {
   login(email: string, password: string): Promise<User>;
   register(email: string, password: string, fullName: string): Promise<User>;
   logout(): Promise<boolean>;
   getSession(): Promise<User>;
   user: User | undefined;
   setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export function useAuth() {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error("Auth context is not inside provider.");
   }

   return context;
}

export function AuthProvider({ children }) {
   const [user, setUser] = useState<User | undefined>(undefined);

   useEffect(() => {
      value.getSession();
   }, []);

   const value: AuthContextInterface = {
      login: async function (email: string, password: string) {
         return login(email, password)
            .then((res) => {
               setUser(res);
               return res;
            })
            .catch((err) => {
               console.error(err);
               setUser(null);
               return null;
            });
      },
      register: async function (email: string, password: string, fullName: string) {
         return register(email, password, fullName)
            .then((res) => {
               setUser(res);
               return res;
            })
            .catch((err) => {
               console.error(err);
               setUser(null);
               return null;
            });
      },
      logout: async function () {
         return logout()
            .then((res) => {
               if (res) {
                  setUser(null);
               }

               return res;
            })
            .catch((err) => {
               console.error(err);
               return false;
            });
      },
      getSession: async function () {
         return getSession()
            .then((res) => {
               setUser(res);
               return res;
            })
            .catch((err) => {
               console.error(err);
               setUser(null);
               return null;
            });
      },
      user: user,
      setUser: setUser,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function Providers({ children }) {
   return <AuthProvider>{children}</AuthProvider>;
}
