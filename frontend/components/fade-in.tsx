import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

function FadeIn({ fadeDelay = 500, children }: { fadeDelay?: number; children: React.ReactNode }) {
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
   }, []);

   return (
      <React.Fragment>
         <div
            className={cn(
               `transition-opacity duration-${fadeDelay} ease-in-out`,
               isMounted && "opacity-100",
               !isMounted && "opacity-0",
            )}
         >
            {children}
         </div>
      </React.Fragment>
   );
}

export default FadeIn;
