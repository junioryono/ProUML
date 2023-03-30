import { Graph, Cell } from "@antv/x6";

import "./aggregation";
import "./association";
import "./composition";
import "./extend";
import "./implement";

const edgeNames = ["aggregation", "association", "composition", "extend", "implement"];

function isEdge(cell: Cell.Properties) {
   console.log("cell.shape", cell.shape);
   return cell.shape === "edge" || edgeNames.includes(cell.shape);
}

Graph.registerEdge(
   "edge",
   {
      attrs: {
         line: {
            stroke: "#000000",
            strokeWidth: 2,
            sourceMarker: {
               size: 0,
            },
            targetMarker: {
               size: 0,
            },
         },
      },
   },
   true,
);

export default {
   isEdge,
};
