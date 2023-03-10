import { useState, useEffect, useRef } from "react";

// props for the ScrollFade component
interface ScrollFadeProps {
   children: React.ReactNode;
   maxHeight?: number;
}

// fade effect for scrollable lists
export const ScrollFade = ({ children, maxHeight }: ScrollFadeProps) => {
   // for if a bottom fade should be shown
   const [showBottomFade, setShowBottomFade] = useState(true);
   // for the height of the scrollable container
   const [containerHeight, setContainerHeight] = useState(0);
   // useRef hook to store the current scroll position
   const scrollPositionRef = useRef(0);

   // if the children of the scrollable container change, reset the fade effects
   useEffect(() => {
      // if the list is too long (needs a scroll), show the fade effect
      if (containerHeight > maxHeight) {
         setShowBottomFade(true);
      }
   }, [containerHeight, maxHeight]);

   // is called when the scroll bar is scrolled
   const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, clientHeight, scrollHeight } = e.target as HTMLDivElement;

      // store the current scroll position in the ref
      scrollPositionRef.current = scrollTop;

      // if the scroll bar is at the top of the list, show only the bottom fade effect
      if (scrollTop === 0) {
         setShowBottomFade(true);
      } else {
         // if the scroll bar reaches the bottom of the list get rid of the bottom fade effect
         if (scrollTop + clientHeight === scrollHeight) {
            setShowBottomFade(false);
            // if the scroll bar is not at the top or bottom of the list, show both top and bottom fades
         } else {
            setShowBottomFade(true);
         }
      }
   };

   return (
      <div>
         {/* scrollable container */}
         <div
            ref={(ref) => setContainerHeight(ref?.offsetHeight || 0)}
            className={`overflow-y-scroll no-scrollbar overflow-x-hidden list-container`}
            // style={{ maxHeight }}
            onScroll={handleScroll}
         >
            {children}
         </div>
         {/* if the list is too long (needs a scroll), show the fade effect */}
         {containerHeight > maxHeight && (
            <>
               {/* only show bottom fade if not at the bottom of list */}
               {showBottomFade && (
                  <>
                     {/* fade effect for bottom elements in the list */}
                     <div className="absolute bottom-0 w-full pointer-events-none after:absolute after:bottom-0 after: after:w-full after:h-4 after:pointer-events-none after:content-'' after:bg-gradient-to-t from-white to-transparent"></div>
                  </>
               )}
            </>
         )}
      </div>
   );
};
