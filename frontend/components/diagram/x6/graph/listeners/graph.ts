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
         copyStyles: false,
         serializeImages: true,
         width: 518,
         height: 384,
         backgroundColor: `#${backgroundColor}`,
         padding: 20,
         quality: 1,
         beforeSerialize(svg) {
            // Remove class with "x6-graph-svg-primer"
            const primer = svg.querySelectorAll(".x6-graph-svg-primer");
            for (let i = 0; i < primer.length; i++) {
               primer[i].remove();
            }

            // Remove class with "x6-graph-svg-decorator"
            const decorator = svg.querySelectorAll(".x6-graph-svg-decorator");
            for (let i = 0; i < decorator.length; i++) {
               decorator[i].remove();
            }

            // Remove class with "x6-graph-svg-overlay"
            const overlay = svg.querySelectorAll(".x6-graph-svg-overlay");
            for (let i = 0; i < overlay.length; i++) {
               overlay[i].remove();
            }

            // Remove class with "x6-port"
            const port = svg.querySelectorAll(".x6-port");
            for (let i = 0; i < port.length; i++) {
               port[i].remove();
            }

            // Remove class with "user-cell-selection"
            const userCellSelection = svg.querySelectorAll(".user-cell-selection");
            for (let i = 0; i < userCellSelection.length; i++) {
               userCellSelection[i].remove();
            }

            // If a node has a class with "x6-node-selected", remove the class from the node
            const selected = svg.querySelectorAll(".x6-node-selected");
            for (let i = 0; i < selected.length; i++) {
               selected[i].classList.remove("x6-node-selected");
            }
         },
         stylesheet: `
         *, ::before, ::after {
            box-sizing: border-box;
         }
         .x6-node .scalable *,
         .x6-edge .source-marker,
         .x6-edge .target-marker {
            vector-effect: non-scaling-stroke;
         }
         .x6-node foreignObject,
         .x6-node foreignObject > body {
            overflow: visible;
            background-color: transparent;
         }
         .x6-node foreignObject {
            display: block;
         }
         .x6-node foreignObject > body {
            position: static;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
         }
         .x6-edge .connection,
         .x6-edge .connection-wrap {
            strokeLinejoin: round;
            fill: none;
         }
         .x6-edge .connection-wrap {
            stroke: #000;
            strokeWidth: 15;
            strokeLinecap: round;
         }
         .x6-edge .vertices,
         .x6-edge .arrowheads,
         .x6-edge .connection-wrap {
            opacity: 0;
         }
         .x6-edge .vertices .vertex,
         .x6-edge .arrowheads .arrowhead {
            fill: #1abc9c;
         }
         .x6-edge .vertices .vertex-remove {
            fill: #fff;
         }
         .x6-edge .vertices .vertex-remove-area {
            opacity: 0.1;
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
