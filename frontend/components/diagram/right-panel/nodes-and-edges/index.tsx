import type X6Type from "@antv/x6";
import { MutableRefObject, useState } from "react";
import NodesPanel from "../nodes";
import EdgesPanel from "../edges";
import { cn } from "@/lib/utils";

export default function NodesAndEdgesPanel({ graph }: { graph: MutableRefObject<X6Type.Graph> }) {
   const [activeTab, setActiveTab] = useState("nodes");

   return (
      <>
         {/* Tabs navigation */}
         <div className="flex rounded-lg mb-1 border pl-0 outline-none">
            <button
               className={cn(
                  "w-1/2 py-1.5 border rounded-l-md text-md leading-tight",
                  activeTab === "nodes"
                     ? "bg-slate-400 border-slate-600 font-bold"
                     : "bg-slate-300 border-slate-400 font-normal",
               )}
               onClick={() => setActiveTab("nodes")}
            >
               Node(s)
            </button>

            <button
               className={cn(
                  "w-1/2 py-1.5 border rounded-r-md text-md leading-tight",
                  activeTab === "edges"
                     ? "bg-slate-400 border-slate-600 font-bold"
                     : "bg-slate-300 border-slate-400 font-normal",
               )}
               onClick={() => setActiveTab("edges")}
            >
               Edge(s)
            </button>
         </div>

         {/* Tabs content */}
         {activeTab === "nodes" ? (
            <div>
               <NodesPanel graph={graph} />
            </div>
         ) : (
            <div>
               <EdgesPanel graph={graph} />
            </div>
         )}
      </>
   );
}
