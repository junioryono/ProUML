import "server-only";

import {
   login as fetchLogin,
   register as fetchRegister,
   logout as fetchLogout,
   getSession as fetchSession,
   getDiagrams as fetchDiagrams,
   getDiagram as fetchDiagram,
   createDiagram as newDiagram,
} from "./auth-fetch";

import { Diagram, User } from "types";
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

export async function getDiagrams(): Promise<Diagram[]> {
   return fetchDiagrams(requestHeaders()).catch((err) => {
      console.error(err);
      return null;
   });
}

export async function getDiagram(diagramId: string): Promise<Diagram> {
   return fetchDiagram(diagramId, requestHeaders()).catch((err) => {
      console.error(err);
      return null;
   });
}
