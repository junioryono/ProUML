import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import type X6Type from "@antv/x6";
import initializeKeyBindingListeners from "@/components/diagram/x6/graph/listeners/key-bindings";
import initializeNodeChangeListeners from "@/components/diagram/x6/graph/listeners/nodes";
import initializeEdgeChangeListeners from "@/components/diagram/x6/graph/listeners/edges";
import initializeGraphListeners from "@/components/diagram/x6/graph/listeners/graph";

import { LayoutProps } from "@/components/diagram/layout";
import { MutableRefObject } from "react";

export default function initializeListeners(
   graph: MutableRefObject<X6Type.Graph>,
   wsSendJson: SendJsonMessage,
   sessionId: MutableRefObject<string>,
   layoutProps: LayoutProps,
) {
   const removeKeyBindingListeners = initializeKeyBindingListeners(graph, wsSendJson, sessionId, layoutProps);
   const removeNodeChangeListeners = initializeNodeChangeListeners(graph, wsSendJson, sessionId, layoutProps);
   const removeEdgeChangeListeners = initializeEdgeChangeListeners(graph, wsSendJson, sessionId, layoutProps);
   const removeGraphListeners = initializeGraphListeners(graph, wsSendJson, sessionId, layoutProps);

   return () => {
      removeKeyBindingListeners();
      removeNodeChangeListeners();
      removeEdgeChangeListeners();
      removeGraphListeners();
   };
}
