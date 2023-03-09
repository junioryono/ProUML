import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useState } from "react";
import GraphPanel from "./graph/graph";
import EdgesPanel from "./edges";
import NodesPanel from "./nodes";
import { Diagram } from "types";

// RightPanel component, receives a `graph` prop of type `MutableRefObject<X6Type.Graph>`
export default function RightPanel({
   graph,
   backgroundColor,
}: {
   graph: MutableRefObject<X6Type.Graph>;
   backgroundColor: string;
}) {
   // State to keep track of the current tab, either "graph", "nodes", or "edges"
   const [tab, setTab] = useState<"graph" | "nodes" | "edges" | "nodes&edges">("graph");

   // Use effect to listen to the events on the `graph` and set the tab accordingly
   useEffect(() => {
      // Listen to the "node:selected" event and set the tab to "nodes"
      graph.current?.on("node:selected", () => {
         setTab("nodes");
      });

      // Listen to the "node:unselected" event and set the tab to "graph" if there's no selected cells
      graph.current?.on("node:unselected", () => {
         if (graph.current?.getSelectedCells().length === 0) {
            setTab("graph");
         }
      });

      // Listen to the "edge:selected" event and set the tab to "edges"
      graph.current?.on("edge:selected", () => {
         setTab("edges");
      });

      // Listen to the "edge:unselected" event and set the tab to "graph" if there's no selected cells
      graph.current?.on("edge:unselected", () => {
         if (graph.current?.getSelectedCells().length === 0) {
            setTab("graph");
         }
      });
   }, [graph]);

   // Render the component with a width of 60 and a left border of 1
   return (
      <div className="flex flex-col h-[calc(100vh-3rem)] overflow-y-auto no-scrollbar overflow-x-hidden w-60 p-2 pb-3 border-gray-400 border-l-1 select-none cursor-default">
         {/* Render different panels based on the current tab */}
         {tab === "graph" ? (
            <GraphPanel graph={graph} backgroundColor={backgroundColor} />
         ) : tab === "nodes" ? (
            <NodesPanel graph={graph} />
         ) : tab === "edges" ? (
            <EdgesPanel graph={graph} />
         ) : tab === "nodes&edges" ? (
            <NodesPanel graph={graph} />
         ) : null}
      </div>
   );
}
