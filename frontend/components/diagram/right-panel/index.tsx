import type X6Type from "@antv/x6";
import { MutableRefObject, useCallback, useEffect, useState, useMemo } from "react";
import { Issue } from "types";
import GraphPanel from "./graph";
import EdgesPanel from "./edges";
import NodesPanel from "./nodes";
import NodesAndEdgesPanel from "./nodes-and-edges";
import IssuePanel from "./issue";
import FadeIn from "@/components/fade-in";

// RightPanel component, receives a `graph` prop of type `MutableRefObject<X6Type.Graph>`
export default function RightPanel({
   graph,
   backgroundColor,
   selectedIssue,
}: {
   graph: MutableRefObject<X6Type.Graph>;
   backgroundColor: string;
   selectedIssue: Issue;
}) {
   // State to keep track of the current tab, either "graph", "nodes", or "edges"
   const [tab, setTab] = useState<"graph" | "nodes" | "edges" | "nodes&edges" | "issue">("graph");

   const setTabFunction = useCallback(
      (args: any) => {
         if (args?.options?.issue) {
            return;
         }

         if (graph.current?.getSelectedCells().length === 0 && tab !== "issue") {
            setTab("graph");
         } else if (graph.current?.getSelectedCells().every((cell) => cell.isNode())) {
            setTab("nodes");
         } else if (graph.current?.getSelectedCells().every((cell) => cell.isEdge())) {
            setTab("edges");
         } else {
            setTab("nodes&edges");
         }
      },
      [graph],
   );

   // Use effect to listen to the events on the `graph` and set the tab accordingly
   useEffect(() => {
      graph.current?.on("node:selected", setTabFunction);
      graph.current?.on("node:unselected", setTabFunction);
      graph.current?.on("edge:selected", setTabFunction);
      graph.current?.on("edge:unselected", setTabFunction);
   }, [graph]);

   useEffect(() => {
      if (selectedIssue) {
         setTab("issue");
      }
   }, [selectedIssue]);

   // Render the component with a width of 60 and a left border of 1
   return (
      <div className="flex flex-col h-[calc(100vh-3rem)] overflow-y-auto no-scrollbar overflow-x-hidden w-60 p-2 pb-3 border-gray-400 border-l-1 select-none cursor-default">
         {/* Render different panels based on the current tab */}
         <FadeIn fadeDelay={300} key={tab}>
            {(() => {
               switch (tab) {
                  case "graph":
                     return <GraphPanel graph={graph} backgroundColor={backgroundColor} />;
                  case "nodes":
                     return <NodesPanel graph={graph} />;
                  case "edges":
                     return <EdgesPanel graph={graph} />;
                  case "nodes&edges":
                     return <NodesAndEdgesPanel graph={graph} />;
                  case "issue":
                     return <IssuePanel issue={selectedIssue} />;
                  default:
                     return null;
               }
            })()}
         </FadeIn>
      </div>
   );
}
