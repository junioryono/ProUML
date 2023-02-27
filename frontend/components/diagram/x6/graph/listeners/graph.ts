import type X6Type from "@antv/x6";
import {
   wsLocalAndDBUpdateNode,
   wsDBUpdateGraphImage,
   wsLocalUpdateNode,
   wsLocalAndDBUpdateGraphShowGrid,
   wsLocalAndDBUpdateGraphBackgroundColor,
} from "@/components/diagram/x6/graph/websocket";
import { JsonValue, WebSocketHook } from "react-use-websocket/dist/lib/types";
import { LayoutProps } from "@/components/diagram/layout";
import { MutableRefObject } from "react";

export default function Graph(
   graph: MutableRefObject<X6Type.Graph>,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
   layoutProps: LayoutProps,
) {
   // const dbListeners = ["node:added", "node:removed", "node:resized", "node:moved", "node:rotated"];
   // for (const dbListener of dbListeners) {
   //    graph.current?.on(dbListener, (args: { cell: X6Type.Cell<X6Type.Cell.Properties> }) => {
   //       wsLocalAndDBUpdateNode(args.cell, websocket, sessionId);
   //    });
   // }

   let jsonString: string = JSON.stringify(graph.current?.toJSON());
   const mouseLeaveFunction = () => {
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
   };
   document.addEventListener("mouseleave", mouseLeaveFunction);

   graph.current?.on("scale", (args) => {
      console.log("scale", args);
      layoutProps.setZoom(args.sx);
   });

   graph.current?.on("grid:changed", (args) => {
      console.log("grid:changed", args);
      if (args.ws) {
         return;
      }

      wsLocalAndDBUpdateGraphShowGrid(args.showGrid, websocket, sessionId);
   });

   // Background color
   graph.current?.on("background:changed", (args) => {
      console.log("background:changed", args);
      if (args.ws) {
         return;
      }

      layoutProps.setBackgroundColor(args.color);
      graph.current?.drawBackground({
         color: `#${args.color}`,
      });
      wsLocalAndDBUpdateGraphBackgroundColor(args.color, websocket, sessionId);
   });

   return () => {
      document.removeEventListener("mouseleave", mouseLeaveFunction);
      graph.current?.off("scale");
      graph.current?.off("grid:changed");
      graph.current?.off("background:changed");
   };
}
