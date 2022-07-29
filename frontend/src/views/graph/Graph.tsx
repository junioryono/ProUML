import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { initGraph, initListeners, initDragAndDrop, startDrag } from "./utils";
import { Parser } from "JavaToJSON/javatojson";
import type { Graph, Cell } from "@antv/x6";
import type { Dnd } from "@antv/x6/es/addon/dnd";
import files from "JavaToJSON/TestProject";
import "antd/dist/antd.css";
import "./Graph.css";

function GraphView() {
  const graph = useRef<Graph>();
  const dnd = useRef<Dnd>();
  const container = useRef<HTMLDivElement>();
  const minimapContainer = useRef<HTMLDivElement>();
  const [selectedCells, setSelectedCells] = useState<Cell<Cell.Properties> | Cell<Cell.Properties>[]>();
  const [freshRender, forceRender] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    // console.log("selectedCells", selectedCells);
    if (!graph.current) {
      return;
    }

    // GROUPING
    // if (Array.isArray(selectedCells)) {
    //   for (const cell of selectedCells) {
    //     cell
    //   }
    // } else if (selectedCells) {
    //   selectedCells.removetoo
    // }
  }, [selectedCells]);

  useEffect(() => {
    const handleResize = () => {
      graph.current?.size.resizeScroller(window.innerWidth - 500, window.innerHeight - 100);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!container.current || !minimapContainer.current) {
      console.error("Container refs not found.");
      return;
    }

    graph.current = initGraph(container.current, minimapContainer.current);
    dnd.current = initDragAndDrop(graph.current);

    initListeners(graph.current, container.current, forceRender, setSelectedCells);

    const parser = new Parser(files);
    console.log("files", files);
    const parsedFiles = parser.parseFiles();
    const parsedForUML = parsedFiles.getParsedForUML();

    const cells: Cell[] = [];
    for (const node of parsedForUML) {
      if (node.shape === "class") {
        cells.push(graph.current.createNode(node));
      } else {
        cells.push(graph.current.createEdge(node));
      }
    }
    graph.current.resetCells(cells);

    // console.log("parsedFiles", parsedFiles.getParsedFiles());
    // console.log("getParsedForUML", parsedFiles.getParsedForUML());

    // // TESTING
    // const source = graph.current.addNode({
    //   x: 400,
    //   y: 200,
    //   width: 200,
    //   height: 80,
    //   data: {
    //     parent: true,
    //   },
    //   attrs: {
    //     label: {
    //       text: "Hello",
    //       fill: "#6a6c8a",
    //     },
    //     body: {
    //       magnet: true,
    //       padding: "90%",
    //       stroke: "#31d0c6",
    //       strokeWidth: 2,
    //     },
    //   },
    // });

    // const target = graph.current.addNode({
    //   x: 320,
    //   y: 500,
    //   width: 100,
    //   height: 40,
    //   data: {
    //     parent: true,
    //   },
    //   attrs: {
    //     label: {
    //       text: "World",
    //       fill: "#6a6c8a",
    //     },
    //     body: {
    //       stroke: "#31d0c6",
    //       strokeWidth: 2,
    //     },
    //   },
    // });

    // graph.current.addEdge({ source, target });

    return () => {
      graph.current?.dispose();
    };
  }, []);

  const refContainer = (containerParam: HTMLDivElement) => {
    container.current = containerParam;
  };

  const refMinimapContainer = (containerParam: HTMLDivElement) => {
    minimapContainer.current = containerParam;
  };

  return (
    <div className="rootContainer">
      <div className="topBar">
        <div className="logo">Logo</div>
        <div className="contentContainer">
          <div className="leftContent">
            <div className="titleSection">
              <div className="title">Title here</div>
            </div>
            <div className="optionsSection">
              <div
                onClick={() => {
                  console.log(graph.current?.toJSON());
                }}
              >
                Option 1
              </div>
              <div>Option 2</div>
              <div>Option 3</div>
            </div>
          </div>
          <div className="rightContent">
            <div>Option 1</div>
            <div>Option 2</div>
            <div>Option 3</div>
          </div>
        </div>
      </div>
      <div className="mainBody">
        {React.useMemo(() => {
          return (
            <div className="leftBar">
              <div className="general">
                <div>Shapes here</div>
                <div
                  data-type="class"
                  onMouseDown={(e) => startDrag(graph.current, dnd.current, e)}
                  style={{
                    width: 100,
                    height: 40,
                    border: "2px solid #31d0c6",
                    textAlign: "center",
                    lineHeight: "40px",
                    margin: 16,
                    cursor: "move",
                  }}
                >
                  Rect
                </div>
                <div
                  data-type="rect"
                  onMouseDown={(e) => startDrag(graph.current, dnd.current, e)}
                  style={{
                    width: 100,
                    height: 40,
                    border: "2px solid #31d0c6",
                    textAlign: "center",
                    lineHeight: "40px",
                    margin: 16,
                    cursor: "move",
                  }}
                >
                  Rect
                </div>
                <div
                  data-type="circle"
                  onMouseDown={(e) => startDrag(graph.current, dnd.current, e)}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "100%",
                    border: "2px solid #31d0c6",
                    textAlign: "center",
                    lineHeight: "60px",
                    margin: 16,
                    cursor: "move",
                  }}
                >
                  Circle
                </div>
                {/* stage of all shapes width={250} height={100} */}
              </div>
            </div>
          );
        }, [])}
        <div tabIndex={-1} ref={refContainer} className="mainStage" />
        <div className="rightBar">
          <div className="inDepthEditor">
            <div>In-depth editor here</div>
            {/* {selectedShape && JSON.stringify(selectedShape)} */}
            {Array.isArray(selectedCells) ? (
              "This is a group"
            ) : selectedCells ? (
              <div>
                <SelectedCell cell={selectedCells} freshRender={freshRender} />
              </div>
            ) : (
              <div>Graph Editor</div>
            )}
          </div>
          <div ref={refMinimapContainer} className="minimapStage" />
        </div>
      </div>
    </div>
  );
}

