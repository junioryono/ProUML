import { useState, useEffect } from "react";

const FadeIn = ({ children, id }) => {
   const [isVisible, setIsVisible] = useState(false);
   const [isLoaded, setIsLoaded] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         const currentScrollPos = window.pageYOffset + 800;
         const maxScrollPos = document.body.scrollHeight - window.innerHeight;
         const scrollPercentage = (currentScrollPos / maxScrollPos) * 100;

         const element = document.getElementById(id);
         if (element) {
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            const elementBottom = elementTop + elementHeight;

            if (currentScrollPos > elementTop && currentScrollPos < elementBottom && !isLoaded) {
               setIsVisible(true);
               setIsLoaded(true);
            } else {
               setIsVisible(false);
            }
         }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
         window.removeEventListener("scroll", handleScroll);
      };
   }, [id, isLoaded]);

   return (
      <div
         id={id}
         className={`transition-opacity duration-1000 ${
            isLoaded ? (isVisible ? "opacity-100" : "opacity-100") : "opacity-0"
         }`}
      >
         {children}
      </div>
   );
};

export default FadeIn;
