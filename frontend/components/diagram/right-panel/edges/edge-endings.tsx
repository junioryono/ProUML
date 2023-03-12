interface ArrowProps {
   direction: "left" | "right";
}

// svg source: https://www.svgrepo.com/svg/500330/arrow-right
export function OpenArrow({ direction }: ArrowProps) {
   return (
      <>
         {direction === "left" ? (
            <svg fill="#000000" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, 1, 0, 0)">
               <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
               <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
               <g id="SVGRepo_iconCarrier">
                  <path d="M14.85 6.69 7.14 1.55l-.7 1 7.12 4.75H.5v1.28h12.76l-6.83 4.86.72 1L14.85 9a1.42 1.42 0 0 0 .65-1.15 1.4 1.4 0 0 0-.65-1.16z"></path>
               </g>
            </svg>
         ) : (
            <svg fill="#000000" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
               <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
               <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
               <g id="SVGRepo_iconCarrier">
                  <path d="M14.85 6.69 7.14 1.55l-.7 1 7.12 4.75H.5v1.28h12.76l-6.83 4.86.72 1L14.85 9a1.42 1.42 0 0 0 .65-1.15 1.4 1.4 0 0 0-.65-1.16z"></path>
               </g>
            </svg>
         )}
      </>
   );
}

// svg source: https://www.svgrepo.com/svg/36997/triangular-arrow-facing-left
export function SolidArrow({ direction }: ArrowProps) {
   return (
      <>
         {direction === "left" ? (
            <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53.76 53.76">
               <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
               <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
               <g id="SVGRepo_iconCarrier">
                  <g>
                     <g>
                        <path d="M44.574,53.76L9.186,26.88L44.574,0V53.76z M13.044,26.88l29.194,22.172V4.709L13.044,26.88z"></path>{" "}
                     </g>
                  </g>
               </g>
            </svg>
         ) : (
            <svg
               fill="#000000"
               version="1.1"
               id="Capa_1"
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 53.76 53.76"
               transform="matrix(-1, 0, 0, 1, 0, 0)"
            >
               <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
               <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
               <g id="SVGRepo_iconCarrier">
                  <g>
                     <g>
                        <path d="M44.574,53.76L9.186,26.88L44.574,0V53.76z M13.044,26.88l29.194,22.172V4.709L13.044,26.88z"></path>{" "}
                     </g>
                  </g>
               </g>
            </svg>
         )}
      </>
   );
}

// svg source: https://www.svgrepo.com/svg/392323/diamond-figure-form-geometry-graphic-line
export function OpenDiamond() {
   return (
      <svg
         viewBox="0 0 20 20"
         version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         fill="#000000"
         transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
      >
         <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
         <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
         <g id="SVGRepo_iconCarrier">
            <g id="layer1">
               <path d="M 10 0.099609375 L 0.099609375 10 L 10 19.900391 L 19.900391 10 L 10 0.099609375 z M 10 1.515625 L 18.484375 10 L 10 18.484375 L 1.515625 10 L 10 1.515625 z "></path>
            </g>
         </g>
      </svg>
   );
}

// svg source: https://www.svgrepo.com/svg/403749/large-orange-diamond
export function SolidDiamond() {
   return (
      <svg
         viewBox="0 0 64 64"
         xmlns="http://www.w3.org/2000/svg"
         aria-hidden="true"
         role="img"
         className="iconify iconify--emojione-monotone"
         preserveAspectRatio="xMidYMid meet"
         fill="#000000"
      >
         <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
         <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
         <g id="SVGRepo_iconCarrier">
            <path d="M2 32L32 2l29.999 30l-30 30z" fill="#000000"></path>
         </g>
      </svg>
   );
}
