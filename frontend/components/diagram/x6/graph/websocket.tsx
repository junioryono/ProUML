import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import type X6Type from "@antv/x6";
import { MutableRefObject, useRef } from "react";
import useWebSocket from "react-use-websocket";
import { getWSUrl } from "@/lib/utils";
import { LayoutProps } from "../../layout";

export default function useGraphWebSocket(
   graph: MutableRefObject<X6Type.Graph>,
   diagramId: string,
   layoutProps: LayoutProps,
) {
   const sessionId = useRef<string>();

   // WebSocket
   const websocket = useWebSocket(getWSUrl() + "/" + diagramId, {
      onMessage: (event) => onWebSocketMessage(event, graph, sessionId, layoutProps),
   });

   return { websocket, sessionId };
}

function onWebSocketMessage(
   event: MessageEvent<any>,
   graph: React.MutableRefObject<X6Type.Graph | null>,
   sessionId: React.MutableRefObject<string | null>,
   layoutProps: LayoutProps,
) {
   if (!event || !event.data || event.data === "ping") {
      return;
   }

   const message = JSON.parse(event.data);
   if (!message || !message.event) {
      return;
   }

   console.log("onWebSocketMessage", message);

   const events = message.event.split("/");
   if (events.includes("connection")) {
      const color = message.color;
      const user = message.user;
      layoutProps.setConnectedUsers((prev) => {
         const newUsers = { ...prev };
         newUsers[color] = user;
         return newUsers;
      });
   } else if (events.includes("disconnection")) {
      const color = message.color;
      layoutProps.setConnectedUsers((prev) => {
         const newUsers = { ...prev };
         delete newUsers[color];
         return newUsers;
      });
   } else if (events.includes("local_updateNode")) {
      const node = message.cell;
      if (!node) {
         return;
      }

      const nodeInGraph = graph.current?.getCellById(node.id) as X6Type.Node;
      if (!nodeInGraph) {
         return;
      }

      graph.current?.batchUpdate(() => {
         nodeInGraph.trigger("change:package", { current: node["package"], ws: true });
         nodeInGraph.trigger("change:name", { current: node["name"], ws: true });
         nodeInGraph.trigger("change:type", { current: node["type"], ws: true });
         nodeInGraph.trigger("change:variables", { current: node["variables"] || [], ws: true });
         nodeInGraph.trigger("change:methods", { current: node["methods"] || [], ws: true });
         nodeInGraph.trigger("change:backgroundColor", { current: node["backgroundColor"], ws: true });
         nodeInGraph.trigger("change:borderColor", { current: node["borderColor"], ws: true });
         nodeInGraph.trigger("change:borderWidth", { current: node["borderWidth"], ws: true });
         nodeInGraph.trigger("change:borderStyle", { current: node["borderStyle"], ws: true });
         nodeInGraph.trigger("change:lockPosition", { current: node["lockPosition"], ws: true });
         nodeInGraph.trigger("change:lockSize", { current: node["lockSize"], ws: true });

         nodeInGraph.angle(node["angle"] || 0, { ws: true });
         nodeInGraph.setSize(node["size"], { ws: true });
         nodeInGraph.setPosition(node["position"], { ws: true });
      });
   } else if (events.includes("local_updateEdge")) {
      const cell = message.cell;
      if (!cell) {
         return;
      }

      const edgeInGraph = graph.current?.getCellById(cell.id) as X6Type.Edge;
      if (!edgeInGraph) {
         return;
      }

      edgeInGraph.setSource(cell.source, { ws: true });
      edgeInGraph.setTarget(cell.target, { ws: true });
   } else if (events.includes("local_removeCell")) {
      const cell = message.cell;
      if (!cell) {
         return;
      }

      const cellInGraph = graph.current?.getCellById(cell.id);
      if (!cellInGraph) {
         return;
      }

      graph.current?.removeCell(cellInGraph, { ws: true });
   } else if (events.includes("local_addNode")) {
      const cell = message.cell;
      if (!cell) {
         return;
      }

      const node = graph.current?.createNode(cell);
      graph.current?.addNode(node, { ws: true });
   } else if (events.includes("local_addEdge")) {
      const cell = message.cell;
      if (!cell) {
         return;
      }

      const edge = graph.current?.createEdge(cell);
      graph.current?.addEdge(edge, { ws: true });
   } else if (events.includes("connected")) {
      if (!message.sessionId || message.sessionId === "") {
         return;
      }

      sessionId.current = message.sessionId;
   } else if (events.includes("local_updateGraphShowGrid")) {
      graph.current.trigger("grid:changed", { current: message.showGrid, ws: true });
   } else if (events.includes("local_updateGraphBackgroundColor")) {
      graph.current.trigger("background:changed", { current: message.backgroundColor, ws: true });
   } else if (events.includes("local_updateGraphName")) {
      layoutProps.setDiagramName(message.name);
   }
}

