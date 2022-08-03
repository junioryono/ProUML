import { Graph, NodeView, Edge, Dom, Cell, ObjectExt } from "@antv/x6";
import { Dnd } from "@antv/x6/es/addon/dnd";
import { Halo } from "@antv/x6/es/addon/halo";
import {
  onBlankContextMenu,
  onErase,
  onCtrlC,
  onCtrlV,
  onCtrlZ,
  onCtrlShiftZ,
  onContextMenu,
  onAdded,
  onRemoved,
  onSelected,
  onMove,
  onMoved,
  onChangePosition,
  onResize,
  onResized,
  onRotate,
  onRotated,
} from "./listeners";

class SimpleNodeView extends NodeView {
  protected renderMarkup() {
    return this.renderJSONMarkup({
      tagName: "rect",
      selector: "body",
    });
  }

  update() {
    super.update({
      body: {
        refWidth: "100%",
        refHeight: "100%",
        fill: "#31d0c6",
      },
    });
  }
}

export function initGraph(container: HTMLDivElement, minimapContainer: HTMLDivElement) {
  return new Graph({
    container: container,
    history: {
      enabled: true,
      beforeAddCommand(event, args: any) {
        if (args?.options?.ignoreHistory) {
          return false;
        }

        return true;
      },
    },
    resizing: true,
    connecting: {
      allowBlank: false,
      createEdge() {
        return new Edge();
      },
      validateConnection({ sourceCell, targetCell }) {
        if (!sourceCell || !targetCell || sourceCell.id === targetCell.id) {
          return false;
        }

        return true;
      },
    },
    selecting: {
      enabled: true,
      rubberband: true,
      multiple: true,
      strict: true,
      showNodeSelectionBox: true,
      // selectCellOnMoved: true,
      // selectNodeOnMoved: true,
      useCellGeometry: true,
    },
    rotating: true,
    snapline: {
      enabled: true,
      sharp: true,
    },
    grid: {
      visible: true,
    },
    scroller: {
      enabled: true,
      width: window.innerWidth - 500,
      height: window.innerHeight - 106,
      pageVisible: true,
    },
    minimap: {
      enabled: true,
      container: minimapContainer,
      width: 235,
      height: 150,
      padding: 20,
      graphOptions: {
        async: true,
        getCellView(cell) {
          if (cell.isNode()) {
            return SimpleNodeView;
          }
        },
        createCellView(cell) {
          if (cell.isEdge()) {
            return null;
          }
        },
      },
    },
    embedding: {
      enabled: true,
      findParent({ node }) {
        const bbox = node.getBBox();
        return this.getNodes().filter((parent) => {
          const data = parent.getData<any>();
          if (data && data.parent) {
            const targetBBox = parent.getBBox();
            return targetBBox.containsRect(bbox);
          }
          return false;
        });
      },
      validate({ parent }) {
        const data = parent.getData<any>();
        if (data == null || data.parent == null) {
          return false;
        }
        return true;
      },
    },
    clipboard: {
      enabled: true,
    },
    keyboard: {
      enabled: true,
      global: true,
    },
    mousewheel: {
      enabled: true,
      modifiers: ["ctrl", "alt"],
    },
  });
}

export function initListeners(
  graph: Graph,
  container: HTMLDivElement,
  forceRender: () => void,
  setSelectedCells: React.Dispatch<React.SetStateAction<Cell<Cell.Properties> | Cell<Cell.Properties>[] | undefined>>,
) {
  graph.bindKey("delete", () => onErase(graph));
  graph.bindKey("backspace", () => onErase(graph));
  graph.bindKey("ctrl+c", () => onCtrlC(graph));
  graph.bindKey("ctrl+v", () => onCtrlV(graph));
  graph.bindKey("ctrl+z", () => onCtrlZ(graph));
  graph.bindKey("ctrl+shift+z", () => onCtrlShiftZ(graph));

  graph.on("blank:contextmenu", (position) => onBlankContextMenu(graph, container, position));

  graph.on("node:contextmenu", (handler) => onContextMenu(graph, setSelectedCells, handler));

  graph.on("node:added", (handler) => onAdded(graph, handler));
  graph.on("node:removed", (handler) => onRemoved(graph, setSelectedCells, handler));
  graph.on("node:selected", (handler) => onSelected(graph, setSelectedCells, handler));

  graph.on("node:move", (handler) => onMove(graph, setSelectedCells, handler));
  graph.on("node:moved", (handler) => onMoved(graph, forceRender, setSelectedCells, handler));

  graph.on("node:change:position", (handler) => onChangePosition(graph, handler));

  // graph.on("node:change:size", (handler) => {});
  graph.on("node:resize", (handler) => onResize(graph, setSelectedCells, handler));
  graph.on("node:resized", (handler) => onResized(graph, forceRender, handler));

  graph.on("node:rotate", (handler) => onRotate(graph, setSelectedCells, handler));
  graph.on("node:rotated", (_handler) => onRotated(graph, forceRender));
}

