import { Graph } from "@antv/x6";

Graph.registerEdge("association", {
   inherit: "edge",
   width: 1,
   attrs: {
      line: {
         stroke: "#000000",
         strokeWidth: 1,
         sourceMarker: null,
         targetMarker: null,
      },
   },
   //    router: {
   //       name: "manhattan",
   //       args: {
   //          padding: 50,
   //       },
   //    },
});
