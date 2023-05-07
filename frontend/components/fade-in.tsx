import { useState, useEffect } from "react";

function FadeIn({ children }) {
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
   }, []);

   return <div className={`transition-opacity duration-500 ${isMounted ? "opacity-100" : "opacity-0"}`}>{children}</div>;
}

export default FadeIn;