export function initDragAndDrop(graph: Graph) {
  return new Dnd({
    target: graph as any,
    animation: true,
    getDragNode(sourceNode, options) {
      console.log("getDragNode", sourceNode, options);
      return sourceNode.clone();
    },
    getDropNode(draggingNode, options) {
      console.log("getDropNode", draggingNode, options);
      return draggingNode.clone();
    },
    validateNode(droppingNode, options) {
      console.log("validateNode", droppingNode, options);

      return droppingNode.shape === "html"
        ? new Promise<boolean>((resolve) => {
            const { draggingNode, draggingGraph } = options;
            const view = draggingGraph.findView(draggingNode);
            if (view === null) {
              return;
            }
            const contentElem = view.findOne("foreignObject > body > div");
            Dom.addClass(contentElem, "validating");
            setTimeout(() => {
              Dom.removeClass(contentElem, "validating");
              resolve(true);
            }, 3000);
          })
        : true;
    },
  });
}

export function startDrag(graph: Graph | undefined, dnd: Dnd | undefined, e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  if (!graph || !dnd) {
    return;
  }

  const target = e.currentTarget;
  const type = target.getAttribute("data-type");

  let node: any;

  if (type === "class") {
    node = graph.createNode({
      shape: "class",
      name: ["<<Abstract>>", "动物"],
      variables: ["+有生命"],
      methods: ["+新陈代谢()", "+繁殖()"],
    });
  } else if (type === "rect") {
    node = graph.createNode({
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: "Rect",
          fill: "#6a6c8a",
        },
        body: {
          stroke: "#31d0c6",
          strokeWidth: 2,
        },
      },
    });
  } else if (type === "circle") {
    node = graph.createNode({
      width: 60,
      height: 60,
      shape: "html",
      html: () => {
        const wrap = document.createElement("div");
        wrap.style.width = "100%";
        wrap.style.height = "100%";
        wrap.style.display = "flex";
        wrap.style.alignItems = "center";
        wrap.style.justifyContent = "center";
        wrap.style.border = "2px solid rgb(49, 208, 198)";
        wrap.style.background = "#fff";
        wrap.style.borderRadius = "100%";
        wrap.innerText = "Circle";
        return wrap;
      },
    });
  }

  dnd.start(node as any, e.nativeEvent as any);
}

export function deleteOneCellGroup(graph: Graph, group: string): void {
  if (!graph || !group) {
    return;
  }

  const currentCells = graph.getCells();
  const indexOfFirstElementInGroup = currentCells.findIndex((insideCell) => insideCell.getProp("group") === group);
  if (indexOfFirstElementInGroup === -1) {
    return;
  }

  const indexOfSecondElementInGroup = currentCells.findIndex((insideCell, index) => index !== indexOfFirstElementInGroup && insideCell.getProp("group") === group);
  if (indexOfSecondElementInGroup === -1) {
    currentCells[indexOfFirstElementInGroup].removeProp("group");
  }
}

