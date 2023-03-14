import type X6Type from "@antv/x6";

function addPorts(node: X6Type.Node) {
   const newPortProps = getNewPortProps(node);

   // Add the ports that don't exist yet
   const existingPorts = node.getPorts();
   const existingPortIds = existingPorts.map((port) => port.id);
   const newPortPropsToAdd = newPortProps.filter((portProp) => !existingPortIds.includes(portProp.id));
   node.addPorts(newPortPropsToAdd, { ignoreHistory: true });
}

function showPorts(node: X6Type.Node) {
   for (const port of node.getPorts()) {
      node.portProp(port.id, "attrs/circle/style/visibility", "visible", { ignoreHistory: true });
   }
}

function showAllPorts(graph: X6Type.Graph) {
   const showPortsFunction = [...(graph?.getNodes() as X6Type.Node[])].map((node) => {
      return () => showPorts(node);
   });
   for (const showPorts of showPortsFunction) {
      showPorts();
   }
}

function hidePorts(node: X6Type.Node) {
   for (const port of node.getPorts()) {
      node.portProp(port.id, "attrs/circle/style/visibility", "hidden", { ignoreHistory: true });
   }
}

function hideAllPorts(graph: X6Type.Graph) {
   const hidePortsFunction = [...(graph?.getNodes() as X6Type.Node[])].map((node) => {
      return () => hidePorts(node);
   });
   for (const hidePorts of hidePortsFunction) {
      hidePorts();
   }
}

function updatePorts(node: X6Type.Node) {
   const newPortProps = getNewPortProps(node);

   for (const portProp of newPortProps) {
      node.portProp(portProp.id, portProp, { ignoreHistory: true });
   }
}

function getNewPortProps(node: X6Type.Node) {
   const nodeBbox = node.getBBox();
   const nodeWidth = nodeBbox.width;
   const nodeHeight = nodeBbox.height;

   return [
      {
         id: "top-middle",
         group: "group1",
         args: {
            x: nodeWidth / 2,
            y: 0,
         },
      },
      {
         id: "top-left",
         group: "group1",
         args: {
            x: 0,
            y: 0,
         },
      },
      {
         id: "top-right",
         group: "group1",
         args: {
            x: nodeWidth,
            y: 0,
         },
      },
      {
         id: "top-left-middle",
         group: "group1",
         args: {
            x: nodeWidth / 4,
            y: 0,
         },
      },
      {
         id: "top-right-middle",
         group: "group1",
         args: {
            x: (nodeWidth / 4) * 3,
            y: 0,
         },
      },
      {
         id: "left-middle-top",
         group: "group1",
         args: {
            x: 0,
            y: nodeHeight / 4,
         },
      },
      {
         id: "left-middle",
         group: "group1",
         args: {
            x: 0,
            y: nodeHeight / 2,
         },
      },
      {
         id: "left-middle-bottom",
         group: "group1",
         args: {
            x: 0,
            y: (nodeHeight / 4) * 3,
         },
      },
      {
         id: "right-middle-top",
         group: "group1",
         args: {
            x: nodeWidth,
            y: nodeHeight / 4,
         },
      },
      {
         id: "right-middle",
         group: "group1",
         args: {
            x: nodeWidth,
            y: nodeHeight / 2,
         },
      },
      {
         id: "right-middle-bottom",
         group: "group1",
         args: {
            x: nodeWidth,
            y: (nodeHeight / 4) * 3,
         },
      },
      {
         id: "bottom-middle",
         group: "group1",
         args: {
            x: nodeWidth / 2,
            y: nodeHeight,
         },
      },
      {
         id: "bottom-left",
         group: "group1",
         args: {
            x: 0,
            y: nodeHeight,
         },
      },
      {
         id: "bottom-right",
         group: "group1",
         args: {
            x: nodeWidth,
            y: nodeHeight,
         },
      },
      {
         id: "bottom-left-middle",
         group: "group1",
         args: {
            x: nodeWidth / 4,
            y: nodeHeight,
         },
      },
      {
         id: "bottom-right-middle",
         group: "group1",
         args: {
            x: (nodeWidth / 4) * 3,
            y: nodeHeight,
         },
      },
   ];
}

export { addPorts, showPorts, showAllPorts, hidePorts, hideAllPorts, updatePorts };
