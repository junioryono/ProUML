import { useState, useEffect } from "react";

function FadeIn({ fadeDelay, children }) {
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
   }, []);

   return (
      <div className={`transition-opacity duration-${fadeDelay} ${isMounted ? "opacity-100" : "opacity-0"}`}>{children}</div>
   );
}

export default FadeIn;
