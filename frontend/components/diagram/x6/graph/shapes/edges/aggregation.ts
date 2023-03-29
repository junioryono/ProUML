import { Graph } from "@antv/x6";

Graph.registerEdge(
   "aggregation",
   {
      inherit: "edge",
      attrs: {
         line: {
            strokeWidth: 1,
            sourceMarker: {
               name: "path",
               d: "M 30 10 L 20 16 L 10 10 L 20 4 z",
               fill: "white",
               offsetX: -10,
            },
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
