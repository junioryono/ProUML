import { Graph } from "@antv/x6";

Graph.registerEdgeTool("source-arrowhead-circle", {
   inherit: "source-arrowhead",
   tagName: "circle",
   attrs: {
      r: 6,
      fill: "#000000",
      cursor: "move",
   },
});

Graph.registerEdgeTool("target-arrowhead-circle", {
   inherit: "target-arrowhead",
   tagName: "circle",
   attrs: {
      r: 6,
      fill: "#000000",
      cursor: "move",
   },
});
