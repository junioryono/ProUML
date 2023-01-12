"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OAuthSuccess() {
   const router = useRouter();

   useEffect(() => {
      if (window.top === window.self) {
         router.push("/login");
      }

      // Send parent window a message
      window.parent.postMessage(
         {
            type: "oauth",
            payload: "failure",
         },
         "*",
      );
      window.close();
   }, []);

   return null;
}
