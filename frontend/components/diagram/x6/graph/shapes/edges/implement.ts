import { Graph } from "@antv/x6";

Graph.registerEdge(
   "implement",
   {
      inherit: "edge",
      attrs: {
         line: {
            strokeWidth: 1,
            strokeDasharray: "3,3",
            targetMarker: {
               name: "path",
               d: "M 20 0 L 0 10 L 20 20 z",
               fill: "white",
               offsetX: -10,
            },
         },
      },
   },
   true,
);