export function wsLocalAndDBUpdateGraphName(
   name: boolean,
   wsSendJson: SendJsonMessage,
   sessionId: MutableRefObject<string>,
) {
   if (!sessionId.current) {
      return;
   }

   wsSendJson({
      sessionId: sessionId.current,
      event: "broadcast/local_updateGraphName/db_updateGraphName",
      name,
   } as any);
}

export function wsDBUpdateGraphImage(base64JPEG: string, wsSendJson: SendJsonMessage, sessionId: MutableRefObject<string>) {
   if (!sessionId.current) {
      return;
   }

   wsSendJson({
      sessionId: sessionId.current,
      event: "db_updateGraphImage",
      image: base64JPEG,
   } as any);
}

export function wsLocalAndDBUpdateGraphShowGrid(
   showGrid: boolean,
   wsSendJson: SendJsonMessage,
   sessionId: MutableRefObject<string>,
) {
   if (!sessionId.current) {
      return;
   }

   wsSendJson({
      sessionId: sessionId.current,
      event: "broadcast/local_updateGraphShowGrid/db_updateGraphShowGrid",
      showGrid,
   } as any);
}

export function wsLocalAndDBUpdateGraphBackgroundColor(
   backgroundColor: boolean,
   wsSendJson: SendJsonMessage,
   sessionId: MutableRefObject<string>,
) {
   if (!sessionId.current) {
      return;
   }

   wsSendJson({
      sessionId: sessionId.current,
      event: "broadcast/local_updateGraphBackgroundColor/db_updateGraphBackgroundColor",
      backgroundColor,
   } as any);
}

export function wsLocalUpdateNode(cell: X6Type.Cell, wsSendJson: SendJsonMessage, sessionId: MutableRefObject<string>) {
   if (!sessionId.current) {
      return;
   }

   wsSendJson({
      sessionId: sessionId.current,
      event: "broadcast/local_updateNode",
      cell,
   } as any);
}

export function wsLocalUpdateEdge(cell: X6Type.Cell, wsSendJson: SendJsonMessage, sessionId: MutableRefObject<string>) {
   if (!sessionId.current) {
      return;
   }

   wsSendJson({
      sessionId: sessionId.current,
      event: "broadcast/local_updateEdge",
      cell: removeExtraEdgeProps(cell),
   } as any);
}

export function wsLocalAndDBUpdateNode(cell: X6Type.Cell, wsSendJson: SendJsonMessage, sessionId: MutableRefObject<string>) {
   if (!sessionId.current) {
      return;
   }

   wsSendJson({
      sessionId: sessionId.current,
      event: "broadcast/local_updateNode/db_updateCell",
      cell,
   } as any);
}

export function wsLocalAndDBUpdateEdge(cell: X6Type.Cell, wsSendJson: SendJsonMessage, sessionId: MutableRefObject<string>) {
   if (!sessionId.current) {
      return;
   }

   wsSendJson({
      sessionId: sessionId.current,
      event: "broadcast/local_updateEdge/db_updateCell",
      cell: removeExtraEdgeProps(cell),
   } as any);
}

export function wsLocalAndDBRemoveCell(cell: X6Type.Cell, wsSendJson: SendJsonMessage, sessionId: MutableRefObject<string>) {
   if (!sessionId.current) {
      return;
   }

   wsSendJson({
      sessionId: sessionId.current,
      event: "broadcast/local_removeCell/db_removeCell",
      cell: {
         id: cell.id,
      },
   } as any);
}

export function wsLocalAndDBAddNode(cell: X6Type.Cell, wsSendJson: SendJsonMessage, sessionId: MutableRefObject<string>) {
   if (!sessionId.current) {
      return;
   }

   wsSendJson({
      sessionId: sessionId.current,
      event: "broadcast/local_addNode/db_addCell",
      cell,
   } as any);
}

export function wsLocalAndDBAddEdge(cell: X6Type.Cell, wsSendJson: SendJsonMessage, sessionId: MutableRefObject<string>) {
   if (!sessionId.current) {
      return;
   }

   wsSendJson({
      sessionId: sessionId.current,
      event: "broadcast/local_addEdge/db_addCell",
      cell: removeExtraEdgeProps(cell),
   } as any);
}

function removeExtraEdgeProps(cell: X6Type.Cell): X6Type.Cell.Properties {
   const cellClone = { ...cell.getProp() };
   delete cellClone.tools;

   return cellClone;
}
