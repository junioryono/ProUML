import { MutableRefObject, useEffect, useState } from "react";

import type X6Type from "@antv/x6";
import type { Scroller as X6PluginScrollerType } from "@antv/x6-plugin-scroller";
import type { Snapline as X6PluginSnaplineType } from "@antv/x6-plugin-snapline";
import type { Transform as X6PluginTransformType } from "@antv/x6-plugin-transform";
import type { Selection as X6PluginSelectionType } from "@antv/x6-plugin-selection";
import type { Keyboard as X6PluginKeyboardType } from "@antv/x6-plugin-keyboard";
import type { Clipboard as X6PluginClipboardType } from "@antv/x6-plugin-clipboard";
import type { History as X6PluginHistoryType } from "./plugins/history";
import type { Export as X6PluginExportType } from "./plugins/export";
import type X6ShapeNodeType from "./graph/shapes/nodes";
import type X6ShapeEdgeType from "./graph/shapes/edges";
import { LayoutProps } from "@/components/diagram/layout";
import { Diagram } from "types";
import useGraph from "@/components/diagram/x6/graph";

export type X6StateType = {
   Core: typeof X6Type;
   Plugin: {
      Scroller: typeof X6PluginScrollerType;
      Snapline: typeof X6PluginSnaplineType;
      Transform: typeof X6PluginTransformType;
      Selection: typeof X6PluginSelectionType;
      Keyboard: typeof X6PluginKeyboardType;
      Clipboard: typeof X6PluginClipboardType;
      History: typeof X6PluginHistoryType;
      Export: typeof X6PluginExportType;
   };
   Shape: {
      Node: typeof X6ShapeNodeType;
      Edge: typeof X6ShapeEdgeType;
   };
};

// Create a hook to initialize X6
export default function useX6(container: MutableRefObject<HTMLDivElement>, diagram: Diagram, layoutProps: LayoutProps) {
   const [X6, setX6] = useState<X6StateType>();
   const { graph, ready, wsTimedOut } = useGraph(X6, container, diagram, layoutProps);

   // Import AntV client side
   useEffect(() => {
      let isUnmounted = false;

      (async () => {
         const [
            X6Instance,
            X6PluginScrollerInstance,
            X6PluginSnaplineInstance,
            X6PluginTransformInstance,
            X6PluginSelectionInstance,
            X6PluginKeyboardInstance,
            X6PluginClipboardInstance,
            X6PluginHistoryInstance,
            X6PluginExportInstance,
            X6ShapeNodeInstance,
            X6ShapeEdgeInstance,
         ] = await Promise.all([
            await import("@antv/x6"),
            await import("@antv/x6-plugin-scroller"),
            await import("@antv/x6-plugin-snapline"),
            await import("@antv/x6-plugin-transform"),
            await import("@antv/x6-plugin-selection"),
            await import("@antv/x6-plugin-keyboard"),
            await import("@antv/x6-plugin-clipboard"),
            await import("./plugins/history"),
            await import("./plugins/export"),
            await import("./graph/shapes/nodes"),
            await import("./graph/shapes/edges"),
            await import("./graph/shapes/tools/arrowhead"),
         ]);

         if (!isUnmounted) {
            setX6({
               Core: X6Instance,
               Plugin: {
                  Scroller: X6PluginScrollerInstance.Scroller,
                  Snapline: X6PluginSnaplineInstance.Snapline,
                  Transform: X6PluginTransformInstance.Transform,
                  Selection: X6PluginSelectionInstance.Selection,
                  Keyboard: X6PluginKeyboardInstance.Keyboard,
                  Clipboard: X6PluginClipboardInstance.Clipboard,
                  History: X6PluginHistoryInstance.History,
                  Export: X6PluginExportInstance.Export,
               },
               Shape: {
                  Node: X6ShapeNodeInstance.default,
                  Edge: X6ShapeEdgeInstance.default,
               },
            });
         }
      })();

      return () => {
         isUnmounted = true;
         setX6(null);
      };
   }, []);

   return { graph, ready, wsTimedOut };
}