Graph.registerNode(
  "class",
  {
    inherit: "rect",
    // component: <AlgoNode />, TODO: switch to component
    markup: [
      {
        tagName: "rect",
        selector: "body",
      },
      {
        tagName: "rect",
        selector: "name-rect",
      },
      {
        tagName: "rect",
        selector: "variables-rect",
      },
      {
        tagName: "rect",
        selector: "methods-rect",
      },
      {
        tagName: "text",
        selector: "name-text",
      },
      {
        tagName: "text",
        selector: "variables-text",
      },
      {
        tagName: "text",
        selector: "methods-text",
      },
    ],
    attrs: {
      rect: {
        width: 400,
      },
      "name-rect": {
        fill: "#FC8830",
        stroke: "#fff",
        strokeWidth: 0.5,
      },
      "variables-rect": {
        fill: "#fda059",
        stroke: "#fff",
        strokeWidth: 0.5,
      },
      "methods-rect": {
        fill: "#fda059",
        stroke: "#fff",
        strokeWidth: 0.5,
      },
      "name-text": {
        ref: "name-rect",
        refY: 0.5,
        refX: 0.5,
        textAnchor: "middle",
        fontWeight: "bold",
        fill: "black",
        fontSize: 12,
      },
      "variables-text": {
        ref: "variables-rect",
        refY: 0.5,
        refX: 5,
        textAnchor: "left",
        fill: "black",
        fontSize: 12,
        lineHeight: 15,
      },
      "methods-text": {
        ref: "methods-rect",
        refY: 0.5,
        refX: 5,
        textAnchor: "left",
        fill: "black",
        fontSize: 12,
        lineHeight: 15,
      },
    },
    propHooks(meta) {
      const { name, variables, methods, ...others } = meta;

      if (!name) {
        return meta;
      }

      const variableStrings = variables?.map((variable: any) => variable.string) || [""];
      const methodStrings = methods?.map((method: any) => method.string) || [""];
      const rects = [
        { type: "name", text: name },
        { type: "variables", text: variableStrings },
        { type: "methods", text: methodStrings },
      ];

      let highestTextLength = 0;
      for (const rect of rects) {
        for (const textString of rect.text) {
          if (textString && textString.length > highestTextLength) highestTextLength = textString.length;
        }
      }

      const offsetX = highestTextLength * 6 + 20;
      let offsetY = 0;
      rects.forEach((rect) => {
        const height = rect.text.length * 15 + 16;
        ObjectExt.setByPath(others, `attrs/${rect.type}-text/text`, rect.text.join("\n"));
        ObjectExt.setByPath(others, `attrs/${rect.type}-rect/width`, offsetX);
        ObjectExt.setByPath(others, `attrs/${rect.type}-rect/height`, height);
        ObjectExt.setByPath(others, `attrs/${rect.type}-rect/transform`, "translate(0," + offsetY + ")");
        offsetY += height;
      });

      others.size = { width: offsetX, height: offsetY };

      this.on("change:size", (handler) => {
        console.log("handler", handler);
        const newWidth = handler.current?.width || 0;
        const heightDifference = (handler.current?.height || 0) - (handler.previous?.height || 0);

        const eachRectHeightDifference = heightDifference / rects.length;

        let newOffsetY = 0;
        rects.forEach((rect) => {
          const oldHeight = this.getAttrByPath(`${rect.type}-rect/height`);
          if (typeof oldHeight !== "number") {
            return;
          }

          const newRectHeight = oldHeight + eachRectHeightDifference;

          if (newWidth > 0) {
            this.setAttrByPath(`${rect.type}-rect/width`, newWidth);
          }

          if (newRectHeight > 0 && newOffsetY > 0) {
            this.setAttrByPath(`${rect.type}-rect/height`, newRectHeight);
            this.setAttrByPath(`${rect.type}-rect/transform`, "translate(0," + newOffsetY + ")");
          }

          // ObjectExt.setByPath(others, `attrs/${rect.type}-rect/width`, 30);
          // ObjectExt.setByPath(others, `attrs/${rect.type}-rect/height`, newRectHeight);
          // ObjectExt.setByPath(others, `attrs/${rect.type}-rect/transform`, "translate(0," + newOffsetY + ")");
          newOffsetY += newRectHeight;
        });

        others.size = { width: newWidth, height: newOffsetY };
      });

      return others;
    },
  },
  true,
);

Graph.registerEdge(
  "extends",
  {
    inherit: "edge",
    attrs: {
      line: {
        strokeWidth: 1,
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

Graph.registerEdge(
  "implements",
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

Graph.registerEdge(
  "composition",
  {
    inherit: "edge",
    attrs: {
      line: {
        strokeWidth: 1,
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
    },
  },
  true,
);

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

Graph.registerEdge(
  "association",
  {
    inherit: "edge",
    attrs: {
      line: {
        strokeWidth: 1,
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
