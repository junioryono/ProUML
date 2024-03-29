import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import type X6Type from "@antv/x6";
import {
   wsLocalAndDBAddEdge,
   wsLocalAndDBRemoveCell,
   wsLocalAndDBUpdateEdge,
   wsLocalUpdateEdge,
} from "@/components/diagram/x6/graph/websocket";
import { LayoutProps } from "@/components/diagram/layout";
import { MutableRefObject } from "react";
import { showPorts, hidePorts, addPorts, updatePorts, hideAllPorts, showAllPorts } from "../shapes/ports";
import type { X6StateType } from "../..";

export default function Edges(
   graph: MutableRefObject<X6Type.Graph>,
   wsSendJson: SendJsonMessage,
   sessionId: MutableRefObject<string>,
   layoutProps: LayoutProps,
   edgeFunctions: X6StateType["Shape"]["Edge"],
) {
   graph.current?.on("edge:selected", (args) => {
      // Get all vertices of the edge
      const props = args.cell.getProp();
      console.log("edge:selected", props);
      args.cell.addTools(
         [
            "vertices",
            "source-arrowhead-circle",
            "target-arrowhead-circle",
            {
               name: "button-remove",
               args: {
                  distance: -30,
               },
            },
         ],
         { ignoreHistory: true },
      );
   });

   graph.current?.on("edge:unselected", (args) => {
      args.cell.removeTool("vertices", { ignoreHistory: true });
      args.cell.removeTool("source-arrowhead-circle", { ignoreHistory: true });
      args.cell.removeTool("target-arrowhead-circle", { ignoreHistory: true });
      args.cell.removeTool("button-remove", { ignoreHistory: true });
   });

   graph.current?.on("edge:connected", (args) => {
      graph.current?.select(args.edge);
      wsLocalAndDBUpdateEdge(args.edge, wsSendJson, sessionId);
   });

   graph.current?.on("edge:change:source", (args) => {
      if ((args.previous as any)?.ws || args.options.ws) {
         return;
      }

      wsLocalUpdateEdge(args.cell, wsSendJson, sessionId);
   });

   graph.current?.on("edge:change:target", (args) => {
      console.log("edge:change:target", args.cell.prop());
      if ((args.previous as any)?.ws || args.options.ws) {
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

   graph.current?.on("edge:batch:start", (args) => {
      if (args.name === "move-arrowhead") {
         showAllPorts(graph.current);
      }
   });

   graph.current?.on("edge:batch:stop", (args) => {
      console.log("edge:batch:stop", args);
      if (args.name === "move-arrowhead") {
         hideAllPorts(graph.current);
      } else if (args.name === "add-vertex" || args.name === "move-vertex" || args.name === "update") {
         wsLocalAndDBUpdateEdge(args.cell, wsSendJson, sessionId);
      }
   });

   return () => {
      graph.current?.off("edge:connected");
      graph.current?.off("edge:change:source");
      graph.current?.off("edge:change:target");
      graph.current?.off("edge:removed");
      graph.current?.off("edge:added");
      graph.current?.off("edge:batch:start");
      graph.current?.off("edge:batch:stop");
   };
}
