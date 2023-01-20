"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Diagram } from "types";
import { fetchAPI, getWSUrl } from "@/lib/utils";
import { UserAccountNav } from "@/components/dashboard/user-account-nav";

import type X6Type from "@antv/x6";
import type X6PluginScrollerType from "@antv/x6-plugin-scroller";
import type Transform from "@antv/x6-plugin-transform";
import { ShareButton } from "./share-button";
import { ZoomButton } from "./zoom-button";
import useWebSocket, { ReadyState } from "react-use-websocket";

type X6StateType = {
   Core: typeof X6Type;
   Plugin: {
      Scroller: typeof X6PluginScrollerType;
      Transform: typeof Transform;
   };
   Shape: {
      Class: any;
   };
};

export function DiagramLayout({ diagram }: { diagram: Diagram }) {
   // Core
   const [X6, setX6] = useState<X6StateType>();
   const container = useRef<HTMLDivElement>();
   const graph = useRef<X6Type.Graph>();
   const sessionId = useRef<string>();

   // WebSocket
   const websocket = useWebSocket(getWSUrl() + "/" + diagram.id, {
      onMessage: (event) => {
         const message = JSON.parse(event.data);
         if (!message || !message.event) {
            return;
         }

         const events = message.event.split("/");
         if (events.includes("local_updateCell")) {
            const cell = message.cell;
            if (!cell) {
               return;
            }

            const cellInGraph = graph.current?.getCellById(cell.id);
            if (!cellInGraph) {
               return;
            }

            graph.current.batchUpdate(() => {
               for (const key in cell) {
                  if (key === "id") {
                     continue;
                  }

                  cellInGraph.setProp(key, cell[key], { ws: true });
               }

               if (!cell.angle) {
                  cellInGraph.setProp("angle", 0, { ws: true });
               }
            });
         } else if (events.includes("connected")) {
            console.log("connected");

            if (!message.sessionId || message.sessionId === "") {
               console.log("could not connect");
               return;
            }

            sessionId.current = message.sessionId;
         }
      },
   });

   // Extras
   const [zoom, setZoom] = useState(1);

   // Import AntV client side
   useEffect(() => {
      let isUnmounted = false;

      (async () => {
         const [X6Instance, X6PluginScrollerInstance, X6PluginTransformInstance, ShapeClass] = await Promise.all([
            await import("@antv/x6"),
            await import("@antv/x6-plugin-scroller"),
            await import("@antv/x6-plugin-transform"),
            await import("./shape-class"),
         ]);

         if (!isUnmounted) {
            setX6({
               Core: X6Instance,
               Plugin: {
                  Scroller: X6PluginScrollerInstance,
                  Transform: X6PluginTransformInstance,
               },
               Shape: {
                  Class: ShapeClass,
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
      if (!diagram || !container.current || !X6 || !X6.Plugin || !X6.Plugin.Scroller || !X6.Plugin.Transform) {
         return;
      }

      const getGraphWidth = () => window.innerWidth;
      const getGraphHeight = () => window.innerHeight - 48;

      graph.current = new X6.Core.Graph({
         container: container.current,
         width: getGraphWidth(),
         height: getGraphHeight(),
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

      graph.current.use(
         new X6.Plugin.Transform.Transform({
            resizing: {
               enabled: true,
            },
            rotating: {
               enabled: true,
            },
         }),
      );

      // const node = graph.current.addNode({
      //    x: 40,
      //    y: 40,
      //    width: 80,
      //    height: 40,
      //    label: "Hello",
      //    attrs: {
      //       body: {
      //          fill: "#31d0c6",
      //          stroke: "#4b4a67",
      //       },
      //       label: {
      //          fill: "#fff",
      //          fontSize: 14,
      //          fontWeight: "bold",
      //       },
      //    },
      // });
      // node.rotate(45);

      console.log("diagram", diagram);
      graph.current.fromJSON({ cells: diagram.content as any });

      console.log(graph.current.toJSON());

      // graph.current.on("cell:change:*", (args) => {
      //    console.log("cell:change:*", args);
      // });

      const wsLocalUpdateCell = (cell: X6Type.Cell) => {
         if (!sessionId.current) {
            return;
         }

         websocket.sendJsonMessage({
            sessionId: sessionId.current,
            event: "broadcast/local_updateCell",
            cell,
         } as any);
      };

      const wsDBUpdateCell = (cell: X6Type.Cell) => {
         if (!sessionId.current) {
            return;
         }

         websocket.sendJsonMessage({
            sessionId: sessionId.current,
            event: "broadcast/db_updateCell",
            cell,
         } as any);
      };

      graph.current.on("cell:change:*", (args) => {
         console.log("cell:change:*", args);
         if (args.options.ws) {
            return;
         }

         wsLocalUpdateCell(args.cell);
      });

      // const dbListeners = ["node:added", "node:removed", "node:resized", "node:moved", "node:rotated"];
      // for (const dbListener of dbListeners) {
      //    graph.current?.on(dbListener, (args: { cell: X6Type.Cell<X6Type.Cell.Properties> }) => {
      //       wsDBUpdateCell(args.cell);
      //    });
      // }

      graph.current.on("node:moved", (args) => {
         console.log("node:moved", args);
         wsDBUpdateCell(args.cell);
      });

      graph.current.on("node:resized", (args) => {
         console.log("node:resized", args);
         wsDBUpdateCell(args.cell);
      });

      graph.current.on("node:change:angle", (args) => {
         console.log("node:change:angle", args);
         wsDBUpdateCell(args.cell);
      });

      // graph.current.fromJSON(diagram.content);

      const handleResize = () => graph.current.size.resize(getGraphWidth(), getGraphHeight());
      window.addEventListener("resize", handleResize);

      return () => {
         window.removeEventListener("resize", handleResize);
      };
   }, [diagram, websocket.readyState, container, X6]);

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
               <ZoomButton graph={graph} zoom={zoom} setZoom={setZoom} />
            </div>
         </div>
         {websocket.readyState === ReadyState.OPEN ? <div ref={refContainer} /> : <div>LOADING...</div>}
      </div>
   );
}
