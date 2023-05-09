import type { Graph, Cell, Edge } from "@antv/x6";

export function isRegularEdge(cell: Cell.Properties) {
   return cell.shape === "edge" && (!cell.edgeType || cell.edgeType === "classic");
}

export function isAggregationEdge(cell: Cell.Properties) {
   return cell.shape === "edge" && cell.edgeType === "aggregation";
}

export function isAssociationEdge(cell: Cell.Properties) {
   return cell.shape === "edge" && cell.edgeType === "association";
}

export function isAssociationSource(cell: Cell.Properties) {}

export function isCompositionEdge(cell: Cell.Properties) {
   return cell.shape === "edge" && cell.edgeType === "composition";
}

export function isGeneralizationEdge(cell: Cell.Properties) {
   return cell.shape === "edge" && cell.edgeType === "generalization";
}

export function isRealizationEdge(cell: Cell.Properties) {
   return cell.shape === "edge" && cell.edgeType === "realization";
}

export const defaultAttrs = {
   line: { stroke: "#000000", strokeWidth: 2, strokeDasharray: undefined },
   lines: { connection: true, strokeLinejoin: "round" },
   wrap: { strokeWidth: 10 },
};

const dashedLine = {
   strokeDasharray: "3,3",
};

const solidLine = {
   strokeDasharray: undefined,
};

export function setEdgeStrokeColor(edge: Edge, color: string) {
   const edgeLine = edge.getPropByPath("attrs/line");
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         ...(typeof edgeLine === "object" ? edgeLine : {}),
         stroke: color,
      },
   });
}

export function isEdgeDashed(edge: Edge) {
   return edge.getPropByPath("attrs/line/strokeDasharray") === "3,3";
}

export function setEdgeStrokeDasharray(edge: Edge, dashed = true) {
   const edgeLine = edge.getPropByPath("attrs/line");
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         ...(typeof edgeLine === "object" ? edgeLine : {}),
         ...(dashed ? dashedLine : solidLine),
      },
   });
}

function setEdgeStrokeWidth(edge: Edge, strokeWidth: number) {
   const edgeLine = edge.getPropByPath("attrs/line");
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

const classicMarker = {
   type: "classic",
   size: 0,
};

export function setRegularEdgeTarget(edge: Edge) {
   const edgeLine = edge.getPropByPath("attrs/line");
   setEdgeConnectionPoint(edge, 0, -2);
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         ...(typeof edgeLine === "object" ? edgeLine : {}),
         targetMarker: classicMarker,
      },
   });
}
export function setRegularEdgeSource(edge: Edge) {
   const edgeLine = edge.getPropByPath("attrs/line");
   setEdgeConnectionPoint(edge, -2, 0);
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         ...(typeof edgeLine === "object" ? edgeLine : {}),
         sourceMarker: classicMarker,
      },
   });
}

const aggregationMarker = {
   type: "aggregation",
   name: "path",
   d: "M 30 10 L 18 18 L 6 10 L 18 2 z",
   fill: "black",
   offsetX: -12,
};

export function setAggregationEdgeTarget(edge: Edge) {
   const edgeLine = edge.getPropByPath("attrs/line");
   setEdgeConnectionPoint(edge);
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         ...(typeof edgeLine === "object" ? edgeLine : {}),
         targetMarker: aggregationMarker,
      },
   });
}

export function setAggregationEdgeSource(edge: Edge) {
   const edgeLine = edge.getPropByPath("attrs/line");
   setEdgeConnectionPoint(edge);
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         ...(typeof edgeLine === "object" ? edgeLine : {}),
         sourceMarker: aggregationMarker,
      },
   });
}

const associationMarker = {
   type: "association",
   name: "path",
   d: "M 6 10 L 18 4 C 14.3333 6 10.6667 8 7 10 L 18 16 z",
   fill: "black",
   offsetX: -5,
};

export function setAssociationEdgeTarget(edge: Edge) {
   const edgeLine = edge.getPropByPath("attrs/line");
   setEdgeConnectionPoint(edge);
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         ...(typeof edgeLine === "object" ? edgeLine : {}),
         targetMarker: associationMarker,
      },
   });
}

