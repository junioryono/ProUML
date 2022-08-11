import { Graph, NodeView, Edge, Dom, Cell, ObjectExt, Node } from "@antv/x6";
import { Dnd } from "@antv/x6/es/addon/dnd";
import { Halo } from "@antv/x6/es/addon/halo";
import "@antv/x6-react-shape";
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
  onResizing,
  onResized,
  onRotate,
  onRotated,
} from "./listeners";
import { useCallback, useEffect, useRef, useState } from "react";
import { Slate, Editable, withReact, ReactEditor, RenderLeafProps } from "slate-react";
import StarterKit from "@tiptap/starter-kit";
import { useEditor } from "@tiptap/react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { supabase } from "supabase/supabase";

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
    createSelectionManager(this) {
      const selectionManager = new Graph.SelectionManager(this);
      selectionManager.options.preventDefaultDblClick = false;
      return selectionManager;
    },
  });
}

export function initListeners(
  graph: Graph,
  container: HTMLDivElement,
  documentId: string,
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
  graph.on("node:resizing", (handler) => onResizing(graph, handler));
  graph.on("node:resized", (handler) => onResized(graph, forceRender, handler));

  graph.on("node:rotate", (handler) => onRotate(graph, setSelectedCells, handler));
  graph.on("node:rotated", (_handler) => onRotated(graph, forceRender));

  graph.on("node:change:*", (handler) => {
    const subscriptions = supabase.getSubscriptions();
    console.log("subscriptions", subscriptions);

    const graphJSON = { ...graph.toJSON(), userEdit: supabase.auth.session()?.user?.id };
    console.log("graphJSON", graphJSON);
    supabase
      .from("document")
      .update({ json: JSON.stringify(graphJSON) })
      .match({ id: documentId });
  });
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
      width: 250,
      height: 100,
      data: {
        name: ["<<Abstract>>", "ClassName"],
        variables: [
          {
            static: false,
            string: "+ variableName: boolean",
            toString() {
              return this.string;
            },
          },
        ],
        methods: [
          {
            static: false,
            string: "+ methodName(arg: String): void",
            toString() {
              return this.string;
            },
          },
        ],
      },
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

function getTextWidth(text: string, font: string = "14px 'Inter',sans-serif") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return 0;
  }

  context.font = font || getComputedStyle(document.body).font;

  return context.measureText(text).width * 1.15;
}

function getTextHeight(text: string, font: string = "14px 'Inter',sans-serif") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return 0;
  }

  context.font = font;
  const metrics = context.measureText(text);
  const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  console.log("actualHeight", actualHeight);

  return actualHeight;
}

type ClassNode = {
  name: string[];
  variables: { static: boolean; string: string; toString(): string }[] | undefined;
  methods: { static: boolean; string: string; toString(): string }[] | undefined;
};

