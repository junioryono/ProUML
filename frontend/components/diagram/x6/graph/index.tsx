import type X6Type from "@antv/x6";
import type { X6StateType } from "..";

import { MutableRefObject, useEffect, useRef, useState } from "react";
import { LayoutProps } from "@/components/diagram/layout";
import { Diagram } from "types";
import { ReadyState } from "react-use-websocket";

import initializeListeners from "@/components/diagram/x6/graph/listeners";
import useGraphWebSocket from "@/components/diagram/x6/graph/websocket";
import { addAllPorts, addPorts } from "./shapes/ports";

export default function useGraph(
   X6: X6StateType,
   container: MutableRefObject<HTMLDivElement>,
   diagram: Diagram,
   layoutProps: LayoutProps,
) {
   const graph = useRef<X6Type.Graph>();
   const {
      websocket: { readyState: wsReadyState, sendJsonMessage: wsSendJson },
      sessionId,
   } = useGraphWebSocket(graph, diagram.id, layoutProps);
   const [graphReady, setGraphReady] = useState(false);
   const [wsTimedOut, setWSTimedOut] = useState(false);

   useEffect(() => {
      if (
         !diagram ||
         !container.current ||
         !X6 ||
         !X6.Plugin ||
         !X6.Plugin.Scroller ||
         !X6.Plugin.Transform ||
         !X6.Plugin.Selection ||
         !X6.Plugin.Keyboard ||
         !X6.Plugin.Clipboard ||
         !X6.Plugin.History ||
         !X6.Plugin.Export ||
         !X6.Shape ||
         !X6.Shape.Edge ||
         wsReadyState !== ReadyState.OPEN
      ) {
         return;
      }
      const getGraphWidth = () => window.innerWidth - 480;
      const getGraphHeight = () => window.innerHeight - 48;

      graph.current = new X6.Core.Graph({
         container: container.current,
         width: getGraphWidth(),
         height: getGraphHeight(),
         grid: {
            visible: true,
            type: "doubleMesh",
            size: 16,
            args: [
               {
                  color: "#e5e5e5",
                  thickness: 1,
               },
               {
                  color: "#e5e5e5",
                  thickness: 2,
                  factor: 4,
               },
            ],
         },
         connecting: {
            snap: true,
            allowBlank: false,
            // allowLoop: true,
            // allowNode: false,
            // allowEdge: false,
            // allowMulti: true,
            // allowPort: true,
            highlight: true,
            router: "normal",
            anchor: "center",
            connectionPoint: {
               name: "anchor",
               args: {
                  offset: -2,
               },
            },
            validateConnection(connection) {
               if (connection.sourcePort === connection.targetPort) {
                  return false;
               }
               return true;
            },
            // Dont show anchor when connecting
            createEdge() {
               return this.createEdge({
                  shape: "edge",
               });
            },
         },
         background: {
            // color: "#e5e5e5",
         },
         mousewheel: {
            enabled: true,
            global: true,
            modifiers: ["ctrl", "meta"],
         },
         interacting(cellView) {
            return !graph.current?.isPannable();
         },
      });

      graph.current.use(
         new X6.Plugin.Scroller({
            enabled: true,
            graph: graph.current,
            className: "no-scrollbar",
            pageVisible: true,
         }),
      );

      // graph.current.use(
      //    new X6.Plugin.Snapline({
      //       enabled: true,
      //    }),
      // );

      // graph.current.use(
      //    new X6.Plugin.Transform.Transform({
      //       resizing: {
      //          enabled: true,
      //       },
      //       rotating: {
      //          enabled: true,
      //       },
      //    }),
      // );

      graph.current.use(
         new X6.Plugin.Selection({
            enabled: true,
            multiple: true,
            rubberband: true,
            movable: true,
            showNodeSelectionBox: false,
            showEdgeSelectionBox: false,
            // filter(cell) {
            //    if (cell.isEdge()) {
            //       return false;
            //    }
            //    return true;
            // },
         }),
      );

      graph.current.use(
         new X6.Plugin.Keyboard({
            enabled: true,
            global: true,
         }),
      );

      graph.current.use(
         new X6.Plugin.Clipboard({
            enabled: true,
            useLocalStorage: true,
         }),
      );

      graph.current.use(
         new X6.Plugin.History({
            enabled: true,
            beforeAddCommand(_, args: any) {
               if (args?.options?.ws === true || args?.options?.ignoreHistory === true) {
                  return false;
               }

               return true;
            },
         }),
      );

      graph.current.use(new X6.Plugin.Export());

      console.log("diagram.content", diagram.content);
      graph.current.fromJSON({ cells: diagram.content }, { ignoreHistory: true });

      const removeListeners = initializeListeners(graph, wsSendJson, sessionId, layoutProps, X6.Shape.Edge);
      const handleResize = () => graph.current.size.resize(getGraphWidth(), getGraphHeight());
      window.addEventListener("resize", handleResize);

      graph.current.setGridSize(diagram.show_grid ? 16 : 1);
      graph.current?.drawBackground({
         color: `#${diagram.background_color}`,
      });

      // const nodesT = graph.current.getNodes();
      // graph.current.addEdge({
      //    shape: "extend",
      //    source: nodesT[0],
      //    target: nodesT[1],
      // });

      setGraphReady(true);

      return () => {
         removeListeners();
         window.removeEventListener("resize", handleResize);

         graph.current.dispose();
         graph.current = null;
         setGraphReady(false);
      };
   }, [diagram, container, X6, wsReadyState]);

   useEffect(() => {
      if (wsReadyState === ReadyState.CLOSED) {
         setWSTimedOut(true);
      } else {
         setWSTimedOut(false);
      }
   }, [wsReadyState]);

   return { graph, ready: graphReady, wsTimedOut };
}