export function setAssociationEdgeSource(edge: Edge) {
   const edgeLine = edge.getPropByPath("attrs/line");
   setEdgeConnectionPoint(edge);
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         ...(typeof edgeLine === "object" ? edgeLine : {}),
         sourceMarker: associationMarker,
      },
   });
}

const compositionMarker = {
   type: "composition",
   name: "path",
   d: "M 30 10 L 20 16 L 10 10 L 20 4 z",
   fill: "black",
   offsetX: -10,
};

export function setCompositionEdgeTarget(edge: Edge) {
   const edgeLine = edge.getPropByPath("attrs/line");
   setEdgeConnectionPoint(edge);
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         ...(typeof edgeLine === "object" ? edgeLine : {}),
         targetMarker: compositionMarker,
      },
   });
}

export function setCompositionEdgeSource(edge: Edge) {
   const edgeLine = edge.getPropByPath("attrs/line");
   setEdgeConnectionPoint(edge);
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         ...(typeof edgeLine === "object" ? edgeLine : {}),
         sourceMarker: compositionMarker,
      },
   });
}

const generalizationMarker = {
   type: "generalization",
   name: "path",
   d: "M 6 10 L 18 4 L 18 5 L 8 10 L 18 15 L 18 16 z",
   strokeWidth: 1.5,
   fill: "black",
   offsetX: -5,
};

export function setGeneralizationEdgeTarget(edge: Edge) {
   const edgeLine = edge.getPropByPath("attrs/line");
   setEdgeConnectionPoint(edge);
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         ...(typeof edgeLine === "object" ? edgeLine : {}),
         targetMarker: generalizationMarker,
      },
   });
}

export function setGeneralizationEdgeSource(edge: Edge) {
   const edgeLine = edge.getPropByPath("attrs/line");
   setEdgeConnectionPoint(edge);
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         ...(typeof edgeLine === "object" ? edgeLine : {}),
         sourceMarker: generalizationMarker,
      },
   });
}

const realizationMarker = {
   type: "realization",
   name: "path",
   d: "M 20 0 L 0 10 L 20 20 z",
   fill: "white",
   offsetX: -10,
};

export function setRealizationEdgeTarget(edge: Edge) {
   const edgeLine = edge.getPropByPath("attrs/line");
   setEdgeConnectionPoint(edge);
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         ...(typeof edgeLine === "object" ? edgeLine : {}),
         targetMarker: realizationMarker,
      },
   });
}

export function setRealizationEdgeSource(edge: Edge) {
   const edgeLine = edge.getPropByPath("attrs/line");
   setEdgeConnectionPoint(edge);
   edge.setProp("attrs", {
      ...defaultAttrs,
      line: {
         ...defaultAttrs.line,
         ...(typeof edgeLine === "object" ? edgeLine : {}),
         sourceMarker: realizationMarker,
      },
   });
}

export function getEdgeSourceType(edge: Edge): string | undefined {
   const srcMarker = edge.getPropByPath("attrs/line/sourceMarker");
   if (!srcMarker) return undefined;

   const t = srcMarker["type"];
   if (!t) return undefined;

   return t;
}

export function getEdgeTargetType(edge: Edge): string | undefined {
   const targetMarker = edge.getPropByPath("attrs/line/targetMarker");
   if (!targetMarker) return undefined;

   const t = targetMarker["type"];
   if (!t) return undefined;

   return t;
}

export default {
   isRegularEdge,
   isAggregationEdge,
   isCompositionEdge,
   isGeneralizationEdge,
   isRealizationEdge,
   setRegularEdgeTarget,
   setRegularEdgeSource,
   setAggregationEdgeTarget,
   setAggregationEdgeSource,
   setCompositionEdgeTarget,
   setCompositionEdgeSource,
   setGeneralizationEdgeTarget,
   setGeneralizationEdgeSource,
   setRealizationEdgeTarget,
   setRealizationEdgeSource,
};
