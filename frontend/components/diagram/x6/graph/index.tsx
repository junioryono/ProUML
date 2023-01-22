"use client";

import type X6Type from "@antv/x6";
import type { X6StateType } from "..";

import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef } from "react";
import { initializeListeners } from "@/components/diagram/x6/graph/listeners";
import { useGraphWebSocket } from "@/components/diagram/x6/graph/websocket";
import { LayoutProps } from "@/components/diagram/layout";
import { Diagram } from "types";

export function useGraph(
   X6: X6StateType,
   container: MutableRefObject<HTMLDivElement>,
   diagram: Diagram,
   layoutProps: LayoutProps,
) {
   const graph = useRef<X6Type.Graph>();
   const { websocket, sessionId } = useGraphWebSocket(graph, diagram.id);

   useEffect(() => {
      if (!diagram || !container.current || !X6 || !X6.Plugin || !X6.Plugin.Scroller || !X6.Plugin.Transform) {
         return;
      }

      const getGraphWidth = () => window.innerWidth;
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
            className: "no-scrollbar",
            pageVisible: true,
         }),
      );

      graph.current.use(
         new X6.Plugin.Transform.Transform({
            resizing: {
               enabled: true,
            },
            rotating: {
               enabled: true,
            },
         }),
      );

      graph.current.use(
         new X6.Plugin.Selection.Selection({
            enabled: true,
            multiple: true,
            rubberband: true,
            movable: true,
            className: "selection",
            showNodeSelectionBox: true,
            showEdgeSelectionBox: true,
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
         }),
      );

      graph.current.fromJSON({ cells: diagram.content });

      const removeListeners = initializeListeners(graph, websocket, sessionId, layoutProps);
      const handleResize = () => graph.current.size.resize(getGraphWidth(), getGraphHeight());
      window.addEventListener("resize", handleResize);

      return () => {
         removeListeners();
         window.removeEventListener("resize", handleResize);
      };
   }, [diagram, container, X6]);

   return { graph, websocket };
}
