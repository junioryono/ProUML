import "server-only";

import { headers } from "next/headers";
import {
   login as fetchLogin,
   register as fetchRegister,
   logout as fetchLogout,
   getSession as fetchSession,
   getDiagrams as fetchDiagrams,
   getDiagram as fetchDiagram,
   createDiagram as newDiagram,
} from "./auth-fetch";

function requestHeaders(): RequestInit {
   return {
      headers: {
         cookie: headers().get("cookie"),
      },
   };
}

export async function login(email: string, password: string) {
   return fetchLogin(email, password, requestHeaders());
}

export async function register(email: string, password: string, fullName: string) {
   return fetchRegister(email, password, fullName, requestHeaders());
}

export async function logout() {
   return fetchLogout(requestHeaders());
}

export async function getSession() {
   return fetchSession(requestHeaders());
}

export async function getDiagrams() {
   return fetchDiagrams(requestHeaders());
}

export async function getDiagram(diagramId: string) {
   return fetchDiagram(diagramId, requestHeaders());
}
