import { Cell } from "@antv/x6";

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

export default {
   isEdge,
};
