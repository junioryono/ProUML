import type X6Type from "@antv/x6";
import type { X6StateType } from "..";

import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { LayoutProps } from "@/components/diagram/layout";
import { Diagram } from "types";
import { ReadyState } from "react-use-websocket";

import initializeListeners from "@/components/diagram/x6/graph/listeners";
import useGraphWebSocket from "@/components/diagram/x6/graph/websocket";

export default function useGraph(
   X6: X6StateType,
   container: MutableRefObject<HTMLDivElement>,
   diagram: Diagram,
   layoutProps: LayoutProps,
) {
   const graph = useRef<X6Type.Graph>();
   const { websocket, sessionId } = useGraphWebSocket(graph, diagram.id, layoutProps);
   const [graphReady, setGraphReady] = useState(false);

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
         websocket.readyState !== ReadyState.OPEN
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
            router: {
               name: "manhattan",
               args: {
                  startDirections: ["right", "left"],
                  padding: 16,
               },
            },
            connectionPoint: "boundary",
            validateConnection({ sourceView, targetView }) {
               if (sourceView === targetView) {
                  return false;
               }
               return true;
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
      });

      graph.current.use(
         new X6.Plugin.Scroller.Scroller({
            enabled: true,
            graph: graph.current,
            className: "no-scrollbar",
            pageVisible: true,
         }),
      );

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
         new X6.Plugin.Selection.Selection({
            enabled: false,
            multiple: true,
            rubberband: true,
            movable: true,
            className: "selection",
            showNodeSelectionBox: true,
            showEdgeSelectionBox: false,
         }),
      );

      graph.current.use(
         new X6.Plugin.Keyboard.Keyboard({
            enabled: true,
            global: true,
         }),
      );

      graph.current.use(
         new X6.Plugin.Clipboard.Clipboard({
            enabled: true,
            useLocalStorage: true,
         }),
      );

      graph.current.use(
         new X6.Plugin.History.History({
            enabled: true,
            beforeAddCommand(_, args) {
               // if ((args as any)?.options?.ws === true) {
               //    return false;
               // }

               return true;
            },
         }),
      );

      graph.current.use(new X6.Plugin.Export.Export());

      console.log("diagram.content", diagram.content);
      graph.current.fromJSON({ cells: diagram.content });

      const removeListeners = initializeListeners(graph, websocket, sessionId, layoutProps);
      const handleResize = () => graph.current.size.resize(getGraphWidth(), getGraphHeight());
      window.addEventListener("resize", handleResize);

      graph.current.setGridSize(diagram.show_grid ? 16 : 1);
      graph.current?.drawBackground({
         color: `#${diagram.background_color}`,
      });

      // const nodes = graph.current.getNodes();
      // graph.current.addEdge({
      //    shape: "association",
      //    source: nodes[0],
      //    target: nodes[1],
      // });

      setGraphReady(true);

      return () => {
         removeListeners();
         window.removeEventListener("resize", handleResize);

         graph.current.dispose();
         graph.current = null;
         setGraphReady(false);
      };
   }, [diagram, container, X6, websocket.readyState]);

   useEffect(() => {
      console.log("graphReady", graphReady);
   }, [graphReady]);

   return { graph, sessionId, ready: graphReady && websocket.readyState === ReadyState.OPEN };
}
