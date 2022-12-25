import { deleteOneCellGroup } from "./utils";
import { Menu, Dropdown } from "antd";
import { Graph, Dom, ToolsView, EdgeView, Cell, Model, Node, Color, Edge, NodeView } from "@antv/x6";
import { v4 as uuidv4 } from "uuid";
// import ReactDomClient from "react-dom/client";

export function FullContextMenu({ overlay }: { overlay: any }) {
  return (
    <Dropdown visible={true} trigger={["contextMenu"]} overlay={overlay}>
      <a />
    </Dropdown>
  );
}

class ContextMenuTool extends ToolsView.ToolItem<EdgeView, ContextMenuToolOptions> {
  private knob: HTMLDivElement | undefined;
  // private knobRoot: ReactDomClient.Root | undefined;

  render() {
    this.knob = ToolsView.createElement("div", false) as HTMLDivElement;
    this.knob.style.position = "absolute";
    this.container.appendChild(this.knob);
    // this.knobRoot = ReactDomClient.createRoot(this.knob);
    return this;
  }

  private toggleContextMenu(visible: boolean) {
    // if (!this.knob || !this.knobRoot) {
    //   return;
    // }

    if (!visible) {
      // this.knobRoot.unmount();
      // this.knobRoot = ReactDomClient.createRoot(this.knob);
      document.removeEventListener("click", this.onMouseDown);
      return;
    }

    const cell = this.cell;
    const graph = this.graph;
    const contextMenuProps = [
      {
        text: "Delete",
        onClick() {
          const cells = graph.getSelectedCells();
          for (const insideCell of cells) {
            insideCell.remove();
          }
        },
      },
      {
        text: "Cut",
        onClick() {
          const cells = graph.getSelectedCells();
          if (cells.length) {
            graph.copy(cells);
          }
          for (const insideCell of cells) {
            insideCell.remove();
          }
        },
      },
      {
        text: "Copy",
        onClick() {
          const cells = graph.getSelectedCells();
          if (cells.length) {
            graph.copy(cells);
          }
        },
      },
      {
        text: "To Front",
        onClick() {
          const group = cell.getProp("group");
          if (!group) {
            cell.toFront();
            return;
          }

          const cells = graph.getCells();
          for (const insideCell of cells) {
            if (insideCell.id !== cell.id && insideCell.getProp("group") === group) {
              insideCell.toFront();
            }
          }
          cell.toFront();
        },
      },
      {
        text: "To Back",
        onClick() {
          const group = cell.getProp("group");
          if (!group) {
            cell.toBack();
            return;
          }

          const cells = graph.getCells();
          for (const insideCell of cells) {
            if (insideCell.id !== cell.id && insideCell.getProp("group") === group) {
              insideCell.toBack();
            }
          }
          cell.toBack();
        },
      },
    ];

    // Show group or ungroup
    if (this.graph.getSelectedCellCount() > 1) {
      let showGroup = true;

      const selectedCells = this.graph.getSelectedCells();
      const cellToSearchForGroup = selectedCells.find((cell) => cell.getProp("group"));
      if (cellToSearchForGroup) {
        showGroup = selectedCells.some((cell) => {
          if (
            !cell.getProp("group") &&
            selectedCells.every((insideCell) => {
              if (insideCell.id === cell.id || !insideCell.getProp("group") || insideCell.getProp("group") === cellToSearchForGroup.getProp("group")) {
                return true;
              }

              return false;
            })
          ) {
            return true;
          }

          return false;
        });
      }

      if (showGroup) {
        contextMenuProps.push({
          text: "Group",
          onClick() {
            const selectedCells = graph.getSelectedCells();
            const cellToSearchForGroup = selectedCells.find((cell) => cell.getProp("group"));
            const currentGroup = cellToSearchForGroup?.getProp("group") || uuidv4();
            for (const cell of selectedCells) {
              cell.setProp("group", currentGroup);
            }
          },
        });
      } else {
        if (selectedCells.every((cell) => !cellToSearchForGroup || cell.getProp("group") === cellToSearchForGroup.getProp("group"))) {
          contextMenuProps.push({
            text: "Ungroup",
            onClick() {
              const group = cell.getProp("group");
              for (const cellLoop of graph.getSelectedCells()) {
                cellLoop.removeProp("group");
              }
              deleteOneCellGroup(graph, group);
            },
          });
        }
      }
    } else if (cell.getProp("group")) {
      contextMenuProps.push({
        text: "Ungroup",
        onClick() {
          const group = cell.getProp("group");
          cell.removeProp("group");
          deleteOneCellGroup(graph, group);
        },
      });
    }

    // this.knobRoot.render(<FullContextMenu overlay={<ContextMenu items={contextMenuProps} />} />);
    document.addEventListener("click", this.onMouseDown);
  }

  private updatePosition(e?: MouseEvent) {
    const style = this.knob?.style;
    if (!style) return;

    if (!e) {
      style.left = "-1000px";
      style.top = "-1000px";
      return;
    }

    const pos = this.graph.clientToGraph(e.clientX, e.clientY);
    style.left = `${pos.x}px`;
    style.top = `${pos.y}px`;
  }

  private onMouseDown = (e: MouseEvent) => {
    this.toggleContextMenu(false);
  };

  private onContextMenu({ e }: { e: MouseEvent }) {
    this.updatePosition(e);
    this.toggleContextMenu(true);
  }

  delegateEvents() {
    this.cellView.on("cell:contextmenu", this.onContextMenu, this);
    return super.delegateEvents();
  }

  protected onRemove() {
    this.cellView.off("cell:contextmenu", this.onContextMenu, this);
  }
}

ContextMenuTool.config({
  tagName: "div",
  isSVGElement: false,
});

interface ContextMenuToolOptions extends ToolsView.ToolItem.Options {
  menu: React.ReactElement;
}

Graph.registerEdgeTool("contextmenu", ContextMenuTool, true);
Graph.registerNodeTool("contextmenu", ContextMenuTool, true);

export function ContextMenu({ items }: { items: any }) {
  return (
    <Menu>
      {items.map((item: any, index: any) => {
        return (
          <Menu.Item key={index} danger={item.danger} onClick={(e) => item.onClick && item.onClick(e)}>
            {item.href ? <a href={item.href}>{item.text}</a> : item.text}
          </Menu.Item>
        );
      })}
    </Menu>
  );
}
