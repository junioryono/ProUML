import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import type X6Type from "@antv/x6";
import {
   wsDBUpdateGraphImage,
   wsLocalAndDBUpdateGraphShowGrid,
   wsLocalAndDBUpdateGraphBackgroundColor,
} from "@/components/diagram/x6/graph/websocket";
import { LayoutProps } from "@/components/diagram/layout";
import { MutableRefObject } from "react";
import { hideAllPorts, hidePorts } from "../shapes/ports";

export default function Graph(
   graph: MutableRefObject<X6Type.Graph>,
   wsSendJson: SendJsonMessage,
   sessionId: MutableRefObject<string>,
   layoutProps: LayoutProps,
) {
   let jsonString: string = JSON.stringify(graph.current?.toJSON());
   const mouseLeaveFunction = () => {
      const newJSON = graph.current?.toJSON();
      const newJSONString = JSON.stringify(newJSON);
      if (jsonString === newJSONString) {
         return;
      }

      jsonString = newJSONString;

      graph.current?.toJPEG((base64JPEG) => wsDBUpdateGraphImage(base64JPEG, wsSendJson, sessionId), {
         copyStyles: true,
         serializeImages: true,
         width: 518,
         height: 384,
         backgroundColor: "#ffffff",
         padding: 20,
         quality: 1,
         stylesheet: `
         .user-cell-selection {
            display: none;
         }
         `,
      });
   };
   document.addEventListener("mouseleave", mouseLeaveFunction);

   const visibilityChangeFunction = () => {
      mouseLeaveFunction();

      if (document.visibilityState === "hidden") {
         hideAllPorts(graph.current);
      }
   };
   document.addEventListener("visibilitychange", visibilityChangeFunction);

   graph.current?.on("scale", (args) => {
      layoutProps.setZoom(args.sx);
   });

   graph.current?.on("grid:changed", (args) => {
      if (args.ws) {
         return;
      }

      wsLocalAndDBUpdateGraphShowGrid(args.showGrid, wsSendJson, sessionId);
   });

   // Background color
   graph.current?.on("background:changed", (args) => {
      if (args.ws) {
         return;
      }

      layoutProps.setBackgroundColor(args.color);
      graph.current?.drawBackground({
         color: `#${args.color}`,
      });
      wsLocalAndDBUpdateGraphBackgroundColor(args.color, wsSendJson, sessionId);
   });

   graph.current?.on("graph:mouseleave", () => {
      hideAllPorts(graph.current);
   });

   return () => {
      document.removeEventListener("mouseleave", mouseLeaveFunction);
      document.removeEventListener("visibilitychange", visibilityChangeFunction);
      graph.current?.off("scale");
      graph.current?.off("grid:changed");
      graph.current?.off("background:changed");
      graph.current?.off("graph:mouseleave");
   };
}
