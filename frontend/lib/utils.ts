import { twMerge } from "tailwind-merge";
import { ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function formatDate(input: string | number, sameDayPrefix?: string): string {
   const date = new Date(input);

   // If the date is within the last 24 hours, return either hours or minutes
   if (new Date().getTime() - date.getTime() < 86400000) {
      const hours = Math.floor((new Date().getTime() - date.getTime()) / 3600000);
      const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);

      if (hours > 0) {
         if (sameDayPrefix) {
            return `${sameDayPrefix} ${hours} hour${hours > 1 ? "s" : ""} ago`;
         }

         return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      }

      if (minutes > 0) {
         if (sameDayPrefix) {
            return `${sameDayPrefix} ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
         }

         return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      }

      return "Just now";
   }

   return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
   });
}

export function formatTime(input: string | number): string {
   const date = new Date(input);
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, "0");
   const day = String(date.getDate()).padStart(2, "0");
   return `${month}/${day}/${year}`;
}

export function absoluteUrl(path: string) {
   return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function getWSUrl() {
   if (process.env.NODE_ENV === "production") {
      return "wss://api.prouml.com/ws";
   }

   return "ws://127.0.0.1:5001/ws";
}

// Make function to call API routes at api.prouml.com/...
export function fetchAPI(path: string, options?: RequestInit) {
   if (process.env.NODE_ENV === "production") {
      return fetch(`https://api.prouml.com${path}`, { ...options, credentials: "include" });
   }

   return fetch(`http://127.0.0.1:5001${path}`, { ...options, credentials: "include" });
}
