import { Cell } from "@antv/x6";

import "./aggregation";
import "./association";
import "./composition";
import "./extend";
import "./implement";

const edgeNames = ["aggregation", "association", "composition", "extend", "implement"];

function isEdge(cell: Cell.Properties) {
   return edgeNames.includes(cell.shape);
}

export default {
   isEdge,
};
