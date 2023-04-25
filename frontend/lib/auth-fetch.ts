import { Diagram, User, APIResponse, Project, Issue } from "types";
import { fetchAPI } from "./utils";

const defaultError: APIResponse<any> = {
   success: false,
   reason: "Failed to fetch.",
};

async function jsonResponse<T>(res: Response): Promise<APIResponse<T>> {
   const cookie = res.headers.get("set-cookie");
   const json = await res.json();

   if (cookie === null) {
      return json;
   }

   return {
      ...json,
      cookie,
   };
}

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

export async function forgotPassword(email: string, options?: RequestInit): Promise<APIResponse<undefined>> {
   const form = new FormData();
   form.append("email", email);

   return fetchAPI("/auth/forgot-password", {
      ...options,
      method: "POST",
      body: form,
   })
      .then((res) => res.json())
      .catch(() => defaultError);
}

export async function forgotPasswordVerifyToken(token: string, options?: RequestInit): Promise<APIResponse<undefined>> {
   return fetchAPI("/auth/forgot-password/verify-token?" + new URLSearchParams({ token }), {
      ...options,
      method: "GET",
   })
      .then((res) => res.json())
      .catch(() => defaultError);
}

export async function forgotPasswordReset(
   token: string,
   password: string,
   options?: RequestInit,
): Promise<APIResponse<undefined>> {
   const form = new FormData();
   form.append("password", password);

   return fetchAPI("/auth/forgot-password/reset?" + new URLSearchParams({ token }), {
      ...options,
      method: "PATCH",
      body: form,
   })
      .then((res) => res.json())
      .catch(() => defaultError);
}

export async function changePassword(
   oldPassword: string,
   newPassword: string,
   options?: RequestInit,
): Promise<APIResponse<undefined>> {
   const form = new FormData();
   form.append("oldPassword", oldPassword);
   form.append("newPassword", newPassword);

   return fetchAPI("/auth/change-password", {
      ...options,
      method: "PATCH",
      body: form,
   })
      .then((res) => res.json())
      .catch(() => defaultError);
}

export async function updateProfile(form: FormData, options?: RequestInit): Promise<APIResponse<undefined>> {
   return fetchAPI("/auth/update-profile", {
      ...options,
      method: "PATCH",
      body: form,
   })
      .then((res) => res.json())
      .catch(() => defaultError);
}

export async function verifyEmail(token: string, options?: RequestInit): Promise<APIResponse<undefined>> {
   return fetchAPI("/auth/verify-email?" + new URLSearchParams({ token }), {
      ...options,
      method: "POST",
   })
      .then((res) => jsonResponse<undefined>(res))
      .catch(() => defaultError);
}

export async function getSession(options?: RequestInit): Promise<APIResponse<User>> {
   return fetchAPI("/auth/session", {
      ...options,
   })
      .then((res) => jsonResponse<User>(res))
      .catch(() => defaultError);
}

export async function getDiagrams(options?: RequestInit): Promise<
   APIResponse<{
      projects: Project[];
      diagrams: Diagram[];
   }>
> {
   return fetchAPI("/diagrams", {
      ...options,
   })
      .then((res) =>
         jsonResponse<{
            projects: Project[];
            diagrams: Diagram[];
         }>(res),
      )
      .catch(() => defaultError);
}

export async function getSharedDiagrams(options?: RequestInit): Promise<
   APIResponse<{
      projects: Project[];
      diagrams: Diagram[];
   }>
> {
   return fetchAPI("/diagrams?shared=true", {
      ...options,
   })
      .then((res) =>
         jsonResponse<{
            projects: Project[];
            diagrams: Diagram[];
         }>(res),
      )
      .catch(() => defaultError);
}

export async function getDiagram(
   diagramId: string,
   options?: RequestInit,
): Promise<
   APIResponse<{
      diagram: Diagram;
      role: string;
   }>
> {
   return fetchAPI(
      "/diagram?" +
         new URLSearchParams({
            id: diagramId,
         }),
      {
         ...options,
      },
   )
      .then((res) =>
         jsonResponse<{
            diagram: Diagram;
            role: string;
         }>(res),
      )
      .catch(() => defaultError);
}

export async function getDiagramUsers(
   diagramId: string,
   options?: RequestInit,
): Promise<
   APIResponse<{
      users: User[];
      allowedToEdit?: boolean;
      editorPermissionsEnabled?: boolean;
   }>
> {
   return fetchAPI(
      "/diagram/users?" +
         new URLSearchParams({
            id: diagramId,
         }),
      {
         ...options,
      },
   )
      .then((res) =>
         jsonResponse<{
            users: User[];
            allowedToEdit?: boolean;
            editorPermissionsEnabled?: boolean;
         }>(res),
      )
      .catch(() => defaultError);
}

export async function addDiagramUser(
   diagramId: string,
   email: string,
   role: string,
   options?: RequestInit,
): Promise<APIResponse<undefined>> {
   return fetchAPI(
      "/diagram/users?" +
         new URLSearchParams({
            diagram_id: diagramId,
            email: email,
            role: role,
         }),
      {
         ...options,
         method: "POST",
      },
   )
      .then((res) => jsonResponse<undefined>(res))
      .catch(() => defaultError);
}

