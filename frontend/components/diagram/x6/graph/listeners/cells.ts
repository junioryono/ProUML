import type X6Type from "@antv/x6";
import {
   wsLocalAndDBAddNode,
   wsLocalAndDBAddEdge,
   wsLocalAndDBRemoveCell,
   wsDBUpdateCell,
   wsLocalUpdateCell,
} from "@/components/diagram/x6/graph/websocket";
import { JsonValue, WebSocketHook } from "react-use-websocket/dist/lib/types";
import { LayoutProps } from "@/components/diagram/layout";
import { MutableRefObject } from "react";

export default function Cells(
   graph: MutableRefObject<X6Type.Graph>,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
   layoutProps: LayoutProps,
) {
   // const dbListeners = ["node:added", "node:removed", "node:resized", "node:moved", "node:rotated"];
   // for (const dbListener of dbListeners) {
   //    graph.current?.on(dbListener, (args: { cell: X6Type.Cell<X6Type.Cell.Properties> }) => {
   //       wsDBUpdateCell(args.cell, websocket, sessionId);
   //    });
   // }

   graph.current?.on("node:mouseenter", (args) => {
      console.log("node:mouseenter", args);
   });

   graph.current?.on("node:mouseleave", (args) => {
      console.log("node:mouseleave", args);
   });

   graph.current?.on("cell:change:*", (args) => {
      console.log("cell:change:*", args);
      if (args.options.ws) {
         return;
      }

      wsLocalUpdateCell(args.cell, websocket, sessionId);
   });

   graph.current?.on("cell:removed", (args) => {
      console.log("cell:removed", args);
      if (args.options.ws) {
         return;
      }

      wsLocalAndDBRemoveCell(args.cell, websocket, sessionId);
   });

   graph.current?.on("cell:added", (args) => {
      console.log("node:added", args);
      if (args.options.ws) {
         return;
      }

      if (args.cell.isEdge()) {
         wsLocalAndDBAddEdge(args.cell, websocket, sessionId);
         return;
      }

      wsLocalAndDBAddNode(args.cell, websocket, sessionId);
   });

   graph.current?.on("node:moved", (args) => {
      console.log("node:moved", args);
      wsDBUpdateCell(args.cell, websocket, sessionId);
   });

   graph.current?.on("node:resized", (args) => {
      console.log("node:resized", args);
      wsDBUpdateCell(args.cell, websocket, sessionId);
   });

   graph.current?.on("node:change:angle", (args) => {
      console.log("node:change:angle", args);
      wsDBUpdateCell(args.cell, websocket, sessionId);
   });

   return () => {
      graph.current?.off("cell:change:*");
      graph.current?.off("cell:removed");
      graph.current?.off("cell:added");
      graph.current?.off("node:moved");
      graph.current?.off("node:resized");
      graph.current?.off("node:change:angle");
   };
}
