import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import type X6Type from "@antv/x6";
import {
   wsLocalAndDBAddNode,
   wsLocalAndDBRemoveCell,
   wsLocalAndDBUpdateNode,
   wsLocalUpdateNode,
} from "@/components/diagram/x6/graph/websocket";
import { LayoutProps } from "@/components/diagram/layout";
import { MutableRefObject } from "react";
import { showPorts, hidePorts, addPorts, updatePorts, hideAllPorts, showAllPorts } from "../shapes/ports";

export default function Nodes(
   graph: MutableRefObject<X6Type.Graph>,
   wsSendJson: SendJsonMessage,
   sessionId: MutableRefObject<string>,
   layoutProps: LayoutProps,
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

   graph.current?.on("node:change:data", (args) => {
      if (args.options.ws) {
         return;
      }

      wsLocalAndDBUpdateNode(args.cell, wsSendJson, sessionId);
   });

   // When a node just starts to be moved. Triggers on mouse down and first move
   graph.current?.on("node:move", (args) => {
      graph.current?.cleanSelection();
      graph.current?.select(args.cell);
   });

   // When a node has finished being moved. Triggers on mouse up
   graph.current?.on("node:moved", (args) => {
      wsLocalAndDBUpdateNode(args.cell, wsSendJson, sessionId);
   });

   // When a node's position has changed. Triggers on every mouse move
   graph.current?.on("node:change:position", (args) => {
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