function ClassComponent({ node }: { node?: Node }) {
  const enum Section {
    Name,
    Variables,
    Methods,
  }

  const [selectedSection, setSelectedSection] = useState<Section>();
  const nameInputRef = useRef<HTMLTextAreaElement>(null);
  const variablesInputRef = useRef<HTMLTextAreaElement>(null);
  const methodsInputRef = useRef<HTMLTextAreaElement>(null);

  const nameDivRef = useRef<HTMLDivElement>(null);
  const variablesDivRef = useRef<HTMLDivElement>(null);
  const methodsDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedSection === Section.Name) {
      nameInputRef.current?.select();
    } else if (selectedSection === Section.Variables) {
      variablesInputRef.current?.select();
    } else if (selectedSection === Section.Methods) {
      methodsInputRef.current?.select();
    }
  }, [selectedSection]);

  const [fontSize, setFontSize] = useState(14);
  const [borderWidth, setBorderWidth] = useState(1);
  const [name, setName] = useState("");
  const [variables, setVariables] = useState("");
  const [methods, setMethods] = useState("");
  const [minimumHeight, setMinimumHeight] = useState({ name: 0, variables: 0, methods: 0 });

  useEffect(() => {
    if (!node || fontSize === undefined || borderWidth === undefined) {
      return;
    }

    const data = node.getData() as ClassNode;

    if (!data) {
      return;
    }

    let highestWidth = 150;
    let height = 0;

    if (data.name) {
      for (const nameT of data.name) {
        const width = getTextWidth(nameT);
        if (width > highestWidth) {
          highestWidth = width;
        }
      }
      const minHeight = data.name.length * fontSize * 1.5 + borderWidth;
      height += minHeight;
      setMinimumHeight((current) => ({ ...current, name: minHeight }));
      setName(data.name.join("\n"));
    }

    if (data.variables) {
      for (const nameT of data.variables) {
        if (nameT.toString() !== nameT.string) {
          nameT.toString = function () {
            return this.string;
          };
        }
        const width = getTextWidth(nameT.string);
        if (width > highestWidth) {
          highestWidth = width;
        }
      }
      const minHeight = (data.variables?.length || 0) * fontSize * 1.5 + borderWidth;
      height += minHeight;
      setMinimumHeight((current) => ({ ...current, variables: minHeight }));
      setVariables(data.variables.join("\n"));
    }

    if (data.methods) {
      for (const nameT of data.methods) {
        if (nameT.toString() !== nameT.string) {
          nameT.toString = function () {
            return this.string;
          };
        }
        const width = getTextWidth(nameT.string);
        if (width > highestWidth) {
          highestWidth = width;
        }
      }

      const minHeight = (data.methods?.length || 0) * fontSize * 1.5 + borderWidth;
      height += minHeight;
      setMinimumHeight((current) => ({ ...current, methods: minHeight }));
      setMethods(data.methods.join("\n"));
    }

    node.setAttrs({
      minimum: {
        width: highestWidth,
        height: height,
      },
    });
  }, [node, fontSize, borderWidth]);

  // useEffect(() => {
  //   console.log("variables", variables);
  // }, [variables]);

  useEffect(() => {
    if (node) {
      node.on("change:size", (e) => {
        const previous = e.previous?.height || 0;
        const now = e.current?.height || 0;

        const different = now - previous;
        setMinimumHeight((current) => ({
          name: current.name + different / 3,
          variables: current.variables + different / 3,
          methods: current.methods + different / 3,
        }));
      });

      return () => {
        node.off();
      };
    }
  }, [node]);

  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    color: "black",
    whiteSpace: "pre-line",
    fontSize: 14,
    height: minimumHeight.name + minimumHeight.variables + minimumHeight.methods,
    border: "1px solid black",
  } as React.CSSProperties;

  const nameStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid black",
    height: minimumHeight.name,
    textAlign: "center",
  } as React.CSSProperties;
  const variablesStyles = {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid black",
    paddingLeft: 8,
    height: minimumHeight.variables,
  } as React.CSSProperties;
  const methodsStyles = { display: "flex", alignItems: "center", paddingLeft: 8, height: minimumHeight.methods } as React.CSSProperties;

  const unselectOnEndEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>, text: string) => {
    if (selectedSection !== undefined && e.key === "Enter" && (e.target.selectionStart !== text.length || (e.target.selectionStart === text.length && e.shiftKey))) {
      setMinimumHeight((current) => {
        const oldLineLength = text.split("\n").length;
        const oldLineHeight = selectedSection === Section.Name ? current.name : selectedSection === Section.Variables ? current.variables : current.methods;
        const newLineLength = oldLineLength + 1;
        const newLineHeight = newLineLength * (oldLineHeight / oldLineLength);
        const lineHeightDifference = newLineHeight - oldLineHeight;
        const currentNodeSize = node?.getSize() || { width: 0, height: 0 };

        node?.setSize(
          {
            ...currentNodeSize,
            height: currentNodeSize.height + lineHeightDifference,
          },
          {
            silent: true,
          },
        );

        return {
          ...current,
          [selectedSection === Section.Name ? "name" : selectedSection === Section.Variables ? "variables" : "methods"]: newLineHeight,
        };
      });

      return;
    }

    if (e.key === "Enter") {
      setSelectedSection(undefined);
    }
  };

  return (
    <div style={containerStyles}>
      <div style={nameStyles} onDoubleClick={() => setSelectedSection(Section.Name)}>
        {selectedSection === Section.Name ? (
          <ClickAwayListener onClickAway={() => setSelectedSection(undefined)}>
            <textarea
              ref={nameInputRef}
              style={{ height: nameStyles.height, width: nameDivRef.current?.clientWidth, textAlign: "center" }}
              className="documentInput"
              value={name}
              onChange={(e) => {
                if (!node) {
                  return;
                }
                node.setData({
                  name: e.target.value.split("\n"),
                });
                setName(e.target.value);
              }}
              onKeyDown={(e) => unselectOnEndEnter(e, name)}
            />
          </ClickAwayListener>
        ) : (
          <div ref={nameDivRef} style={{ height: nameStyles.height }}>
            {name}
          </div>
        )}
      </div>
      <div style={variablesStyles} onDoubleClick={() => setSelectedSection(Section.Variables)}>
        {selectedSection === Section.Variables ? (
          <ClickAwayListener onClickAway={() => setSelectedSection(undefined)}>
            <textarea
              ref={variablesInputRef}
              style={{ height: variablesStyles.height, width: variablesDivRef.current?.clientWidth }}
              className="documentInput"
              value={variables}
              onChange={(e) => {
                if (!node) {
                  return;
                }
                const split = e.target.value.split("\n");
                const variables = node.getData().variables;
                const mapping = variables.map((variable: any, index: any) => {
                  return {
                    ...variable,
                    string: split[index],
                  };
                });
                node.setData({
                  variables: mapping,
                });
                setVariables(e.target.value);
              }}
              onKeyDown={(e) => unselectOnEndEnter(e, variables)}
            />
          </ClickAwayListener>
        ) : (
          <div ref={variablesDivRef} style={{ height: variablesStyles.height }}>
            {variables}
          </div>
        )}
      </div>
      <div style={methodsStyles} onDoubleClick={() => setSelectedSection(Section.Methods)}>
        {selectedSection === Section.Methods ? (
          <ClickAwayListener onClickAway={() => setSelectedSection(undefined)}>
            <textarea
              ref={methodsInputRef}
              style={{ height: methodsStyles.height, width: methodsDivRef.current?.clientWidth }}
              className="documentInput"
              value={methods}
              onChange={(e) => {
                if (!node) {
                  return;
                }
                const split = e.target.value.split("\n");
                const methods = node.getData().methods;
                const mapping = split.map((string, index) => {
                  return {
                    static: methods[index] && !!methods[index].static ? true : false,
                    string,
                    toString: function () {
                      return this.string;
                    },
                  };
                });

                node.setData({
                  methods: mapping,
                });
                setMethods(e.target.value);
              }}
              onKeyDown={(e) => unselectOnEndEnter(e, methods)}
            />
          </ClickAwayListener>
        ) : (
          <div ref={methodsDivRef} style={{ height: methodsStyles.height }}>
            {methods}
          </div>
        )}
      </div>
    </div>
  );
}

