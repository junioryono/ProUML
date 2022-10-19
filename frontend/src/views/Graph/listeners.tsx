import { Cell, Graph, JQuery, Model, NodeView, ToolsView } from "@antv/x6";
import { Halo } from "@antv/x6/es/addon/halo";
// import ReactDomClient from "react-dom/client";
import { ContextMenu, FullContextMenu } from "./contextmenu";
import { deleteOneCellGroup } from "./utils";

export function onBlankContextMenu(graph: Graph, container: HTMLDivElement, position: any) {
  if (!graph || !container) {
    return;
  }

  graph.cleanSelection();

  const knob = ToolsView.createElement("div", false) as HTMLDivElement;
  // const knobRoot = ReactDomClient.createRoot(knob);

  knob.style.position = "absolute";
  knob.style.left = `${position.x}px`;
  knob.style.top = `${position.y}px`;

  container.appendChild(knob);

  const contextMenuProps = [
    {
      text: "Select All",
      onClick() {
        for (const cell of graph.getCells()) {
          graph.select(cell);
        }
      },
    },
  ];

  if (!graph.isClipboardEmpty()) {
    contextMenuProps.unshift({
      text: "Paste",
      onClick() {
        graph.paste();
      },
    });
  }

  if (graph.canRedo()) {
    contextMenuProps.unshift({
      text: "Redo All",
      onClick() {
        while (graph.canRedo()) {
          graph.redo();
        }
      },
    });
  }

  if (graph.canRedo()) {
    contextMenuProps.unshift({
      text: "Redo",
      onClick() {
        graph.redo();
      },
    });
  }

  if (graph.canUndo()) {
    contextMenuProps.unshift({
      text: "Undo",
      onClick() {
        graph.undo();
      },
    });
  }

  // knobRoot.render(<FullContextMenu overlay={<ContextMenu items={contextMenuProps} />} />);

  const onMouseDown = () => {
    // knobRoot.unmount();
    document.removeEventListener("click", onMouseDown);
  };
  document.addEventListener("click", onMouseDown);
}

export function onCtrlC(graph: Graph) {
  if (!graph) {
    return;
  }

  const cells = graph.getSelectedCells();
  if (cells.length) {
    graph.copy(cells);
  }
}

export function onCtrlV(graph: Graph) {
  if (!graph || graph.isClipboardEmpty()) {
    return;
  }

  const cells = graph.paste({ offset: 32, nodeProps: { group: false } });
  for (const cell of cells) {
    cell.removeProp("group", { ignoreHistory: true });
  }
  graph.cleanSelection();
}

export function onCtrlZ(graph: Graph) {
  if (!graph) {
    return;
  }

  graph.undo();
}

export function onCtrlShiftZ(graph: Graph) {
  if (!graph) {
    return;
  }

  graph.redo();
}

export function onErase(graph: Graph) {
  if (!graph) {
    return;
  }

  for (const cell of graph.getSelectedCells()) {
    graph.removeCell(cell);
  }
}

export function unselectAllExcept(
  graph: Graph,
  cells: Cell<Cell.Properties>[],
  setSelectedCells: React.Dispatch<React.SetStateAction<Cell<Cell.Properties> | Cell<Cell.Properties>[] | undefined>>,
) {
  if (!graph) {
    return;
  }

  for (const insideCell of graph.getSelectedCells()) {
    if (cells.some((cell) => cell.id !== insideCell.id)) {
      graph.unselect(insideCell.id);
    }
  }

  setSelectedCells(graph.getSelectedCellCount() === 1 ? graph.getSelectedCells()[0] : graph.getSelectedCells());
}

export function onContextMenu(
  graph: Graph,
  setSelectedCells: React.Dispatch<React.SetStateAction<Cell<Cell.Properties> | Cell<Cell.Properties>[] | undefined>>,
  handler: NodeView.PositionEventArgs<JQuery.ContextMenuEvent>,
) {
  const selectedCells = graph.getSelectedCells();
  const currentCellIsInsideCurrentSelection = selectedCells.some((insideCell) => insideCell.id === handler.cell.id);
  if (!currentCellIsInsideCurrentSelection) {
    graph.cleanSelection();
    graph.select(handler.cell.id);
    setSelectedCells(handler.cell);
  }
}

export function onAdded(graph: Graph, handler: { cell: Cell<Cell.Properties>; options: Model.SetOptions }) {
  if (!graph) {
    return;
  }

  graph.cleanSelection();
  graph.select(handler.cell);
  handler.cell.addTools("contextmenu");
}

export function onRemoved(
  graph: Graph,
  setSelectedCells: React.Dispatch<React.SetStateAction<Cell<Cell.Properties> | Cell<Cell.Properties>[] | undefined>>,
  handler: { cell: Cell<Cell.Properties>; options: Model.SetOptions },
) {
  if (!graph) {
    return;
  }

  deleteOneCellGroup(graph, handler.cell.getProp("group"));
  setSelectedCells(undefined);
}

export function onSelected(
  graph: Graph,
  setSelectedCells: React.Dispatch<React.SetStateAction<Cell<Cell.Properties> | Cell<Cell.Properties>[] | undefined>>,
  handler: { cell: Cell<Cell.Properties>; options: Model.SetOptions },
) {
  if (!graph) {
    return;
  }

  if (graph.getSelectedCellCount() === 1) {
    // const view = handler.cell.findView(graph);
    // const halo = new Halo({
    //   view: handler.cell.findView(graph) as any,
    //   // type: 'toolbar',
    //   // pie: { sliceAngle: 360 / 7 },
    // });

    // console.log(halo);

    setSelectedCells(handler.cell);
    return;
  }

  setSelectedCells(graph.getSelectedCells());
}

