"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OAuthSuccess() {
   const router = useRouter();

   useEffect(() => {
      if (window.parent === window.self) {
         router.push("/login");
      }

      // Send parent window a message
      window.parent.postMessage(
         {
            type: "oauth",
            payload: "success",
         },
         "*",
      );
      window.close();
   }, []);

   return null;
}