Graph.registerNode(
  "class",
  {
    inherit: "react-shape",
    component: <ClassComponent />,
    data: {
      name: undefined,
      variables: undefined,
      methods: undefined,
    },
  },
  true,
);

// Graph.registerNode(
//   "class",
//   {
//     inherit: "rect",
//     // component: <AlgoNode />, TODO: switch to component
//     markup: [
//       {
//         tagName: "rect",
//         selector: "body",
//       },
//       {
//         tagName: "rect",
//         selector: "name-rect",
//       },
//       {
//         tagName: "rect",
//         selector: "variables-rect",
//       },
//       {
//         tagName: "rect",
//         selector: "methods-rect",
//       },
//       {
//         tagName: "text",
//         selector: "name-text",
//       },
//       {
//         tagName: "text",
//         selector: "variables-text",
//       },
//       {
//         tagName: "text",
//         selector: "methods-text",
//       },
//     ],
//     attrs: {
//       rect: {
//         width: 400,
//       },
//       "name-rect": {
//         fill: "#FC8830",
//         stroke: "#fff",
//         strokeWidth: 0.5,
//       },
//       "variables-rect": {
//         fill: "#fda059",
//         stroke: "#fff",
//         strokeWidth: 0.5,
//       },
//       "methods-rect": {
//         fill: "#fda059",
//         stroke: "#fff",
//         strokeWidth: 0.5,
//       },
//       "name-text": {
//         ref: "name-rect",
//         refY: 0.5,
//         refX: 0.5,
//         textAnchor: "middle",
//         fontWeight: "bold",
//         fill: "black",
//         fontSize: 12,
//       },
//       "variables-text": {
//         ref: "variables-rect",
//         refY: 0.5,
//         refX: 5,
//         textAnchor: "left",
//         fill: "black",
//         fontSize: 12,
//         lineHeight: 15,
//       },
//       "methods-text": {
//         ref: "methods-rect",
//         refY: 0.5,
//         refX: 5,
//         textAnchor: "left",
//         fill: "black",
//         fontSize: 12,
//         lineHeight: 15,
//       },
//     },
//     propHooks(meta) {
//       const { name, variables, methods, ...others } = meta;

