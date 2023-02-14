import type X6Type from "@antv/x6";
import { wsDBUpdateCell, wsDBUpdateGraphImage, wsLocalUpdateCell } from "@/components/diagram/x6/graph/websocket";
import { JsonValue, WebSocketHook } from "react-use-websocket/dist/lib/types";
import { LayoutProps } from "@/components/diagram/layout";
import { MutableRefObject } from "react";

export default function Graph(
   graph: MutableRefObject<X6Type.Graph>,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
   layoutProps: LayoutProps,
) {
   graph.current?.on("cell:change:*", (args) => {
      console.log("cell:change:*", args);
      if (args.options.ws) {
         return;
      }

      wsLocalUpdateCell(args.cell, websocket, sessionId);
   });

   // const dbListeners = ["node:added", "node:removed", "node:resized", "node:moved", "node:rotated"];
   // for (const dbListener of dbListeners) {
   //    graph.current?.on(dbListener, (args: { cell: X6Type.Cell<X6Type.Cell.Properties> }) => {
   //       wsDBUpdateCell(args.cell, websocket, sessionId);
   //    });
   // }

   let jsonString: string = JSON.stringify(graph.current?.toJSON());
   document.addEventListener("mouseleave", () => {
      const newJSON = graph.current?.toJSON();
      const newJSONString = JSON.stringify(newJSON);
      if (jsonString === newJSONString) {
         return;
      }

      jsonString = newJSONString;

      graph.current?.toJPEG((base64JPEG) => wsDBUpdateGraphImage(base64JPEG, websocket, sessionId), {
         copyStyles: true,
         serializeImages: true,
         width: 518,
         height: 384,
         backgroundColor: "#ffffff",
         padding: 20,
         quality: 1,
      });
   });

   graph.current?.on("scale", (args) => {
      console.log("scale", args);
      layoutProps.setZoom(args.sx);
   });

   return () => {
      graph.current?.off("scale");
   };
}
