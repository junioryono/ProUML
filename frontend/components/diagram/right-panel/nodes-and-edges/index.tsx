import type X6Type from "@antv/x6";
import { MutableRefObject } from "react";
import NodesPanel from "../nodes";
import EdgesPanel from "../edges";

export default function NodesAndEdgesPanel({ graph }: { graph: MutableRefObject<X6Type.Graph> }) {
   return (
      <>
         <NodesPanel graph={graph} />
         <EdgesPanel graph={graph} />
      </>
   );
}
