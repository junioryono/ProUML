import "server-only";

import {
   getSession as fetchSession,
   login as fetchLogin,
   logout as fetchLogout,
   register as fetchRegister,
} from "./auth-fetch";

import { User } from "types";
import { headers } from "next/headers";

function requestHeaders(): RequestInit {
   return {
      headers: {
         cookie: headers().get("cookie"),
      },
   };
}

export async function login(email: string, password: string): Promise<User> {
   return fetchLogin(email, password, requestHeaders()).catch((err) => {
      console.error(err);
      return null;
   });
}

export async function register(email: string, password: string, fullName: string): Promise<User> {
   return fetchRegister(email, password, fullName, requestHeaders()).catch((err) => {
      console.error(err);
      return null;
   });
}

export async function logout(): Promise<boolean> {
   return fetchLogout(requestHeaders()).catch((err) => {
      console.error(err);
      return null;
   });
}

export async function getSession(): Promise<User> {
   return fetchSession(requestHeaders()).catch((err) => {
      console.error(err);
      return null;
   });
}
