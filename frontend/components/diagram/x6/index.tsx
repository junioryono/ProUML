"use client";

import { Dispatch, MutableRefObject, SetStateAction, useEffect, useState } from "react";

import type X6Type from "@antv/x6";
import type X6PluginScrollerType from "@antv/x6-plugin-scroller";
import type X6PluginTransformType from "@antv/x6-plugin-transform";
import type X6PluginSelectionType from "@antv/x6-plugin-selection";
import type X6PluginKeyboardType from "@antv/x6-plugin-keyboard";
import type X6PluginClipboardType from "@antv/x6-plugin-clipboard";
import type X6PluginHistoryType from "@antv/x6-plugin-history";
import { LayoutProps } from "@/components/diagram/layout";
import { useGraph } from "@/components/diagram/x6/graph";
import { Diagram } from "types";

export type X6StateType = {
   Core: typeof X6Type;
   Plugin: {
      Scroller: typeof X6PluginScrollerType;
      Transform: typeof X6PluginTransformType;
      Selection: typeof X6PluginSelectionType;
      Keyboard: typeof X6PluginKeyboardType;
      Clipboard: typeof X6PluginClipboardType;
      History: typeof X6PluginHistoryType;
   };
   Shape: {
      Class: any;
   };
};

// Create a hook to initialize X6
export function useX6(container: MutableRefObject<HTMLDivElement>, diagram: Diagram, layoutProps: LayoutProps) {
   const [X6, setX6] = useState<X6StateType>();
   const { graph, sessionId, ready } = useGraph(X6, container, diagram, layoutProps);

   // Import AntV client side
   useEffect(() => {
      let isUnmounted = false;

      (async () => {
         const [
            X6Instance,
            X6PluginScrollerInstance,
            X6PluginTransformInstance,
            X6PluginSelectionInstance,
            X6PluginKeyboardInstance,
            X6PluginClipboardInstance,
            X6PluginHistoryInstance,
            ShapeClass,
         ] = await Promise.all([
            await import("@antv/x6"),
            await import("@antv/x6-plugin-scroller"),
            await import("@antv/x6-plugin-transform"),
            await import("@antv/x6-plugin-selection"),
            await import("@antv/x6-plugin-keyboard"),
            await import("@antv/x6-plugin-clipboard"),
            await import("@antv/x6-plugin-history"),
            await import("./graph/shapes/class"),
         ]);

         if (!isUnmounted) {
            setX6({
               Core: X6Instance,
               Plugin: {
                  Scroller: X6PluginScrollerInstance,
                  Transform: X6PluginTransformInstance,
                  Selection: X6PluginSelectionInstance,
                  Keyboard: X6PluginKeyboardInstance,
                  Clipboard: X6PluginClipboardInstance,
                  History: X6PluginHistoryInstance,
               },
               Shape: {
                  Class: ShapeClass,
               },
            });
         }
      })();

      return () => {
         isUnmounted = true;
         setX6(null);
      };
   }, []);

   return { graph, sessionId, ready };
}
