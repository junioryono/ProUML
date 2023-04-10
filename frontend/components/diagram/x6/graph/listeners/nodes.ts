import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import type X6Type from "@antv/x6";
import {
   wsLocalAndDBAddNode,
   wsLocalAndDBRemoveCell,
   wsLocalAndDBUpdateNode,
   wsLocalUpdateNode,
   wsLocalAndDBUpdateEdge,
} from "@/components/diagram/x6/graph/websocket";
import { LayoutProps } from "@/components/diagram/layout";
import { MutableRefObject } from "react";
import { showPorts, hidePorts, addPorts, updatePorts, hideAllPorts, showAllPorts } from "../shapes/ports";
import type { X6StateType } from "../..";

export default function Nodes(
   graph: MutableRefObject<X6Type.Graph>,
   wsSendJson: SendJsonMessage,
   sessionId: MutableRefObject<string>,
   layoutProps: LayoutProps,
   edgeFunctions: X6StateType["Shape"]["Edge"],
) {
   graph.current?.on("node:mouseenter", (args) => {
      if (!graph.current?.isSelected(args.node) && !graph.current?.isPannable()) {
         showPorts(args.node);
      }
   });

   graph.current?.on("node:mouseleave", (args) => {
      hideAllPorts(graph.current);
   });

   graph.current?.on("node:selected", (args) => {
      args.node.trigger("selected", args);
      hidePorts(args.node);
   });

   graph.current?.on("node:unselected", (args) => {
      args.node.trigger("unselected", args);
   });

   graph.current?.on("node:removed", (args) => {
      if (args.options.ws) {
         return;
      }

      wsLocalAndDBRemoveCell(args.cell, wsSendJson, sessionId);
   });

   graph.current?.on("node:added", (args) => {
      if (args.options.ws) {
         return;
      }

      addPorts(args.cell as X6Type.Node);
      wsLocalAndDBAddNode(args.cell, wsSendJson, sessionId);
   });

   graph.current?.on("node:change:data", (args: any) => {
      if (args.options.ws) {
         return;
      }

      if (args.key) {
         graph.current?.model.trigger("cell:change:*", {
            key: args.key,
            cell: args.cell,
         });
      }

      // if (args.key === "type") {
      //    const incomingEdges = graph.current?.getConnectedEdges(args.cell, { incoming: true });
      //    for (const edge of incomingEdges) {
      //       graph.current?.trigger("edge:change:target", {
      //          edge,
      //          cell: args.cell,
      //          options: {
      //             ...args.options,
      //             type:
      //          },
      //       });
      //    }
      // }

      // const newType: string = args.cell.getProp("type") || "";
      // if (newType === "interface") {
      //    edgeFunctions.setRealizationEdge(edge);
      // } else if (newType === "abstract") {
      //    edgeFunctions.setGeneralizationEdge(edge);
      // } else {
      //    edgeFunctions.setRegularEdge(edge);
      // }

      wsLocalAndDBUpdateNode(args.cell, wsSendJson, sessionId);
   });

   graph.current?.on("node:change:type", (args) => {
      const incomingEdges = graph.current?.getConnectedEdges(args.cell, { incoming: true });
      for (const edge of incomingEdges) {
         if (args.type === "interface") {
            console.log("edge:change:target", "interface");
            edgeFunctions.setRealizationEdge(edge);
         } else if (args.type === "abstract") {
            console.log("edge:change:target", "abstract");
            edgeFunctions.setGeneralizationEdge(edge);
         } else {
            console.log("edge:change:target", "regular");
            edgeFunctions.setRegularEdge(edge);
         }

         wsLocalAndDBUpdateEdge(edge, wsSendJson, sessionId);
      }
   });

   // When a node just starts to be moved. Triggers on mouse down and first move
   graph.current?.on("node:move", (args) => {
      // If the node is not selected, clear the selection and select the node
      if (!graph.current?.isSelected(args.cell)) {
         graph.current?.cleanSelection();
         graph.current?.select(args.cell);
      }
   });

   // When a node has finished being moved. Triggers on mouse up
   graph.current?.on("node:moved", (args) => {
      wsLocalAndDBUpdateNode(args.cell, wsSendJson, sessionId);
   });

   // When a node's position has changed. Triggers on every mouse move
   graph.current?.on("node:change:position", (args) => {
      const edges = graph.current?.getEdges();
      for (const edge of edges) {
         const edgeView = edge.findView(graph.current);
         edgeView.render();
      }

      if (args.options.ws) {
         return;
      }

      wsLocalUpdateNode(args.cell, wsSendJson, sessionId);
   });

   graph.current?.on("node:change:size", (args) => {
      updatePorts(args.node);

      if (args.options.ws) {
         return;
      }

      wsLocalAndDBUpdateNode(args.cell, wsSendJson, sessionId);
   });

   graph.current?.on("node:change:angle", (args) => {
      if (args.options.ws) {
         return;
      }

      wsLocalAndDBUpdateNode(args.cell, wsSendJson, sessionId);
   });

   return () => {
      graph.current?.off("node:mouseenter");
      graph.current?.off("node:mouseleave");
      graph.current?.off("node:selected");
      graph.current?.off("node:unselected");
      graph.current?.off("node:removed");
      graph.current?.off("node:added");
      graph.current?.off("node:change:data");
      graph.current?.off("node:move");
      graph.current?.off("node:moved");
      graph.current?.off("node:change:position");
      graph.current?.off("node:change:size");
      graph.current?.off("node:change:angle");
   };
}
