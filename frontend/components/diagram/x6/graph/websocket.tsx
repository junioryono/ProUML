import type X6Type from "@antv/x6";
import { JsonValue, WebSocketHook } from "react-use-websocket/dist/lib/types";
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
   if (!event || !event.data) {
      return;
   }

   const message = JSON.parse(event.data);
   if (!message || !message.event) {
      return;
   }

   const events = message.event.split("/");
   if (events.includes("local_updateNode")) {
      const node = message.cell as X6Type.Node;
      if (!node) {
         return;
      }

      const nodeInGraph = graph.current?.getCellById(node.id);
      if (!nodeInGraph) {
         return;
      }

      console.log("local_updateNode", node);

      graph.current?.batchUpdate(() => {
         nodeInGraph.trigger("change:className", { name: node["name"], ws: true });
         nodeInGraph.trigger("change:variables", { variables: node["variables"] || [], ws: true });
         nodeInGraph.trigger("change:methods", { methods: node["methods"] || [], ws: true });

         nodeInGraph.setProp("package", node["package"], { ws: true });
         nodeInGraph.setProp("type", node["type"], { ws: true });
         nodeInGraph.setProp("angle", node["angle"] || 0, { ws: true });
         node["size"] && nodeInGraph.setProp("size", node["size"], { ws: true });
         node["position"] && nodeInGraph.setProp("position", node["position"], { ws: true });
      });
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
      console.log("connected");

      if (!message.sessionId || message.sessionId === "") {
         console.log("could not connect");
         return;
      }

      sessionId.current = message.sessionId;
   } else if (events.includes("local_updateGraphShowGrid")) {
      graph.current.setGridSize(message.showGrid ? 16 : 1);
   } else if (events.includes("local_updateGraphBackgroundColor")) {
      layoutProps.setBackgroundColor(message.backgroundColor);
      graph.current?.drawBackground({
         color: `#${message.backgroundColor}`,
      });
   } else if (events.includes("local_updateGraphName")) {
      layoutProps.setDiagramName(message.name);
   }
}

// export function wsDBUpdateGraph(
//    cell: X6Type.Cell,
//    websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
//    sessionId: MutableRefObject<string>,
// ) {
//    if (!sessionId.current) {
//       return;
//    }

//    websocket.sendJsonMessage({
//       sessionId: sessionId.current,
//       event: "broadcast/db_updateCell",
//       cell,
//    } as any);
// }

export function wsLocalAndDBUpdateGraphName(
   name: boolean,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
) {
   if (!sessionId.current) {
      return;
   }

   websocket.sendJsonMessage({
      sessionId: sessionId.current,
      event: "broadcast/local_updateGraphName/db_updateGraphName",
      name,
   } as any);
}

export function wsDBUpdateGraphImage(
   base64JPEG: string,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
) {
   if (!sessionId.current) {
      return;
   }

   console.log("wsDBUpdateGraphImage");

   websocket.sendJsonMessage({
      sessionId: sessionId.current,
      event: "db_updateGraphImage",
      image: base64JPEG,
   } as any);
}

export function wsLocalAndDBUpdateGraphShowGrid(
   showGrid: boolean,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
) {
   if (!sessionId.current) {
      return;
   }

   websocket.sendJsonMessage({
      sessionId: sessionId.current,
      event: "broadcast/local_updateGraphShowGrid/db_updateGraphShowGrid",
      showGrid,
   } as any);
}

export function wsLocalAndDBUpdateGraphBackgroundColor(
   backgroundColor: boolean,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
) {
   if (!sessionId.current) {
      return;
   }

   websocket.sendJsonMessage({
      sessionId: sessionId.current,
      event: "broadcast/local_updateGraphBackgroundColor/db_updateGraphBackgroundColor",
      backgroundColor,
   } as any);
}

export function wsLocalUpdateNode(
   cell: X6Type.Cell,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
) {
   if (!sessionId.current) {
      return;
   }

   websocket.sendJsonMessage({
      sessionId: sessionId.current,
      event: "broadcast/local_updateNode",
      cell,
   } as any);
}

export function wsLocalAndDBUpdateNode(
   cell: X6Type.Cell,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
) {
   if (!sessionId.current) {
      return;
   }

   websocket.sendJsonMessage({
      sessionId: sessionId.current,
      event: "broadcast/local_updateNode/db_updateCell",
      cell,
   } as any);
}

export function wsLocalAndDBRemoveCell(
   cell: X6Type.Cell,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
) {
   if (!sessionId.current) {
      return;
   }

   websocket.sendJsonMessage({
      sessionId: sessionId.current,
      event: "broadcast/local_removeCell/db_removeCell",
      cell,
   } as any);
}

export function wsLocalAndDBAddNode(
   cell: X6Type.Cell,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
) {
   if (!sessionId.current) {
      return;
   }

   websocket.sendJsonMessage({
      sessionId: sessionId.current,
      event: "broadcast/local_addNode/db_addCell",
      cell,
   } as any);
}

export function wsLocalAndDBAddEdge(
   cell: X6Type.Cell,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
) {
   if (!sessionId.current) {
      return;
   }

   websocket.sendJsonMessage({
      sessionId: sessionId.current,
      event: "broadcast/local_addEdge/db_addCell",
      cell,
   } as any);
}