//       if (!name) {
//         return meta;
//       }

//       const variableStrings = variables?.map((variable: any) => variable.string) || [""];
//       const methodStrings = methods?.map((method: any) => method.string) || [""];
//       const rects = [
//         { type: "name", text: name },
//         { type: "variables", text: variableStrings },
//         { type: "methods", text: methodStrings },
//       ];

//       let highestTextLength = 0;
//       for (const rect of rects) {
//         for (const textString of rect.text) {
//           if (textString && textString.length > highestTextLength) highestTextLength = textString.length;
//         }
//       }

//       const offsetX = highestTextLength * 6 + 20;
//       let offsetY = 0;
//       rects.forEach((rect) => {
//         const height = rect.text.length * 15 + 16;
//         ObjectExt.setByPath(others, `attrs/${rect.type}-text/text`, rect.text.join("\n"));
//         ObjectExt.setByPath(others, `attrs/${rect.type}-rect/width`, offsetX);
//         ObjectExt.setByPath(others, `attrs/${rect.type}-rect/height`, height);
//         ObjectExt.setByPath(others, `attrs/${rect.type}-rect/transform`, "translate(0," + offsetY + ")");
//         offsetY += height;
//       });

//       others.size = { width: offsetX, height: offsetY };

//       this.on("change:size", (handler) => {
//         console.log("handler", handler);
//         const newWidth = handler.current?.width || 0;
//         const heightDifference = (handler.current?.height || 0) - (handler.previous?.height || 0);

//         const eachRectHeightDifference = heightDifference / rects.length;

//         let newOffsetY = 0;
//         rects.forEach((rect) => {
//           const oldHeight = this.getAttrByPath(`${rect.type}-rect/height`);
//           if (typeof oldHeight !== "number") {
//             return;
//           }

//           const newRectHeight = oldHeight + eachRectHeightDifference;

//           if (newWidth > 0) {
//             this.setAttrByPath(`${rect.type}-rect/width`, newWidth);
//           }

//           if (newRectHeight > 0 && newOffsetY > 0) {
//             this.setAttrByPath(`${rect.type}-rect/height`, newRectHeight);
//             this.setAttrByPath(`${rect.type}-rect/transform`, "translate(0," + newOffsetY + ")");
//           }

//           // ObjectExt.setByPath(others, `attrs/${rect.type}-rect/width`, 30);
//           // ObjectExt.setByPath(others, `attrs/${rect.type}-rect/height`, newRectHeight);
//           // ObjectExt.setByPath(others, `attrs/${rect.type}-rect/transform`, "translate(0," + newOffsetY + ")");
//           newOffsetY += newRectHeight;
//         });

//         others.size = { width: newWidth, height: newOffsetY };
//       });

//       return others;
//     },
//   },
//   true,
// );

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
