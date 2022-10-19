import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { supabase } from "supabase/supabase";

import type { IAppLoad } from "@antv/xflow";

import {
  XFlow,
  FlowchartCanvas,
  FlowchartExtension,
  FlowchartNodePanel,
  FlowchartFormPanel,
  KeyBindings,
  CanvasScaleToolbar,
  CanvasContextMenu,
  CanvasToolbar,
  CanvasSnapline,
  CanvasNodePortTooltip,
} from "@antv/xflow";

import type { Graph, Model } from "@antv/x6";
import { useCmdConfig } from "./config-cmd";
import { useGraphConfig } from "./config-graph";
import { useToolbarConfig } from "./config-toolbar";
import { useKeybindingConfig } from "./config-keybinding";
import { useContextMenuConfig } from "./config-context-menu";
import { ForceLayout } from "@antv/layout";

import "@antv/xflow/dist/index.css";
import "antd/dist/antd.css";

import { UMLClass } from "./react-node/uml-class";
import { DndNode } from "./react-node/dnd-node";

import { Circle } from "./react-node";

const documentJSON = {
  nodes: [
    { id: "node10", renderKey: "class", label: "hello", width: 160, height: 32 },
    { id: "node1", label: "算法节点-1", width: 160, height: 32 },
    { id: "node2", label: "算法节点-2", width: 160, height: 32 },
    { id: "node3", label: "算法节点-3", width: 160, height: 32 },
    { id: "node4", label: "算法节点-4", width: 160, height: 32 },
  ],
  edges: [
    {
      id: "be257d5e-a720-403f-bce9-25b606dc1a7c",
      source: "node1",
      target: "node2",
      sourcePortId: "node1-output-1",
      targetPortId: "node2-input-1",
      attrs: { line: { targetMarker: { name: "block", width: 4, height: 8 }, strokeDasharray: "", stroke: "#A2B1C3", strokeWidth: 1 } },
      sourcePort: "node1-output-1",
      targetPort: "node2-input-1",
    },
    {
      id: "98ebe3b3-bb02-4350-a395-69880b87caae",
      source: "node1",
      target: "node3",
      sourcePortId: "node1-output-1",
      targetPortId: "node3-input-1",
      attrs: { line: { targetMarker: { name: "block", width: 4, height: 8 }, strokeDasharray: "", stroke: "#A2B1C3", strokeWidth: 1 } },
      sourcePort: "node1-output-1",
      targetPort: "node3-input-1",
    },
    {
      id: "bb7fb2c8-e8a5-42ae-ae22-02888006e7cd",
      source: "node1",
      target: "node4",
      sourcePortId: "node1-output-1",
      targetPortId: "node4-input-1",
      attrs: { line: { targetMarker: { name: "block", width: 4, height: 8 }, strokeDasharray: "", stroke: "#A2B1C3", strokeWidth: 1 } },
      sourcePort: "node1-output-1",
      targetPort: "node4-input-1",
    },
  ],
};

export interface IProps {
  meta: { flowId: string };
}

const Document: React.FC = () => {
  const graphConfig = useGraphConfig();
  const toolbarConfig = useToolbarConfig();
  const menuConfig = useContextMenuConfig();
  const keybindingConfig = useKeybindingConfig();
  const graphRef = useRef<Graph>();
  const commandConfig = useCmdConfig();
  const { documentId } = useParams();

  const onLoad: IAppLoad = async (app) => {
    graphRef.current = await app.getGraphInstance();

    // const documentJSON = await supabase
    //   .from("document")
    //   .select("json")
    //   .match({ id: documentId })
    //   .then((response) => {
    //     if (!response || !Array.isArray(response.data) || !response.data[0]) {
    //       return false;
    //     }

    //     return response.data[0].json;
    //   });

    const forceLayout = new ForceLayout({
      type: "force",
      center: [369, 180],
      preventOverlap: true,
      linkDistance: (d) => {
        if (d.source.id === "node1") {
          return 200;
        }
        return 100;
      },
      tick: () => {
        graphRef.current?.fromJSON(documentJSON);
      },
    });

    forceLayout.layout(documentJSON);

    console.log("documentJSON", documentJSON);

    graphRef.current.on("node:added", (handler) => {
      graphRef.current?.resetSelection(handler.cell);
    });

    // Clear selection on DND side menu
    graphRef.current.on("batch:start", (handler) => {
      if (!handler || !graphRef.current) {
        return;
      }

      if (handler.name === "dnd") {
        graphRef.current.cleanSelection();
        return;
      }
    });

    // Reset node selection if current moving node is not selected
    graphRef.current.on("node:move", (handler) => {
      if (!handler || !graphRef.current) {
        return;
      }

      if (!graphRef.current.isSelected(handler.cell.id)) {
        graphRef.current.resetSelection(handler.cell.id);
        return;
      }
    });

    graphRef.current.on("node:selected", (handler) => {});
    // graphRef.current.on("nod")
  };

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.on("node:click", (...arg) => {
        console.log(arg);
      });
    }
  }, [graphRef]);

  return (
    <XFlow
      className="xflow-user-container"
      graphConfig={graphConfig}
      commandConfig={commandConfig}
      onLoad={onLoad}
      style={{ height: 500 }}
      isAutoCenter={true}
      meta={{ flowId: documentId }}
      {...{
        children: [
          <FlowchartExtension />,
          <FlowchartNodePanel
            showOfficial={true}
            defaultActiveKey={["custom"]}
            registerNode={
              [
                {
                  title: "General",
                  key: "custom",
                  nodes: [
                    {
                      component: Circle,
                      popover: () => <div>Circle</div>,
                      name: "circle",
                      width: 40,
                      height: 40,
                    },
                    {
                      component: Circle,
                      popover: () => <div>Circle</div>,
                      name: "circle2",
                      width: 40,
                      height: 40,
                    },
                    {
                      component: Circle,
                      popover: () => <div>Circle</div>,
                      name: "circle3",
                      width: 40,
                      height: 40,
                    },
                    {
                      component: Circle,
                      popover: () => <div>Circle</div>,
                      name: "circle4",
                      width: 40,
                      height: 40,
                    },
                    {
                      component: Circle,
                      popover: () => <div>Circle</div>,
                      name: "circle5",
                      width: 40,
                      height: 40,
                    },
                  ],
                },
              ] as any
            }
            position={{ width: 162, top: 40, bottom: 0, left: 0 }}
          />,
          <CanvasToolbar className="xflow-workspace-toolbar-top" layout="horizontal" config={toolbarConfig} position={{ top: 0, left: 0, right: 0, bottom: 0 }} />,
          <FlowchartCanvas
            position={{ top: 40, left: 0, right: 0, bottom: 0 }}
            onAddNode={() => {
              console.log("hello");
            }}
            config={graphConfig}
            {...{
              children: [
                <CanvasScaleToolbar
                  layout="horizontal"
                  position={{ top: -40, right: 0 }}
                  style={{
                    width: 150,
                    left: "auto",
                    height: 39,
                  }}
                />,
                <CanvasContextMenu config={menuConfig} />,
                <CanvasSnapline color="#faad14" />,
                <CanvasNodePortTooltip />,
              ],
            }}
          />,
          <FlowchartFormPanel show={true} position={{ width: 200, top: 40, bottom: 0, right: 0 }} />,
          <KeyBindings config={keybindingConfig} />,
        ],
      }}
    />
  );
};

export default Document;
