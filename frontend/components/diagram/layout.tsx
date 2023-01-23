"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { UserAccountNav } from "@/components/dashboard/user-account-nav";
import { ReadyState } from "react-use-websocket";
import { Diagram } from "types";

import { useX6 } from "@/components/diagram/x6";
import { Menu } from "@/components/diagram/header/menu";
import { ZoomButton } from "@/components/diagram/header/zoom-button";
import { ShareButton } from "@/components/diagram/header/share-button";
import { Selector } from "@/components/diagram/header/selector";
import { Components } from "@/components/diagram/header/components";
import { HandTool } from "@/components/diagram/header/hand-tool";
import { AddComment } from "@/components/diagram/header/add-comment";

export type LayoutProps = {
   setZoom: Dispatch<SetStateAction<number>>;
};

export function DiagramLayout({ diagram }: { diagram: Diagram }) {
   // States
   const [zoom, setZoom] = useState(1);
   const [panning, setPanning] = useState(false);

   // Core
   const container = useRef<HTMLDivElement>();
   const { graph, websocket, sessionId, ready } = useX6(container, diagram, {
      setZoom,
   });

   const refContainer = useCallback((containerParam: HTMLDivElement) => {
      container.current = containerParam;
   }, []);

   return (
      <div className="flex flex-col">
         <div className="flex justify-between items-center h-12 bg-neutral-800 text-white">
            <div className="flex h-full items-center">
               <Menu graph={graph} />
               <Selector graph={graph} panning={panning} setPanning={setPanning} />
               <HandTool graph={graph} panning={panning} setPanning={setPanning} />
               <Components graph={graph} />
               <AddComment graph={graph} />
            </div>
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