export function onMove(graph: Graph, setSelectedCells: React.Dispatch<React.SetStateAction<Cell<Cell.Properties> | Cell<Cell.Properties>[] | undefined>>, handler: any) {
  if (!graph) {
    return;
  }

  const movingCellIsInsideCurrentSelection = graph.getSelectedCells().some((cell) => cell.id === handler.cell.id);
  if (!movingCellIsInsideCurrentSelection) {
    graph.cleanSelection();
    graph.select(handler.cell);
    setSelectedCells(handler.cell);
  }
}

export function onMoved(
  graph: Graph,
  forceRender: () => void,
  setSelectedCells: React.Dispatch<React.SetStateAction<Cell<Cell.Properties> | Cell<Cell.Properties>[] | undefined>>,
  handler: any,
) {
  if (!graph) {
    return;
  }

  if (graph.getSelectedCellCount() === 0) {
    graph.select(handler.cell);
    setSelectedCells(handler.cell);
  }

  forceRender();
}

export function onChangePosition(graph: Graph, handler: { cell: Cell<Cell.Properties>; options: Model.SetOptions }) {
  const group = handler.cell.getProp("group");
  if (!group || handler.cell.getProp("handleOnChange") === false || !graph) {
    return;
  }

  const currentPosition = handler.cell.getBBox();
  const previousPosition = handler.cell.previous("position");
  const xDif = previousPosition.x - currentPosition.x;
  const yDif = previousPosition.y - currentPosition.y;

  const allCells = graph.getCells();
  const selectedCells = graph.getSelectedCells();

  let numberOfSelectedCellsInGroup = 0;
  for (const cell of selectedCells) {
    if (cell.getProp("group") === group) {
      numberOfSelectedCellsInGroup++;
    }
  }

  for (const cell of allCells) {
    if (cell.id === handler.cell.id || cell.getProp("group") !== group || selectedCells.some((insideCell) => insideCell.id === cell.id)) {
      continue;
    }

    const cellBBox = cell.getBBox();
    cell.setProp(
      {
        handleOnChange: false,
        position: {
          x: cellBBox.x - xDif / numberOfSelectedCellsInGroup,
          y: cellBBox.y - yDif / numberOfSelectedCellsInGroup,
        },
      },
      { deep: false, overwrite: true },
    );
  }

  for (const cell of allCells) {
    if (cell.getProp("group") === group) {
      cell.removeProp("handleOnChange");
    }
  }
}

export function onResize(
  graph: Graph,
  setSelectedCells: React.Dispatch<React.SetStateAction<Cell<Cell.Properties> | Cell<Cell.Properties>[] | undefined>>,
  handler: NodeView.ResizeEventArgs<JQuery.MouseDownEvent>,
) {
  if (!graph) {
    return;
  }

  if (graph.getSelectedCellCount() > 1) {
    unselectAllExcept(graph, [handler.cell], setSelectedCells);
    return;
  }
}

export function onResized(graph: Graph, forceRender: () => void, handler: any) {
  if (!graph) {
    return;
  }

  const bbox = handler.cell.getBBox();

  if (bbox.x % 1 !== 0 || bbox.y % 1 !== 0) {
    handler.cell.setProp(
      {
        position: {
          x: Math.round(bbox.x),
          y: Math.round(bbox.y),
        },
      },
      { deep: false, overwrite: true },
    );
  }

  forceRender();
}

// minWidth(this, cell) {
//   const minWidth = cell.getAttrByPath("minimum/width") as number | undefined;

//   if (minWidth === undefined) {
//     return undefined;
//   }

//   const bbox = cell.getBBox();
//   if (bbox.width >= minWidth) {
//     return undefined;
//   }

//   return minWidth;
// },
// minHeight(this, cell) {
//   const minHeight = cell.getAttrByPath("minimum/height") as number | undefined;
//   console.log("minHeight", minHeight);

//   if (minHeight === undefined) {
//     return undefined;
//   }

//   const bbox = cell.getBBox();
//   if (bbox.width >= minHeight) {
//     return undefined;
//   }

//   return minHeight;
// },

export function onResizing(graph: Graph, handler: NodeView.ResizeEventArgs<JQuery.MouseDownEvent>) {
  if (!graph) {
    return;
  }

  const minWidth = (handler.cell.getAttrByPath("minimum/width") as number) || 0;
  const minHeight = (handler.cell.getAttrByPath("minimum/height") as number) || 0;

  const bbox = handler.cell.getBBox();
  if (bbox.width < minWidth && bbox.height < minHeight) {
    handler.cell.setProp(
      {
        size: {
          height: minHeight,
          width: minWidth,
        },
      },
      { deep: false, overwrite: true },
    );
    return;
  } else if (bbox.width < minWidth) {
    handler.cell.setProp(
      {
        size: {
          height: bbox.height,
          width: minWidth,
        },
      },
      { deep: false, overwrite: true },
    );
    return;
  } else if (bbox.height < minHeight) {
    handler.cell.setProp(
      {
        size: {
          height: minHeight,
          width: bbox.width,
        },
      },
      { deep: false, overwrite: true },
    );
    return;
  }
}

export function onRotate(
  graph: Graph,
  setSelectedCells: React.Dispatch<React.SetStateAction<Cell<Cell.Properties> | Cell<Cell.Properties>[] | undefined>>,
  handler: NodeView.RotateEventArgs<JQuery.MouseDownEvent>,
) {
  if (!graph) {
    return;
  }

  if (graph.getSelectedCellCount() > 1) {
    unselectAllExcept(graph, [handler.cell], setSelectedCells);
    return;
  }
}

export function onRotated(graph: Graph, forceRender: () => void) {
  if (!graph) {
    return;
  }

  forceRender();
}
