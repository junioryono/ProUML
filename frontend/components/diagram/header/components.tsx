import type X6Type from "@antv/x6";
import { MutableRefObject } from "react";

export default function Components({ graph }: { graph: MutableRefObject<X6Type.Graph> }) {
   return (
      <div
         className="w-10 h-full px-2 text-xs flex justify-center items-center gap-1 hover:bg-diagram-menu-item-hovered"
         onClick={() => {
            console.log("graph", graph.current);
         }}
      >
         <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path
               className="fill-white"
               d="M6 1H3v3h3V1zM2 0v5h5V0H2zm2.5 9.379L2.379 11.5 4.5 13.621 6.621 11.5 4.5 9.379zM.964 11.5L4.5 15.036 8.036 11.5 4.5 7.964.964 11.5zM15 10h-3v3h3v-3zm-4-1v5h5V9h-5zm3-9h-1v2h-2v1h2v2h1V3h2V2h-2V0z"
               fillRule="evenodd"
               fillOpacity="1"
               fill="#fff"
               stroke="none"
            />
         </svg>
      </div>
   );
}
