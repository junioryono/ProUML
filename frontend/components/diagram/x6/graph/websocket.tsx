"use client";

import type X6Type from "@antv/x6";
import { JsonValue, WebSocketHook } from "react-use-websocket/dist/lib/types";
import { MutableRefObject, useRef } from "react";
import useWebSocket from "react-use-websocket";
import { getWSUrl } from "@/lib/utils";

export function useGraphWebSocket(graph: MutableRefObject<X6Type.Graph>, diagramId: string) {
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
   } else if (events.includes("connected")) {
      console.log("connected");

      if (!message.sessionId || message.sessionId === "") {
         console.log("could not connect");
         return;
      }

      sessionId.current = message.sessionId;
   }
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

export function wsDBRemoveCell(
   cell: X6Type.Cell,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
) {
   if (!sessionId.current) {
      return;
   }

   websocket.sendJsonMessage({
      sessionId: sessionId.current,
      event: "broadcast/db_removeCell",
      cell,
   } as any);
}

export function wsDBAddCell(
   cell: X6Type.Cell,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
) {
   if (!sessionId.current) {
      return;
   }

   websocket.sendJsonMessage({
      sessionId: sessionId.current,
      event: "broadcast/db_addCell",
      cell,
   } as any);
}
