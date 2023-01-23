"use client";

import type X6Type from "@antv/x6";
import { MutableRefObject, Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

export function Selector({
   graph,
   panning,
   setPanning,
}: {
   graph: MutableRefObject<X6Type.Graph>;
   panning: boolean;
   setPanning: Dispatch<SetStateAction<boolean>>;
}) {
   return (
      <div
         className={cn(
            "w-10 h-full px-2 text-xs flex justify-center items-center gap-1",
            !panning ? "bg-[#0d99ff]" : "hover:bg-[#111111]",
         )}
         onClick={() => {
            console.log("graph", graph.current);
            graph.current?.disablePanning();
            graph.current?.enableRubberband();
            setPanning(false);
         }}
      >
         <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path
               className="fill-white"
               d="M14.872 8.859L3.646 2.072l-.98-.592.231 1.121 2.683 13 .243 1.178.664-1.003 3.038-4.59 5.22-1.417 1.127-.306-1-.604zM4.108 3.52l9.247 5.59-4.274 1.16-.182.05-.104.156-2.479 3.746L4.108 3.52z"
               fillRule="nonzero"
               fillOpacity="1"
               fill="#000"
               stroke="none"
            />
         </svg>
      </div>
   );
}
