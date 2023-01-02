import { Diagram, User } from "types";
import { fetchAPI } from "./utils";

export async function login(email: string, password: string, options?: RequestInit): Promise<User> {
   const form = new FormData();
   form.append("email", email);
   form.append("password", password);

   return fetchAPI("/auth/login", {
      ...options,
      method: "POST",
      body: form,
   })
      .then((res) => res.json())
      .then((res) => {
         if (res && res.success === true) {
            const user = res.response as User;
            return user;
         }

         return null;
      })
      .catch((err) => {
         console.error(err);
         return null;
      });
}

export async function register(email: string, password: string, fullName: string, options?: RequestInit): Promise<User> {
   const form = new FormData();
   form.append("email", email);
   form.append("password", password);
   form.append("fullName", fullName);

   return fetchAPI("/auth/register", {
      ...options,
      method: "POST",
      body: form,
   })
      .then((res) => res.json())
      .then((res) => {
         if (res && res.success === true) {
            const user = res.response as User;
            return user;
         }

         return null;
      })
      .catch((err) => {
         console.error(err);
         return null;
      });
}

export async function logout(options?: RequestInit): Promise<boolean> {
   return fetchAPI("/auth/logout", {
      ...options,
      method: "POST",
   })
      .then((res) => res.json())
      .then((res) => {
         if (res && res.success === true) {
            return true;
         }

         return false;
      })
      .catch((err) => {
         console.error(err);
         return false;
      });
}

export async function getSession(options?: RequestInit): Promise<User> {
   return fetchAPI("/auth/session", {
      ...options,
   })
      .then((res) => res.json())
      .then((res) => {
         if (res && res.success === true) {
            return res.response as User;
         }

         return null;
      })
      .catch((err) => {
         console.error(err);
         return null;
      });
}

export async function getDiagrams(options?: RequestInit): Promise<Diagram[]> {
   return fetchAPI("/diagrams", {
      ...options,
   })
      .then((res) => res.json())
      .then((res) => {
         if (res && res.success === true) {
            return res.response as Diagram[];
         }

         return null;
      })
      .catch((err) => {
         console.error(err);
         return null;
      });
}

export async function getDiagram(diagramId: string, options?: RequestInit): Promise<Diagram> {
   return fetchAPI(
      "/diagram?" +
         new URLSearchParams({
            id: diagramId,
         }),
      {
         ...options,
      },
   )
      .then((res) => res.json())
      .then((res) => {
         if (res && res.success === true) {
            return res.response as Diagram;
         }

         return null;
      })
      .catch((err) => {
         console.error(err);
         return null;
      });
}
