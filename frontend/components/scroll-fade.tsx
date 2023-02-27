import { useState } from "react";

// props for the ScrollFade component
interface ScrollFadeProps {
   children: React.ReactNode;
   maxHeight?: number;
}

// fade effect for scrollable lists
export const ScrollFade = ({ children, maxHeight }: ScrollFadeProps) => {
   // for if a top fade should be shown
   const [showTopFade, setShowTopFade] = useState(false);
   // for if a bottom fade should be shown
   const [showBottomFade, setShowBottomFade] = useState(true);
   // for the height of the scrollable container
   const [containerHeight, setContainerHeight] = useState(0);

   // for the scrollable container
   const handleContainerRef = (ref) => {
      if (ref) {
         setContainerHeight(ref.offsetHeight); // Get the height of the container
      }
   };

   // is called when the scroll bar is scrolled
   const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, clientHeight, scrollHeight } = e.target as HTMLDivElement;

      // if the scroll bar is at the top of the list, show only the bottom fade effect
      if (scrollTop === 0) {
         setShowBottomFade(true);
         setShowTopFade(false);
      } else {
         // if the scroll bar reaches the bottom of the list get rid of the bottom fade effect
         if (scrollTop + clientHeight === scrollHeight) {
            setShowBottomFade(false);
            setShowTopFade(true);
            // if the scroll bar is not at the top or bottom of the list, show both top and bottom fades
         } else {
            setShowTopFade(true);
            setShowBottomFade(true);
         }
      }
   };

   return (
      <div>
         {/* scrollable container */}
         <div
            ref={handleContainerRef}
            className={`overflow-y-scroll no-scrollbar overflow-x-hidden list-container`}
            onScroll={handleScroll}
         >
            {children}
         </div>
         {/* if the list is too long (needs a scroll), show the fade effect */}
         {containerHeight > maxHeight && (
            <>
               {/* only show top fade if not at the top of list */}
               {showTopFade && (
                  <>
                     {/* fade effect for top elements in the list */}
                     <div className="absolute top-0 w-full h-6 pointer-events-none after:absolute after:top-0 after:w-full after:h-8 after:pointer-events-none after:content-'' after:bg-gradient-to-b from-white to-transparent"></div>
                  </>
               )}
               {/* only show bottom fade if not at the bottom of list */}
               {showBottomFade && (
                  <>
                     {/* fade effect for bottom elements in the list */}
                     <div className="absolute bottom-0 w-full h-6 pointer-events-none after:absolute after:bottom-0 after: after:w-full after:h-8 after:pointer-events-none after:content-'' after:bg-gradient-to-t from-white to-transparent"></div>
                  </>
               )}
            </>
         )}
      </div>
   );
};
