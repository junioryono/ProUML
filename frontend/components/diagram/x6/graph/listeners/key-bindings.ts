import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import type X6Type from "@antv/x6";
import { LayoutProps } from "@/components/diagram/layout";
import { MutableRefObject } from "react";

export default function KeyBindings(
   graph: MutableRefObject<X6Type.Graph>,
   wsSendJson: SendJsonMessage,
   sessionId: MutableRefObject<string>,
   layoutProps: LayoutProps,
) {
   graph.current?.bindKey("delete", () => remove(graph));
   graph.current?.bindKey("backspace", () => remove(graph));

   graph.current?.bindKey("ctrl+c", () => copy(graph));
   graph.current?.bindKey("command+c", () => copy(graph));

   graph.current?.bindKey("ctrl+v", () => paste(graph));
   graph.current?.bindKey("command+v", () => paste(graph));

   graph.current?.bindKey("ctrl+z", () => undo(graph));
   graph.current?.bindKey("command+z", () => undo(graph));

   graph.current?.bindKey("ctrl+shift+z", () => redo(graph));
   graph.current?.bindKey("command+shift+z", () => redo(graph));

   return () => {
      graph.current?.unbindKey("delete");
      graph.current?.unbindKey("backspace");
      graph.current?.unbindKey("ctrl+c");
      graph.current?.unbindKey("command+c");
      graph.current?.unbindKey("ctrl+v");
      graph.current?.unbindKey("command+v");
      graph.current?.unbindKey("ctrl+z");
      graph.current?.unbindKey("command+z");
      graph.current?.unbindKey("ctrl+shift+z");
      graph.current?.unbindKey("command+shift+z");
   };
}

function remove(graph: MutableRefObject<X6Type.Graph>) {
   const cells = graph.current?.getSelectedCells();
   graph.current?.removeCells(cells);
}

function copy(graph: MutableRefObject<X6Type.Graph>) {
   const cells = graph.current?.getSelectedCells();
   graph.current?.copy(cells);
}

function paste(graph: MutableRefObject<X6Type.Graph>) {
   // graph.current.getCellsInClipboard();
   // TODO need to paste to mouse position
   const cells = graph.current?.paste();
   graph.current?.resetSelection(cells);
}

function undo(graph: MutableRefObject<X6Type.Graph>) {
   graph.current?.undo();
}

function redo(graph: MutableRefObject<X6Type.Graph>) {
   graph.current?.redo();
}
