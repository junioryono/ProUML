import { Diagram, User, APIResponse } from "types";
import { fetchAPI } from "./utils";

const defaultError: APIResponse<any> = {
   success: false,
   reason: "Failed to fetch.",
};

export async function login(email: string, password: string, options?: RequestInit): Promise<APIResponse<User>> {
   const form = new FormData();
   form.append("email", email);
   form.append("password", password);

   return fetchAPI("/auth/login", {
      ...options,
      method: "POST",
      body: form,
   })
      .then((res) => res.json())
      .catch(() => defaultError);
}

export async function register(
   email: string,
   password: string,
   fullName: string,
   options?: RequestInit,
): Promise<APIResponse<User>> {
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
      .catch(() => defaultError);
}

export async function logout(options?: RequestInit): Promise<APIResponse<undefined>> {
   return fetchAPI("/auth/logout", {
      ...options,
      method: "POST",
   })
      .then((res) => res.json())
      .catch(() => defaultError);
}

export async function getSession(options?: RequestInit): Promise<APIResponse<User>> {
   return fetchAPI("/auth/session", {
      ...options,
   })
      .then((res) => res.json())
      .catch(() => defaultError);
}

export async function getDiagrams(options?: RequestInit): Promise<APIResponse<Diagram[]>> {
   return fetchAPI("/diagrams", {
      ...options,
   })
      .then((res) => res.json())
      .catch(() => defaultError);
}

export async function getDiagram(diagramId: string, options?: RequestInit): Promise<APIResponse<Diagram>> {
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
      .catch(() => defaultError);
}

export async function createDiagram(form: FormData, options?: RequestInit): Promise<APIResponse<string>> {
   return fetchAPI("/diagram", {
      ...options,
      method: "POST",
      body: form,
   })
      .then((res) => res.json())
      .catch(() => defaultError);
}

export async function deleteDiagram(diagramId: string, options?: RequestInit): Promise<APIResponse<null>> {
   return fetchAPI(
      "/diagram?" +
         new URLSearchParams({
            id: diagramId,
         }),
      {
         ...options,
         method: "DELETE",
      },
   )
      .then((res) => res.json())
      .catch(() => defaultError);
}

export async function updateDiagram(
   diagramId: string,
   data: { [key: string]: any },
   options?: RequestInit,
): Promise<APIResponse<null>> {
   return fetchAPI(
      "/diagram?" +
         new URLSearchParams({
            id: diagramId,
         }),
      {
         ...options,
         method: "PUT",
         body: JSON.stringify(data),
         headers: {
            "Content-Type": "application/json",
         },
      },
   )
      .then((res) => res.json())
      .catch(() => defaultError);
}