function SelectedCell({ cell, freshRender }: { cell: Cell<Cell.Properties>; freshRender: any }) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [angle, setAngle] = useState(0);

  const refreshCell = useCallback(() => {
    const bbox = cell.getBBox();
    setX(bbox.x);
    setY(bbox.y);
    setWidth(bbox.width);
    setHeight(bbox.height);
    setAngle(cell.getProp("angle") || 0);
  }, [cell]);

  useEffect(() => {
    refreshCell();
  }, [cell]);

  useEffect(() => {
    if (freshRender) {
      refreshCell();
    }
  }, [freshRender]);

  return (
    <div>
      <div>
        <div>Width:</div>
        <input
          value={width}
          onChange={(event) => {
            const newValue = parseInt(event.target.value) || 0;
            setWidth(newValue);
            cell.setProp(
              {
                size: {
                  width: newValue,
                },
              },
              { deep: false, overwrite: true },
            );
          }}
        />
      </div>
      <div>
        <div>Height:</div>
        <input
          value={height}
          onChange={(event) => {
            const newValue = parseInt(event.target.value) || 0;
            setHeight(newValue);
            cell.setProp(
              {
                size: {
                  height: newValue,
                },
              },
              { deep: false, overwrite: true },
            );
          }}
        />
      </div>
      <div>
        <div>Left:</div>
        <input
          value={x}
          onChange={(event) => {
            const newValue = parseInt(event.target.value) || 0;
            setX(newValue);
            cell.setProp(
              {
                position: {
                  x: newValue,
                },
              },
              { deep: false, overwrite: true },
            );
          }}
        />
      </div>
      <div>
        <div>Top:</div>
        <input
          value={y}
          onChange={(event) => {
            const newValue = parseInt(event.target.value) || 0;
            setY(newValue);
            cell.setProp(
              {
                position: {
                  y: newValue,
                },
              },
              { deep: false, overwrite: true },
            );
          }}
        />
      </div>
      <div>
        <div>Angle:</div>
        <input
          value={angle}
          onChange={(event) => {
            const newValue = parseInt(event.target.value) || 0;
            setAngle(newValue);
            cell.setProp(
              {
                angle: newValue,
              },
              { deep: false, overwrite: true },
            );
          }}
        />
      </div>
      <div>Hello {JSON.stringify(cell)}</div>
    </div>
  );
}

export default GraphView;
