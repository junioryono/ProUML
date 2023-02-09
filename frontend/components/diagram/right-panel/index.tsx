"use client";

import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useState } from "react";
import GraphPanel from "./graph";
import NodesPanel from "./nodes";
import EdgesPanel from "./edges";

// background color options
export const lightColorOptions = [
   "FFFFFF", // white
   "F8B4D9", // pink-300
   "F8B4B4", // red-300
   "FDBA8C", // orange-300
   "FACA15", // yellow-300
   "84E1BC", // green-300
   "7EDCE2", // teal-300
   "A4CAFE", // blue-300
   "B4C6FC", // indigo-300
   "CABFFD", // purple-300
];

// border color options
export const darkColorOptions = [
   "000000", // black
   "046C4E", // green
   "0B5394", // blue
   "6A329F", // purple
   "800000", // maroon
   "5A5A5A", // grey
   "964B00", // brown
   "CC0000", // red
   "DB4914", // orange
   "B58B00", // yellow
];

// RightPanel component, receives a `graph` prop of type `MutableRefObject<X6Type.Graph>`
export default function RightPanel({ graph }: { graph: MutableRefObject<X6Type.Graph> }) {
   // State to keep track of the current tab, either "graph", "nodes", or "edges"
   const [tab, setTab] = useState<"graph" | "nodes" | "edges">("edges");

   // Use effect to listen to the events on the `graph` and set the tab accordingly
   useEffect(() => {
      // Return early if the `graph` is not set yet
      if (!graph.current) {
         return;
      }

      // Listen to the "node:selected" event and set the tab to "nodes"
      graph.current.on("node:selected", () => {
         setTab("nodes");
      });

      // Listen to the "node:unselected" event and set the tab to "graph" if there's no selected cells
      graph.current.on("node:unselected", () => {
         if (graph.current.getSelectedCells().length === 0) {
            setTab("graph");
         }
      });

      // Listen to the "edge:selected" event and set the tab to "edges"
      graph.current.on("edge:selected", () => {
         setTab("edges");
      });

      // Listen to the "edge:unselected" event and set the tab to "graph" if there's no selected cells
      graph.current.on("edge:unselected", () => {
         if (graph.current.getSelectedCells().length === 0) {
            setTab("graph");
         }
      });

      // Return a cleanup function to remove the event listeners when unmounting
      return () => {
         graph.current?.off("node:selected");
         graph.current?.off("node:unselected");
         graph.current?.off("edge:selected");
         graph.current?.off("edge:unselected");
      };
   }, []);

   // Render the component with a width of 60 and a left border of 1
   return (
      <div className="w-60 p-2 flex flex-col border-gray-400 border-l-1">
         {/* Render different panels based on the current tab */}
         {tab === "graph" ? (
            <GraphPanel graph={graph} />
         ) : tab === "nodes" ? (
            <NodesPanel graph={graph} />
         ) : tab === "edges" ? (
            <EdgesPanel graph={graph} />
         ) : null}
      </div>
   );
}
