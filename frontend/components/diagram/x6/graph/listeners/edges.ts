import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
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
import { LayoutProps } from "@/components/diagram/layout";
import { MutableRefObject } from "react";
import { showPorts, hidePorts, addPorts, updatePorts, hideAllPorts, showAllPorts } from "../shapes/ports";

export default function Edges(
   graph: MutableRefObject<X6Type.Graph>,
   wsSendJson: SendJsonMessage,
   sessionId: MutableRefObject<string>,
   layoutProps: LayoutProps,
) {
   graph.current?.on("edge:connected", (args) => {
      console.log("edge:connected", args.edge);
      wsLocalAndDBUpdateEdge(args.edge, wsSendJson, sessionId);
   });

   graph.current?.on("edge:change:source", (args) => {
      if ((args.previous as any).ws) {
         return;
      }

      wsLocalUpdateEdge(args.cell, wsSendJson, sessionId);
   });

   graph.current?.on("edge:change:target", (args) => {
      console.log("edge:change:target", args);
      if ((args.previous as any).ws) {
         return;
      }

      wsLocalUpdateEdge(args.cell, wsSendJson, sessionId);
   });

   graph.current?.on("edge:removed", (args) => {
      if (args.options.ws) {
         return;
      }

      hideAllPorts(graph.current);
      wsLocalAndDBRemoveCell(args.cell, wsSendJson, sessionId);
   });

   graph.current?.on("edge:added", (args) => {
      if (args.options.ws) {
         return;
      }

      const edge = args.cell as X6Type.Edge;
      wsLocalAndDBAddEdge(edge, wsSendJson, sessionId);

      const sourceCell = edge.getSourceCell();
      const targetCell = edge.getTargetCell();
      if (!sourceCell || !targetCell) {
         graph.current?.cleanSelection();
         showAllPorts(graph.current);
      }
   });

   return () => {
      graph.current?.off("edge:connected");
      graph.current?.off("edge:change:source");
      graph.current?.off("edge:change:target");
      graph.current?.off("edge:removed");
      graph.current?.off("edge:added");
   };
}
