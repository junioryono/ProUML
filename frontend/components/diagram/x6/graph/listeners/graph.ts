import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import type X6Type from "@antv/x6";
import {
   wsDBUpdateGraphImage,
   wsLocalAndDBUpdateGraphShowGrid,
   wsLocalAndDBUpdateGraphBackgroundColor,
} from "@/components/diagram/x6/graph/websocket";
import { LayoutProps } from "@/components/diagram/layout";
import { MutableRefObject } from "react";
import { hideAllPorts } from "../shapes/ports";

export default function Graph(
   graph: MutableRefObject<X6Type.Graph>,
   wsSendJson: SendJsonMessage,
   sessionId: MutableRefObject<string>,
   layoutProps: LayoutProps,
) {
   const originalJSON = graph.current?.toJSON();
   let jsonString = JSON.stringify(removePortsFromJSON(originalJSON));
   let backgroundColor = layoutProps.backgroundColor.current || "FFFFFF";

   const mouseLeaveFunction = () => {
      const newJSON = graph.current?.toJSON();
      const newJSONString = JSON.stringify(removePortsFromJSON(newJSON));
      const newBackgroundColor = layoutProps.backgroundColor.current || "FFFFFF";
      if (jsonString === newJSONString && backgroundColor === newBackgroundColor) {
         return;
      }

      jsonString = newJSONString;
      backgroundColor = newBackgroundColor;

      graph.current?.toJPEG((base64JPEG) => wsDBUpdateGraphImage(base64JPEG, wsSendJson, sessionId), {
         copyStyles: true,
         serializeImages: true,
         width: 518,
         height: 384,
         backgroundColor: `#${backgroundColor}`,
         padding: 20,
         quality: 1,
         stylesheet: `
         .user-cell-selection {
            display: none;
         }
         .x6-port {
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
      if (args.current) {
         graph.current.setGridSize(16);
      } else {
         graph.current.setGridSize(1);
      }

      if (args.ws) {
         return;
      }

      wsLocalAndDBUpdateGraphShowGrid(args.current, wsSendJson, sessionId);
   });

   // Background color
   graph.current?.on("background:changed", (args) => {
      layoutProps.setBackgroundColor(args.current || "FFFFFF");
      graph.current?.drawBackground({
         color: `#${args.current || "FFFFFF"}`,
      });

      if (args.ws) {
         return;
      }

      wsLocalAndDBUpdateGraphBackgroundColor(args.current, wsSendJson, sessionId);
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

function removePortsFromJSON(json: { cells: any }): any {
   if (json === null) {
      return null;
   }

   const newJSON = JSON.parse(JSON.stringify(json));

   // Order the properties of the cells alphabetically
   for (const cell of newJSON.cells) {
      if (cell.ports) {
         delete cell.ports;
      }

      const orderedCell = {};
      Object.keys(cell)
         .sort()
         .forEach((key) => {
            orderedCell[key] = cell[key];
         });

      newJSON.cells[newJSON.cells.indexOf(cell)] = orderedCell;
   }

   return newJSON;
}
