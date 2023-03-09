import type X6Type from "@antv/x6";
import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { ClassNode } from "types";
import { lightColorOptions, darkColorOptions } from "../styling-options/colors";
import ColorPicker from "../styling-options/color-picker";
import LineWidth from "../styling-options/line-width";
import NodeSettings from "./node-settings";
import { SolidLine, DashedLine, DottedLine, DoubleLine } from "../styling-options/line-styles";

export default function NodesPanel({ graph }: { graph: MutableRefObject<X6Type.Graph> }) {
   // for current background & border colors of selected cell
   const [backgroundColor, setBackgroundColor] = useState<string>(); // <- default should be initial bg color
   const [borderColor, setBorderColor] = useState<string>(); // <- default should be initial border color

   // for current line width & style of selected cell
   const [borderWidth, setBorderWidth] = useState<number>(); // <- default should be initial border width
   const [borderStyle, setBorderStyle] = useState<string>(); // <- default should be initial border style

   // for the border style of the selected cell
   const borderStyleOptions = [
      {
         value: "solid",
         icon: <SolidLine />,
      },
      {
         value: "dashed",
         icon: <DashedLine />,
      },
      {
         value: "dotted",
         icon: <DottedLine />,
      },
      {
         value: "double",
         icon: <DoubleLine />,
      },
   ];

   // the selected cells
   const [selectedNodes, setSelectedNodes] = useState<X6Type.Node[]>([]);

   // when selecting cells, update the selected cells
   const getSelectedNodes = () => {
      const selectedCells = graph.current?.getSelectedCells();
      const newSelectedNodes: X6Type.Node[] = [];
      const selectedBgColors = [];
      const selectedBdColors = [];
      const selectedBdWidths = [];
      const selectedBdStyles = [];
      for (const cell of selectedCells) {
         if (cell.isNode()) {
            newSelectedNodes.push(cell);

            const bgColor = cell.getProp("backgroundColor");
            if (bgColor) {
               selectedBgColors.push(bgColor);
            }

            const bdColor = cell.getProp("borderColor");
            if (bdColor) {
               selectedBdColors.push(bdColor);
            }

            const bdWidth = cell.getProp("borderWidth");
            if (bdWidth) {
               selectedBdWidths.push(bdWidth);
            }

            const bdStyle = cell.getProp("borderStyle");
            if (bdStyle) {
               selectedBdStyles.push(bdStyle);
            }
         }
      }
      setSelectedNodes(newSelectedNodes);

      // Check if all selected cells have the same background color
      if (selectedBgColors.every((color) => color === selectedBgColors[0])) {
         setBackgroundColor(selectedBgColors[0]);
      } else {
         setBackgroundColor("Multiple");
      }

      // Check if all selected cells have the same border color
      if (selectedBdColors.every((color) => color === selectedBdColors[0])) {
         setBorderColor(selectedBdColors[0]);
      } else {
         setBorderColor("Multiple");
      }

      // Check if all selected cells have the same border width
      if (selectedBdWidths.every((width) => width === selectedBdWidths[0])) {
         setBorderWidth(selectedBdWidths[0]);
      } else {
         setBorderWidth(-1);
      }

      // Check if all selected cells have the same border style
      if (selectedBdStyles.every((style) => style === selectedBdStyles[0])) {
         setBorderStyle(selectedBdStyles[0]);
      } else {
         setBorderStyle("Multiple");
      }
   };

   useEffect(() => {
      // set the selected cells to the current selected cells
      getSelectedNodes();

      // when a cell is selected, update the selected cells
      graph.current?.on("cell:selected", () => {
         getSelectedNodes();
      });

      // when a cell is unselected, update the selected cells
      graph.current?.on("cell:unselected", () => {
         getSelectedNodes();
      });
   }, [graph]);

   // useCallback on setBackgroundColor
   const setBackgroundColorFunction = useCallback(
      (color: string) => {
         setBackgroundColor(color);
         for (const node of selectedNodes) {
            node.trigger("change:backgroundColor", {
               backgroundColor: color,
            });
         }
      },
      [selectedNodes],
   );

   // useCallback on setBorderColor
   const setBorderColorFunction = useCallback(
      (color: string) => {
         setBorderColor(color);
         for (const node of selectedNodes) {
            node.trigger("change:borderColor", {
               borderColor: color,
            });
         }
      },
      [selectedNodes],
   );

   // useCallback on setBorderWidth
   const setBorderWidthFunction = useCallback(
      (width: number) => {
         setBorderWidth(width);
         for (const node of selectedNodes) {
            const currentBorderWidth = node.getProp("borderWidth") || 1;
            const newHeight = node.size().height + (width - currentBorderWidth) * 4;
            node.trigger("change:borderWidth", {
               borderWidth: width,
               newHeight: newHeight,
            });
         }
      },
      [selectedNodes],
   );

   // useCallback on setBorderStyle
   const setBorderStyleFunction = useCallback(
      (style: string) => {
         setBorderStyle(style);
         for (const node of selectedNodes) {
            node.trigger("change:borderStyle", {
               borderStyle: style,
            });
         }
      },
      [selectedNodes],
   );

   // when the selected cells change, update the event listeners
   useEffect(() => {
      for (const node of selectedNodes) {
         node.on("change:backgroundColor", (args) => {
            setBackgroundColor(args.backgroundColor);
         });
         node.on("change:borderColor", (args) => {
            setBorderColor(args.borderColor);
         });
         node.on("change:borderWidth", (args) => {
            setBorderWidth(args.borderWidth);
         });
         node.on("change:borderStyle", (args) => {
            setBorderStyle(args.borderStyle);
         });
      }
   }, [selectedNodes]);

   return (
      <>
         {/* ---------------------- NODE SETTINGS SECTION ---------------------- */}
         {selectedNodes.length === 1 && (
            <NodeSettings key={selectedNodes[0].id} node={selectedNodes[0] as X6Type.Node} graph={graph} />
         )}

         {/* ---------------------- BACKGROUND COLOR SECTION ---------------------- */}
         <div className="flex flex-col pb-3">
            <div className="font-bold">Background Color</div>

            {/* all of the background color options */}
            <ColorPicker
               colorOptions={lightColorOptions}
               indicatorColor={"black"}
               objColor={backgroundColor}
               setObjColor={setBackgroundColorFunction}
            />
         </div>
         <hr className="border-slate-400" />

         {/* ---------------------- BORDER COLOR SECTION ---------------------- */}
         <div className="flex flex-col pt-1.5 pb-3">
            <div className="font-bold">Border Color</div>

            {/* all of the border color options */}
            <ColorPicker
               colorOptions={darkColorOptions}
               indicatorColor={"white"}
               objColor={borderColor}
               setObjColor={setBorderColorFunction}
            />
         </div>
         <hr className="border-slate-400" />

         {/*---------------------- BORDER WIDTH SECTION ---------------------- */}
         {/* line svg source: https://www.svgrepo.com/svg/409180/layout-line-solid?edit=true */}
         <div className="flex flex-col pt-1.5 pb-3">
            <div className="font-bold mb-1">Border Width</div>

            <LineWidth lineWidth={borderWidth} setLineWidth={setBorderWidthFunction} />
         </div>
         <hr className="border-slate-400" />

         {/* ---------------------- BORDER STYLE SECTION ---------------------- */}
         <div className="flex flex-col pt-1.5">
            <div className="font-bold mb-1">Border Style</div>

            <div className="flex items-center gap-2 pl-1.5">
               {/* map out all of the buttons for the border styles */}
               {borderStyleOptions.map((style, index) => (
                  <button
                     key={index}
                     className={`border rounded-md transition duration-500 hover:scale-125
                     ${borderStyle !== style.value ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                     onClick={() => setBorderStyleFunction(style.value)}
                  >
                     {/* show the component of this style */}
                     {style.icon}
                  </button>
               ))}
            </div>
         </div>
      </>
   );
}
