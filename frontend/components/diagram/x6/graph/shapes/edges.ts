import { Graph, Cell, Edge } from "@antv/x6";

function isRegularEdge(cell: Cell.Properties) {
   return cell.shape === "edge" && (!cell.edgeType || cell.edgeType === "classic");
}

function isAggregationEdge(cell: Cell.Properties) {
   return cell.shape === "edge" && cell.edgeType === "aggregation";
}

function isAssociationEdge(cell: Cell.Properties) {
   return cell.shape === "edge" && cell.edgeType === "association";
}

function isCompositionEdge(cell: Cell.Properties) {
   return cell.shape === "edge" && cell.edgeType === "composition";
}

function isGeneralizationEdge(cell: Cell.Properties) {
   return cell.shape === "edge" && cell.edgeType === "generalization";
}

function isRealizationEdge(cell: Cell.Properties) {
   return cell.shape === "edge" && cell.edgeType === "realization";
}

const defaultAttrs = {
   line: { stroke: "#000000", strokeWidth: 2 },
   lines: { connection: true, strokeLinejoin: "round" },
   wrap: { strokeWidth: 10 },
};

function setEdgeStrokeWidth(edge: Edge, strokeWidth: number) {
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         strokeWidth,
      },
   });
}

function setEdgeConnectionPoint(edge: Edge, sourceOffset = 0, targetOffset = 0) {
   edge.prop("source/connectionPoint", {
      name: "anchor",
      args: {
         offset: sourceOffset,
      },
   });
   edge.prop("target/connectionPoint", {
      name: "anchor",
      args: {
         offset: targetOffset,
      },
   });
}

function setRegularEdge(edge: Edge) {
   setEdgeConnectionPoint(edge, 0, -2);
   edge.setProp("edgeType", "classic");
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         targetMarker: {
            size: 0,
         },
      },
   });
}

function setAggregationEdge(edge: Edge) {
   setEdgeConnectionPoint(edge);
   edge.setProp("edgeType", "aggregation");
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         targetMarker: {
            name: "path",
            d: "M 30 10 L 18 18 L 6 10 L 18 2 z",
            fill: "black",
            offsetX: -12,
         },
      },
   });
}

function setAssociationEdge(edge: Edge) {
   setEdgeConnectionPoint(edge);
   edge.setProp("edgeType", "association");
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         targetMarker: {
            name: "path",
            d: "M 6 10 L 18 4 C 14.3333 6 10.6667 8 7 10 L 18 16 z",
            fill: "black",
            offsetX: -5,
         },
      },
   });
}

function setCompositionEdge(edge: Edge) {
   setEdgeConnectionPoint(edge);
   edge.setProp("edgeType", "composition");
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         sourceMarker: {
            name: "path",
            d: "M 30 10 L 20 16 L 10 10 L 20 4 z",
            fill: "black",
            offsetX: -10,
         },
         targetMarker: {
            name: "path",
            d: "M 6 10 L 18 4 C 14.3333 6 10.6667 8 7 10 L 18 16 z",
            fill: "black",
            offsetX: -5,
         },
      },
   });
}

function setGeneralizationEdge(edge: Edge) {
   setEdgeConnectionPoint(edge);
   edge.setProp("edgeType", "generalization");
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         targetMarker: {
            name: "path",
            d: "M 6 10 L 18 4 L 18 5 L 8 10 L 18 15 L 18 16 z",
            strokeWidth: 1.5,
            fill: "black",
            offsetX: -5,
         },
      },
   });
}

function setRealizationEdge(edge: Edge) {
   setEdgeConnectionPoint(edge);
   edge.setProp("edgeType", "realization");
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         strokeDasharray: "3,3",
         targetMarker: {
            name: "path",
            d: "M 20 0 L 0 10 L 20 20 z",
            fill: "white",
            offsetX: -10,
         },
      },
   });
}

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

export default {
   isRegularEdge,
   isAggregationEdge,
   isAssociationEdge,
   isCompositionEdge,
   isGeneralizationEdge,
   isRealizationEdge,
   setRegularEdge,
   setAggregationEdge,
   setAssociationEdge,
   setCompositionEdge,
   setGeneralizationEdge,
   setRealizationEdge,
};
