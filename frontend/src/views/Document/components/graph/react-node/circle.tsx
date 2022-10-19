import { Graph } from "@antv/x6";
import { useXFlowApp, XFlowGraphCommands, NsGraphCmd, NsGraph } from "@antv/xflow";
import { useEffect } from "react";
import "./dnd-node.css";

export default (props: NsGraph.IReactNodeProps) => {
  console.log("props", props);

  const { id, width, height, label, stroke, fill, fontFill, fontSize } = props.data;
  const app = useXFlowApp();

  useEffect(() => {
    if (!id) {
        return;
    }

    const setListeners = async () => {
      const graph: Graph = await app.getGraphInstance();
      console.log("graph", graph);
      const currentCell = graph.getCellById(id)
      currentCell.on("change:size", (handler) => {
        
      })
    };

    setListeners();
  }, [id]);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <path d="M 1,20 a 19 19 0 1 1 0 1 z" fill="#FFFFFF" stroke="#A2B1C3" style={{ transform: `scaleX(${width / 40}) scaleY(${height / 40})` }} />
      <text x="30" y="20" fill="#000" text-anchor="middle" alignment-baseline="middle" font-size="12">
        {label}
      </text>
      Sorry, your browser does not support inline SVG.
    </svg>
  );
};
