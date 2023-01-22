"use client";

import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import { UserAccountNav } from "@/components/dashboard/user-account-nav";
import { ReadyState } from "react-use-websocket";
import { ShareButton } from "@/components/diagram/share-button";
import { ZoomButton } from "@/components/diagram/zoom-button";
import { Diagram } from "types";
import { useX6 } from "@/components/diagram/x6";

export type LayoutProps = {
   setZoom: Dispatch<SetStateAction<number>>;
};

export function DiagramLayout({ diagram }: { diagram: Diagram }) {
   // States
   const [zoom, setZoom] = useState(1);

   // Core
   const container = useRef<HTMLDivElement>();
   const { graph, websocket } = useX6(container, diagram, {
      setZoom,
   });

   const refContainer = useCallback((containerParam: HTMLDivElement) => {
      container.current = containerParam;
   }, []);

   return (
      <div className="flex flex-col">
         <div className="flex justify-between items-center h-12 bg-neutral-800 text-white">
            <div>Left</div>
            <div className="basis-2/4 flex justify-center items-center gap-2">
               <h1 className="text-md">{diagram.name}</h1>
               <svg className="svg" width="8" height="7" viewBox="0 0 8 7" xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M3.646 5.354l-3-3 .708-.708L4 4.293l2.646-2.647.708.708-3 3L4 5.707l-.354-.353z"
                     fillRule="evenodd"
                     fillOpacity="1"
                     fill="#000"
                     stroke="none"
                     className="fill-white"
                  />
               </svg>
            </div>
            <div className="flex h-full items-center">
               <UserAccountNav />
               <ShareButton diagram={diagram} />
               <ZoomButton graph={graph} zoom={zoom} />
            </div>
         </div>
         {websocket.readyState === ReadyState.OPEN ? <div ref={refContainer} /> : <div>LOADING...</div>}
      </div>
   );
}
