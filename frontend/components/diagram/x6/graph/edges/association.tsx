import { Graph } from "@antv/x6";

Graph.registerEdge("association", {
   inherit: "edge",
   width: 1,
   attrs: {
      line: {
         stroke: "#000",
         strokeWidth: 1,
      },
   },
   //    router: {
   //       name: "manhattan",
   //       args: {
   //          padding: 50,
   //       },
   //    },
});
