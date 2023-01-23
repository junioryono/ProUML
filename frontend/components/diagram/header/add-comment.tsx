"use client";

import type X6Type from "@antv/x6";
import { MutableRefObject } from "react";

export function AddComment({ graph }: { graph: MutableRefObject<X6Type.Graph> }) {
   return (
      <div
         className="w-10 h-full px-2 text-xs flex justify-center items-center gap-1 hover:bg-[#111111]"
         onClick={() => {
            console.log("graph", graph.current);
         }}
      >
         <svg aria-label="Add comment" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
               className="fill-white"
               d="M1.944 16.75l1.696-2.758.287-.465-.237-.493c-.465-.951-.697-1.91-.69-3.034 0-3.866 3.134-7 7-7 3.866 0 7 3.134 7 7 0 3.866-3.134 7-7 7-1.14.007-2.112-.232-3.074-.709l-.268-.131-.296.037-4.418.552zm4.543.44c1.06.518 2.253.81 3.513.81 4.418 0 8-3.582 8-8 0-4.418-3.582-8-8-8-4.418 0-8 3.582-8 8 0 1.243.283 2.419.789 3.468l-2.117 3.44L0 18l1.272-.159 5.215-.652z"
               fillRule="nonzero"
               fillOpacity="1"
               fill="#000"
               stroke="none"
            />
         </svg>
      </div>
   );
}
