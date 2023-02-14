import type X6Type from "@antv/x6";
import initializeKeyBindingListeners from "@/components/diagram/x6/graph/listeners/key-bindings";
import initializeCellChangeListeners from "@/components/diagram/x6/graph/listeners/cells";
import initializeGraphListeners from "@/components/diagram/x6/graph/listeners/graph";
import { JsonValue, WebSocketHook } from "react-use-websocket/dist/lib/types";
import { LayoutProps } from "@/components/diagram/layout";
import { MutableRefObject } from "react";

export default function initializeListeners(
   graph: MutableRefObject<X6Type.Graph>,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
   layoutProps: LayoutProps,
) {
   const removeKeyBindingListeners = initializeKeyBindingListeners(graph, websocket, sessionId, layoutProps);
   const removeCellChangeListeners = initializeCellChangeListeners(graph, websocket, sessionId, layoutProps);
   const removeGraphListeners = initializeGraphListeners(graph, websocket, sessionId, layoutProps);

   return () => {
      removeKeyBindingListeners();
      removeCellChangeListeners();
      removeGraphListeners();
   };
}
