import { createGraphConfig } from "@antv/xflow";
import { UMLClass } from "./react-node/uml-class";

export const useGraphConfig = createGraphConfig((config) => {
  config.setX6Config({
    scaling: {
      min: 0.2,
      max: 1,
    },
    grid: {
      visible: true,
    },
    snapline: {
      enabled: false,
    },
    history: {
      enabled: false,
    },
    clipboard: {
      enabled: true,
      useLocalStorage: true,
    },
    selecting: {
      enabled: false,
      multiple: false,
      selectCellOnMoved: true,
      showNodeSelectionBox: false,
      movable: true,
    },
    scroller: {
      enabled: false,
    },
    mousewheel: {
      enabled: true,
      minScale: 0.2,
      maxScale: 1,
      factor: 1.1,
      modifiers: ["ctrl"],
    },
    panning: {
      enabled: true,
    },
    keyboard: {
      enabled: true,
    },
  });

  config.setNodeRender("class", (props) => <UMLClass {...props} />);
  // config.setNodeRender("NODE2", Node2);
  // config.setEdgeRender("EDGE1", (props) => <Edge1 {...props} />);
  // config.setEdgeRender("EDGE2", (props) => <Edge2 {...props} />);
});
