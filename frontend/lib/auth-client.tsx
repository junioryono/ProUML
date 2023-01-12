"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { APIResponse, User } from "types";
import { getSession, login, logout, register } from "./auth-fetch";

interface AuthContextInterface {
   login(email: string, password: string): Promise<APIResponse<User>>;
   register(email: string, password: string, fullName: string): Promise<APIResponse<User>>;
   logout(): Promise<APIResponse<boolean>>;
   getSession(): Promise<APIResponse<User>>;
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
               if (res.success === false) {
                  throw new Error(res.reason);
               }

               setUser(res.response);
               return res.response;
            })
            .catch((err) => {
               console.error(err);
               setUser(null);
               return err;
            });
      },
      register: async function (email: string, password: string, fullName: string) {
         return register(email, password, fullName)
            .then((res) => {
               if (res.success === false) {
                  throw new Error(res.reason);
               }

               setUser(res.response);
               return res.response;
            })
            .catch((err) => {
               console.error(err);
               setUser(null);
               return err;
            });
      },
      logout: async function () {
         return logout()
            .then((res) => {
               if (res.success === false) {
                  throw new Error(res.reason);
               }

               setUser(null);
               return res.success;
            })
            .catch((err) => {
               console.error(err);
               return err;
            });
      },
      getSession: async function () {
         return getSession()
            .then((res) => {
               if (res.success === false) {
                  throw new Error(res.reason);
               }

               setUser(res.response);
               return res.response;
            })
            .catch((err) => {
               console.error(err);
               setUser(null);
               return err;
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
