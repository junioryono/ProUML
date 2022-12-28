import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

// Make function to call API routes at api.prouml.com/...
export function fetchAPI(path: string, options?: RequestInit) {
  if (process.env.NODE_ENV === "production") {
    return fetch(`https://api.prouml.com${path}`, { ...options, credentials: "include" });
  }

  const route = `http://localhost:5000${path}`;
  console.log("route", route);

  return fetch(route, { ...options, credentials: "include" });
}
