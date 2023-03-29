import { Graph } from "@antv/x6";

Graph.registerEdge(
   "association",
   {
      inherit: "edge",
      attrs: {
         line: {
            strokeWidth: 1,
            targetMarker: {
               name: "path",
               d: "M 6 10 L 18 4 C 14.3333 6 10.6667 8 7 10 L 18 16 z",
               fill: "black",
               offsetX: -5,
            },
         },
      },
   },
   true,
);
