"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Diagram } from "types";
import { fetchAPI } from "@/lib/utils";
import { UserAccountNav } from "@/components/dashboard/user-account-nav";

import type X6Type from "@antv/x6";
import type X6PluginScrollerType from "@antv/x6-plugin-scroller";
import { ShareButton } from "./share-button";
import { ZoomButton } from "./zoom-button";

type X6StateType = {
   Core: typeof X6Type;
   Plugin: {
      Scroller: typeof X6PluginScrollerType;
   };
};

export function DiagramLayout({ diagram }: { diagram: Diagram }) {
   // Core
   const [X6, setX6] = useState<X6StateType>(null);
   const container = useRef<HTMLDivElement>(null);
   const graph = useRef<X6Type.Graph>();

   // Extras
   const [zoom, setZoom] = useState(1);

   // Import AntV client side
   useEffect(() => {
      let isUnmounted = false;

      (async () => {
         const X6Instance = await import("@antv/x6");
         const X6PluginScrollerInstance = await import("@antv/x6-plugin-scroller");
         if (!isUnmounted) {
            setX6({
               Core: X6Instance,
               Plugin: {
                  Scroller: X6PluginScrollerInstance,
               },
            });
         }
      })();

      return () => {
         isUnmounted = true;
         setX6(null);
      };
   }, []);

   const refContainer = useCallback((containerParam: HTMLDivElement) => {
      container.current = containerParam;
   }, []);

   useEffect(() => {
      if (!diagram || !container.current || !X6 || !X6.Plugin || !X6.Plugin.Scroller) {
         return;
      }

      const graphWidth = window.innerWidth;
      const graphHeight = window.innerHeight - 48;

      graph.current = new X6.Core.Graph({
         container: container.current,
         width: graphWidth,
         height: graphHeight,
         background: {
            color: "#e5e5e5",
         },
      });

      graph.current.use(
         new X6.Plugin.Scroller.Scroller({
            enabled: true,
            className: "no-scrollbar",
         }),
      );

      graph.current.addNode({
         x: 40,
         y: 40,
         width: 80,
         height: 40,
         label: "Hello",
         attrs: {
            body: {
               fill: "#31d0c6",
               stroke: "#4b4a67",
            },
            label: {
               fill: "#fff",
               fontSize: 14,
               fontWeight: "bold",
            },
         },
      });

      // graph.current.fromJSON(diagram.content);

      graph.current.on("resize", () => setZoom(graph.current.zoom()));

      const handleResize = () => graph.current.size.resize(graphWidth, graphHeight);
      window.addEventListener("resize", handleResize);

      return () => {
         window.removeEventListener("resize", handleResize);
      };
   }, [diagram, container, X6]);

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
               <UserAccountNav className="w-6 h-6" />
               <ShareButton diagram={diagram} />
               <ZoomButton graph={graph.current} zoom={zoom} />
            </div>
         </div>
         <div ref={refContainer} />
      </div>
   );
}
