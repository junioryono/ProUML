import type X6Type from "@antv/x6";
import {
   wsLocalAndDBAddNode,
   wsLocalAndDBAddEdge,
   wsLocalAndDBRemoveCell,
   wsLocalAndDBUpdateNode,
   wsLocalUpdateNode,
} from "@/components/diagram/x6/graph/websocket";
import { JsonValue, WebSocketHook } from "react-use-websocket/dist/lib/types";
import { LayoutProps } from "@/components/diagram/layout";
import { MutableRefObject } from "react";

export default function Cells(
   graph: MutableRefObject<X6Type.Graph>,
   websocket: WebSocketHook<JsonValue, MessageEvent<any>>,
   sessionId: MutableRefObject<string>,
   layoutProps: LayoutProps,
) {
   // const dbListeners = ["node:added", "node:removed", "node:resized", "node:moved", "node:rotated"];
   // for (const dbListener of dbListeners) {
   //    graph.current?.on(dbListener, (args: { cell: X6Type.Cell<X6Type.Cell.Properties> }) => {
   //       wsLocalAndDBUpdateNode(args.cell, websocket, sessionId);
   //    });
   // }

   const addPorts = (node: X6Type.Node) => {
      node.removePorts();

      const nodeBbox = node.getBBox();
      const nodeWidth = nodeBbox.width;
      const nodeHeight = nodeBbox.height;

      node.addPorts(
         [
            {
               id: "top-middle",
               group: "group1",
               args: {
                  x: nodeWidth / 2,
                  y: 0,
               },
            },
            {
               id: "top-left",
               group: "group1",
               args: {
                  x: 0,
                  y: 0,
               },
            },
            {
               id: "top-right",
               group: "group1",
               args: {
                  x: nodeWidth,
                  y: 0,
               },
            },
            {
               id: "top-left-middle",
               group: "group1",
               args: {
                  x: nodeWidth / 4,
                  y: 0,
               },
            },
            {
               id: "top-right-middle",
               group: "group1",
               args: {
                  x: (nodeWidth / 4) * 3,
                  y: 0,
               },
            },
            {
               id: "left-middle-top",
               group: "group1",
               args: {
                  x: 0,
                  y: nodeHeight / 4,
               },
            },
            {
               id: "left-middle",
               group: "group1",
               args: {
                  x: 0,
                  y: nodeHeight / 2,
               },
            },
            {
               id: "left-middle-bottom",
               group: "group1",
               args: {
                  x: 0,
                  y: (nodeHeight / 4) * 3,
               },
            },
            {
               id: "right-middle-top",
               group: "group1",
               args: {
                  x: nodeWidth,
                  y: nodeHeight / 4,
               },
            },
            {
               id: "right-middle",
               group: "group1",
               args: {
                  x: nodeWidth,
                  y: nodeHeight / 2,
               },
            },
            {
               id: "right-middle-bottom",
               group: "group1",
               args: {
                  x: nodeWidth,
                  y: (nodeHeight / 4) * 3,
               },
            },
            {
               id: "bottom-middle",
               group: "group1",
               args: {
                  x: nodeWidth / 2,
                  y: nodeHeight,
               },
            },
            {
               id: "bottom-left",
               group: "group1",
               args: {
                  x: 0,
                  y: nodeHeight,
               },
            },
            {
               id: "bottom-right",
               group: "group1",
               args: {
                  x: nodeWidth,
                  y: nodeHeight,
               },
            },
            {
               id: "bottom-left-middle",
               group: "group1",
               args: {
                  x: nodeWidth / 4,
                  y: nodeHeight,
               },
            },
            {
               id: "bottom-right-middle",
               group: "group1",
               args: {
                  x: (nodeWidth / 4) * 3,
                  y: nodeHeight,
               },
            },
         ],
         {
            silent: true,
         },
      );
   };

   const showPorts = (node: X6Type.Node) => {
      for (const port of node.getPorts()) {
         //port.attrs.style.visibility = "visible";
         node.portProp(port.id, "attrs/circle/style/visibility", "visible");
      }
   };

   const hidePorts = (node: X6Type.Node) => {
      for (const port of node.getPorts()) {
         //port.attrs.style.visibility = "hidden";
         node.setPortProp(port.id, "attrs/circle/style/visibility", "hidden");
      }
   };

   graph.current?.on("node:mouseenter", (args) => {
      console.log("node:mouseenter", args);
      showPorts(args.node);
   });

   graph.current?.on("node:mouseleave", (args) => {
      console.log("node:mouseleave", args);
      hidePorts(args.node);
   });

   graph.current?.on("edge:added", (args) => {
      console.log("edge:added", args);
      const sourceCell = args.edge.getSourceCell();
      const targetCell = args.edge.getTargetCell();
      if (!sourceCell || !targetCell) {
         for (const node of graph.current?.getNodes() as X6Type.Node[]) {
            showPorts(node);
         }
      }
   });

   graph.current?.on("edge:connected", (args) => {
      console.log("edge:connected", args);
      console.log(graph.current.toJSON());
      for (const node of graph.current?.getNodes() as X6Type.Node[]) {
         hidePorts(node);
      }
   });

   graph.current?.on("cell:removed", (args) => {
      console.log("cell:removed", args);
      if (args.options.ws) {
         return;
      }

      if (args.cell.isEdge()) {
         for (const node of graph.current?.getNodes() as X6Type.Node[]) {
            hidePorts(node);
         }
      }

      wsLocalAndDBRemoveCell(args.cell, websocket, sessionId);
   });

   graph.current?.on("cell:added", (args) => {
      console.log("cell:added", args);
      if (args.options.ws) {
         return;
      }

      if (args.cell.isEdge()) {
         wsLocalAndDBAddEdge(args.cell, websocket, sessionId);
         return;
      }

      addPorts(args.cell as X6Type.Node);

      wsLocalAndDBAddNode(args.cell, websocket, sessionId);
   });

   graph.current?.on("node:change:data", (args) => {
      if (args.options.ws) {
         return;
      }

      console.log(args.cell.prop("name"));

      wsLocalAndDBUpdateNode(args.cell, websocket, sessionId);
   });

   graph.current?.on("node:move", (args) => {
      const isSelected = graph.current?.isSelected(args.cell);
      if (!isSelected) {
         const selectedCells = graph.current?.getSelectedCells();
         for (const cell of selectedCells) {
            if (cell.isNode()) {
               hidePorts(cell);
            }
         }
         graph.current?.cleanSelection();
      }

      hidePorts(args.cell);
      graph.current?.select(args.cell);
   });

   graph.current?.on("node:moving", () => {
      graph.current?.getSelectedCells().forEach((cell) => {
         if (cell.isNode()) {
            wsLocalUpdateNode(cell, websocket, sessionId);
         }
      });
   });

   graph.current?.on("node:moved", (args) => {
      console.log("node:moved", args);
      wsLocalAndDBUpdateNode(args.cell, websocket, sessionId);

      showPorts(args.cell);
   });

   graph.current?.on("node:change:position", (args) => {
      if (args.options.ws) {
         return;
      }

      console.log("node:change:position", args);
      wsLocalUpdateNode(args.cell, websocket, sessionId);
   });

   graph.current?.on("node:change:size", (args) => {
      if (args.options.ws) {
         return;
      }

      console.log("node:change:size", args);
      wsLocalAndDBUpdateNode(args.cell, websocket, sessionId);
   });

   graph.current?.on("node:change:angle", (args) => {
      if (args.options.ws) {
         return;
      }

      console.log("node:change:angle", args);
      wsLocalAndDBUpdateNode(args.cell, websocket, sessionId);
   });

   return () => {
      graph.current?.off("cell:change:*");
      graph.current?.off("cell:removed");
      graph.current?.off("cell:added");
      graph.current?.off("node:moved");
      graph.current?.off("node:resized");
      graph.current?.off("node:change:angle");

      // From other components
      graph.current?.off("node:added");
      graph.current?.off("node:removed");
      graph.current?.off("edge:added");
      graph.current?.off("edge:removed");
      graph.current?.off("node:selected");
      graph.current?.off("node:unselected");
      graph.current?.off("cell:selected");
      graph.current?.off("cell:unselected");
   };
}
