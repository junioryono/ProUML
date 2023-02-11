"use client";

import type X6Type from "@antv/x6";
import { JsonValue, WebSocketHook } from "react-use-websocket/dist/lib/types";
import { MutableRefObject, useRef } from "react";
import useWebSocket from "react-use-websocket";
import { getWSUrl } from "@/lib/utils";

export default function useGraphWebSocket(graph: MutableRefObject<X6Type.Graph>, diagramId: string) {
   const sessionId = useRef<string>();

   // WebSocket
   const websocket = useWebSocket(getWSUrl() + "/" + diagramId, {
      onMessage: (event) => onWebSocketMessage(event, graph, sessionId),
   });

   return { websocket, sessionId };
}

function onWebSocketMessage(
   event: MessageEvent<any>,
   graph: React.MutableRefObject<X6Type.Graph | null>,
   sessionId: React.MutableRefObject<string | null>,
) {
   if (!event || !event.data) {
      return;
   }

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

      graph.current?.batchUpdate(() => {
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

export function wsLocalUpdateCell(
   cell: X6Type.Cell,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
) {
   if (!sessionId.current) {
      return;
   }

   websocket.sendJsonMessage({
      sessionId: sessionId.current,
      event: "broadcast/local_updateCell",
      cell,
   } as any);
}

export function wsDBUpdateCell(
   cell: X6Type.Cell,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
) {
   if (!sessionId.current) {
      return;
   }

   websocket.sendJsonMessage({
      sessionId: sessionId.current,
      event: "broadcast/db_updateCell",
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
