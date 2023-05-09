import { Graph } from "@antv/x6";
import { defaultAttrs } from "./edges";

Graph.registerEdge(
   "edge",
   {
      edgeType: "classic",
      attrs: {
         line: {
            ...defaultAttrs.line,
            targetMarker: {
               size: 0,
            },
         },
      },
   },
   true,
);
