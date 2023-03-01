import type X6Type from "@antv/x6";
import {
   wsLocalAndDBAddNode,
   wsLocalAndDBAddEdge,
   wsLocalAndDBRemoveCell,
   wsLocalAndDBUpdateNode,
   wsLocalAndDBUpdateEdge,
   wsLocalUpdateNode,
   wsLocalUpdateEdge,
} from "@/components/diagram/x6/graph/websocket";
import { JsonValue, WebSocketHook } from "react-use-websocket/dist/lib/types";
import { LayoutProps } from "@/components/diagram/layout";
import { MutableRefObject } from "react";
import { showPorts, hidePorts, addPorts, updatePorts, hideAllPorts, showAllPorts } from "../shapes/ports";

export default function Cells(
   graph: MutableRefObject<X6Type.Graph>,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
   layoutProps: LayoutProps,
) {
   graph.current?.on("node:mouseenter", (args) => {
      console.log("node:mouseenter", args);
      if (!graph.current?.isSelected(args.node)) {
         showPorts(args.node);
      }
   });

   graph.current?.on("node:mouseleave", (args) => {
      console.log("node:mouseleave", args);
      hideAllPorts(graph.current);
   });

   graph.current?.on("node:selected", (args) => {
      console.log("node:selected", args);
      hidePorts(args.node);
   });

   graph.current?.on("edge:connected", (args) => {
      console.log("edge:connected", args.edge);
      wsLocalAndDBUpdateEdge(args.edge, websocket, sessionId);
   });

   graph.current?.on("edge:change:source", (args) => {
      if ((args.previous as any).ws) {
         return;
      }

      wsLocalUpdateEdge(args.cell, websocket, sessionId);
   });

   graph.current?.on("edge:change:target", (args) => {
      console.log("edge:change:target", args);
      if ((args.previous as any).ws) {
         return;
      }

      wsLocalUpdateEdge(args.cell, websocket, sessionId);
   });

   graph.current?.on("cell:removed", (args) => {
      console.log("cell:removed", args);
      if (args.options.ws) {
         return;
      }

      if (args.cell.isEdge()) {
         hideAllPorts(graph.current);
      }

      wsLocalAndDBRemoveCell(args.cell, websocket, sessionId);
   });

   graph.current?.on("node:added", (args) => {
      if (args.options.ws) {
         return;
      }

      addPorts(args.cell as X6Type.Node);
      wsLocalAndDBAddNode(args.cell, websocket, sessionId);
   });

   graph.current?.on("edge:added", (args) => {
      if (args.options.ws) {
         return;
      }

      const edge = args.cell as X6Type.Edge;
      wsLocalAndDBAddEdge(edge, websocket, sessionId);

      const sourceCell = edge.getSourceCell();
      const targetCell = edge.getTargetCell();
      if (!sourceCell || !targetCell) {
         graph.current?.cleanSelection();
         showAllPorts(graph.current);
      }
   });

   graph.current?.on("node:change:data", (args) => {
      if (args.options.ws) {
         return;
      }

      wsLocalAndDBUpdateNode(args.cell, websocket, sessionId);
   });

   graph.current?.on("node:move", (args) => {
      graph.current?.cleanSelection();
      graph.current?.select(args.cell);
   });

   graph.current?.on("node:moving", () => {
      graph.current?.getSelectedCells().forEach((cell) => {
         if (cell.isNode()) {
            wsLocalUpdateNode(cell, websocket, sessionId);
         }
      });
   });

   graph.current?.on("node:moved", (args) => {
      console.log("node:moved", args);
      wsLocalAndDBUpdateNode(args.cell, websocket, sessionId);
   });

   graph.current?.on("node:change:position", (args) => {
      if (args.options.ws) {
         return;
      }

      console.log("node:change:position", args);
      wsLocalUpdateNode(args.cell, websocket, sessionId);
   });

   graph.current?.on("node:change:size", (args) => {
      if (args.options.ws) {
         return;
      }

      wsLocalAndDBUpdateNode(args.cell, websocket, sessionId);
   });

   graph.current?.on("node:change:angle", (args) => {
      if (args.options.ws) {
         return;
      }

      console.log("node:change:angle", args);
      wsLocalAndDBUpdateNode(args.cell, websocket, sessionId);
   });

   return () => {
      graph.current?.off("cell:change:*");
      graph.current?.off("cell:removed");
      graph.current?.off("cell:added");
      graph.current?.off("node:moved");
      graph.current?.off("node:resized");
      graph.current?.off("node:change:angle");

      // From other components
      graph.current?.off("node:added");
      graph.current?.off("node:removed");
      graph.current?.off("edge:added");
      graph.current?.off("edge:removed");
      graph.current?.off("node:selected");
      graph.current?.off("node:unselected");
      graph.current?.off("cell:selected");
      graph.current?.off("cell:unselected");
   };
}
