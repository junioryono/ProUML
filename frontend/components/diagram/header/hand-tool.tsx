"use client";

import type X6Type from "@antv/x6";
import { MutableRefObject, Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

export function HandTool({
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
            panning ? "bg-[#0d99ff]" : "hover:bg-[#111111]",
         )}
         onClick={() => {
            console.log("graph", graph.current);
            graph.current?.enablePanning();
            graph.current?.disableRubberband();
            setPanning(true);
         }}
      >
         <svg aria-label="Hand tool" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
               className="fill-white"
               d="M2.026 12.382c-.518-.487-.57-1.308-.118-1.856.435-.527 1.191-.62 1.74-.216l1.347.996 1 .739V4c0-.552.448-1 1-1 .553 0 1 .448 1 1v5h1V2c0-.552.448-1 1-1 .553 0 1 .448 1 1v7h1V3c0-.552.448-1 1-1 .553 0 1 .448 1 1v6h1V6c0-.552.448-1 1-1 .553 0 1 .448 1 1v8c0 2.762-2.238 5-5 5h-1c-1.553 0-2.94-.708-3.858-1.82-.036-.028-.071-.06-.106-.092l-5.005-4.706zm4.4 5.507l-.08-.072-5.005-4.706c-.902-.848-.993-2.267-.204-3.221.772-.936 2.127-1.106 3.105-.384l.753.557V4c0-1.104.896-2 2-2 .365 0 .706.097 1 .268V2c0-1.105.896-2 2-2 .873 0 1.615.559 1.888 1.338.318-.214.7-.338 1.112-.338 1.105 0 2 .895 2 2v1.268c.295-.17.636-.268 1-.268 1.105 0 2 .896 2 2v8c0 3.314-2.686 6-6 6h-1c-1.83 0-3.47-.821-4.57-2.111z"
               fillRule="evenodd"
               fillOpacity="1"
               fill="#fff"
               stroke="none"
            />
         </svg>
      </div>
   );
}
