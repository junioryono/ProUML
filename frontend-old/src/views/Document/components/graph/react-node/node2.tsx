import type { NsGraph } from "@antv/xflow";
import React from "react";
import { useAppContext } from "@antv/xflow";

const Node2: NsGraph.INodeRender = (props) => {
  const ctx = useAppContext();

  return (
    <div className="node2-container">
      <div>{"React节点2"}</div>
    </div>
  );
};
export default Node2;
