import { ScrollFade } from "@/components/scroll-fade";
import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useState } from "react";

// if only one node is selected, show the node settings
export default function EdgeSettings({ edge, graph }: { edge: X6Type.Edge; graph: MutableRefObject<X6Type.Graph> }) {
   return (
      <>
         <div className="flex flex-col pb-3"></div>
         <hr className="border-slate-400 pb-1.5" />
      </>
   );
}
