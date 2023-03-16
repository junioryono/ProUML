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
         stylesheet: `
         .user-cell-selection {
            display: none;
         }
         .x6-port {
            display: none;
         }
         *, ::before, ::after {
            box-sizing: border-box;
         }
         .x6-graph-scroller {
            position: relative;
            box-sizing: border-box;
            overflow: scroll;
            outline: none;
         }
         .x6-graph-scroller-content {
            position: relative;
         }
         .x6-graph-scroller-background {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
         }
         .x6-graph-scroller .x6-graph {
            position: absolute;
            display: inline-block;
            margin: 0;
            box-shadow: none;
         }
         .x6-graph-scroller .x6-graph > svg {
            display: block;
         }
         .x6-graph-scroller.x6-graph-scroller-paged .x6-graph {
            box-shadow: 0 0 4px 0 #eee;
         }
         .x6-graph-scroller.x6-graph-scroller-pannable[data-panning='false'] {
            cursor: grab;
         }
         .x6-graph-scroller.x6-graph-scroller-pannable[data-panning='true'] {
            cursor: grabbing;
            user-select: none;
         }
         .x6-graph-pagebreak {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
         }
         .x6-graph-pagebreak-vertical {
            position: absolute;
            top: 0;
            bottom: 0;
            box-sizing: border-box;
            width: 1px;
            border-left: 1px dashed #bdbdbd;
         }
         .x6-graph-pagebreak-horizontal {
            position: absolute;
            right: 0;
            left: 0;
            box-sizing: border-box;
            height: 1px;
            border-top: 1px dashed #bdbdbd;
         }
         .x6-graph {
            position: relative;
            outline: none;
            touch-action: none;
          }
         .x6-graph-background,
         .x6-graph-grid,
         .x6-graph-svg {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
         }
         .x6-graph-background-stage,
         .x6-graph-grid-stage,
         .x6-graph-svg-stage {
            user-select: none;
         }
         .x6-graph.x6-graph-pannable {
            cursor: grab;
            cursor: -moz-grab;
            cursor: -webkit-grab;
         }
         .x6-graph.x6-graph-panning {
            cursor: grabbing;
            cursor: -moz-grabbing;
            cursor: -webkit-grabbing;
            user-select: none;
         }
         .x6-node {
            cursor: move;
            /* stylelint-disable-next-line */
         }
         .x6-node.x6-node-immovable {
            cursor: default;
         }
         .x6-node * {
            -webkit-user-drag: none;
         }
         .x6-node .scalable * {
            vector-effect: non-scaling-stroke;
         }
         .x6-node [magnet='true'] {
            cursor: crosshair;
            transition: opacity 0.3s;
         }
         .x6-node [magnet='true']:hover {
            opacity: 0.7;
         }
         .x6-node foreignObject {
            display: block;
            overflow: visible;
            background-color: transparent;
         }
         .x6-node foreignObject > body {
            position: static;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: visible;
            background-color: transparent;
         }
         .x6-edge .source-marker,
         .x6-edge .target-marker {
            vector-effect: non-scaling-stroke;
         }
         .x6-edge .connection {
            stroke-linejoin: round;
            fill: none;
         }
         .x6-edge .connection-wrap {
            cursor: move;
            opacity: 0;
            fill: none;
            stroke: #000;
            stroke-width: 15;
            stroke-linecap: round;
            stroke-linejoin: round;
         }
         .x6-edge .connection-wrap:hover {
            opacity: 0.4;
            stroke-opacity: 0.4;
         }
         .x6-edge .vertices {
            cursor: move;
            opacity: 0;
         }
         .x6-edge .vertices .vertex {
            fill: #1abc9c;
         }
         .x6-edge .vertices .vertex :hover {
            fill: #34495e;
            stroke: none;
         }
         .x6-edge .vertices .vertex-remove {
            cursor: pointer;
            fill: #fff;
         }
         .x6-edge .vertices .vertex-remove-area {
            cursor: pointer;
            opacity: 0.1;
         }
         .x6-edge .vertices .vertex-group:hover .vertex-remove-area {
            opacity: 1;
         }
         .x6-edge .arrowheads {
            cursor: move;
            opacity: 0;
         }
         .x6-edge .arrowheads .arrowhead {
            fill: #1abc9c;
         }
         .x6-edge .arrowheads .arrowhead :hover {
            fill: #f39c12;
            stroke: none;
         }
         .x6-edge .tools {
            cursor: pointer;
            opacity: 0;
         }
         .x6-edge .tools .tool-options {
            display: none;
         }
         .x6-edge .tools .tool-remove circle {
            fill: #f00;
         }
         .x6-edge .tools .tool-remove path {
            fill: #fff;
         }
         .x6-edge:hover .vertices,
         .x6-edge:hover .arrowheads,
         .x6-edge:hover .tools {
            opacity: 1;
         }
         .x6-highlight-opacity {
            opacity: 0.3;
         }
         .x6-cell-tool-editor {
            position: relative;
            display: inline-block;
            min-height: 1em;
            margin: 0;
            padding: 0;
            line-height: 1;
            white-space: normal;
            text-align: center;
            vertical-align: top;
            overflow-wrap: normal;
            outline: none;
            transform-origin: 0 0;
            -webkit-user-drag: none;
         }
         .x6-edge-tool-editor {
            border: 1px solid #275fc5;
            border-radius: 2px;
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