export async function updateDiagramUser(
   diagramId: string,
   userId: string,
   role: string,
   options?: RequestInit,
): Promise<APIResponse<undefined>> {
   return fetchAPI(
      "/diagram/users?" +
         new URLSearchParams({
            diagram_id: diagramId,
            user_id: userId,
            role: role,
         }),
      {
         ...options,
         method: "PUT",
      },
   )
      .then((res) => jsonResponse<undefined>(res))
      .catch(() => defaultError);
}

export async function removeDiagramUser(
   diagramId: string,
   userId: string,
   options?: RequestInit,
): Promise<APIResponse<undefined>> {
   return fetchAPI(
      "/diagram/users?" +
         new URLSearchParams({
            diagram_id: diagramId,
            user_id: userId,
         }),
      {
         ...options,
         method: "DELETE",
      },
   )
      .then((res) => jsonResponse<undefined>(res))
      .catch(() => defaultError);
}

export async function createDiagram(form: FormData, options?: RequestInit): Promise<APIResponse<string>> {
   return fetchAPI("/diagram", {
      ...options,
      method: "POST",
      body: form,
   })
      .then((res) => jsonResponse<string>(res))
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
      .then((res) => jsonResponse<null>(res))
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
      .then((res) => jsonResponse<null>(res))
      .catch(() => defaultError);
}

export async function getProjects(options?: RequestInit): Promise<APIResponse<Project[]>> {
   return fetchAPI("/projects", {
      ...options,
   })
      .then((res) => jsonResponse<Project[]>(res))
      .catch(() => defaultError);
}

export async function getProject(projectId: string, options?: RequestInit): Promise<APIResponse<Project>> {
   return fetchAPI(
      "/project?" +
         new URLSearchParams({
            id: projectId,
         }),
      {
         ...options,
      },
   )
      .then((res) => jsonResponse<Project>(res))
      .catch(() => defaultError);
}

export async function createProject(form: FormData, options?: RequestInit): Promise<APIResponse<string>> {
   return fetchAPI("/project", {
      ...options,
      method: "POST",
      body: form,
   })
      .then((res) => jsonResponse<string>(res))
      .catch(() => defaultError);
}

export async function deleteProject(projectId: string, options?: RequestInit): Promise<APIResponse<null>> {
   return fetchAPI(
      "/project?" +
         new URLSearchParams({
            id: projectId,
         }),
      {
         ...options,
         method: "DELETE",
      },
   )
      .then((res) => jsonResponse<null>(res))
      .catch(() => defaultError);
}

export async function updateProject(
   projectId: string,
   data: { [key: string]: any },
   options?: RequestInit,
): Promise<APIResponse<null>> {
   return fetchAPI(
      "/project?" +
         new URLSearchParams({
            id: projectId,
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
      .then((res) => jsonResponse<null>(res))
      .catch(() => defaultError);
}

export async function getProjectDiagrams(projectId: string, options?: RequestInit): Promise<APIResponse<Diagram[]>> {
   return fetchAPI(
      "/project/diagrams?" +
         new URLSearchParams({
            id: projectId,
         }),
      {
         ...options,
      },
   )
      .then((res) => jsonResponse<Diagram[]>(res))
      .catch(() => defaultError);
}

export async function addDiagramToProject(
   projectId: string,
   diagramId: string,
   options?: RequestInit,
): Promise<APIResponse<null>> {
   return fetchAPI(
      "/project/diagram?" +
         new URLSearchParams({
            projectId,
            diagramId,
         }),
      {
         ...options,
         method: "PUT",
      },
   )
      .then((res) => jsonResponse<null>(res))
      .catch(() => defaultError);
}

export async function removeDiagramFromProject(
   projectId: string,
   diagramId: string,
   options?: RequestInit,
): Promise<APIResponse<null>> {
   return fetchAPI(
      "/project/diagram?" +
         new URLSearchParams({
            projectId,
            diagramId,
         }),
      {
         ...options,
         method: "DELETE",
      },
   )
      .then((res) => jsonResponse<null>(res))
      .catch(() => defaultError);
}

export async function getAllIssues(options?: RequestInit): Promise<APIResponse<Issue[]>> {
   return fetchAPI("/diagrams/issues", {
      ...options,
   })
      .then((res) => jsonResponse<Issue[]>(res))
      .catch(() => defaultError);
}

export async function createIssue(
   diagramId: string,
   data: { [key: string]: any },
   options?: RequestInit,
): Promise<APIResponse<null>> {
   return fetchAPI(
      "/diagram/issues?" +
         new URLSearchParams({
            diagram_id: diagramId,
         }),
      {
         ...options,
         method: "POST",
         body: JSON.stringify(data),
         headers: {
            "Content-Type": "application/json",
         },
      },
   )
      .then((res) => jsonResponse<null>(res))
      .catch(() => defaultError);
}

export async function deleteIssue(diagramId: string, issueId: string, options?: RequestInit): Promise<APIResponse<null>> {
   return fetchAPI(
      "/diagram/issues?" +
         new URLSearchParams({
            diagram_id: diagramId,
            issue_id: issueId,
         }),
      {
         ...options,
         method: "DELETE",
      },
   )
      .then((res) => jsonResponse<null>(res))
      .catch(() => defaultError);
}
