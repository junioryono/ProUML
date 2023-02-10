"use client";

import type X6Type from "@antv/x6";
import { wsLocalAndDBRemoveCell, wsDBUpdateCell, wsLocalUpdateCell } from "@/components/diagram/x6/graph/websocket";
import { JsonValue, WebSocketHook } from "react-use-websocket/dist/lib/types";
import { LayoutProps } from "@/components/diagram/layout";
import { MutableRefObject } from "react";

export default function KeyBindings(
   graph: MutableRefObject<X6Type.Graph>,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
   layoutProps: LayoutProps,
) {
   graph.current?.bindKey("delete", () => {
      const cells = graph.current?.getSelectedCells();
      graph.current?.removeCells(cells);
   });
   graph.current?.bindKey("backspace", () => {
      const cells = graph.current?.getSelectedCells();
      graph.current?.removeCells(cells);
   });
   graph.current?.bindKey("ctrl+c", () => {
      const cells = graph.current?.getSelectedCells();
      graph.current?.copy(cells);
   });
   graph.current?.bindKey("ctrl+v", () => {
      graph.current.getCellsInClipboard();
      // TODO need to paste to mouse position
   });
   graph.current?.bindKey("ctrl+z", () => {
      graph.current?.undo();
   });
   graph.current?.bindKey("ctrl+shift+z", () => {
      graph.current?.redo();
   });

   return () => {
      graph.current?.unbindKey("delete");
      graph.current?.unbindKey("backspace");
      graph.current?.unbindKey("ctrl+c");
      graph.current?.unbindKey("ctrl+v");
      graph.current?.unbindKey("ctrl+z");
      graph.current?.unbindKey("ctrl+shift+z");
   };
}
